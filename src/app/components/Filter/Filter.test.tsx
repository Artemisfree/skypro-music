import React, { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useFilteredTracks } from '@/contexts/FilteredTracksContext'
import { getAllTracks } from '@/app/api'
import Filter from './Filter'

jest.mock('@/contexts/FilteredTracksContext')
const mockedUseFilteredTracks = useFilteredTracks as jest.MockedFunction<
	typeof useFilteredTracks
>

jest.mock('@/app/api')
const mockedGetAllTracks = getAllTracks as jest.MockedFunction<
	typeof getAllTracks
>

const tracks = [
	{ id: 1, author: 'Author1', genre: ['Genre1'], year: 2021 },
	{ id: 2, author: 'Author2', genre: ['Genre2'], year: 2020 },
	{ id: 3, author: 'Author1', genre: ['Genre2'], year: 2019 },
]

beforeEach(() => {
	mockedUseFilteredTracks.mockReturnValue({
        activeGenres: [],
        setActiveGenres: jest.fn(),
        activeAuthors: [],
        setActiveAuthors: jest.fn(),
        sortOrder: 'default',
        setSortOrder: jest.fn(),
        searchKeyword: '',
        setSearchKeyword: function (value: React.SetStateAction<string>): void {
            throw new Error('Function not implemented.')
        }
    })

	mockedGetAllTracks.mockResolvedValue({ data: tracks })
})

test('renders Filter component', async () => {
	render(<Filter />)

	expect(screen.getByText('Искать по:')).toBeInTheDocument()
	expect(screen.getByText('исполнителю')).toBeInTheDocument()
	expect(screen.getByText('дате выпуска')).toBeInTheDocument()
	expect(screen.getByText('жанру')).toBeInTheDocument()
	expect(mockedGetAllTracks).toHaveBeenCalled()
})

test('changes sort order', async () => {
	render(<Filter />)

	fireEvent.click(screen.getByText('дате выпуска'))

	expect(await screen.findByText('По умолчанию')).toBeInTheDocument()
	expect(await screen.findByText('Сначала новые')).toBeInTheDocument()
	expect(await screen.findByText('Сначала старые')).toBeInTheDocument()

	fireEvent.click(screen.getByText('Сначала новые'))

	const { setSortOrder } = mockedUseFilteredTracks()

	expect(setSortOrder).toHaveBeenCalledWith('newest')
})
