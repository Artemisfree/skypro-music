'use client'

import { Track } from '@/app/components/Playlist/Playlist'
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useState,
} from 'react'

type CurrentTrackContextValue = {
	currentTrack: Track | null
	setCurrentTrack: Dispatch<SetStateAction<Track | null>>
}

const CurrentTrackContext = createContext<CurrentTrackContextValue | undefined>(
	undefined
)

type CurrentTrackProviderProps = {
	children: ReactNode
}

export function CurrentTrackProvider({ children }: CurrentTrackProviderProps) {
	const [currentTrack, setCurrentTrack] = useState<Track | null>(null)

	return (
		<CurrentTrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
			{children}
		</CurrentTrackContext.Provider>
	)
}

export function useCurrentTrack() {
    const context = useContext(CurrentTrackContext)
    if (context === undefined) {
        throw new Error ("useCurrentTrack only in provider");
    }
	return context;
}
