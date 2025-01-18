import { FetchError } from 'emt-http-base-client';
import { useEffect, useState } from 'react';

// Create a generic function type that allows us to dynamically determine both the
// expected input arguments and output type.
type Function<A = any[], B = any> = (...args: A extends any[] ? A : [A]) => B;

export const useApi = <U, T>(
  apiPromise: Function<U, Promise<T>>, // (...args: U) => Promise<T>
  runOnMount?: boolean,
  initParams?: Parameters<typeof apiPromise>,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FetchError | undefined>(undefined);
  const [response, setResponse] = useState<T | undefined>(undefined);

  const callApi = (...args: Parameters<typeof apiPromise>) => {
    setError(undefined);
    setIsLoading(true);
    try {
      apiPromise(...args)
        .then((r) => setResponse(r))
        .catch((e: FetchError) => {
          // Parse the response JSON and re-create Fetch error with message
          e.response?.json().then((r) => setError(new FetchError(r.Message, e.status, r)));
        })
        .finally(() => setIsLoading(false));
    } catch (e) {
      const tryError = new FetchError((e as Error).message, -1, new Response());
      setError(tryError);
      setIsLoading(false);
      throw e;
    }
  };

  // If runOnMount is true, then this api will be called immediately
  // without needing to be called manually.
  useEffect(() => {
    if (runOnMount) {
      const params = initParams || [];
      // @ts-ignore
      callApi(...params);
    }
  }, []);

  return [response, isLoading, error, callApi] as const;
};
