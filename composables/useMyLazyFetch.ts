import useApiBaseUrl from './useApiBaseUrl'
export const useMyLazyFetch: typeof useLazyFetch = (request, opts?) => {
    const config = useRuntimeConfig()
    const { apiBase } = useApiBaseUrl()

    return useLazyFetch(request, { baseURL: apiBase, ...opts })
    // return useLazyFetch(request, { baseURL: config.public.baseURL, ...opts })
  }