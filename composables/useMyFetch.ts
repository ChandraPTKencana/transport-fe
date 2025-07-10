import useApiBaseUrl from './useApiBaseUrl'
export const useMyFetch: typeof useFetch = (request, opts?) => {
    const config = useRuntimeConfig()
    const { apiBase } = useApiBaseUrl()
    
    return useFetch(request, { baseURL: apiBase, ...opts })
    // return useFetch(request, { baseURL: config.public.baseURL, ...opts })
  }