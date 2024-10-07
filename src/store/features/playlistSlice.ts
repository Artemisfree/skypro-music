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
		updateTrackLikeStatus(
			state,
			action: PayloadAction<{ _id: number; isLiked: boolean }>
		) {
			const { _id, isLiked } = action.payload
			const trackIndex = state.tracks.findIndex(track => track._id === _id)
			if (trackIndex >= 0) {
				state.tracks[trackIndex].isLiked = isLiked
			}
		},
		removeTrack(state, action: PayloadAction<string>) {
			state.tracks = state.tracks.filter(track => track._id !== action.payload)
		},
	},
})

export const { setTracks, updateTrackLikeStatus, removeTrack } =
	playlistSlice.actions
export default playlistSlice.reducer
