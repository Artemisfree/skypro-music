'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import Player from '../Player/Player'
import Volume from '../Volume/Volume'
import styles from './Bar.module.css'
import React, { useState, useRef, ChangeEvent, useEffect } from 'react'
import {
	playTrack,
	pauseTrack,
	updateCurrentTime,
	setCurrentTrack,
	setPlayingState,
	saveCurrentTime,
} from '@/store/features/currentTrackSlice'

function Bar() {
	const { currentTrack, isPlaying, currentTime } = useSelector(
		(state: RootState) => state.currentTrack
	)
	const { tracks } = useSelector((state: RootState) => state.playlist)
	const dispatch = useDispatch()
	const [isRepeat, setIsRepeat] = useState(false)
	const [isShuffle, setIsShuffle] = useState(false)
	const [volume, setVolume] = useState(1)

	const audioRef = useRef<HTMLAudioElement | null>(null)
	const duration = audioRef.current?.duration || 0

	useEffect(() => {
		if (audioRef.current && currentTrack) {
			const handleCanPlay = () => {
				if (audioRef.current && isPlaying) {
					audioRef.current.play().catch(error => {
						console.error('Error playing audio:', error)
					})
				}
			}

			if (audioRef.current.src !== currentTrack.track_file) {
				audioRef.current.src = currentTrack.track_file
				audioRef.current.addEventListener('canplay', handleCanPlay)
			}

			return () => {
				audioRef.current?.removeEventListener('canplay', handleCanPlay)
			}
		}
	}, [currentTrack, isPlaying, dispatch])

	useEffect(() => {
		const handleEnded = () => {
			if (audioRef.current && isRepeat) {
				audioRef.current.currentTime = 0
				audioRef.current.play()
			}
		}
		if (audioRef.current) {
			audioRef.current.addEventListener('ended', handleEnded)
		}
		return () => {
			if (audioRef.current) {
				audioRef.current.removeEventListener('ended', handleEnded)
			}
		}
	}, [isRepeat])

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume
		}
	}, [volume])

	useEffect(() => {
		const handleTimeUpdate = () => {
			if (audioRef.current) {
				const currentTime = audioRef.current.currentTime
				dispatch(updateCurrentTime(currentTime))
			}
		}
		if (audioRef.current) {
			audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
		}
		return () => {
			if (audioRef.current) {
				audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
			}
		}
	}, [dispatch])

	if (!currentTrack) {
		return null
	}
	const { name, author, track_file } = currentTrack

	const togglePlay = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause()
				dispatch(pauseTrack())
			} else {
				audioRef.current.currentTime = currentTime
				audioRef.current.play()
				dispatch(playTrack())
			}
		}
	}

	const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
		if (audioRef.current) {
			const newTime = parseFloat(event.target.value)
			audioRef.current.currentTime = newTime
			dispatch(updateCurrentTime(newTime))
		}
	}

	const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
		setVolume(parseFloat(event.target.value))
	}

	return (
		<div className={styles.bar}>
			<div className={styles.bar__content}>
				<div className={styles.bar__player_progress}>
					<input
						type='range'
						max={duration || 0}
						value={currentTime}
						step={0.01}
						onChange={handleSeek}
						className={styles.styledProgressInput}
					/>
				</div>
				<div className={styles.bar__player_block}>
					<audio
						ref={audioRef}
						onTimeUpdate={e =>
							dispatch(updateCurrentTime(e.currentTarget.currentTime))
						}
					/>
					<Player
						isRepeat={isRepeat}
						setIsRepeat={setIsRepeat}
						togglePlay={togglePlay}
						isShuffle={isShuffle}
						setIsShuffle={setIsShuffle}
						tracks={tracks}
						audioRef={audioRef}
					/>
					<div className={styles.bar__volume_block}>
						<Volume volume={volume} onVolumeChange={handleVolumeChange} />
						<span className={styles.bar__time}>
							{formatTime(currentTime)} / {formatTime(duration)}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Bar

const formatTime = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = Math.floor(seconds % 60)
	return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
}