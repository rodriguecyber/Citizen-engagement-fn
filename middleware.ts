import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define role-based access control mapping
const roleAccessMap = {
    '/dashboard/superadmin': ['superadmin'],
    '/dashboard/orgadmin': ['orgadmin'],
    '/dashboard/districtadmin': ['districtadmin'],
    '/dashboard/sectoradmin': ['sectoradmin'],
    '/dashboard/citizen': ['citizen'],
}

// Helper function to check if user has access to a path
function hasAccess(path: string, userRole: string | null): boolean {
    // If no role, no access
    if (!userRole) return false

    // Find the matching path prefix
    const matchingPrefix = Object.keys(roleAccessMap).find(prefix => path.startsWith(prefix))
    if (!matchingPrefix) return true // If no matching prefix, allow access (public routes)

    // Check if user's role is in the allowed roles for this path
    return roleAccessMap[matchingPrefix as keyof typeof roleAccessMap].includes(userRole)
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Skip middleware for public routes
    if (path === '/auth/login' || path === '/auth/register') {
        return NextResponse.next()
    }

    if (path.startsWith('/dashboard/')) {
        // Create a response that includes a script to check auth on client side
        const response = NextResponse.next()

        // Add a custom header to indicate this is a protected route
        response.headers.set('x-protected-route', 'true')

        return response
    }

    return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/auth/:path*'
    ]
} 