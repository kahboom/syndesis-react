import { storiesOf } from '@storybook/react';
import { Alert } from 'patternfly-react';
import * as React from 'react';
import { AlertGroup } from '../../src/AlertGroup/AlertGroup';

const stories = storiesOf('Notifications', module);

stories.add('AlertGroup Basic', () => {
  return (
    <AlertGroup assistiveTechnologyDelay={2000}>
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

const alertList: any[] = [
  {
    key: 'alert1',
    title: 'Success Alert',
    type: 'success',
  },
  {
    key: 'alert2',
    title: 'Warning Alert',
    type: 'warning',
  },
  {
    key: 'alert3',
    title: 'Error Alert',
    type: 'error',
  },
  {
    key: 'alert4',
    title: 'Info Alert',
    type: 'info',
  },
];

const buildAlert = (props: any, idx: number): JSX.Element => {
  return (
    <Alert {...props} key={idx}>
      <span>{props.title}</span>
    </Alert>
  );
};

stories.add('AlertGroup passed an array', () => {
  return (
    <AlertGroup assistiveTechnologyDelay={5000}>
      {alertList.map((props, idx) => buildAlert(props, idx))}
    </AlertGroup>
  );
});
