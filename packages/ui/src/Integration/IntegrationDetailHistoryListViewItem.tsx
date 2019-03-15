import {
  Alert,
  DropdownKebab,
  ListView,
  ListViewInfoItem,
  ListViewItem,
  MenuItem,
} from 'patternfly-react';
import * as React from 'react';
import { AlertGroup } from '../AlertGroup/AlertGroup';

export interface IIntegrationDetailHistoryListViewItemProps {
  integrationId: string;
  integrationName?: string;
  integrationUpdatedAt?: string;
  integrationVersion?: number;
  i18nTextHistoryMenuReplaceDraft?: string;
  i18nTextHistoryMenuUnpublish?: string;
  i18nTextLastPublished?: string;
  i18nTextVersion?: string;
  onUnpublish: (integrationId: string) => void;
}

export class IntegrationDetailHistoryListViewItem extends React.Component<
  IIntegrationDetailHistoryListViewItemProps
> {
  public handleonUnpublish() {
    this.props.onUnpublish(this.props.integrationId);
  }

  public render() {
    return (
      <>
        <AlertGroup>
          {[
            <Alert key={0} type="success">
              <span>Unpublished!</span>
            </Alert>,
          ]}
        </AlertGroup>
        <ListViewItem
          key={1}
          heading={
            <span>
              {<span>{this.props.i18nTextVersion}:</span>}{' '}
              {this.props.integrationVersion}
            </span>
          }
          actions={
            <DropdownKebab id="integrationActions" pullRight={true}>
              <MenuItem>{this.props.i18nTextHistoryMenuReplaceDraft}</MenuItem>
              <MenuItem onClick={this.handleonUnpublish}>
                {this.props.i18nTextHistoryMenuUnpublish}
              </MenuItem>
            </DropdownKebab>
          }
          additionalInfo={[
            <ListViewInfoItem key={1}>
              {this.props.i18nTextLastPublished}
              {this.props.integrationUpdatedAt}
            </ListViewInfoItem>,
          ]}
          leftContent={
            <ListView.Icon
              type="pf"
              name="ok"
              size="sm"
              className="list-view-pf-icon-success"
            />
          }
          stacked={false}
        />
      </>
    );
  }
}
