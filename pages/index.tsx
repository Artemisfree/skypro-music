import React from 'react'
import Playlist from '@/app/components/Playlist/Playlist'
import App from '@/app/components/Main/Main'
import { useRouter } from 'next/router'

const HomePage: React.FC = () => {
	const router = useRouter()
	const { playlist } = router.query

	let title = 'Треки'
	let playlistId

	switch (playlist) {
		case 'indie':
			title = 'Инди-заряд'
			playlistId = 4
			break
		case 'hits':
			title = '100 танцевальных хитов'
			playlistId = 3
			break
		case 'daily':
			title = 'Плейлист дня'
			playlistId = 2
			break
		default:
			title = 'Треки'
			playlistId = undefined
			break
	}

	return (
		<App title={title}>
			<Playlist playlistId={playlistId} />
		</App>
	)
}

export default HomePage
