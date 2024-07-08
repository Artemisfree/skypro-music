'use client';

import React, { useEffect, useState } from 'react'
import { getAllTracks } from '@/app/api'
import styles from './Playlist.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
	setCurrentTrack,
	playTrack,
	pauseTrack,
} from '@/store/features/currentTrackSlice'
import { setTracks } from '@/store/features/playlistSlice'

export interface Track {
	id: number
	name: string
	author: string
	album: string
	duration_in_seconds: number
	track_file: string
}

const Playlist: React.FC = () => {
	const [error, setError] = useState<string | null>(null)
	const dispatch = useDispatch()
	const { currentTrack, isPlaying } = useSelector(
		(state: RootState) => state.currentTrack
	)
	const { tracks } = useSelector((state: RootState) => state.playlist)

	const handleTrackClick = (track: Track) => {
		if (currentTrack?.id === track.id) {
			if (isPlaying) {
				dispatch(pauseTrack())
			} else {
				dispatch(playTrack())
			}
		} else {
			dispatch(setCurrentTrack(track))
		}
	}

	useEffect(() => {
		const fetchTracks = async () => {
			try {
				const data = await getAllTracks()
				dispatch(setTracks(data))
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

	if (error) {
		return <div>{error}</div>
	}

	return (
		<div className={styles.centerblock__content}>
			<div className={styles.content__title}>
				<div className={styles.col01}>Трек</div>
				<div className={styles.col02}>Исполнитель</div>
				<div className={styles.col03}>Альбом</div>
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
								<a className={styles.track__title_link} href='http://'>
									{track.name}{' '}
									<span className={styles.track__title_span}></span>
								</a>
							</div>
						</div>
						<div className={styles.track__author}>
							<a className={styles.track__author_link} href='http://'>
								{track.author}
							</a>
						</div>
						<div className={styles.track__album}>
							<a className={styles.track__album_link} href='http://'>
								{track.album}
							</a>
						</div>
						<div className={styles.track__time}>
							<svg className={styles.track__time_svg}>
								<use xlinkHref='img/icon/sprite.svg#icon-like'></use>
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
