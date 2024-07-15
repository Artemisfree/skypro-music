import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import styles from './Playlist.module.css'
import { Track } from '@/types/types'
import {
	setCurrentTrack,
	playTrack,
	pauseTrack,
} from '@/store/features/currentTrackSlice'
import { setTracks, removeTrack, updateTrackLikeStatus } from '@/store/features/playlistSlice'
import { getAllFavoriteTracks, removeTrackFromFavorites } from '@/app/api'

const Favorites: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const dispatch = useDispatch()
	const { currentTrack, isPlaying } = useSelector(
		(state: RootState) => state.currentTrack
	)
	const { tracks } = useSelector((state: RootState) => state.playlist)

	const getAccessToken = (): string | null => {
		return localStorage.getItem('accessToken')
	}

	const getRefreshToken = (): string | null => {
		return localStorage.getItem('refreshToken')
	}

	useEffect(() => {
		const fetchFavoriteTracks = async () => {
			const accessToken = getAccessToken()
			const refreshToken = getRefreshToken()
			if (!accessToken || !refreshToken) {
				setError('Пожалуйста, авторизуйтесь для доступа к избранным трекам.')
				return
			}

			try {
				const favorites: Track[] = await getAllFavoriteTracks(
					accessToken,
					refreshToken
				)
				dispatch(setTracks(favorites))
			} catch (error) {
				setError(
					'Не удалось загрузить избранные треки. Пожалуйста, попробуйте позже.'
				)
			}
		}

		fetchFavoriteTracks()
	}, [dispatch])

	const handleTrackClick = (track: Track) => {
		if (currentTrack?.id === track.id) {
			if (isPlaying) {
				dispatch(pauseTrack())
			} else {
				dispatch(playTrack())
			}
		} else {
			dispatch(setCurrentTrack({ ...track }))
		}
	}

	const handleDislikeClick = async (e: React.MouseEvent, track: Track) => {
		e.stopPropagation()
		const accessToken = getAccessToken()
		const refreshToken = getRefreshToken()

		if (!accessToken || !refreshToken) {
			setError('Пожалуйста, авторизуйтесь для снятия лайка.')
			return
		}

		const updatedTrack = { ...track, isLiked: false }
		dispatch(updateTrackLikeStatus(updatedTrack))

		if (currentTrack?.id === track.id) {
			dispatch(setCurrentTrack(updatedTrack))
		}
		setLoading(true)
		try {
			await removeTrackFromFavorites(track.id, accessToken, refreshToken)
			dispatch(removeTrack(track.id))
		} catch (err) {
			setError('Не удалось снять лайк. Пожалуйста, попробуйте позже.')
			dispatch(updateTrackLikeStatus(track))
			if (currentTrack?.id === track.id) {
				dispatch(setCurrentTrack(track))
			}
		} finally {
			setLoading(false)
		}
	}

	const formatDuration = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
	}

	if (error) {
		return (
			<div>
				<p>{error}</p>
			</div>
		)
	}

	return (
		<div className={styles.centerblock__content}>
			<div className={styles.content__title}>
				<div className={styles.col01}>ТРЕК</div>
				<div className={styles.col02}>ИСПОЛНИТЕЛЬ</div>
				<div className={styles.col03}>АЛЬБОМ</div>
				<div className={styles.col04}>
					<svg className={styles.playlist_title__svg}>
						<use xlinkHref='img/icon/sprite.svg#icon-watch'></use>
					</svg>
				</div>
			</div>
			<div className={styles.content__playlist}>
				{tracks.map(track => (
					<div
						className={`${styles.playlist__track} ${
							currentTrack?.id === track.id ? styles.currentTrack : ''
						}`}
						key={track.id}
						onClick={() => handleTrackClick(track)}
					>
						<div className={styles.track__title}>
							<div className={styles.track__title_image}>
								{currentTrack?.id === track.id ? (
									<div
										className={`${
											isPlaying ? styles.pulsingDot : styles.staticDot
										}`}
									></div>
								) : (
									<svg className={styles.track__title_svg}>
										<use xlinkHref='img/icon/sprite.svg#icon-note'></use>
									</svg>
								)}
							</div>
							<div className={styles.track__title_text}>
								<a className={styles.track__title_link} href='#'>
									{track.name}{' '}
									<span className={styles.track__title_span}></span>
								</a>
							</div>
						</div>
						<div className={styles.track__author}>
							<a className={styles.track__author_link} href='#'>
								{track.author}
							</a>
						</div>
						<div className={styles.track__album}>
							<a className={styles.track__album_link} href='#'>
								{track.album}
							</a>
						</div>
						<div
							className={`${styles.track__like} _btn-icon`}
							onClick={e => handleDislikeClick(e, track)}
						>
							<svg className={styles.track__time_svg}>
								<use xlinkHref='img/icon/sprite.svg#icon-liked'></use>
							</svg>
							<span className={styles.track__time_text}>
								{formatDuration(track.duration_in_seconds)}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Favorites
