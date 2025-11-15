import { Button } from '@/components/ui/button'
import Link from 'next/dist/client/link'

export default function Home() {
  return (
    <main className="h-screen top-1/2">
      <div className="grid place-items-center">
        <span>Hello</span>
        <Button asChild>
          <Link href="/api/auth/login">
            Login
          </Link>
        </Button>
      </div>
    </main>
  )
}
