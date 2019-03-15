import * as React from 'react';

export enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface IAlertNotification {
  title: string;
  type: AlertType;
}

export interface IAlertContext {
  notifications: IAlertNotification[];
  addNotification(title: string, type: AlertType): void;
  removeNotification(idx: number): void;
}

export const AlertContextDefaultValue = {} as IAlertContext;

export const AlertContext = React.createContext<IAlertContext>(
  AlertContextDefaultValue
);
