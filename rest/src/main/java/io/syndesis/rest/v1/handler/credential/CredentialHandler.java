/**
 * Copyright (C) 2016 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.syndesis.rest.v1.handler.credential;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import io.swagger.annotations.Api;
import io.syndesis.credential.CredentialFlowState;
import io.syndesis.credential.Credentials;
import io.syndesis.rest.v1.state.ClientSideState;
import io.syndesis.rest.v1.util.Urls;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import static io.syndesis.rest.v1.handler.credential.CallbackStatus.failure;
import static io.syndesis.rest.v1.handler.credential.CallbackStatus.success;
import static io.syndesis.rest.v1.util.Urls.appHome;

@Path("/credentials")
@Api(value = "credentials")
@Component
public class CredentialHandler {

    private static final Logger LOG = LoggerFactory.getLogger(CredentialHandler.class);

    private static final ObjectWriter SERIALIZER = new ObjectMapper().writerFor(CallbackStatus.class);

    private final Credentials credentials;

    private final ClientSideState state;

    public CredentialHandler(final Credentials credentials, final ClientSideState state) {
        this.credentials = credentials;
        this.state = state;
    }

    @GET
    @Path("/callback")
    public Response callback(@Context final HttpServletRequest request, @Context final HttpServletResponse response) {
        // user could have tried multiple times in parallel or encoutered an
        // error, and that leads to multiple `cred-` cookies being present
        final List<CredentialFlowState> allStatesFromRequest;
        try {
            allStatesFromRequest = CredentialFlowState.Builder.restoreFrom(state::restoreFrom, request, response)
                .collect(Collectors.toList());
        } catch (@SuppressWarnings("PMD.AvoidCatchingGenericException") final RuntimeException e) {
            LOG.debug("Unable to restore credential flow state from request", e);
            return fail(request, "Unable to restore the state of authorization");
        }

        if (allStatesFromRequest.isEmpty()) {
            return fail(request,
                "Unable to recall the state of authorization, called callback without initiating OAuth autorization?");
        }

        final Stream<CredentialFlowState> updatedStatesFromRequest;
        try {
            updatedStatesFromRequest = allStatesFromRequest.stream().map(s -> s.updateFrom(request));
        } catch (@SuppressWarnings("PMD.AvoidCatchingGenericException") final RuntimeException e) {
            LOG.debug("Unable to update credential flow state from request", e);
            return fail(request, "Unable to update the state of authorization");
        }

        // let's try to finish with any remaining flow states, as there might be
        // many try with each one
        final Optional<CredentialFlowState> maybeUpdatedFlowState = updatedStatesFromRequest
            .flatMap(s -> tryToFinishAcquisition(request, s)).findFirst();

        if (!maybeUpdatedFlowState.isPresent()) {
            return fail(request, "Unable to finish authorization, OAuth authorization timed out?");
        }

        final CredentialFlowState flowState = maybeUpdatedFlowState.get();

        final URI successfullReturnUrl = addFragmentTo(flowState.getReturnUrl(),
            success(flowState.getProviderId(), "Successfully authorized Syndesis's access"));

        return Response.temporaryRedirect(successfullReturnUrl)
            .cookie(state.persist(flowState.persistenceKey(), "/", flowState)).build();
    }

    protected Stream<CredentialFlowState> tryToFinishAcquisition(final HttpServletRequest request,
        final CredentialFlowState flowState) {
        try {
            return Stream.of(credentials.finishAcquisition(flowState, Urls.apiBase(request)));
        } catch (@SuppressWarnings("PMD.AvoidCatchingGenericException") final RuntimeException e) {
            LOG.debug("Unable to perform OAuth callback on flow state: {}", flowState, e);

            return Stream.empty();
        }
    }

    /* default */ static URI addFragmentTo(final URI uri, final CallbackStatus status) {
        try {
            final String fragment = SERIALIZER.writeValueAsString(status);

            return new URI(uri.getScheme(), null, uri.getHost(), uri.getPort(), uri.getPath(), uri.getQuery(),
                fragment);
        } catch (JsonProcessingException | URISyntaxException e) {
            throw new IllegalStateException("Unable to add fragment to URI: " + uri + ", for state: " + status, e);
        }
    }

    /* default */ static Response fail(final HttpServletRequest request, final String message) {
        final URI redirect = addFragmentTo(appHome(request), failure(null, message));

        return Response.temporaryRedirect(redirect).build();
    }

}
