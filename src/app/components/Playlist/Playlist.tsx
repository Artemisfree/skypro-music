import React, { useEffect, useState } from 'react'
import {
	getAllTracks,
	addTrackToFavorites,
	removeTrackFromFavorites,
	getAllFavoriteTracks,
} from '@/app/api'
import styles from './Playlist.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
	setCurrentTrack,
	playTrack,
	pauseTrack,
} from '@/store/features/currentTrackSlice'
import {
	setTracks,
	updateTrackLikeStatus,
} from '@/store/features/playlistSlice'
import { Track } from '@/types/types'

const Modal: React.FC<{ message: string; onClose: () => void }> = ({
	message,
	onClose,
}) => (
	<div className={styles.modalOverlay}>
		<div className={styles.modal}>
			<p>{message}</p>
			<button onClick={onClose}>Закрыть</button>
		</div>
	</div>
)

const Playlist: React.FC = () => {
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [isModalVisible, setModalVisible] = useState<boolean>(false)
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

	const handleTrackClick = (track: Track) => {
		if (currentTrack?.id === track.id) {
			if (isPlaying) {
				dispatch(pauseTrack())
			} else {
				dispatch(playTrack())
			}
		} else {
			dispatch(setCurrentTrack({ ...track}))
		}
	}

	const handleLikeClick = async (e: React.MouseEvent, track: Track) => {
		e.stopPropagation()
		const accessToken = getAccessToken()
		const refreshToken = getRefreshToken()

		if (!accessToken || !refreshToken) {
			setModalVisible(true)
			return
		}


		const updatedTrack = { ...track, isLiked: !track.isLiked }
		dispatch(updateTrackLikeStatus(updatedTrack))

		setLoading(true)
		try {
			if (track.isLiked) {
				await removeTrackFromFavorites(track.id, accessToken, refreshToken)
			} else {
				await addTrackToFavorites(track.id, accessToken, refreshToken)
			}
		} catch (err) {
			setError('Не удалось обновить лайк. Пожалуйста, попробуйте позже.')
			dispatch(updateTrackLikeStatus(track))
			setModalVisible(true)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const fetchTracks = async () => {
			try {
				const data: Track[] = await getAllTracks()
				let tracksWithLikes = data

				const accessToken = getAccessToken()
				const refreshToken = getRefreshToken()

				if (accessToken && refreshToken) {
					const favorites: Track[] = await getAllFavoriteTracks(
						accessToken,
						refreshToken
					)
					tracksWithLikes = data.map((track: Track) => ({
						...track,
						isLiked: favorites.some((favTrack: Track) => favTrack.id === track.id),
					}))
				}

				dispatch(setTracks(tracksWithLikes))
			} catch (error) {
				setError('Не удалось загрузить треки. Пожалуйста, попробуйте позже.')
			}
		}

		fetchTracks()
	}, [dispatch])

	const formatDuration = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
	}

	const closeModal = () => {
		setModalVisible(false)
		setError(null)
	}

	if (error) {
		return (
			<div>
				<Modal message={error} onClose={closeModal} />
			</div>
		)
	}

	return (
		<div className={styles.centerblock__content}>
			{isModalVisible && (
				<Modal
					message='Пожалуйста, авторизуйтесь для того, чтобы ставить лайки.'
					onClose={closeModal}
				/>
			)}
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
							onClick={e => handleLikeClick(e, track)}
						>
							<svg className={styles.track__time_svg}>
								<use
									xlinkHref={
										track.isLiked
											? 'img/icon/sprite.svg#icon-liked'
											: 'img/icon/sprite.svg#icon-like'
									}
								></use>
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

export default Playlist
