export const useDynamicPathCookie = <T = string | null>(
  name: string,
  value?: T,
  options?: any,
  pathSegment?: string, // Parameter opsional untuk path
  routePath?: string // Parameter tambahan untuk middleware
) => {
  const cookiePath = computed(() => {
    if (pathSegment) return `/${pathSegment.replace(/^\/|\/$/g, '')}`
    
    // Gunakan routePath jika tersedia (untuk middleware)
    if (routePath) {
      const firstPathSegment = routePath.split('/')[1] || '/'
      return `/${firstPathSegment}`
    }
    
    // if (process.client) {
    //   // const route = useRoute()
    //   const firstPathSegment = window.location.pathname.split('/')[1] || '/'
    //   console.log("in client",firstPathSegment)
    //   return `/${firstPathSegment}`
    // }
    // return '/' // Fallback untuk server-side

    const url = useRequestURL();
    const firstPathSegment = url.pathname.split('/')[1] || '/';
    return `/${firstPathSegment}`;
  })

  console.log("call cookie",value !== undefined,name,cookiePath.value);
  const cookie = useCookie<T>(name, {
    ...options,
    path: cookiePath.value,
  })

  if (value !== undefined) {
    cookie.value = value
  }

  return cookie
}