import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { TokenResponse, loginUser, refreshToken } from '@/app/api'

interface AuthState {
	accessToken: string | null
	refreshToken: string | null
	status: 'idle' | 'loading' | 'failed'
	error: string | null
}

const initialState: AuthState = {
	accessToken: null,
	refreshToken: null,
	status: 'idle',
	error: null,
}

export const login = createAsyncThunk(
	'auth/login',
	async ({ email, password }: { email: string; password: string }) => {
		const response = await loginUser(email, password)
		return response
	}
)

export const refreshAuthToken = createAsyncThunk(
	'auth/refreshToken',
	async (refresh: string) => {
		const response = await refreshToken(refresh)
		return response
	}
)

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout(state) {
			state.accessToken = null
			state.refreshToken = null
			state.status = 'idle'
			state.error = null
			localStorage.removeItem('accessToken')
			localStorage.removeItem('refreshToken')
		},
	},
	extraReducers: builder => {
		builder
			.addCase(login.pending, state => {
				state.status = 'loading'
			})
			.addCase(
				login.fulfilled,
				(state, action: PayloadAction<TokenResponse>) => {
					state.status = 'idle'
					state.accessToken = action.payload.access
					state.refreshToken = action.payload.refresh
					localStorage.setItem('accessToken', action.payload.access)
					localStorage.setItem('refreshToken', action.payload.refresh)
				}
			)
			.addCase(login.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.error.message || 'Failed to login'
			})
			.addCase(
				refreshAuthToken.fulfilled,
				(state, action: PayloadAction<TokenResponse>) => {
					state.accessToken = action.payload.access
					localStorage.setItem('accessToken', action.payload.access)
				}
			)
			.addCase(refreshAuthToken.rejected, (state, action) => {
				state.error = action.error.message || 'Failed to refresh token'
			})
	},
})

export const { logout } = authSlice.actions

export default authSlice.reducer
