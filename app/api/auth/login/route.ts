import { WorkOS } from '@workos-inc/node'
import { NextRequest, NextResponse } from 'next/server'

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
})

export async function GET(request: NextRequest) {
  // Dynamically determine redirect URI based on the current host
  const host = request.headers.get('host')
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const redirectUri = `${protocol}://${host}/callback`

  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: 'authkit',
    redirectUri: redirectUri,
    clientId: process.env.WORKOS_CLIENT_ID!,
  })

  return NextResponse.redirect(authorizationUrl)
}
