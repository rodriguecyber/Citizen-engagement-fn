'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export function AuthCheck() {
    const { user, loading, hasRole } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const checkAuth = async () => {
            // Skip check for public routes
            if (pathname === '/auth/login' || pathname === '/auth/register') {
                return
            }

            // Get token from localStorage
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/auth/login')
                return
            }

            if (!loading && !user) {
                router.push('/auth/login')
                return
            }

            // Check role-based access
            if (user && pathname.startsWith('/dashboard/')) {
                const role = pathname.split('/')[2] // Get role from path
                if (!hasRole(role as any)) {
                    // Redirect to appropriate dashboard based on user's role
                    router.push(`/dashboard/${user.role}`)
                }
            }
        }

        checkAuth()
    }, [user, loading, pathname, router, hasRole])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return null
} 