import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Player from './Player'
import { useDispatch, useSelector } from 'react-redux'
import {
	setCurrentTrack,
	updateCurrentTime,
} from '@/store/features/currentTrackSlice'
import { addTrackToFavorites, removeTrackFromFavorites } from '@/app/api'
import { updateTrackLikeStatus } from '@/store/features/playlistSlice'
import { Track } from '@/types/types'

jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	useDispatch: jest.fn(),
	useSelector: jest.fn(),
}))
jest.mock('@/app/api', () => ({
	addTrackToFavorites: jest.fn(),
	removeTrackFromFavorites: jest.fn(),
}))

describe('Player Component', () => {
	const mockDispatch = jest.fn()
	const mockUseDispatch = useDispatch as jest.Mock
	const mockUseSelector = useSelector as jest.Mock
	const mockTrack: Track = {
		_id: 1,
		name: 'Test Track',
		author: 'Test Author',
		track_file: 'test-file.mp3',
		duration_in_seconds: 300,
		isLiked: false,
	}
	const mockAudioRef = {
		current: {
			src: '',
			play: jest.fn(),
			pause: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		},
	}

	beforeEach(() => {
		jest.clearAllMocks()
		mockUseDispatch.mockReturnValue(mockDispatch)
		mockUseSelector.mockImplementation(selector =>
			selector({
				currentTrack: {
					currentTrack: mockTrack,
					isPlaying: false,
					currentTime: 0,
				},
				playlist: {
					tracks: [mockTrack],
				},
			})
		)
	})

	test('renders correctly with current track', () => {
		const { getByText } = render(
			<Player
				isRepeat={false}
				setIsRepeat={() => {}}
				togglePlay={() => {}}
				isShuffle={false}
				setIsShuffle={() => {}}
				tracks={[mockTrack]}
				audioRef={mockAudioRef}
			/>
		)
		expect(getByText('Test Track')).toBeInTheDocument()
		expect(getByText('Test Author')).toBeInTheDocument()
	})

	test('plays and pauses track', () => {
		const togglePlay = jest.fn()
		const { container } = render(
			<Player
				isRepeat={false}
				setIsRepeat={() => {}}
				togglePlay={togglePlay}
				isShuffle={false}
				setIsShuffle={() => {}}
				tracks={[mockTrack]}
				audioRef={mockAudioRef}
			/>
		)
		const playButton = container.querySelector('.player__btn_play')
		fireEvent.click(playButton)
		expect(togglePlay).toHaveBeenCalled()
	})

	test('toggles repeat and shuffle modes', () => {
		const setIsRepeat = jest.fn()
		const setIsShuffle = jest.fn()

		const { container } = render(
			<Player
				isRepeat={false}
				setIsRepeat={setIsRepeat}
				togglePlay={() => {}}
				isShuffle={false}
				setIsShuffle={setIsShuffle}
				tracks={[mockTrack]}
				audioRef={mockAudioRef}
			/>
		)

		const repeatButton = container.querySelector('.player__btn_repeat')
		fireEvent.click(repeatButton)
		expect(setIsRepeat).toHaveBeenCalledWith(true)

		const shuffleButton = container.querySelector('.player__btn_shuffle')
		fireEvent.click(shuffleButton)
		expect(setIsShuffle).toHaveBeenCalledWith(true)
	})

	test('handles next and previous track', () => {
		const { container } = render(
			<Player
				isRepeat={false}
				setIsRepeat={() => {}}
				togglePlay={() => {}}
				isShuffle={false}
				setIsShuffle={() => {}}
				tracks={[mockTrack]}
				audioRef={mockAudioRef}
			/>
		)

		const nextButton = container.querySelector('.player__btn_next')
		fireEvent.click(nextButton)
		expect(mockDispatch).toHaveBeenCalledWith(setCurrentTrack(mockTrack))
		expect(mockDispatch).toHaveBeenCalledWith(updateCurrentTime(0))

		const prevButton = container.querySelector('.player__btn_prev')
		fireEvent.click(prevButton)
		expect(mockDispatch).toHaveBeenCalledWith(setCurrentTrack(mockTrack))
		expect(mockDispatch).toHaveBeenCalledWith(updateCurrentTime(0))
	})
})
