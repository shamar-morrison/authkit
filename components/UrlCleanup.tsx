'use client'

import { useEffect } from 'react'

export function UrlCleanup() {
  useEffect(() => {
    // Check if there's a code parameter in the URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (url.searchParams.has('code')) {
        // Remove the code parameter and update the URL without reloading
        url.searchParams.delete('code')
        window.history.replaceState({}, '', url.pathname + url.search + url.hash)
      }
    }
  }, [])

  return null // This component doesn't render anything
}
