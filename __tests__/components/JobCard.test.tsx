import { render, screen } from '@testing-library/react'
import JobCard from '@/components/dashboard/job-card'
import { describe, it, expect } from 'vitest'

describe('JobCard', () => {
    const mockJob = {
        _id: '123',
        title: 'Senior Developer',
        company: {
            _id: '456',
            companyName: 'Tech Corp',
            logo: '/logo.png'
        },
        location: 'Remote',
        budget: {
            min: 100000,
            max: 150000,
            currency: 'INR'
        },
        type: 'Full-time',
        skills: ['React', 'Node.js'],
        description: 'Great job',
        createdAt: new Date().toISOString()
    }

    it('renders job title and company name', () => {
        render(<JobCard job={mockJob} />)

        expect(screen.getByText('Senior Developer')).toBeInTheDocument()
        expect(screen.getByText('Tech Corp')).toBeInTheDocument()
    })

    it('renders budget correctly', () => {
        render(<JobCard job={mockJob} />)
        expect(screen.getByText(/INR 1,00,000 - 1,50,000/)).toBeInTheDocument()
    })

    it('renders skills', () => {
        render(<JobCard job={mockJob} />)
        expect(screen.getByText('React')).toBeInTheDocument()
        expect(screen.getByText('Node.js')).toBeInTheDocument()
    })
})
