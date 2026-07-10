import * as React from "react";

enum Status {
  idle = "idle",
  resolved = "resolved",
  rejected = "rejected",
  pending = "pending"
}

interface IState<D, E> {
  status?: Status;
  data?: D | null;
  error?: E | null;
}

const useSafeDispatch = <D, E>(
  dispatch: React.Dispatch<Partial<IState<D, E>>>
) => {
  const mounted = React.useRef(false);

  React.useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return React.useCallback(
    (args: Partial<IState<D, E>>) =>
      mounted.current ? dispatch(args) : void 0,
    [dispatch]
  );
};

const defaultInitialState = {
  status: Status.idle,
  data: null,
  error: null
};

const useAsync = <D, E>(initialState: IState<D, E> = {}) => {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState
  });

  const [{ status, data, error }, setState] = React.useReducer(
    (s: IState<D, E>, a: Partial<IState<D, E>>) => ({ ...s, ...a }),
    initialStateRef.current
  );

  const safeSetState = useSafeDispatch(setState);

  const setData = React.useCallback(
    (data: D | null) => safeSetState({ data, status: Status.resolved }),
    [safeSetState]
  );

  const setError = React.useCallback(
    (error: E) => safeSetState({ error, status: Status.rejected }),
    [safeSetState]
  );

  const reset = React.useCallback(() => safeSetState(initialStateRef.current), [
    safeSetState
  ]);

  const run = React.useCallback(
    (promise: Promise<D | null>) => {
      safeSetState({ status: Status.pending });

      return promise.then(
        (data: D | null) => {
          setData(data);
          return data;
        },
        (error: E) => {
          setError(error);
          return Promise.reject(error);
        }
      );
    },
    [safeSetState, setData, setError]
  );

  return {
    isIdle: status === "idle",
    isLoading: status === "pending",
    isError: status === "rejected",
    isSuccess: status === "resolved",
    data,
    setData,
    error,
    setError,
    status,
    run,
    reset
  };
};

export { useAsync, Status };
