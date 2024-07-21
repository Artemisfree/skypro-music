import { Track } from '@/types/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CurrentTrackState {
	currentTrack: Track | null
	isPlaying: boolean
	currentTime: number
}

const initialState: CurrentTrackState = {
	currentTrack: null,
	isPlaying: false,
	currentTime: 0,
}

const currentTrackSlice = createSlice({
	name: 'currentTrack',
	initialState,
	reducers: {
		setCurrentTrack(state, action: PayloadAction<Track>) {
			state.currentTrack = action.payload
			state.isPlaying = true
			state.currentTime = 0
		},
		playTrack(state) {
			state.isPlaying = true
		},
		pauseTrack(state) {
			state.isPlaying = false
		},
		updateCurrentTime(state, action: PayloadAction<number>) {
			state.currentTime = action.payload
		},
		setPlayingState(state, action: PayloadAction<boolean>) {
			state.isPlaying = action.payload
		},
	},
})

export const {
	setCurrentTrack,
	playTrack,
	pauseTrack,
	updateCurrentTime,
	setPlayingState,
} = currentTrackSlice.actions
export default currentTrackSlice.reducer
