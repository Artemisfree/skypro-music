'use client'
import { useCurrentTrack } from "@/contexts/CurrentTrackProvider";
import Player from "../Player/Player";
import Volume from "../Volume/Volume";
import styles from './Bar.module.css';
import { useState, useRef, ChangeEvent, useEffect } from "react";

export function Bar() {
    const {currentTrack} = useCurrentTrack();
    const [currentTime, setCurrentTime] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
    const [isRepeat, setIsRepeat] = useState(false)
    const [volume, setVolume] = useState(1)

	const audioRef = useRef<HTMLAudioElement | null>(null)
	const duration = audioRef.current?.duration

    useEffect(() => {
		if (audioRef.current && currentTrack) {
			audioRef.current.play()
			setIsPlaying(true)
		}
	}, [currentTrack])

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
			} else {
				audioRef.current.play()
			}
			setIsPlaying(prev => !prev)
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
						/>
						<Volume volume={volume} onVolumeChange={handleVolumeChange} />
					</div>
				</div>
			</div>
		)
}