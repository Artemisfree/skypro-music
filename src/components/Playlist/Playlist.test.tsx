import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import currentTrackReducer from '@/store/features/currentTrackSlice'
import playlistReducer from '@/store/features/playlistSlice'
import authReducer from '@/store/features/authSlice'
import { FilteredTracksProvider } from '@/contexts/FilteredTracksContext'
import Playlist from './Playlist'

jest.mock('@/app/api', () => ({
	getAllTracks: jest.fn().mockResolvedValue({
		data: [
			{
				_id: '1',
				name: 'Track1',
				author: 'Author1',
				genre: ['Genre1'],
				album: 'Album1',
				release_date: '2020-01-01',
				duration_in_seconds: 180,
				isLiked: false,
			},
			{
				_id: '2',
				name: 'Track2',
				author: 'Author2',
				genre: ['Genre2'],
				album: 'Album2',
				release_date: '2021-01-01',
				duration_in_seconds: 210,
				isLiked: true,
			},
		],
	}),
	addTrackToFavorites: jest.fn().mockResolvedValue({}),
	removeTrackFromFavorites: jest.fn().mockResolvedValue({}),
	getAllFavoriteTracks: jest.fn().mockResolvedValue({
		data: [
			{
				_id: '2',
				name: 'Track2',
				author: 'Author2',
				genre: ['Genre2'],
				album: 'Album2',
				release_date: '2021-01-01',
				duration_in_seconds: 210,
				isLiked: true,
			},
		],
	}),
	getSelectionById: jest.fn().mockResolvedValue({
		data: {
			items: [1, 2],
		},
	}),
	getTrackById: jest.fn().mockResolvedValue(id => ({
		data: {
			_id: String(id),
			name: `Track${id}`,
			author: `Author${id}`,
			genre: [`Genre${id}`],
			album: `Album${id}`,
			release_date: `2020-01-01`,
			duration_in_seconds: 180,
			isLiked: false,
		},
	})),
}))

const store = configureStore({
	reducer: {
		currentTrack: currentTrackReducer,
		playlist: playlistReducer,
		auth: authReducer,
	},
})

describe('Playlist component', () => {
	it('renders correctly and matches snapshot', async () => {
		const component = renderer.create(
			<Provider store={store}>
				<FilteredTracksProvider>
					<Playlist />
				</FilteredTracksProvider>
			</Provider>
		)

		await renderer.act(async () => {
			await Promise.resolve()
		})

		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
