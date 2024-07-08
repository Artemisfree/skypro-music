'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import Player from "../Player/Player";
import Volume from "../Volume/Volume";
import styles from './Bar.module.css';
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { playTrack, pauseTrack } from '@/store/features/currentTrackSlice'

export function Bar() {
    const { currentTrack, isPlaying } = useSelector(
			(state: RootState) => state.currentTrack
		)
    const { tracks } = useSelector((state: RootState) => state.playlist)
    const dispatch = useDispatch()
    const [currentTime, setCurrentTime] = useState(0)
    const [isRepeat, setIsRepeat] = useState(false)
    const [isShuffle, setIsShuffle] = useState(false)
    const [volume, setVolume] = useState(1)

	const audioRef = useRef<HTMLAudioElement | null>(null)
	const duration = audioRef.current?.duration

    useEffect(() => {
		if (audioRef.current && currentTrack) {
			audioRef.current.src = currentTrack.track_file
			audioRef.current.play()
			dispatch(playTrack())
		}
	}, [currentTrack, dispatch])

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
				audioRef.current.play()
				dispatch(playTrack())
			}
		}
	}
    
    const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
			if (audioRef.current) {
				audioRef.current.currentTime = parseFloat(event.target.value)
				setCurrentTime(parseFloat(event.target.value))
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
							src={track_file}
							ref={audioRef}
							onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
						/>
						<Player
							name={name}
							author={author}
							isPlaying={isPlaying}
							togglePlay={togglePlay}
							isRepeat={isRepeat}
							setIsRepeat={setIsRepeat}
							isShuffle={isShuffle}
							setIsShuffle={setIsShuffle}
							tracks={tracks}
							audioRef={audioRef}
						/>
						<Volume volume={volume} onVolumeChange={handleVolumeChange} />
					</div>
				</div>
			</div>
		)
}