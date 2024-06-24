const API_BASE_URL = 'https://skypro-music-api.skyeng.tech/catalog'

const handleErrors = (response: Response) => {
	if (!response.ok) {
		throw Error(response.statusText)
	}
	return response
}

export const getAllTracks = async () => {
	try {
		const response = await fetch(`${API_BASE_URL}/track/all/`)
		handleErrors(response)
		return response.json()
	} catch (error) {
		console.error('Ошибка при получении всех треков:', error)
		throw error
	}
}

export const getTrackById = async (id: number) => {
	try {
		const response = await fetch(`${API_BASE_URL}/track/${id}`)
		handleErrors(response)
		return response.json()
	} catch (error) {
		console.error(`Ошибка при получении трека с ID ${id}:`, error)
		throw error
	}
}

export const addTrackToFavorites = async (id: number, accessToken: string) => {
	try {
		const response = await fetch(`${API_BASE_URL}/track/${id}/favorite/`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		handleErrors(response)
		return response.json()
	} catch (error) {
		console.error(`Ошибка при добавлении трека с ID ${id} в избранное:`, error)
		throw error
	}
}

export const removeTrackFromFavorites = async (
	id: number,
	accessToken: string
) => {
	try {
		const response = await fetch(`${API_BASE_URL}/track/${id}/favorite/`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		handleErrors(response)
		return response.json()
	} catch (error) {
		console.error(`Ошибка при удалении трека с ID ${id} из избранного:`, error)
		throw error
	}
}

export const getAllFavoriteTracks = async (accessToken: string) => {
	try {
		const response = await fetch(`${API_BASE_URL}/track/favorite/all/`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		handleErrors(response)
		return response.json()
	} catch (error) {
		console.error('Ошибка при получении всех избранных треков:', error)
		throw error
	}
}
