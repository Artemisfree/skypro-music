import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Track } from '@/app/components/Playlist/Playlist'

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
	},
})

export const { setTracks } = playlistSlice.actions
export default playlistSlice.reducer
