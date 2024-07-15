import { Track } from '@/types/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PlaylistState {
	tracks: Track[]
}

const initialState: PlaylistState = {
	tracks: [],
}

const playlistSlice = createSlice({
	name: 'playlist',
	initialState,
	reducers: {
		setTracks(state, action: PayloadAction<Track[]>) {
			state.tracks = action.payload
		},
		updateTrackLikeStatus(state, action: PayloadAction<Track>) {
			const updatedTrack = action.payload
			state.tracks = state.tracks.map(track =>
				track.id === updatedTrack.id ? updatedTrack : track
			)
		},
		removeTrack(state, action: PayloadAction<string>) {
			state.tracks = state.tracks.filter(track => track.id !== action.payload)
		},
	},
})

export const { setTracks, updateTrackLikeStatus, removeTrack } =
	playlistSlice.actions
export default playlistSlice.reducer
