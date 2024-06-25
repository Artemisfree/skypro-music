'use client'

import React, { useState, useEffect, MouseEvent } from 'react'
import { getAllTracks } from '@/app/api'
import styles from './Filter.module.css'

interface Track {
	author: string
	genre: string
	release_date: string
}

interface Position {
	top: number
	left: number
}

const Filter: React.FC = () => {
	const [tracks, setTracks] = useState<Track[]>([])
	const [uniqueAuthors, setUniqueAuthors] = useState<string[]>([])
	const [uniqueGenres, setUniqueGenres] = useState<string[]>([])
	const [uniqueYears, setUniqueYears] = useState<number[]>([])
	const [activeFilter, setActiveFilter] = useState<string | null>(null)
	const [dropdownPosition, setDropdownPosition] = useState<Position>({
		top: 0,
		left: 0,
	})

	useEffect(() => {
		const fetchTracks = async () => {
			try {
				const data = await getAllTracks()
				setTracks(data)
				extractUniqueValues(data)
			} catch (error) {
				console.error('Ошибка при получении треков:', error)
			}
		}

		fetchTracks()
	}, [])

	const extractUniqueValues = (tracks: Track[]) => {
		const authors = new Set<string>()
		const genres = new Set<string>()
		const years = new Set<number>()

		tracks.forEach(track => {
			authors.add(track.author)
			genres.add(track.genre)
			const year = new Date(track.release_date).getFullYear()
			years.add(year)
		})

		setUniqueAuthors(Array.from(authors))
		setUniqueGenres(Array.from(genres))
		setUniqueYears(Array.from(years).sort((a, b) => a - b))
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
		setActiveFilter(prevFilter => (prevFilter === filter ? null : filter))
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
			</div>
			{activeFilter === 'author' && (
				<div
					className={`${styles.filter__dropdown} ${styles.dropdown_performer} ${styles.active}`}
					style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
				>
					{uniqueAuthors.map(author => (
						<div key={author} className={styles.filter__item}>
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
				году выпуска
			</div>
			{activeFilter === 'year' && (
				<div
					className={`${styles.filter__dropdown} ${styles.dropdown_year} ${styles.active}`}
					style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
				>
					{uniqueYears.map(year => (
						<div key={year} className={styles.filter__item}>
							{year}
						</div>
					))}
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
						<div key={genre} className={styles.filter__item}>
							{genre}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Filter
