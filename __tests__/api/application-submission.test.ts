import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/applications/route'
import { NextResponse } from 'next/server'
import Application from '@/lib/db/models/Application'
import Job from '@/lib/db/models/Job'
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
        findOne: vi.fn(),
        create: vi.fn(),
    },
}))

vi.mock('@/lib/db/models/Job', () => ({
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

describe('POST /api/applications', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return 401 if not authenticated', async () => {
        const { auth } = await import('@clerk/nextjs/server')
        vi.mocked(auth).mockResolvedValueOnce({ userId: null } as any)

        const req = new Request('http://localhost:3000/api/applications', {
            method: 'POST',
            body: JSON.stringify({})
        })

        const res = await POST(req)
        expect(res.status).toBe(401)
    })

    it('should create a job application successfully', async () => {
        const { auth } = await import('@clerk/nextjs/server')
        vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any)

        vi.mocked(User.findOne).mockResolvedValue({
            _id: 'user_id',
            role: 'freelancer',
            onboardingCompleted: true
        })

        vi.mocked(Job.findById).mockResolvedValue({
            status: 'open',
            company: 'company_id'
        })

        vi.mocked(Application.findOne).mockResolvedValue(null) // No existing app

        vi.mocked(Application.create).mockResolvedValue({ _id: 'new_app_id' })

        const req = new Request('http://localhost:3000/api/applications', {
            method: 'POST',
            body: JSON.stringify({
                jobId: 'job_123',
                coverLetter: 'Hello',
                proposedRate: 50
            })
        })

        const res = await POST(req)
        const data = await res.json()

        expect(res.status).toBe(201)
        expect(data.success).toBe(true)
        expect(Application.create).toHaveBeenCalled()
    })
})
