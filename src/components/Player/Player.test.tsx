import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import currentTrackReducer from '@/store/features/currentTrackSlice'
import playlistReducer from '@/store/features/playlistSlice'
import authReducer from '@/store/features/authSlice'
import Player from './Player'

jest.mock('@/app/api', () => ({
	addTrackToFavorites: jest.fn().mockResolvedValue({}),
	removeTrackFromFavorites: jest.fn().mockResolvedValue({}),
}))

const store = configureStore({
	reducer: {
		currentTrack: currentTrackReducer,
		playlist: playlistReducer,
		auth: authReducer,
	},
})

const mockTracks = [
	{
		_id: '1',
		name: 'Track1',
		author: 'Author1',
		genre: ['Genre1'],
		album: 'Album1',
		release_date: '2020-01-01',
		duration_in_seconds: 180,
		isLiked: false,
		track_file: 'path/to/track1.mp3',
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
		track_file: 'path/to/track2.mp3',
	},
]

describe('Player component', () => {
	it('renders correctly and matches snapshot', () => {
		const audioRef = React.createRef<HTMLAudioElement>()
		const component = renderer.create(
			<Provider store={store}>
				<Player
					isRepeat={false}
					setIsRepeat={jest.fn()}
					togglePlay={jest.fn()}
					isShuffle={false}
					setIsShuffle={jest.fn()}
					tracks={mockTracks}
					audioRef={audioRef}
				/>
			</Provider>
		)

		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
