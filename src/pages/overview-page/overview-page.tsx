import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EngagementConfigClient, Engagement } from '@partnerincentives/engagements-client';
import {
  Alert,
  PageTitle, SortedTableHeadCellType, Table, useSortingTableHeader,
} from '@partnercenter-react/ui-webcore';
import { useUserPrivilegesContext } from '@partnerincentives/engagements-common';
import { AddEngagementModal } from './add-engagement-modal';
import {
  nameOf, enumKeyToString, updateBreadcrumb, toLocalizedDate, compareDates,
} from '../../utilities';
import { useApi } from '../../hooks/use-api';
import { LoadedContent } from '../../components/loaded-content/loaded-content';
import { Selectable, StyledCheckbox } from '../../components/styled-checkbox/styled-checkbox';
import { DeleteEngagementsModal } from './delete-engagements-modal';

export const OverviewPage: React.FC = () => {
  const EngagementsClient = new EngagementConfigClient();
  const [userPrivileges, isUserPrivilegesLoading] = useUserPrivilegesContext();

  const [engagementsResponse, isLoading, error, fetchEngagements] = useApi(
    () => EngagementsClient.getEngagements({ pageSize: 100 }), true,
  );

  // Maintain separate state in this case so that we can immediately add new engagements to the list.
  const [engagements, setEngagements] = useState<Selectable<Engagement>[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Reset breadcrumbs in case user is returning from other page.
    updateBreadcrumb({ 0: { value: '/internal/incentives' } });
  }, []);

  useEffect(() => {
    setEngagements(engagementsResponse?.items || []);
  }, [engagementsResponse]);

  const onSelectAllEngagements = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      setEngagements((currEngagements) => currEngagements.map(
        (eng) => ({ ...eng, isSelected: true }),
      ));
      setIsAllSelected(true);
    } else {
      setEngagements((currEngagements) => currEngagements.map(
        (eng) => ({ ...eng, isSelected: false }),
      ));
      setIsAllSelected(false);
    }
  };

  const onSelectEngagement = (engagementId: string) => {
    setEngagements((currEngagements) => currEngagements.map(
      (eng) => {
        if (eng.id === engagementId) {
          const tempEng = eng;
          tempEng.isSelected = !tempEng.isSelected;
          return tempEng;
        }
        return eng;
      },
    ));
  };

  const onAddEngagement = (newEngagement: Engagement) => {
    setEngagements((e) => [newEngagement, ...e]);
    setSuccessMessage(`Successfully created new engagement '${newEngagement.name}'`);
    setIsSuccessAlertVisible(true);
  };

  const onDeleteEngagement = (message: string) => {
    fetchEngagements();
    setSuccessMessage(message);
    setIsSuccessAlertVisible(true);
  };

  const headerCells: SortedTableHeadCellType<Engagement>[] = [
    {
      children: <StyledCheckbox
        onChange={onSelectAllEngagements}
        ariaLabel="Select all engagements"
        checked={isAllSelected}
      />,
    },
    {
      children: 'Engagement',
      sortKey: nameOf<Engagement>('name'),
    },
    {
      children: 'Solution area',
      sortKey: nameOf<Engagement>('solutionArea'),
    },
    {
      children: 'Status',
      sortKey: nameOf<Engagement>('status'),
    },
    {
      children: 'Partner role',
      sortKey: nameOf<Engagement>('partnerRole'),
    },
    {
      children: 'Start (UTC)',
      sortKey: nameOf<Engagement>('startDate'),
      comparator: (left, right) => compareDates(left.startDate, right.startDate),
    },
    {
      children: 'End (UTC)',
      sortKey: nameOf<Engagement>('endDate'),
      comparator: (left, right) => compareDates(left.endDate, right.endDate),
    },
    {
      children: 'Last modified (UTC)',
      sortKey: nameOf<Engagement>('lastModifiedDate'),
      comparator: (left, right) => compareDates(left.lastModifiedDate, right.lastModifiedDate),
    },
    {
      children: 'Last approved (UTC)',
      sortKey: nameOf<Engagement>('lastApprovedDate'),
      comparator: (left, right) => compareDates(left.lastApprovedDate, right.lastApprovedDate),
    },
  ];

  const [sortedEngagements, tableHeader] = useSortingTableHeader(engagements, headerCells);

  const sortedRows = sortedEngagements.map((e) => ({
    cells: [
      {
        children: <StyledCheckbox
          onChange={() => onSelectEngagement(e.id)}
          ariaLabel={`Select ${e.name}`}
          checked={e.isSelected}
        />,
        key: 'select',
      },
      { children: <Link to={`${e.id}/scope/edit`}>{e.name}</Link>, key: e.id },
      { children: enumKeyToString(e.solutionArea).replace('Unknown', '-'), key: e.solutionArea },
      { children: enumKeyToString(e.status).replace('Unknown', '-'), key: e.status },
      { children: enumKeyToString(e.partnerRole).replace('Unknown', '-'), key: e.partnerRole },
      { children: e.startDate ? toLocalizedDate(e.startDate) : '-', key: 'startDate' },
      { children: e.endDate ? toLocalizedDate(e.endDate) : '-', key: 'endDate' },
      {
        children: e.lastModifiedDate ? toLocalizedDate(e.lastModifiedDate) : '-',
        key: 'modifiedDate',
      },
      {
        children: e.lastApprovedDate ? toLocalizedDate(e.lastApprovedDate) : '-',
        key: 'approvedDate',
      },
    ],
    key: e.id,
  }));

  return (
    <>
      <PageTitle
        title="Incentives"
        subTitle="Engagements"
        inline
      />
      {!isUserPrivilegesLoading && userPrivileges.canManage
        && (
        <div className="btn-group">
          <AddEngagementModal
            onAddEngagement={onAddEngagement}
          />
          <DeleteEngagementsModal
            selectedEngagements={engagements.filter((e) => e.isSelected)}
            onDelete={onDeleteEngagement}
          />
        </div>
        )}

      {isSuccessAlertVisible
      && (
      <Alert
        alertType="success"
        onDismiss={() => setIsSuccessAlertVisible(false)}
        content={successMessage}
      />
      )}
      <LoadedContent isLoading={isLoading} error={error} retryFunction={fetchEngagements}>
        <Table
          head={tableHeader}
          rows={sortedRows}
          caption="List of engagements"
        />
      </LoadedContent>
    </>
  );
};
