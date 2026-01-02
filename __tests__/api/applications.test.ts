import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PATCH } from '@/app/api/applications/[id]/status/route'
import { NextResponse } from 'next/server'
import Application from '@/lib/db/models/Application'
import User from '@/lib/db/models/User'

// Mock dependencies
vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(),
}))

vi.mock('@/lib/db/connect', () => ({
    default: vi.fn(),
}))

vi.mock('@/lib/db/models/Application', () => ({
    default: {
        findById: vi.fn(),
        findByIdAndUpdate: vi.fn(),
    },
}))

vi.mock('@/lib/db/models/User', () => ({
    default: {
        findOne: vi.fn(),
    },
}))

describe('PATCH /api/applications/[id]/status', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return 401 if not authenticated', async () => {
        const { auth } = await import('@clerk/nextjs/server')
        vi.mocked(auth).mockResolvedValueOnce({ userId: null } as any)

        const req = new Request('http://localhost:3000/api/applications/123/status', {
            method: 'PATCH',
            body: JSON.stringify({ status: 'accepted' })
        })

        const params = Promise.resolve({ id: '123' })
        const res = await PATCH(req, { params })

        expect(res.status).toBe(401)
    })

    it('should return 403 if user is not a company', async () => {
        const { auth } = await import('@clerk/nextjs/server')
        vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any)

        // Mock User finding
        vi.mocked(User.findOne).mockResolvedValue({ role: 'freelancer' })

        const req = new Request('http://localhost:3000/api/applications/123/status', {
            method: 'PATCH',
            body: JSON.stringify({ status: 'accepted' })
        })

        const params = Promise.resolve({ id: '123' })
        const res = await PATCH(req, { params })

        expect(res.status).toBe(403)
    })
})
