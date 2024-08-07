import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { TokenResponse, loginUser, refreshToken, registerUser } from '../../../api/api'

interface AuthState {
	accessToken: string | null
	refreshToken: string | null
	username: string | null
	status: 'idle' | 'loading' | 'failed'
	error: string | null
}

const initialState: AuthState = {
	accessToken: null,
	refreshToken: null,
	username: null,
	status: 'idle',
	error: null,
}

export const login = createAsyncThunk(
	'auth/signin',
	async ({ email, password }: { email: string; password: string }) => {
		const response = await loginUser(email, password)
		return response
	}
)

export const register = createAsyncThunk(
	'auth/signup',
	async ({
		email,
		password,
		username,
	}: {
		email: string
		password: string
		username: string
	}) => {
		const response = await registerUser(email, password, username)
		return { ...response, username }
	}
)

export const refreshAuthToken = createAsyncThunk(
	'auth/refreshToken',
	async () => {
		const response = await refreshToken()
		return response
	}
)

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<string>) {
			state.username = action.payload
		},
		logout(state) {
			state.accessToken = null
			state.refreshToken = null
			state.username = null
			state.status = 'idle'
			state.error = null
			localStorage.removeItem('accessToken')
			localStorage.removeItem('refreshToken')
			localStorage.removeItem('username')
		},
	},
	extraReducers: builder => {
		builder
			.addCase(login.pending, state => {
				state.status = 'loading'
			})
			.addCase(
				login.fulfilled,
				(
					state,
					action: PayloadAction<TokenResponse & { username: string }>
				) => {
					state.status = 'idle'
					state.accessToken = action.payload.access
					state.refreshToken = action.payload.refresh
					state.username = action.payload.username
					localStorage.setItem('accessToken', action.payload.access)
					localStorage.setItem('refreshToken', action.payload.refresh)
					localStorage.setItem('username', action.payload.username)
				}
			)
			.addCase(login.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.error.message || 'Failed to login'
			})
			.addCase(register.pending, state => {
				state.status = 'loading'
			})
			.addCase(
				register.fulfilled,
				(state, action: PayloadAction<{ username: string }>) => {
					state.status = 'idle'
					state.username = action.payload.username
					localStorage.setItem('username', action.payload.username)
				}
			)
			.addCase(register.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.error.message || 'Failed to register'
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

export const { logout, setUser } = authSlice.actions

export default authSlice.reducer
