# AuthKit - Next.js 16 Authentication

A modern authentication starter built with Next.js 16, React 19, and WorkOS AuthKit. This project demonstrates how to implement secure, production-ready authentication with session management and a clean user interface.

## Features

- **WorkOS AuthKit Integration** - Enterprise-grade authentication -**Next.js 16** - Latest Next.js with App Router
- **React 19** - Cutting-edge React features
- **Tailwind CSS v4** - Modern styling with CSS variables
- **shadcn/ui** - Beautiful, accessible UI components
- **Session Management** - Cookie-based user sessions
- **Responsive Design** - Works on all devices
- **Serverless Ready** - Deploy to Vercel or Netlify
- **Dynamic Redirect URIs** - Automatic environment detection
- **TypeScript** - Full type safety

## Prerequisites

- **Node.js** 18.x or later
- **WorkOS Account** - [Sign up for free](https://workos.com)

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd authkit
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
WORKOS_API_KEY=sk_test_your_api_key_here
WORKOS_CLIENT_ID=client_your_client_id_here
```

**Getting your WorkOS credentials:**

1. Go to the [WorkOS Dashboard](https://dashboard.workos.com)
2. Navigate to **API Keys** to get your `WORKOS_API_KEY`
3. Navigate to **Authentication** → **Configuration** to get your `WORKOS_CLIENT_ID`

### 4. Configure WorkOS Redirect URIs

In your WorkOS Dashboard under **Authentication** � **Configuration**, add your redirect URIs:

**Development:**

```
http://localhost:3000/api/callback
```

**Production:**

```
https://your-domain.com/api/callback
```

The app automatically determines the correct redirect URI based on your environment.

### 5. Run the Development Server

```bash
npm run dev
```

## Authentication Flow

### 1. **Login** ([app/api/auth/login/route.ts](app/api/auth/login/route.ts))

When a user clicks the "Login" button:

```typescript
// Dynamically determines redirect URI based on request host
const host = request.headers.get('host')
const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
const redirectUri = `${protocol}://${host}/api/callback`

// Generates WorkOS AuthKit authorization URL
const authorizationUrl = workos.userManagement.getAuthorizationUrl({
  provider: 'authkit',
  redirectUri: redirectUri,
  clientId: process.env.WORKOS_CLIENT_ID!,
})

// Redirects user to WorkOS AuthKit
return NextResponse.redirect(authorizationUrl)
```

### 2. **Callback** ([app/api/callback/route.ts](app/api/callback/route.ts))

After successful authentication, WorkOS redirects back with an authorization code:

```typescript
// Exchange authorization code for user information
const { user } = await workos.userManagement.authenticateWithCode({
  code,
  clientId: process.env.WORKOS_CLIENT_ID!,
})

// Store user session in secure cookie
response.cookies.set('session', JSON.stringify(userData), {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
})
```

### 3. **Display User** ([app/page.tsx](app/page.tsx))

The homepage reads the session cookie and displays user information:

```typescript
const cookieStore = await cookies()
const sessionCookie = cookieStore.get('session')

if (sessionCookie) {
  user = JSON.parse(sessionCookie.value)
  // Display: user.email, user.firstName, user.lastName
}
```

### 4. **Logout** ([app/api/auth/logout/route.ts](app/api/auth/logout/route.ts))

Clears the session cookie and redirects to homepage:

```typescript
response.cookies.set('session', '', {
  maxAge: 0,
  path: '/',
})
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables:
   - `WORKOS_API_KEY`
   - `WORKOS_CLIENT_ID`
4. Deploy!

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Push your code to GitHub
2. Import your repository in Netlify
3. Add environment variables:
   - `WORKOS_API_KEY`
   - `WORKOS_CLIENT_ID`
4. Deploy!

The project includes a `netlify.toml` with the required Next.js plugin configuration.

## Customization

### Change Session Duration

Edit the `maxAge` in [app/api/callback/route.ts](app/api/callback/route.ts#L41):

```typescript
maxAge: 60 * 60 * 24 * 30 // 30 days instead of 7
```

### Add Protected Routes

Create a middleware to check authentication:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')

  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
}
```

### Customize Authentication Providers

WorkOS AuthKit supports multiple providers (Google, GitHub, Microsoft, etc.). Configure them in your WorkOS Dashboard under **Authentication** → **Connections**.

## Troubleshooting

### "No code provided" error

- Check that your redirect URI in WorkOS Dashboard matches exactly: `http://localhost:3000/api/callback` or `https://your-domain.com/api/callback`

### "Authentication failed" error

- Verify your `WORKOS_API_KEY` and `WORKOS_CLIENT_ID` in `.env`
- Check the server logs for detailed error messages

### Session not persisting

- Ensure cookies are enabled in your browser
- Check that `httpOnly` and `secure` settings match your environment

### Deployment issues

- Make sure environment variables are set in your deployment platform
- Verify the production redirect URI is configured in WorkOS Dashboard

## Learn More

- [WorkOS Documentation](https://workos.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
