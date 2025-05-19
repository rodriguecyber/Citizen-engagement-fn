import { useAuth, UserRole } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface WithRoleProps {
    allowedRoles: UserRole | UserRole[]
    children: React.ReactNode
}

export function WithRole({ allowedRoles, children }: WithRoleProps) {
    const { user, loading, hasRole } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !hasRole(allowedRoles)) {
            // Redirect to appropriate dashboard based on user's role
            if (user) {
                router.push(`/dashboard/${user.role}`)
            } else {
                router.push('/auth/login')
            }
        }
    }, [loading, user, hasRole, allowedRoles, router])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user || !hasRole(allowedRoles)) {
        return null
    }

    return <>{children}</>
}

// Higher-order component for role-based protection
export function withRole<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    allowedRoles: UserRole | UserRole[]
) {
    return function WithRoleWrapper(props: P) {
        return (
            <WithRole allowedRoles={allowedRoles}>
                <WrappedComponent {...props} />
            </WithRole>
        )
    }
} 