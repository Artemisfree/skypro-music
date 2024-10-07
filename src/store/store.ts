import { configureStore } from '@reduxjs/toolkit'
import currentTrackReducer from './features/currentTrackSlice'
import playlistReducer from './features/playlistSlice'
import authReducer from './features/authSlice'

export const store = configureStore({
	reducer: {
		currentTrack: currentTrackReducer,
		playlist: playlistReducer,
		auth: authReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
