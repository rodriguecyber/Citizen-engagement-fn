import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { API_URL } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

export type UserRole = 'superadmin' | 'orgadmin' | 'districtadmin' | 'sectoradmin' | 'citizen'

interface User {
    _id: string
    firstName: string
    lastName: string
    email: string
    role: UserRole
    organization?: {
        _id: string
        name: string
    }
    district?: {
        _id: string
        name: string
    }
    sector?: {
        _id: string
        name: string
    }
}

interface UseAuthReturn {
    user: User | null
    loading: boolean
    error: string | null
    logout: () => Promise<void>
    hasRole: (roles: UserRole | UserRole[]) => boolean
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            setLoading(false)
            return
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setUser(response.data)
                setError(null)
            } catch (err) {
                console.error('Error fetching user:', err)
                setError('Failed to fetch user data')
                // If token is invalid, clear it and redirect to login
                localStorage.removeItem('token')
                router.push('/auth/login')
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [router])

    const logout = async () => {
        try {
            const token = localStorage.getItem('token')
            if (token) {
                await axios.post(`${API_URL}/auth/logout`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            }
        } catch (err) {
            console.error('Error during logout:', err)
        } finally {
            localStorage.removeItem('token')
            setUser(null)
            router.push('/auth/login')
            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
            })
        }
    }

    const hasRole = (roles: UserRole | UserRole[]): boolean => {
        if (!user) return false
        const roleArray = Array.isArray(roles) ? roles : [roles]
        return roleArray.includes(user.role)
    }

    return {
        user,
        loading,
        error,
        logout,
        hasRole,
    }
} 