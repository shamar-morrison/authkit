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

    // Store user session in cookie
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }

    const response = NextResponse.redirect(new URL('/', request.url))

    // Set session cookie (expires in 7 days)
    response.cookies.set('session', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Authentication error:', error)
    return new NextResponse('Authentication failed', { status: 500 })
  }
}
