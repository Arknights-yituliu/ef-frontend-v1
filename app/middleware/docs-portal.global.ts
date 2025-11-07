export default defineNuxtRouteMiddleware((to, from) => {
  const { docsRoutePrefixes = [] } = useAppConfig()

  const isDocsRoute = (route: typeof to | typeof from) => {
    if (!docsRoutePrefixes.length || !route?.path) {
      return false
    }

    return docsRoutePrefixes.some((prefix) => route.path.startsWith(prefix))
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

