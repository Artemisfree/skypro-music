'use client'

import React, { createContext, useState, useContext } from 'react'

interface FilteredTracksContextType {
    activeGenres: string[]
    setActiveGenres: React.Dispatch<React.SetStateAction<string[]>>
    activeAuthors: string[]
    setActiveAuthors: React.Dispatch<React.SetStateAction<string[]>>
    searchKeyword: string
    setSearchKeyword: React.Dispatch<React.SetStateAction<string>>
    sortOrder: string
    setSortOrder: React.Dispatch<React.SetStateAction<string>>
}

const FilteredTracksContext = createContext<FilteredTracksContextType | undefined>(undefined)

export const FilteredTracksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeGenres, setActiveGenres] = useState<string[]>([])
    const [activeAuthors, setActiveAuthors] = useState<string[]>([])
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const [sortOrder, setSortOrder] = useState<string>('default')

    return (
        <FilteredTracksContext.Provider value={{ activeGenres, setActiveGenres, activeAuthors, setActiveAuthors, searchKeyword, setSearchKeyword, sortOrder, setSortOrder }}>
            {children}
        </FilteredTracksContext.Provider>
    )
}

export const useFilteredTracks = (): FilteredTracksContextType => {
    const context = useContext(FilteredTracksContext)
    if (!context) {
        throw new Error('useFilteredTracks must be used within a FilteredTracksProvider')
    }
    return context
}
