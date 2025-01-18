import { Alert, Button, IndeterminateProgressRing } from '@partnercenter-react/ui-webcore';
import { ErrorBoundary } from '@partnercenter-react/component-gallery';
import { FetchError } from 'emt-http-base-client';
import React from 'react';
import { useErrorString } from '../../hooks';

export type LoadedContentProps = {
  isLoading: boolean;
  error: FetchError | undefined;
  retryFunction?: () => void;
};

export const LoadedContent: React.FC<LoadedContentProps> = ({
  isLoading, error, retryFunction, children,
}) => {
  if (isLoading) {
    return <IndeterminateProgressRing className="center-block" aria-label="loading" />;
  }

  if (error) {
    const content = (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>{`${useErrorString(error)} (${error.status})`}</p>
        {retryFunction
        && (
          <Button
            renderAsLink
            className="pull-right"
            onClick={retryFunction}
            text="Try again"
          />
        )}
      </div>
    );

    return (
      <Alert
        title="Something went wrong"
        alertType="danger"
        role="alert"
        dismissible={false}
        content={content}
      />
    );
  }

  return (
    <>
      <ErrorBoundary
        fallbackComponent={(
          <Alert
            alertType="danger"
            role="alert"
            dismissible={false}
            content="An unexpected error occurred, please try again."
          />
      )}
      >
        { children || null }
      </ErrorBoundary>
    </>
  );
};
