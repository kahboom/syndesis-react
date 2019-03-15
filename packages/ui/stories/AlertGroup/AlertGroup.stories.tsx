import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Alert } from 'patternfly-react';
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

let alertList: any[] = [
  {
    type: 'success',
    title: 'Success Alert',
    key: 'alert1',
  },
  {
    type: 'warning',
    title: 'Warning Alert',
    key: 'alert2',
  },
  {
    type: 'error',
    title: 'Error Alert',
    key: 'alert3',
  },
  {
    type: 'info',
    title: 'Info Alert',
    key: 'alert4',
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
