'use client'

import React, { useState, useEffect, MouseEvent, useCallback } from 'react'
import { getAllTracks } from '../../../api/api'
import styles from './Filter.module.css'
import { Track } from '@/types/types'
import { useFilteredTracks } from '@/contexts/FilteredTracksContext'

interface Position {
	top: number
	left: number
}

const Filter: React.FC = () => {
	const [tracks, setTracks] = useState<Track[]>([])
	const [uniqueAuthors, setUniqueAuthors] = useState<string[]>([])
	const [uniqueGenres, setUniqueGenres] = useState<string[]>([])
	const [activeFilter, setActiveFilter] = useState<string | null>(null)
	const [dropdownPosition, setDropdownPosition] = useState<Position>({
		top: 0,
		left: 0,
	})

	const {
		activeGenres,
		setActiveGenres,
		activeAuthors,
		setActiveAuthors,
		sortOrder,
		setSortOrder,
	} = useFilteredTracks()

	const updateFilters = useCallback(
		(authors?: string[], genres?: string[]) => {
			setUniqueAuthors(authors ?? uniqueAuthors)
			setUniqueGenres(genres ?? uniqueGenres)
		},
		[uniqueAuthors, uniqueGenres]
	)

	useEffect(() => {
		const fetchTracks = async () => {
			try {
				const response = await getAllTracks()
				const data = response.data
				if (Array.isArray(data)) {
					setTracks(data)
					const uniqueValues = extractUniqueValues(data)
					updateFilters(uniqueValues.authors, uniqueValues.genres)
				} else {
					console.error('Неправильный формат данных:', data)
				}
			} catch (error) {
				console.error('Ошибка при получении треков:', error)
			}
		}

		if (tracks.length === 0) {
			fetchTracks()
		}
	}, [tracks.length, updateFilters])

	const extractUniqueValues = (tracks: Track[]) => {
		const authors = new Set<string>()
		const genres = new Set<string>()

		tracks.forEach(track => {
			authors.add(track.author)
			track.genre.forEach(genre => genres.add(genre))
		})

		return {
			authors: Array.from(authors),
			genres: Array.from(genres),
		}
	}

	const handleFilterClick = (
		filter: string,
		event: MouseEvent<HTMLDivElement>
	) => {
		const button = event.currentTarget
		const rect = button.getBoundingClientRect()
		setDropdownPosition({
			top: rect.bottom + window.scrollY + 10,
			left: rect.left + window.scrollX,
		})
		setActiveFilter(prevFilter => {
			if (prevFilter === filter) {
				return null
			} else {
				return filter
			}
		})
	}

	useEffect(() => {
		if (activeFilter !== 'author') setActiveAuthors([])
		if (activeFilter !== 'genre') setActiveGenres([])
		if (activeFilter !== 'year') setSortOrder('default')
	}, [activeFilter])

	const handleGenreClick = (genre: string) => {
		setActiveGenres(prevGenres =>
			prevGenres.includes(genre)
				? prevGenres.filter(g => g !== genre)
				: [...prevGenres, genre]
		)
	}

	const handleAuthorClick = (author: string) => {
		setActiveAuthors(prevAuthors =>
			prevAuthors.includes(author)
				? prevAuthors.filter(a => a !== author)
				: [...prevAuthors, author]
		)
	}

	const handleSortOrderChange = (order: string) => {
		setSortOrder(order)
	}

	return (
		<div className={styles.centerblock__filter}>
			<div className={styles.filter__title}>Искать по:</div>
			<div
				className={`${styles.filter__button} ${
					activeFilter === 'author' ? styles.active : ''
				}`}
				onClick={event => handleFilterClick('author', event)}
			>
				исполнителю
				{activeAuthors.length > 0 && (
					<div className={styles.filter__badge}>{activeAuthors.length}</div>
				)}
			</div>
			{activeFilter === 'author' && (
				<div
					className={`${styles.filter__dropdown} ${styles.dropdown_performer} ${styles.active}`}
					style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
				>
					{uniqueAuthors.map(author => (
						<div
							key={author}
							className={`${styles.filter__item} ${
								activeAuthors.includes(author) ? styles.active : ''
							}`}
							onClick={() => handleAuthorClick(author)}
						>
							{author}
						</div>
					))}
				</div>
			)}
			<div
				className={`${styles.filter__button} ${
					activeFilter === 'year' ? styles.active : ''
				}`}
				onClick={event => handleFilterClick('year', event)}
			>
				дате выпуска
			</div>
			{activeFilter === 'year' && (
				<div
					className={`${styles.filter__dropdown} ${styles.dropdown_year} ${styles.active}`}
					style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
				>
					<div
						className={`${styles.filter__item} ${
							sortOrder === 'default' ? styles.active : ''
						}`}
						onClick={() => handleSortOrderChange('default')}
					>
						По умолчанию
					</div>
					<div
						className={`${styles.filter__item} ${
							sortOrder === 'newest' ? styles.active : ''
						}`}
						onClick={() => handleSortOrderChange('newest')}
					>
						Сначала новые
					</div>
					<div
						className={`${styles.filter__item} ${
							sortOrder === 'oldest' ? styles.active : ''
						}`}
						onClick={() => handleSortOrderChange('oldest')}
					>
						Сначала старые
					</div>
				</div>
			)}
			<div
				className={`${styles.filter__button} ${
					activeFilter === 'genre' ? styles.active : ''
				}`}
				onClick={event => handleFilterClick('genre', event)}
			>
				жанру
			</div>
			{activeFilter === 'genre' && (
				<div
					className={`${styles.filter__dropdown} ${styles.dropdown_genre} ${styles.active}`}
					style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
				>
					{uniqueGenres.map(genre => (
						<div
							key={genre}
							className={`${styles.filter__item} ${
								activeGenres.includes(genre) ? styles.active : ''
							}`}
							onClick={() => handleGenreClick(genre)}
						>
							{genre}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Filter
