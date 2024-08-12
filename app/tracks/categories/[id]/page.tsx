'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Playlist from '@/components/Playlist/Playlist'
import Filter from '@/components/Filter/Filter'
import { useSelector } from 'react-redux'

const PlaylistPage: React.FC = () => {
	const playlistTitles = {
		'4': 'Инди-заряд',
		'3': '100 танцевальных хитов',
		'2': 'Плейлист дня',
	}

	const { id } = useParams()
	const [tracks, setTracks] = useState([])

	const title = playlistTitles[id as keyof typeof playlistTitles]

	return (
		<>
			<h2 className='centerblock__h2'>{title}</h2>
			<Filter />
			<Playlist playlistId={Number(id)} tracks={tracks} />
		</>
	)
}

export default PlaylistPage
