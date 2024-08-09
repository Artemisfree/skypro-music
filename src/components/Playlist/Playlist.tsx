'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
	addTrackToFavorites,
	removeTrackFromFavorites,
	getAllTracks,
	getSelectionById,
	getTrackById,
} from '../../../api/api'
import styles from './Playlist.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
	setCurrentTrack,
	updateCurrentTime,
} from '@/store/features/currentTrackSlice'
import {
	setTracks,
	updateTrackLikeStatus,
} from '@/store/features/playlistSlice'
import { Track } from '@/types/types'
import { useFilteredTracks } from '@/contexts/FilteredTracksContext'

type PlaylistProps = {
	playlistId?: number
	tracks: Track[]
}

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

const Playlist: React.FC<PlaylistProps> = ({ playlistId, tracks }) => {
	const [error, setError] = useState<string | null>(null)
	const [isModalVisible, setModalVisible] = useState<boolean>(false)
	const [likeError, setLikeError] = useState<string | null>(null)
	const [likedTracks, setLikedTracks] = useState<{ [key: number]: boolean }>({})
	const dispatch = useDispatch()
	const { currentTrack, isPlaying } = useSelector(
		(state: RootState) => state.currentTrack
	)
	const playlistTracks = useSelector(
		(state: RootState) => state.playlist.tracks
	)

	useEffect(() => {
		dispatch(setTracks(tracks))
	}, [dispatch, tracks])

	const { activeGenres, activeAuthors, searchKeyword, sortOrder } =
		useFilteredTracks()
	const audioRef = useRef<HTMLAudioElement>(null)

	const handleTrackClick = (track: Track) => {
		if (currentTrack?._id !== track._id) {
			dispatch(setCurrentTrack({ ...track }))
		}
	}

	const saveLikedState = (trackId: number, isLiked: boolean) => {
		const likedTracks = JSON.parse(localStorage.getItem('likedTracks') || '{}')
		likedTracks[trackId] = isLiked
		localStorage.setItem('likedTracks', JSON.stringify(likedTracks))
		setLikedTracks(likedTracks)
	}

	const getLikedState = (trackId: number) => {
		const likedTracks = JSON.parse(localStorage.getItem('likedTracks') || '{}')
		return likedTracks[trackId] || false
	}

	const handleLikeClick = async (track: Track) => {
		const accessToken = localStorage.getItem('accessToken')
		const refreshToken = localStorage.getItem('refreshToken')

		if (!accessToken || !refreshToken) {
			setModalVisible(true)
			return
		}

		try {
			if (likedTracks[track._id]) {
				await removeTrackFromFavorites(track._id)
			} else {
				await addTrackToFavorites(track._id)
			}
			const updatedTracks = tracks.map(t =>
				t._id === track._id ? { ...t, isLiked: !t.isLiked } : t
			)
			dispatch(setTracks(updatedTracks))
			saveLikedState(track._id, !likedTracks[track._id])
			dispatch(
				updateTrackLikeStatus({
					_id: track._id,
					isLiked: !likedTracks[track._id],
				})
			)
		} catch (error) {
			setLikeError('Не удалось обновить лайк. Пожалуйста, попробуйте позже.')
			console.error('Ошибка при обновлении лайка:', error)
		}
	}

	useEffect(() => {
		const fetchTracks = async () => {
			try {
				let allTracks: Track[] = []
				if (playlistId) {
					const selection = await getSelectionById(playlistId)
					const trackPromises = selection.data.items.map((id: number) =>
						getTrackById(id)
					)
					const playlistTracksResponses = await Promise.all(trackPromises)
					allTracks = playlistTracksResponses
						.map(response => response.data)
						.map((track: Track) => ({
							...track,
							isLiked: getLikedState(track._id),
						}))
				} else {
					const response = await getAllTracks()
					allTracks = response.data.map((track: Track) => ({
						...track,
						isLiked: getLikedState(track._id),
					}))
				}
				dispatch(setTracks(allTracks))
				const initialLikedTracks = allTracks.reduce(
					(acc: { [key: number]: boolean }, track: Track) => {
						acc[track._id] = getLikedState(track._id)
						return acc
					},
					{}
				)
				setLikedTracks(initialLikedTracks)
			} catch (error) {
				setError('Не удалось загрузить треки. Пожалуйста, попробуйте позже.')
			}
		}
		fetchTracks()
	}, [dispatch, playlistId])

	useEffect(() => {
	}, [playlistTracks])

	const filteredTracks = useMemo(() => {
		return Array.isArray(playlistTracks)
			? playlistTracks.filter(track => {
					const matchesGenre =
						activeGenres.length === 0 ||
						track.genre.some(genre => activeGenres.includes(genre))
					const matchesAuthor =
						activeAuthors.length === 0 || activeAuthors.includes(track.author)
					const matchesSearch =
						!searchKeyword ||
						track.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
						track.author.toLowerCase().includes(searchKeyword.toLowerCase())
					return matchesGenre && matchesAuthor && matchesSearch
			  })
			: []
	}, [playlistTracks, activeGenres, activeAuthors, searchKeyword])

	const sortedTracks = useMemo(() => {
		return filteredTracks.sort((a, b) => {
			if (sortOrder === 'newest') {
				return (
					new Date(b.release_date).getTime() -
					new Date(a.release_date).getTime()
				)
			}
			if (sortOrder === 'oldest') {
				return (
					new Date(a.release_date).getTime() -
					new Date(b.release_date).getTime()
				)
			}
			return 0
		})
	}, [filteredTracks, sortOrder])

	const formatDuration = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
	}

	const closeModal = () => {
		setModalVisible(false)
		setError(null)
		setLikeError(null)
	}

	useEffect(() => {
		const handleTimeUpdate = () => {
			if (audioRef.current) {
				const currentTime = audioRef.current.currentTime
				dispatch(updateCurrentTime(currentTime))
			}
		}
		const audioElement = audioRef.current
		if (audioElement) {
			audioElement.addEventListener('timeupdate', handleTimeUpdate)
		}
		return () => {
			if (audioElement) {
				audioElement.removeEventListener('timeupdate', handleTimeUpdate)
			}
		}
	}, [dispatch])

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
			{likeError && <Modal message={likeError} onClose={closeModal} />}
			<div className={styles.content__title}>
				<div className={styles.col01}>ТРЕК</div>
				<div className={styles.col02}>ИСПОЛНИТЕЛЬ</div>
				<div className={styles.col03}>АЛЬБОМ</div>
				<div className={styles.col04}>
					<svg className={styles.playlist_title__svg}>
						<use href='/img/icon/sprite.svg#icon-watch'></use>
					</svg>
				</div>
			</div>
			<div className={styles.content__playlist}>
				{Array.isArray(sortedTracks) && sortedTracks.length > 0 ? (
					sortedTracks.map((track: Track) => (
						<div
							className={`${styles.playlist__track} ${
								currentTrack?._id === track._id ? styles.currentTrack : ''
							}`}
							key={track._id}
							onClick={() => handleTrackClick(track)}
						>
							<div className={styles.track__title}>
								<div className={styles.track__title_image}>
									{currentTrack?._id === track._id ? (
										<div className={styles.staticDot}></div>
									) : (
										<svg className={styles.track__title_svg}>
											<use href='/img/icon/sprite.svg#icon-note'></use>
										</svg>
									)}
								</div>
								<div className={styles.track__title_text}>
									{track.name}{' '}
									<span className={styles.track__title_span}></span>
								</div>
							</div>
							<div className={styles.track__author}>{track.author}</div>
							<div className={styles.track__album}>{track.album}</div>
							<div
								className={`${styles.track__like} _btn-icon`}
								onClick={e => {
									e.stopPropagation()
									handleLikeClick(track)
								}}
							>
								{localStorage.getItem('accessToken') ? (
									<>
										<svg className={styles.track__time_svg}>
											<use
												href={
													likedTracks[track._id]
														? '/img/icon/sprite.svg#icon-liked'
														: '/img/icon/sprite.svg#icon-like'
												}
											></use>
										</svg>
										<span className={styles.track__time_text}>
											{formatDuration(track.duration_in_seconds)}
										</span>
									</>
								) : (
									<svg className={styles.track__time_svg}>
										<use href='/img/icon/sprite.svg#icon-watch'></use>
									</svg>
								)}
							</div>
						</div>
					))
				) : (
					<div className={styles.noTracksFound}>Треки не найдены</div>
				)}
			</div>
		</div>
	)
}

export default Playlist
