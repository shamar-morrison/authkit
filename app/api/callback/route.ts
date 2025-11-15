import { WorkOS } from '@workos-inc/node'
import { NextRequest, NextResponse } from 'next/server'

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
})

export async function GET(request: NextRequest) {
  // The authorization code returned by AuthKit
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return new NextResponse('No code provided', { status: 400 })
  }

  try {
    const { user } = await workos.userManagement.authenticateWithCode({
      code,
      clientId: process.env.WORKOS_CLIENT_ID!,
    })

    // Use the information in `user` for further business logic.
    console.log(user)

    // Redirect the user to the homepage
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('Authentication error:', error)
    return new NextResponse('Authentication failed', { status: 500 })
  }
}
