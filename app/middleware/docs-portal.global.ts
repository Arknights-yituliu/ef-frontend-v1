export default defineNuxtRouteMiddleware((to, from) => {
  const isDocsRoute = (route: typeof to | typeof from) => {
    return Boolean(route && route.path && route.path.startsWith('/introduction'))
  }

  if (!isDocsRoute(to)) {
    return
  }

  const cameFromDocs = isDocsRoute(from)

  if (import.meta.client && !cameFromDocs) {
    const targetUrl = to.fullPath || to.path
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener')
    }
    return abortNavigation()
  }
})

