import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import styles from './Playlist.module.css'
import { Track } from '@/types/types'
import {
	setCurrentTrack,
	playTrack,
	pauseTrack,
	updateCurrentTime,
	setPlayingState,
} from '@/store/features/currentTrackSlice'
import { setTracks } from '@/store/features/playlistSlice'
import { addTrackToFavorites, removeTrackFromFavorites } from '../../../api/api'

interface FavoritesProps {
	tracks: Track[]
}

const Favorites: React.FC<FavoritesProps> = ({ tracks }) => {
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [likedTracks, setLikedTracks] = useState<{ [key: number]: boolean }>({})
	const [favoriteTracks, setFavoriteTracks] = useState<Track[]>(tracks)
	const dispatch = useDispatch()
	const { currentTrack, isPlaying, currentTime } = useSelector(
		(state: RootState) => state.currentTrack
	)
	const audioRef = useRef<HTMLAudioElement>(null)

	useEffect(() => {
		dispatch(setTracks(tracks))
		const initialLikedTracks = tracks.reduce((acc: any, track: Track) => {
			acc[track._id] = getLikedState(track._id)
			return acc
		}, {})
		setLikedTracks(initialLikedTracks)
		setFavoriteTracks(tracks.filter(track => getLikedState(track._id)))
	}, [tracks, dispatch])

	const handleTrackClick = (track: Track) => {
		if (currentTrack?._id === track._id) {
			if (isPlaying) {
				dispatch(pauseTrack())
			} else {
				dispatch(playTrack())
			}
		} else {
			dispatch(setCurrentTrack({ ...track }))
		}
	}

	const formatDuration = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
	}

	useEffect(() => {
		if (currentTrack) {
			localStorage.setItem('currentTrack', JSON.stringify(currentTrack))
			localStorage.setItem('currentTime', JSON.stringify(currentTime))
			localStorage.setItem('isPlaying', JSON.stringify(isPlaying))
		}
	}, [currentTrack, currentTime, isPlaying])

	useEffect(() => {
		const savedTrack = localStorage.getItem('currentTrack')
		const savedTime = localStorage.getItem('currentTime')
		const savedIsPlaying = localStorage.getItem('isPlaying')

		if (savedTrack && savedTime && savedIsPlaying !== null) {
			const track = JSON.parse(savedTrack)
			const time = JSON.parse(savedTime)
			const playing = JSON.parse(savedIsPlaying)
			dispatch(setCurrentTrack(track))
			dispatch(updateCurrentTime(time))
			dispatch(setPlayingState(playing))
			if (audioRef.current) {
				audioRef.current.currentTime = time
				if (playing) {
					audioRef.current.play().catch(error => {
						console.error('Error playing audio:', error)
					})
				}
			}
		}
	}, [dispatch])

	useEffect(() => {
		const handleTimeUpdate = () => {
			if (audioRef.current) {
				const currentTime = audioRef.current.currentTime
				dispatch(updateCurrentTime(currentTime))
				localStorage.setItem('currentTime', JSON.stringify(currentTime))
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
		try {
			if (likedTracks[track._id]) {
				await removeTrackFromFavorites(track._id)
				setFavoriteTracks(favoriteTracks.filter(t => t._id !== track._id))
			} else {
				await addTrackToFavorites(track._id)
				setFavoriteTracks([...favoriteTracks, track])
			}
			saveLikedState(track._id, !likedTracks[track._id])
		} catch (error) {
			setError('Не удалось обновить лайк. Пожалуйста, попробуйте позже.')
			console.error('Ошибка при обновлении лайка:', error)
		}
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
						<use xlinkHref='/img/icon/sprite.svg#icon-watch'></use>
					</svg>
				</div>
			</div>
			<div className={styles.content__playlist}>
				{Array.isArray(favoriteTracks) && favoriteTracks.length > 0 ? (
					favoriteTracks.map(track => (
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
										<div
											className={`${
												isPlaying ? styles.pulsingDot : styles.staticDot
											}`}
										></div>
									) : (
										<svg className={styles.track__title_svg}>
											<use xlinkHref='/img/icon/sprite.svg#icon-note'></use>
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
								onClick={e => {
									e.stopPropagation()
									handleLikeClick(track)
								}}
							>
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

export default Favorites
