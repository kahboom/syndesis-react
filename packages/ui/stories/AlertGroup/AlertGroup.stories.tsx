import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Alert } from 'patternfly-react';
import * as React from 'react';
import {
  AlertContext,
  AlertGroup,
  AlertType,
  IAlertNotification,
} from '../../src/AlertGroup';

const stories = storiesOf('Notifications', module);

stories.add('AlertGroup Basic', () => {
  return (
    <AlertGroup assistiveTechnologyDelay={2000}>
      <Alert type="success">
        <span>
          Well done! You successfully read this important alert message.
        </span>
      </Alert>
      <Alert type="error">
        <span>Something has gone wrong...</span>
      </Alert>
    </AlertGroup>
  );
});

const logAddNotification = action(
  'We will add a notification eventually, promise'
);
const logRemoveNotification = action(
  'We will remove a notification eventually, promise'
);

const AlertProviderDecoratorState: React.FunctionComponent = ({ children }) => {
  const [notifications, setNotifications] = React.useState<
    IAlertNotification[]
  >([]);
  const addNotification = (title: string, type: AlertType) => {
    logAddNotification();
    setNotifications([
      ...notifications,
      {
        title,
        type,
      },
    ]);
  };
  const removeNotification = (idx: number) => {
    logRemoveNotification();
  };
  return (
    <AlertContext.Provider
      value={{
        addNotification,
        notifications,
        removeNotification,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

// const AlertProviderDecorator = storyFn =>
//   <AlertProviderDecoratorState>
//     {storyFn()}
//   </AlertProviderDecoratorState>
// ;

stories
  // .addDecorator(AlertProviderDecorator)
  .add('AlertGroup on click', () => {
    return (
      <AlertProviderDecoratorState>
        <AlertContext.Consumer>
          {({ notifications, addNotification, removeNotification }) => (
            <>
              <AlertGroup>
                {notifications.map((notification, idx) => (
                  <Alert
                    type={notification.type}
                    onDismiss={() => removeNotification(idx)}
                    key={idx}
                  >
                    <span>{notification.title}</span>
                  </Alert>
                ))}
              </AlertGroup>
              <button
                type="button"
                onClick={() =>
                  addNotification('New notification!', AlertType.SUCCESS)
                }
              >
                Add notification
              </button>
            </>
          )}
        </AlertContext.Consumer>
      </AlertProviderDecoratorState>
    );
  });
