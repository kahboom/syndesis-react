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
package io.syndesis.runtime;

import io.syndesis.dao.init.ModelData;
import io.syndesis.model.integration.Integration;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests the /test-support API endpoints
 *
 * Can't call this class TestSupportITCase because it then gets
 * run as a unit test when keycloak is not running.
 */
public class T3stSupportITCase extends BaseITCase {

    @Test
    public void createAndGetIntegration() {

        // Reset to fresh startup state..
        get("/api/v1/test-support/reset-db", Void.class, tokenRule.validToken(), HttpStatus.NO_CONTENT);

        // We should have some initial data in the snapshot since we start up with deployment.json
        @SuppressWarnings({"unchecked", "rawtypes"})
        Class<ModelData<?>[]> type = (Class) ModelData[].class;
        ResponseEntity<ModelData<?>[]> r1 = get("/api/v1/test-support/snapshot-db", type);
        assertThat(r1.getBody().length).isGreaterThan(1);

        // restoring to no data should.. leave us with no data.
        ModelData<?>[] NO_DATA = new ModelData[]{};
        post("/api/v1/test-support/restore-db", NO_DATA, (Class<?>) null, tokenRule.validToken(), HttpStatus.NO_CONTENT);

        // Lets add an integration...
        Integration integration = new Integration.Builder()
            .id("2001")
            .name("test")
            .desiredStatus(Integration.Status.Draft)
            .currentStatus(Integration.Status.Draft)
            .build();
        post("/api/v1/integrations", integration, Integration.class);

        // Snapshot should only contain the integration entity..
        ResponseEntity<ModelData<?>[]> r2 = get("/api/v1/test-support/snapshot-db", type);
        assertThat(r2.getBody().length).isEqualTo(1);

        // Reset to fresh startup state..
        get("/api/v1/test-support/reset-db", Void.class, tokenRule.validToken(), HttpStatus.NO_CONTENT);

        // Verify that the new state has the same number of entities as the original
        ResponseEntity<ModelData<?>[]> r3 = get("/api/v1/test-support/snapshot-db", type);
        assertThat(r3.getBody().length).isEqualTo(r1.getBody().length);

        // restoring 1 item of data
        post("/api/v1/test-support/restore-db", r2.getBody(), (Class<?>) null, tokenRule.validToken(), HttpStatus.NO_CONTENT);

        // Snapshot should only contain the integration entity..
        ResponseEntity<ModelData<?>[]> r4 = get("/api/v1/test-support/snapshot-db", type);
        assertThat(r4.getBody().length).isEqualTo(1);

    }

}
