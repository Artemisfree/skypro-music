// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import Playlist from '@/components/Playlist/Playlist'
// import { getSelectionById } from '../../../api/api'
// import Filter from '@/components/Filter/Filter'

// const PlaylistPage: React.FC = () => {
// 	const playlistTitles = {
// 		'4': 'Инди-заряд',
// 		'3': '100 танцевальных хитов',
// 		'2': 'Плейлист дня',
// 	}
// 	const router = useRouter()
// 	const searchParams = useSearchParams()
// 	const id = searchParams.get('id')

// 	const [tracks, setTracks] = useState([])
// 	const [loading, setLoading] = useState(true)

// 	useEffect(() => {
// 		if (!id) return

// 		const fetchData = async () => {
// 			try {
// 				const response = await getSelectionById(Number(id))
// 				setTracks(response.data)
// 			} catch (error) {
// 				console.error('Error fetching playlist:', error)
// 			} finally {
// 				setLoading(false)
// 			}
// 		}

// 		fetchData()
// 	}, [id])

// 	const title = playlistTitles[id as keyof typeof playlistTitles]

// 	return (
// 		<>
// 			<h2 className='centerblock__h2'>{title}</h2>
// 			<Filter />
// 			<Playlist playlistId={Number(id)} tracks={tracks} />
// 		</>
// 	)
// }

// export default PlaylistPage


'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Playlist from '@/components/Playlist/Playlist'
import { getSelectionById } from '../../../api/api'
import Filter from '@/components/Filter/Filter'

const PlaylistPage: React.FC = () => {
	const playlistTitles = {
		'4': 'Инди-заряд',
		'3': '100 танцевальных хитов',
		'2': 'Плейлист дня',
	}

	const { id } = useParams()

	const [tracks, setTracks] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!id) return

		const fetchData = async () => {
			try {
				const response = await getSelectionById(Number(id))
				setTracks(response.data)
			} catch (error) {
				console.error('Error fetching playlist:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [id])

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
