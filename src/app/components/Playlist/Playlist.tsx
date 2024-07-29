'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
    getAllTracks,
    addTrackToFavorites,
    removeTrackFromFavorites,
    getAllFavoriteTracks,
    getSelectionById,
    getTrackById,
} from '@/app/api'
import styles from './Playlist.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
    setCurrentTrack,
    playTrack,
    pauseTrack,
    updateCurrentTime,
    setPlayingState,
} from '@/store/features/currentTrackSlice'
import {
    setTracks,
    updateTrackLikeStatus,
} from '@/store/features/playlistSlice'
import { Track } from '@/types/types'
import { useFilteredTracks } from '@/contexts/FilteredTracksContext'

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

const Playlist: React.FC<{ playlistId?: number }> = ({ playlistId }) => {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    const dispatch = useDispatch()
    const { currentTrack, isPlaying, currentTime } = useSelector(
        (state: RootState) => state.currentTrack
    )
    const { tracks } = useSelector((state: RootState) => state.playlist)

    const { activeGenres, activeAuthors, searchKeyword, sortOrder } = useFilteredTracks()
    const audioRef = useRef<HTMLAudioElement>(null)

    const getAccessToken = (): string | null => {
        return localStorage.getItem('accessToken')
    }

    const getRefreshToken = (): string | null => {
        return localStorage.getItem('refreshToken')
    }

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
                await removeTrackFromFavorites(track._id, accessToken, refreshToken)
            } else {
                await addTrackToFavorites(track._id, accessToken, refreshToken)
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
                if (playlistId) {
                    const selection = await getSelectionById(playlistId)
                    const trackPromises = selection.data.items.map((id: number) =>
                        getTrackById(id)
                    )
                    const playlistTracksResponses = await Promise.all(trackPromises)
                    const playlistTracks = playlistTracksResponses.map(
                        response => response.data
                    )
                    dispatch(setTracks(playlistTracks))
                } else {
                    const response = await getAllTracks()
                    const data = response.data
                    let tracksWithLikes = data

                    const accessToken = getAccessToken()
                    const refreshToken = getRefreshToken()

                    if (accessToken && refreshToken) {
                        const favoritesResponse = await getAllFavoriteTracks(
                            accessToken,
                            refreshToken
                        )
                        const favorites = favoritesResponse.data
                        tracksWithLikes = data.map((track: Track) => ({
                            ...track,
                            isLiked: favorites.some(
                                (favTrack: Track) => favTrack._id === track._id
                            ),
                        }))
                    }

                    dispatch(setTracks(tracksWithLikes))
                }
            } catch (error) {
                setError('Не удалось загрузить треки. Пожалуйста, попробуйте позже.')
            }
        }

        fetchTracks()
    }, [dispatch, playlistId])

    const filteredTracks = tracks.filter(track => {
        const matchesGenre =
            activeGenres.length === 0 ||
            track.genre.some(genre => activeGenres.includes(genre))
        const matchesAuthor =
            activeAuthors.length === 0 || activeAuthors.includes(track.author)
        const matchesSearch =
            searchKeyword === '' ||
            track.name.toLowerCase().includes(searchKeyword) ||
            track.author.toLowerCase().includes(searchKeyword)
        return matchesGenre && matchesAuthor && matchesSearch
    })

    const sortedTracks = filteredTracks.sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        }
        if (sortOrder === 'oldest') {
            return new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
        }
        return 0 // Default order
    })

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
    }

    const closeModal = () => {
        setModalVisible(false)
        setError(null)
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
                    audioRef.current.play()
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
                {Array.isArray(sortedTracks) && sortedTracks.length > 0 ? (
                    sortedTracks.map(track => (
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
                    ))
                ) : (
                    <div className={styles.noTracksFound}>Треки не найдены</div>
                )}
            </div>
        </div>
    )
}

export default Playlist
