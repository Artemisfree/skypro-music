// import React from 'react'
// import { render, fireEvent } from '@testing-library/react'
// import { Provider } from 'react-redux'
// import configureStore, { MockStoreEnhanced } from 'redux-mock-store'
// import { RootState } from '@/store/store'
// import Bar from './Bar'
// import '@testing-library/jest-dom'
// import { pauseTrack, playTrack } from '@/store/features/currentTrackSlice'

// jest.mock('../Player/Player', () => {
// 	const MockPlayer = ({ togglePlay }) => (
// 		<div>
// 			Mocked Player
// 			<button onClick={togglePlay}>Play/Pause</button>
// 		</div>
// 	)
// 	MockPlayer.displayName = 'MockPlayer'
// 	return MockPlayer
// })

// jest.mock('../Volume/Volume', () => {
// 	const MockVolume = ({ volume, onVolumeChange }) => (
// 		<div>
// 			Mocked Volume
// 			<input
// 				className='mocked-volume-input'
// 				type='range'
// 				min='0'
// 				max='1'
// 				step='0.01'
// 				value={volume}
// 				onChange={onVolumeChange}
// 			/>
// 		</div>
// 	)
// 	MockVolume.displayName = 'MockVolume'
// 	return MockVolume
// })

// Object.defineProperty(HTMLMediaElement.prototype, 'play', {
// 	configurable: true,
// 	value: jest.fn(),
// })

// Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
// 	configurable: true,
// 	value: jest.fn(),
// })

// const mockStore = configureStore<RootState>([])

// describe('Bar Component', () => {
// 	let store: MockStoreEnhanced<RootState>
// 	let initialState: RootState

// 	beforeEach(() => {
// 		initialState = {
// 			currentTrack: {
// 				currentTrack: {
// 					_id: '1',
// 					name: 'Test Track',
// 					author: 'Test Author',
// 					track_file: 'test.mp3',
// 				},
// 				isPlaying: false,
// 				currentTime: 0,
// 			},
// 			playlist: {
// 				tracks: [
// 					{
// 						_id: '1',
// 						name: 'Test Track',
// 						author: 'Test Author',
// 						track_file: 'test.mp3',
// 					},
// 				],
// 			},
// 		}
// 		store = mockStore(initialState)
// 	})

// 	test('renders correctly with given currentTrack', () => {
// 		const { getByText } = render(
// 			<Provider store={store}>
// 				<Bar />
// 			</Provider>
// 		)

// 		expect(getByText('Mocked Player')).toBeInTheDocument()
// 		expect(getByText('Mocked Volume')).toBeInTheDocument()
// 	})

// 	test('changes volume when handleVolumeChange is called', () => {
// 		const { container } = render(
// 			<Provider store={store}>
// 				<Bar />
// 			</Provider>
// 		)

// 		const volumeInput = container.querySelector(
// 			'.mocked-volume-input'
// 		) as HTMLInputElement

// 		fireEvent.change(volumeInput, { target: { value: '0.5' } })

// 		expect(volumeInput.value).toBe('0.5')
// 	})

// 	test('toggles play/pause when the button is clicked', () => {
// 		const { getByText } = render(
// 			<Provider store={store}>
// 				<Bar />
// 			</Provider>
// 		)

// 		const playPauseButton = getByText('Play/Pause')

// 		// Initially, clear any actions that might have been dispatched during the initial render
// 		store.clearActions()

// 		// Simulate clicking the play button
// 		fireEvent.click(playPauseButton)

// 		expect(store.getActions()).toContainEqual(playTrack())
// 		expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()

// 		// Update the store to reflect the playing state
// 		store = mockStore({
// 			...initialState,
// 			currentTrack: {
// 				...initialState.currentTrack,
// 				isPlaying: true,
// 			},
// 		})

// 		// Re-render the component with the updated store
// 		const { getByText: getByTextUpdated } = render(
// 			<Provider store={store}>
// 				<Bar />
// 			</Provider>
// 		)

// 		const playPauseButtonUpdated = getByTextUpdated('Play/Pause')

// 		// Simulate clicking the pause button
// 		fireEvent.click(playPauseButtonUpdated)

// 		expect(store.getActions()).toContainEqual(pauseTrack())
// 		expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()
// 	})
// })


import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore, { MockStoreEnhanced } from 'redux-mock-store'
import { RootState } from '@/store/store'
import Bar from './Bar'
import '@testing-library/jest-dom'
import {
	setCurrentTrack,
	updateCurrentTime,
	setPlayingState,
} from '@/store/features/currentTrackSlice'

jest.mock('../Player/Player', () => {
	const MockPlayer = ({ togglePlay }) => (
		<div>
			Mocked Player
			<button onClick={togglePlay}>Play/Pause</button>
		</div>
	)
	MockPlayer.displayName = 'MockPlayer'
	return MockPlayer
})

jest.mock('../Volume/Volume', () => {
	const MockVolume = ({ volume, onVolumeChange }) => (
		<div>
			Mocked Volume
			<input
				className='mocked-volume-input'
				type='range'
				min='0'
				max='1'
				step='0.01'
				value={volume}
				onChange={onVolumeChange}
			/>
		</div>
	)
	MockVolume.displayName = 'MockVolume'
	return MockVolume
})

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
	configurable: true,
	value: jest.fn(),
})

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
	configurable: true,
	value: jest.fn(),
})

const mockStore = configureStore<RootState>([])

describe('Bar Component', () => {
	let store: MockStoreEnhanced<RootState>
	let initialState: RootState

	beforeEach(() => {
		initialState = {
			currentTrack: {
				currentTrack: {
					_id: '1',
					name: 'Test Track',
					author: 'Test Author',
					track_file: 'test.mp3',
				},
				isPlaying: false,
				currentTime: 0,
			},
			playlist: {
				tracks: [
					{
						_id: '1',
						name: 'Test Track',
						author: 'Test Author',
						track_file: 'test.mp3',
					},
				],
			},
		}
		store = mockStore(initialState)
	})

	test('renders correctly with given currentTrack', () => {
		const { getByText } = render(
			<Provider store={store}>
				<Bar />
			</Provider>
		)

		expect(getByText('Mocked Player')).toBeInTheDocument()
		expect(getByText('Mocked Volume')).toBeInTheDocument()
	})

	test('changes volume when handleVolumeChange is called', () => {
		const { container } = render(
			<Provider store={store}>
				<Bar />
			</Provider>
		)

		const volumeInput = container.querySelector(
			'.mocked-volume-input'
		) as HTMLInputElement

		fireEvent.change(volumeInput, { target: { value: '0.5' } })

		expect(volumeInput.value).toBe('0.5')
	})

	test('plays track when the play button is clicked', () => {
		const { queryByText } = render(
			<Provider store={store}>
				<Bar />
			</Provider>
		)

		const playPauseButton = queryByText('Play/Pause')

		// Очищаем действия, которые могли быть отправлены при начальном рендере
		store.clearActions()

		// Симулируем клик по кнопке воспроизведения
		fireEvent.click(playPauseButton)

		const actions = store.getActions()
		expect(
			actions.some(action => action.type === 'currentTrack/playTrack')
		).toBe(true)
		expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
	})
})
