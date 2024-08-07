'use client'

import React from 'react'
import styles from './Search.module.css'
import { useFilteredTracks } from '@/contexts/FilteredTracksContext'

const Search: React.FC = () => {
    const { setSearchKeyword } = useFilteredTracks()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value.toLowerCase())
    }

    return (
        <div className={styles.centerblock__search}>
            <svg className={styles.search__svg}>
                <use xlinkHref='img/icon/sprite.svg#icon-search'></use>
            </svg>
            <input
                className={styles.search__text}
                type='search'
                placeholder='Поиск'
                name='search'
                onChange={handleInputChange}
            />
        </div>
    )
}

export default Search
