import React from 'react';
import './details-list.scss';

export type DetailItem = {
  label: string;
  data: React.ReactNode;
};

export type DetailsListProps = {
  details: DetailItem[];
};

export const DetailsList: React.FC<DetailsListProps> = ({ details }) => {
  const listItems = details.map((d) => (
    <div>
      <dt>{d.label}</dt>
      <dd>{d.data}</dd>
    </div>
  ));

  return (
    <dl className="detailsList optimal-max-width spacer-md-top">
      {listItems}
    </dl>
  );
};
