import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Alert } from 'patternfly-react';
import { AlertGroup } from '../../src/AlertGroup/AlertGroup';

const stories = storiesOf('Notifications', module);

stories.add('AlertGroup', () => {
  return (
    <AlertGroup>
      {[
        <Alert key={0} type="success">
          <span>
            Well done! You successfully read this important alert message.
          </span>
        </Alert>,
      ]}
    </AlertGroup>
  );
});
