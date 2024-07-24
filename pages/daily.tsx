import React from 'react'
import App from '@/app/components/Main/Main'
import Playlist from '@/app/components/Playlist/Playlist'

const DailyPage: React.FC = () => {
	return (
		<App title='Плейлист дня'>
			<Playlist playlistId={2} />
		</App>
	)
}

export default DailyPage
