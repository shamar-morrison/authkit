import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cookies } from 'next/headers'

interface UserData {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
}

export default async function Home() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  let user: UserData | null = null
  if (sessionCookie) {
    try {
      user = JSON.parse(sessionCookie.value)
    } catch (error) {
      console.error('Failed to parse session cookie:', error)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-6 p-8">
        {user ? (
          <>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Welcome back!</h1>
              <div className="text-lg text-muted-foreground space-y-1">
                {user.firstName && user.lastName && (
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                )}
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link href="/api/auth/logout">
                Logout
              </Link>
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Welcome to AuthKit</h1>
              <p className="text-muted-foreground">Sign in to get started</p>
            </div>
            <Button asChild>
              <Link href="/api/auth/login">
                Login
              </Link>
            </Button>
          </>
        )}
      </div>
    </main>
  )
}
