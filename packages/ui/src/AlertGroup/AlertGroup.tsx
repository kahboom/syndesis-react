import * as React from 'react';
// import { Alert, AlertProps } from '@patternfly/react-core';
import { Alert } from 'patternfly-react';

interface IAlertGroupProps {
  children?: React.ReactNode[];
  assistiveTechnologyDelay?: number;
}

const AlertGroup: React.FunctionComponent<IAlertGroupProps> = props => {
  const [rendered, setRendered] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 2000);
  }, []);

  const buildAlert = (
    props: {},
    key: number,
    rendered: boolean
  ): JSX.Element => {
    return (
      <div
        aria-atomic="false"
        aria-live="polite"
        aria-relevant="additions text"
        key={key}
      >
        {rendered && <Alert {...props} key={key} />}
      </div>
    );
  };

  return (
    <React.Fragment>
      {props.children &&
        props.children.map((alert: any, index: number) => {
          return buildAlert({ ...alert.props }, index, rendered); // interactive
        })}
    </React.Fragment>
  );
};

export { AlertGroup };
