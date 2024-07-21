import React from 'react'
import App from '@/app/components/Main/Main'
import HitsPlaylist from '@/app/components/Playlist/Hits'

const DailyPage: React.FC = () => {
	return (
		<App title='Плейлист дня'>
			<HitsPlaylist />
		</App>
	)
}

export default DailyPage
