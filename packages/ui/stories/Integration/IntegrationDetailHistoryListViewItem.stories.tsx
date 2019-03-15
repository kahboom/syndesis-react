import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { IntegrationDetailHistoryListViewItem } from '../../src';

const stories = storiesOf(
  'Integration/IntegrationDetailHistoryListViewItem',
  module
);

const integrationPublished = {
  id: 'i-LWC6M4_8o0nowToJZkaz',
  name: 'Hello World',
  version: 1,
  updatedAt: 'Feb 24, 2019, 04:27:49',
};

const i18nTextHistoryMenuReplaceDraft = 'Replace Draft';
const i18nTextHistoryMenuUnpublish = 'Unpublish';
const i18nTextLastPublished = 'Last published on ';
const i18nTextVersion = 'Version';

const unpublishText = 'Unpublish';
const unpublishActionText = unpublishText + ' ' + integrationPublished.name;

stories.add(
  'published',
  withNotes('Verify there is a list of history items')(() => (
    <IntegrationDetailHistoryListViewItem
      integrationId={integrationPublished.id}
      integrationUpdatedAt={text(
        'integrationUpdatedAt',
        integrationPublished.updatedAt
      )}
      integrationVersion={text(
        'integrationVersion',
        integrationPublished.version
      )}
      i18nTextHistoryMenuReplaceDraft={text(
        'i18nTextHistoryMenuReplaceDraft',
        i18nTextHistoryMenuReplaceDraft
      )}
      i18nTextHistoryMenuUnpublish={text(
        'i18nTextHistoryMenuUnpublish',
        i18nTextHistoryMenuUnpublish
      )}
      i18nTextLastPublished={text(
        'i18nTextLastPublished',
        i18nTextLastPublished
      )}
      i18nTextVersion={text('i18nTextVersion', i18nTextVersion)}
      onUnpublish={action(unpublishActionText)}
    />
  ))
);
