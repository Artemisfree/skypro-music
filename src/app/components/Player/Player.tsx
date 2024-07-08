import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
	playTrack,
	setCurrentTrack,
} from '@/store/features/currentTrackSlice'
import styles from './Player.module.css'
import { Track } from '../Playlist/Playlist'

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

	const handleNotImplemented = (message: string) => {
		alert(message)
	}

	const toggleRepeat = () => {
		setIsRepeat(!isRepeat)
	}

	const toggleShuffle = () => {
		setIsShuffle(!isShuffle)
	}

	const handleNextTrack = () => {
		if (currentTrack) {
			const currentIndex = tracks.findIndex(
				track => track.id === currentTrack.id
			)
			const nextIndex = isShuffle
				? Math.floor(Math.random() * tracks.length)
				: currentIndex + 1

			if (nextIndex < tracks.length) {
				const nextTrack = tracks[nextIndex]
				if (nextTrack && nextTrack.track_file) {
					dispatch(setCurrentTrack(nextTrack))

					const handleCanPlay = () => {
						audioRef.current?.play()
						dispatch(playTrack())
					}

					if (audioRef.current) {
						audioRef.current.src = nextTrack.track_file
						audioRef.current.addEventListener('canplay', handleCanPlay)

						return () => {
							audioRef.current?.removeEventListener('canplay', handleCanPlay)
						}
					}
				} else {
					console.error(
						'Следующий трек не определен или отсутствует track_file'
					)
				}
			} else {
				console.log('Это последний трек')
			}
		}
	}

	const handlePreviousTrack = () => {
		if (currentTrack) {
			const currentIndex = tracks.findIndex(
				track => track.id === currentTrack.id
			)
			const previousIndex = isShuffle
				? Math.floor(Math.random() * tracks.length)
				: currentIndex + 1

			if (previousIndex >= 0) {
				const previousTrack = tracks[previousIndex]
				if (previousTrack && previousTrack.track_file) {
					dispatch(setCurrentTrack(previousTrack))

					const handleCanPlay = () => {
						audioRef.current?.play()
						dispatch(playTrack())
					}

					if (audioRef.current) {
						audioRef.current.src = previousTrack.track_file
						audioRef.current.addEventListener('canplay', handleCanPlay)

						return () => {
							audioRef.current?.removeEventListener('canplay', handleCanPlay)
						}
					}
				} else {
					console.error(
						'Следующий трек не определен или отсутствует track_file'
					)
				}
			} else {
				console.log('Это первый трек')
			}
		}
	}

	useEffect(() => {
		const handleEnded = () => {
			handleNextTrack()
		}

		const audioElement = audioRef.current
		audioElement?.addEventListener('ended', handleEnded)

		return () => {
			audioElement?.removeEventListener('ended', handleEnded)
		}
	}, [currentTrack, isShuffle])

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
					<div className={`${styles.track_play__like} _btn-icon`}>
						<svg className={styles.track_play__like_svg}>
							<use xlinkHref='/img/icon/sprite.svg#icon-like'></use>
						</svg>
					</div>
					<div className={`${styles.track_play__dislike} _btn-icon`}>
						<svg className={styles.track_play__dislike_svg}>
							<use xlinkHref='/img/icon/sprite.svg#icon-dislike'></use>
						</svg>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Player
