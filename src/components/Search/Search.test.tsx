import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Search from './Search'
import { useFilteredTracks } from '@/contexts/FilteredTracksContext'

jest.mock('@/contexts/FilteredTracksContext', () => ({
	useFilteredTracks: jest.fn(),
}))

describe('Search Component', () => {
	const mockSetSearchKeyword = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		useFilteredTracks.mockReturnValue({
			setSearchKeyword: mockSetSearchKeyword,
		})
	})

	test('renders correctly', () => {
		const { getByPlaceholderText, getByRole } = render(<Search />)

		expect(getByPlaceholderText('Поиск')).toBeInTheDocument()
		expect(getByRole('searchbox')).toBeInTheDocument()
	})

	test('calls setSearchKeyword on input change', () => {
		const { getByPlaceholderText } = render(<Search />)
		const searchInput = getByPlaceholderText('Поиск')

		fireEvent.change(searchInput, { target: { value: 'test' } })

		expect(mockSetSearchKeyword).toHaveBeenCalledWith('test')
	})
})
