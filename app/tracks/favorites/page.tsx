'use client'

import React, { useEffect, useState } from 'react'
import Favorites from '@/components/Playlist/Favorites'
import { getAllFavoriteTracks } from '../../../api/api'
import Filter from '@/components/Filter/Filter'

const FavoritesPage: React.FC = () => {
	const title = 'Избранное'

	const [tracks, setTracks] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const getAccessToken = (): string | null =>
		localStorage.getItem('accessToken')
	const getRefreshToken = (): string | null =>
		localStorage.getItem('refreshToken')

	useEffect(() => {
		const fetchFavoriteTracks = async () => {
			const accessToken = getAccessToken()
			const refreshToken = getRefreshToken()

			if (!accessToken || !refreshToken) {
				setError('Пожалуйста, авторизуйтесь для доступа к избранным трекам.')
				setLoading(false)
				return
			}

			try {
				const response = await getAllFavoriteTracks(accessToken, refreshToken)
				setTracks(response.data)
			} catch (error) {
				setError(
					'Не удалось загрузить избранные треки. Пожалуйста, попробуйте позже.'
				)
			} finally {
				setLoading(false)
			}
		}

		fetchFavoriteTracks()
	}, [])

	if (loading) {
		return <div>Загрузка...</div>
	}

	if (error) {
		return <div>{error}</div>
	}

	return (
		<>
			<h2 className='centerblock__h2'>{title}</h2>
			<Filter />
			<Favorites tracks={tracks} />
		</>
	)
}

export default FavoritesPage