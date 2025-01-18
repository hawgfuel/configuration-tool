import { Engagement } from '@partnerincentives/engagements-client';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { updateBreadcrumb } from '../utilities';

export const useEngagementBreadcrumb = (engagement: Engagement | undefined) => {
  const history = useHistory();

  useEffect(() => {
    // set a global function to take advantage of routing instead of
    // using a link here, which will trigger a full refresh.
    // @ts-ignore
    window.returnToEngagementsOverview = () => {
      history.push('/');
    };

    // Also create a no-op stub so that we can avoid refreshing the page
    // when clicking on the current breadcrumb
    // @ts-ignore
    window.noOp = () => {
    };

    updateBreadcrumb({
      1: {
        text: 'Engagements',
        value: 'returnToEngagementsOverview()',
        type: 'function',
      },
      2: {
        text: engagement?.name || '',
        value: 'noOp()',
        type: 'function',
      },
    });

    // return a cleanup function to reset window object and avoid pollution
    // ☣ TODO commenting this for now to prevent issues related to other pages not implementing breadcrumbs
    // Re-enable cleanup after other pages add setters.
    // return () => {
    //   // @ts-ignore
    //   delete window.returnToEngagementsOverview;
    //   // @ts-ignore
    //   delete window.noOp;
    // };
  }, [engagement]);
};
