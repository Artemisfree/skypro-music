import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Track } from '@/app/components/Playlist/Playlist'

interface CurrentTrackState {
	currentTrack: Track | null
	isPlaying: boolean
}

const initialState: CurrentTrackState = {
	currentTrack: null,
	isPlaying: false,
}

const currentTrackSlice = createSlice({
	name: 'currentTrack',
	initialState,
	reducers: {
		setCurrentTrack(state, action: PayloadAction<Track>) {
			state.currentTrack = action.payload
			state.isPlaying = true
		},
		playTrack(state) {
			state.isPlaying = true
		},
		pauseTrack(state) {
			state.isPlaying = false
		},
	},
})

export const { setCurrentTrack, playTrack, pauseTrack } =
	currentTrackSlice.actions
export default currentTrackSlice.reducer
