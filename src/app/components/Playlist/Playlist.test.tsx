import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from '@/store/store'
import Playlist from './Playlist'
import { setTracks } from '@/store/features/playlistSlice'
import '@testing-library/jest-dom'
import * as api from '@/app/api'

jest.mock('@/app/api')
jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	useDispatch: jest.fn(),
	useSelector: jest.fn(),
}))
jest.mock('@/contexts/FilteredTracksContext', () => ({
	useFilteredTracks: () => ({
		activeGenres: [],
		activeAuthors: [],
		searchKeyword: '',
		sortOrder: 'newest',
	}),
}))

describe('Playlist Component', () => {
	const mockDispatch = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		useDispatch.mockReturnValue(mockDispatch)
		useSelector.mockImplementation(selector =>
			selector({
				currentTrack: { currentTrack: null, isPlaying: false, currentTime: 0 },
				playlist: { tracks: [] },
			})
		)
	})

	test('renders without crashing', () => {
		render(
			<Provider store={store}>
				<Playlist />
			</Provider>
		)
	})

	test('displays tracks correctly', async () => {
		const mockTracks = [
			{
				_id: '1',
				name: 'Track 1',
				author: 'Author 1',
				album: 'Album 1',
				duration_in_seconds: 210,
				isLiked: false,
			},
			{
				_id: '2',
				name: 'Track 2',
				author: 'Author 2',
				album: 'Album 2',
				duration_in_seconds: 180,
				isLiked: true,
			},
		]

		useSelector.mockImplementation(selector =>
			selector({
				currentTrack: { currentTrack: null, isPlaying: false, currentTime: 0 },
				playlist: { tracks: mockTracks },
			})
		)

		const { getByText } = render(
			<Provider store={store}>
				<Playlist />
			</Provider>
		)

		await waitFor(() => {
			expect(getByText('Track 1')).toBeInTheDocument()
			expect(getByText('Author 1')).toBeInTheDocument()
			expect(getByText('Album 1')).toBeInTheDocument()
			expect(getByText('3:30')).toBeInTheDocument()
			expect(getByText('Track 2')).toBeInTheDocument()
			expect(getByText('Author 2')).toBeInTheDocument()
			expect(getByText('Album 2')).toBeInTheDocument()
			expect(getByText('3:00')).toBeInTheDocument()
		})
	})
})
