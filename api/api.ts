const API_BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com/catalog'
const AUTH_API_URL = 'https://webdev-music-003b5b991590.herokuapp.com/user'

export interface TokenResponse {
	access: string
	refresh: string
}

export async function refreshToken(): Promise<TokenResponse> {
	const refresh = localStorage.getItem('refreshToken')
	if (!refresh) {
		throw new Error('No refresh token found')
	}

	const response = await fetch(`${AUTH_API_URL}/token/refresh/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ refresh }),
	})

	if (!response.ok) {
		throw new Error(`Ошибка при обновлении токена: ${response.statusText}`)
	}

	const data = await response.json()
	localStorage.setItem('accessToken', data.access)
	localStorage.setItem('refreshToken', data.refresh)
	return data
}

export async function fetchWithAuth(
	url: string,
	options: RequestInit
): Promise<Response> {
	let access = localStorage.getItem('accessToken')

	if (!access) {
		throw new Error('No access token found')
	}

	options.headers = {
		...(options.headers || {}),
		Authorization: `Bearer ${access}`,
	}

	let res = await fetch(url, options)

	if (res.status === 401) {
		try {
			const newTokens = await refreshToken()
			access = newTokens.access

			options.headers = {
				...(options.headers || {}),
				Authorization: `Bearer ${access}`,
			}

			res = await fetch(url, options)
		} catch (error) {
			console.error('Token refresh failed:', error)
			logoutUser()
			window.location.href = '/signin'
			throw new Error('Token refresh failed')
		}
	}

	if (!res.ok) {
		const errorText = await res.text()
		throw new Error(`${res.status}: ${errorText}`)
	}

	return res
}

const handleErrors = async (response: Response) => {
	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(`${response.status}: ${errorText}`)
	}
	return response
}

export const getAllTracks = async () => {
	try {
		const response = await fetch(`${API_BASE_URL}/track/all/`)
		await handleErrors(response)
		return response.json()
	} catch (error) {
		console.error('Ошибка при получении всех треков:', error)
		throw error
	}
}

export const getTrackById = async (id: number) => {
	try {
		const response = await fetch(`${API_BASE_URL}/track/${id}`)
		await handleErrors(response)
		return response.json()
	} catch (error) {
		console.error(`Ошибка при получении трека с ID ${id}:`, error)
		throw error
	}
}

export const addTrackToFavorites = async (id: number) => {
	try {
		const response = await fetchWithAuth(
			`${API_BASE_URL}/track/${id}/favorite/`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)
		await handleErrors(response)
		return response.json()
	} catch (error) {
		console.error(`Ошибка при добавлении трека с ID ${id} в избранное:`, error)
		throw error
	}
}

export const removeTrackFromFavorites = async (id: number) => {
	try {
		const response = await fetchWithAuth(
			`${API_BASE_URL}/track/${id}/favorite/`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)
		await handleErrors(response)
		return response.json()
	} catch (error) {
		console.error(`Ошибка при удалении трека с ID ${id} из избранного:`, error)
		throw error
	}
}

export const getAllFavoriteTracks = async () => {
	try {
		const response = await fetchWithAuth(
			`${API_BASE_URL}/track/favorite/all/`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)
		await handleErrors(response)
		return response.json()
	} catch (error) {
		console.error('Ошибка при получении всех избранных треков:', error)
		throw error
	}
}

export const registerUser = async (
	email: string,
	password: string,
	username: string
) => {
	try {
		const response = await fetch(`${AUTH_API_URL}/signup/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password, username }),
		})
		await handleErrors(response)
		const data = await response.json()
		return { ...data, username }
	} catch (error) {
		console.error('Ошибка при регистрации пользователя:', error)
		throw error
	}
}

export const loginUser = async (email: string, password: string) => {
	try {
		const response = await fetch(`${AUTH_API_URL}/login/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})
		await handleErrors(response)
		const data = await response.json()
		localStorage.setItem('accessToken', data.access)
		localStorage.setItem('refreshToken', data.refresh)
		return data
	} catch (error) {
		console.error('Ошибка при авторизации пользователя:', error)
		throw error
	}
}

export const getToken = async (email: string, password: string) => {
	try {
		const response = await fetch(`${AUTH_API_URL}/token/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})
		await handleErrors(response)
		const data = await response.json()
		localStorage.setItem('accessToken', data.access)
		localStorage.setItem('refreshToken', data.refresh)
		return data
	} catch (error) {
		console.error('Ошибка при получении токена:', error)
		throw error
	}
}

export const logoutUser = () => {
	localStorage.removeItem('accessToken')
	localStorage.removeItem('refreshToken')
}

export const createSelection = async (
	title: string,
	description: string,
	tracks: number[]
) => {
	try {
		const response = await fetchWithAuth(`${API_BASE_URL}/selection`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title, description, tracks }),
		})
		await handleErrors(response)
		return response.json()
	} catch (error) {
		console.error('Ошибка при создании подборки:', error)
		throw error
	}
}

export const getAllSelections = async () => {
	try {
		const response = await fetch(`${API_BASE_URL}/selection/all`)
		await handleErrors(response)
		return response.json()
	} catch (error) {
		console.error('Ошибка при получении всех подборок:', error)
		throw error
	}
}

export const getSelectionById = async (id: number) => {
	try {
		const response = await fetch(`${API_BASE_URL}/selection/${id}`)
		await handleErrors(response)
		return response.json()
	} catch (error) {
		console.error(`Ошибка при получении подборки с ID ${id}:`, error)
		throw error
	}
}
