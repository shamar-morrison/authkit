'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      // Navigate to logout endpoint
      await fetch('/api/auth/logout')

      // Refresh the page to show updated UI
      startTransition(() => {
        router.refresh()
        router.push('/')
      })
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoading(false)
    }
  }

  const loading = isLoading || isPending

  return (
    <Button variant="outline" onClick={handleLogout} disabled={loading}>
      {loading ? (
        <>
          <svg
            className="animate-spin ml-1 mr-1 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Logging out...
        </>
      ) : (
        'Logout'
      )}
    </Button>
  )
}
