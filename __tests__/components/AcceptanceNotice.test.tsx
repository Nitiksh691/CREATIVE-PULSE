import { render, screen } from '@testing-library/react'
import AcceptanceNotice from '@/components/dashboard/acceptance-notice'
import { describe, it, expect } from 'vitest'

describe('AcceptanceNotice', () => {
    const mockApp = {
        _id: '123',
        company: {
            companyName: 'Cool Company',
        },
        job: {
            title: 'Senior Frontend Engineer',
        },
        acceptanceDetails: {
            message: 'Welcome to the team! Call us.',
            email: 'hr@coolcompany.com',
            phone: '123-456-7890'
        }
    }

    it('renders "Congratulations" message', () => {
        render(<AcceptanceNotice app={mockApp} />)
        expect(screen.getByText('Congratulations! You have been selected.')).toBeInTheDocument()
    })

    it('displays company name and job title', () => {
        render(<AcceptanceNotice app={mockApp} />)
        expect(screen.getByText('Cool Company')).toBeInTheDocument()
        expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument()
    })

    it('displays contact details', () => {
        render(<AcceptanceNotice app={mockApp} />)
        expect(screen.getByText('hr@coolcompany.com')).toBeInTheDocument()
        expect(screen.getByText('123-456-7890')).toBeInTheDocument()
        expect(screen.getByText('"Welcome to the team! Call us."')).toBeInTheDocument()
    })

    it('renders nothing if no acceptanceDetails', () => {
        const incompleteApp = { ...mockApp, acceptanceDetails: undefined }
        const { container } = render(<AcceptanceNotice app={incompleteApp as any} />)
        expect(container).toBeEmptyDOMElement()
    })
})
