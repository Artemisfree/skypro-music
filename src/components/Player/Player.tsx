import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
	playTrack,
	setCurrentTrack,
	updateCurrentTime,
} from '@/store/features/currentTrackSlice'
import styles from './Player.module.css'
import { Track } from '@/types/types'
import { addTrackToFavorites, removeTrackFromFavorites } from '../../../api/api'
import { updateTrackLikeStatus } from '@/store/features/playlistSlice' // Добавлен импорт

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

type TrackPlayProps = {
	isRepeat: boolean
	setIsRepeat: (value: boolean) => void
	togglePlay: () => void
	isShuffle: boolean
	setIsShuffle: (value: boolean) => void
	tracks: Track[]
	audioRef: React.RefObject<HTMLAudioElement>
}

const Player: React.FC<TrackPlayProps> = ({
	isRepeat,
	setIsRepeat,
	togglePlay,
	isShuffle,
	setIsShuffle,
	tracks,
	audioRef,
}) => {
	const dispatch = useDispatch()
	const { currentTrack, isPlaying } = useSelector(
		(state: RootState) => state.currentTrack
	)
	const [isModalVisible, setModalVisible] = useState<boolean>(false)
	const [likedTracks, setLikedTracks] = useState<{ [key: number]: boolean }>({})

	useEffect(() => {
		const initialLikedTracks = tracks.reduce((acc: any, track: Track) => {
			acc[track._id] = getLikedState(track._id)
			return acc
		}, {})
		setLikedTracks(initialLikedTracks)
	}, [tracks])

	const toggleRepeat = () => {
		setIsRepeat(!isRepeat)
	}

	const toggleShuffle = () => {
		setIsShuffle(!isShuffle)
	}

	const getNextIndex = (currentIndex: number) => {
		if (isShuffle) {
			return Math.floor(Math.random() * tracks.length)
		} else {
			return currentIndex < tracks.length - 1 ? currentIndex + 1 : 0
		}
	}

	const getPreviousIndex = (currentIndex: number) => {
		if (isShuffle) {
			return Math.floor(Math.random() * tracks.length)
		} else {
			return currentIndex > 0 ? currentIndex - 1 : tracks.length - 1
		}
	}

	const playTrackFromIndex = (index: number) => {
		const track = tracks[index]
		if (track && track.track_file) {
			dispatch(setCurrentTrack({ ...track, isLiked: getLikedState(track._id) }))
			if (audioRef.current) {
				const handleCanPlay = () => {
					if (isPlaying) {
						audioRef.current?.play().catch(error => {
							console.error('Error playing audio:', error)
						})
						dispatch(playTrack())
					}
				}
				audioRef.current.src = track.track_file
				audioRef.current.addEventListener('canplay', handleCanPlay, {
					once: true,
				})
			}
		} else {
			console.error('Трек не определен или отсутствует track_file')
		}
	}

	const handleNextTrack = () => {
		if (currentTrack) {
			const currentIndex = tracks.findIndex(
				track => track._id === currentTrack._id
			)
			const nextIndex = getNextIndex(currentIndex)
			playTrackFromIndex(nextIndex)
		}
	}

	const handlePreviousTrack = () => {
		if (currentTrack) {
			const currentIndex = tracks.findIndex(
				track => track._id === currentTrack._id
			)
			const previousIndex = getPreviousIndex(currentIndex)
			playTrackFromIndex(previousIndex)
		}
	}

	useEffect(() => {
		const handleEnded = () => {
			if (isRepeat) {
				if (audioRef.current) {
					audioRef.current.currentTime = 0
					audioRef.current.play().catch(error => {
						console.error('Error playing audio:', error)
					})
				}
			} else {
				handleNextTrack()
			}
		}

		const audioElement = audioRef.current
		audioElement?.addEventListener('ended', handleEnded)

		return () => {
			audioElement?.removeEventListener('ended', handleEnded)
		}
	}, [currentTrack, isShuffle, isRepeat])

	const closeModal = () => {
		setModalVisible(false)
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

	const handleLikeClick = async () => {
		if (!currentTrack) return

		const accessToken = localStorage.getItem('accessToken')
		const refreshToken = localStorage.getItem('refreshToken')

		if (!accessToken || !refreshToken) {
			setModalVisible(true)
			return
		}

		try {
			const isCurrentlyLiked = likedTracks[currentTrack._id]
			if (isCurrentlyLiked) {
				await removeTrackFromFavorites(currentTrack._id)
			} else {
				await addTrackToFavorites(currentTrack._id)
			}

			const updatedLikedTracks = {
				...likedTracks,
				[currentTrack._id]: !isCurrentlyLiked,
			}
			setLikedTracks(updatedLikedTracks)
			saveLikedState(currentTrack._id, !isCurrentlyLiked)

			dispatch(
				setCurrentTrack({
					...currentTrack,
					isLiked: !isCurrentlyLiked,
				})
			)
			dispatch(
				updateTrackLikeStatus({
					_id: currentTrack._id,
					isLiked: !isCurrentlyLiked,
				})
			)
		} catch (error) {
			console.error('Ошибка при обновлении лайка:', error)
		}
	}

	return (
		<div className={styles.bar__player}>
			<div className={styles.player__controls}>
				<div className={styles.player__btn_prev} onClick={handlePreviousTrack}>
					<svg className={styles.player__btn_prev_svg}>
						<use xlinkHref='/img/icon/sprite.svg#icon-prev'></use>
					</svg>
				</div>
				<div className={`${styles.player__btn_play} _btn`} onClick={togglePlay}>
					<svg className={styles.player__btn_play_svg}>
						<use
							xlinkHref={
								isPlaying
									? '/img/icon/sprite.svg#icon-pause'
									: '/img/icon/sprite.svg#icon-play'
							}
						></use>
					</svg>
				</div>
				<div className={styles.player__btn_next} onClick={handleNextTrack}>
					<svg className={styles.player__btn_next_svg}>
						<use xlinkHref='/img/icon/sprite.svg#icon-next'></use>
					</svg>
				</div>
				<div
					className={`${styles.player__btn_repeat} _btn-icon ${
						isRepeat ? styles.active : ''
					}`}
					onClick={toggleRepeat}
				>
					<svg className={styles.player__btn_repeat_svg}>
						<use xlinkHref='img/icon/sprite.svg#icon-repeat'></use>
					</svg>
				</div>
				<div
					className={`${styles.player__btn_shuffle} _btn-icon ${
						isShuffle ? styles.active : ''
					}`}
					onClick={toggleShuffle}
				>
					<svg className={styles.player__btn_shuffle_svg}>
						<use xlinkHref='img/icon/sprite.svg#icon-shuffle'></use>
					</svg>
				</div>
			</div>

			<div className={styles.player__track_play}>
				<div className={styles.track_play__contain}>
					<div className={styles.track_play__image}>
						<svg className={styles.track_play__svg}>
							<use xlinkHref='/img/icon/sprite.svg#icon-note'></use>
						</svg>
					</div>
					<div className={styles.track_play__author}>
						<a className={styles.track_play__author_link} href='http://'>
							{currentTrack?.name || 'Трек не выбран'}
						</a>
					</div>
					<div className={styles.track_play__album}>
						<a className={styles.track_play__album_link} href='http://'>
							{currentTrack?.author || ''}
						</a>
					</div>
				</div>

				<div className={styles.track_play__like_dis}>
					<div
						className={`${styles.track_play__like} _btn-icon`}
						onClick={handleLikeClick}
					>
						<svg className={styles.track_play__like_svg}>
							<use
								xlinkHref={
									currentTrack?.isLiked
										? 'img/icon/sprite.svg#icon-liked'
										: 'img/icon/sprite.svg#icon-like'
								}
							></use>
						</svg>
					</div>
				</div>
			</div>

			{isModalVisible && (
				<Modal
					message='Пожалуйста, авторизуйтесь для того, чтобы ставить лайки.'
					onClose={closeModal}
				/>
			)}
		</div>
	)
}

export default Player
