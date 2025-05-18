import axios, { AxiosError } from 'axios'
import { toast } from '@/components/ui/use-toast'

export interface ErrorResponse {
    message: string
    code?: string
    status?: number
    details?: any
}

export class AppError extends Error {
    constructor(
        message: string,
        public code?: string,
        public status?: number,
        public details?: any
    ) {
        super(message)
        this.name = 'AppError'
    }
}

export const handleApiError = (error: unknown): ErrorResponse => {
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>

        if (axiosError.response) {
            // Server responded with an error status
            const status = axiosError.response.status
            const errorData = axiosError.response.data

            switch (status) {
                case 400:
                    return {
                        message: errorData?.message || 'Invalid request data',
                        code: 'INVALID_DATA',
                        status: 400,
                        details: errorData?.details
                    }
                case 401:
                    return {
                        message: 'Your session has expired. Please log in again.',
                        code: 'UNAUTHORIZED',
                        status: 401
                    }
                case 403:
                    return {
                        message: 'You do not have permission to perform this action',
                        code: 'FORBIDDEN',
                        status: 403
                    }
                case 404:
                    return {
                        message: 'The requested resource was not found',
                        code: 'NOT_FOUND',
                        status: 404
                    }
                case 413:
                    return {
                        message: 'The file size exceeds the allowed limit',
                        code: 'FILE_TOO_LARGE',
                        status: 413
                    }
                case 415:
                    return {
                        message: 'The file type is not supported',
                        code: 'INVALID_FILE_TYPE',
                        status: 415
                    }
                case 422:
                    return {
                        message: errorData?.message || 'Validation failed',
                        code: 'VALIDATION_ERROR',
                        status: 422,
                        details: errorData?.details
                    }
                case 429:
                    return {
                        message: 'Too many requests. Please try again later',
                        code: 'RATE_LIMIT_EXCEEDED',
                        status: 429
                    }
                case 500:
                    return {
                        message: 'An internal server error occurred',
                        code: 'SERVER_ERROR',
                        status: 500
                    }
                default:
                    return {
                        message: errorData?.message || 'An unexpected error occurred',
                        code: 'UNKNOWN_ERROR',
                        status: status
                    }
            }
        } else if (axiosError.request) {
            // Request was made but no response received
            return {
                message: 'Unable to connect to the server. Please check your internet connection',
                code: 'NETWORK_ERROR',
                status: 0
            }
        }
    }

    // Handle custom AppError
    if (error instanceof AppError) {
        return {
            message: error.message,
            code: error.code,
            status: error.status,
            details: error.details
        }
    }

    // Handle generic errors
    if (error instanceof Error) {
        return {
            message: error.message,
            code: 'UNKNOWN_ERROR',
            status: 500
        }
    }

    // Fallback for unknown errors
    return {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        status: 500
    }
}

export const showErrorToast = (error: unknown) => {
    const errorResponse = handleApiError(error)

    toast({
        title: getErrorTitle(errorResponse.code),
        description: errorResponse.message,
        variant: 'destructive',
    })

    // Handle special cases
    if (errorResponse.code === 'UNAUTHORIZED') {
        // Redirect to login after a delay
        setTimeout(() => {
            window.location.href = '/login'
        }, 2000)
    }

    return errorResponse
}

export const showSuccessToast = (message: string, title: string = 'Success') => {
    toast({
        title,
        description: message,
        variant: 'default',
    })
}

const getErrorTitle = (code?: string): string => {
    switch (code) {
        case 'INVALID_DATA':
            return 'Invalid Data'
        case 'UNAUTHORIZED':
            return 'Authentication Error'
        case 'FORBIDDEN':
            return 'Access Denied'
        case 'NOT_FOUND':
            return 'Not Found'
        case 'FILE_TOO_LARGE':
            return 'File Too Large'
        case 'INVALID_FILE_TYPE':
            return 'Invalid File Type'
        case 'VALIDATION_ERROR':
            return 'Validation Error'
        case 'RATE_LIMIT_EXCEEDED':
            return 'Too Many Requests'
        case 'SERVER_ERROR':
            return 'Server Error'
        case 'NETWORK_ERROR':
            return 'Network Error'
        default:
            return 'Error'
    }
}

// Utility function to create a custom error
export const createAppError = (
    message: string,
    code?: string,
    status?: number,
    details?: any
): AppError => {
    return new AppError(message, code, status, details)
}

// Validation error helper
export const createValidationError = (message: string, details?: any): AppError => {
    return createAppError(message, 'VALIDATION_ERROR', 422, details)
}

// Authentication error helper
export const createAuthError = (message: string = 'Authentication failed'): AppError => {
    return createAppError(message, 'UNAUTHORIZED', 401)
}

// Permission error helper
export const createPermissionError = (message: string = 'Permission denied'): AppError => {
    return createAppError(message, 'FORBIDDEN', 403)
} 