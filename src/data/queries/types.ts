import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query";

type CustomQueryOptions = {
  cache?: boolean;
};

export type QueryOptions<T> = Omit<UseQueryOptions<T>, "queryKey" | "queryFn"> &
  CustomQueryOptions;

export type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
>;

function processCustomOptions<T>(
  options?: QueryOptions<T>,
): Omit<UseQueryOptions<T>, "queryKey" | "queryFn"> {
  if (!options) return {};

  const { cache, ...reactQueryOptions } = options;

  if (cache) {
    return {
      staleTime: 60 * 60 * 1000,
      ...reactQueryOptions,
    };
  }

  return reactQueryOptions;
}

export function createQueryHook<TData>(
  queryKey: QueryKey | (() => QueryKey),
  queryFn: () => Promise<TData>,
  defaultOptions?: QueryOptions<TData>,
) {
  return (options?: QueryOptions<TData>) => {
    const processedDefaults = processCustomOptions(defaultOptions);
    const processedOptions = processCustomOptions(options);

    return useQuery({
      queryKey: typeof queryKey === "function" ? queryKey() : queryKey,
      queryFn,
      ...processedDefaults,
      ...processedOptions,
    });
  };
}

export function createQueryHookWithParams<TData, TParams extends unknown[]>(
  queryKey: (...params: TParams) => QueryKey,
  queryFn: (...params: TParams) => Promise<TData>,
  defaultOptions?:
    | ((...params: TParams) => QueryOptions<TData>)
    | QueryOptions<TData>,
) {
  return (...args: unknown[]) => {
    let params: TParams;
    let options: QueryOptions<TData> | undefined;

    const lastArg = args[args.length - 1];
    const isOptions =
      lastArg !== null &&
      lastArg !== undefined &&
      typeof lastArg === "object" &&
      !Array.isArray(lastArg) &&
      ("enabled" in lastArg ||
        "staleTime" in lastArg ||
        "retry" in lastArg ||
        "refetchInterval" in lastArg ||
        "onSuccess" in lastArg ||
        "onError" in lastArg ||
        "cache" in lastArg);

    if (isOptions) {
      params = args.slice(0, -1) as TParams;
      options = lastArg as QueryOptions<TData>;
    } else {
      params = args as TParams;
      options = undefined;
    }

    const defaults =
      typeof defaultOptions === "function"
        ? defaultOptions(...params)
        : defaultOptions;

    const processedDefaults = processCustomOptions(defaults);
    const processedOptions = processCustomOptions(options);

    return useQuery({
      queryKey: queryKey(...params),
      queryFn: () => queryFn(...params),
      ...processedDefaults,
      ...processedOptions,
    });
  };
}

export function createMutationHook<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  defaultOptions?: MutationOptions<TData, TVariables>,
) {
  return (options?: MutationOptions<TData, TVariables>) => {
    return useMutation({
      mutationFn,
      ...defaultOptions,
      ...options,
    });
  };
}

export function createMutationHookWithInvalidation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  invalidateKeys:
    | QueryKey
    | QueryKey[]
    | ((variables: TVariables, data: TData) => QueryKey | QueryKey[]),
  additionalOptions?: MutationOptions<TData, TVariables>,
) {
  return (options?: MutationOptions<TData, TVariables>) => {
    const queryClient = useQueryClient();

    const userOnSuccess = options?.onSuccess;
    const additionalOnSuccess = additionalOptions?.onSuccess;

    return useMutation({
      mutationFn,
      ...additionalOptions,
      ...options,
      onSuccess: (...args) => {
        const [data, variables] = args;

        const keys =
          typeof invalidateKeys === "function"
            ? invalidateKeys(variables, data)
            : invalidateKeys;

        const keysArray = Array.isArray(keys[0])
          ? (keys as QueryKey[])
          : [keys as QueryKey];

        Promise.all(
          keysArray.map((key) =>
            queryClient.invalidateQueries({ queryKey: key }),
          ),
        );

        if (userOnSuccess) {
          (userOnSuccess as (...args: unknown[]) => void)(...args);
        }
        if (additionalOnSuccess) {
          (additionalOnSuccess as (...args: unknown[]) => void)(...args);
        }
      },
    });
  };
}
