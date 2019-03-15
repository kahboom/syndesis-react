import { Alert } from 'patternfly-react';
import * as React from 'react';

interface IAlertGroupProps {
  children?: React.ReactNode[];
  assistiveTechnologyDelay?: number;
}

const AlertGroup: React.FunctionComponent<IAlertGroupProps> = props => {
  const [rendered, setRendered] = React.useState(false);
  let timer: number;

  React.useEffect(() => {
    timer = setTimeout(() => {
      setRendered(true);
    }, props.assistiveTechnologyDelay);
  }, []);

  React.useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  });

  const buildAlert = (
    alertProps: {},
    key: number,
    isRendered: boolean
  ): JSX.Element => {
    return (
      <div
        aria-atomic="false"
        aria-live="polite"
        aria-relevant="additions text"
        key={key}
      >
        {isRendered && <Alert {...alertProps} key={key} />}
      </div>
    );
  };

  return (
    <React.Fragment>
      {props.children &&
        props.children.map((alert: any, index: number) => {
          return buildAlert({ ...alert.props }, index, rendered);
        })}
    </React.Fragment>
  );
};

AlertGroup.defaultProps = {
  assistiveTechnologyDelay: 200,
};

export { AlertGroup, IAlertGroupProps };
