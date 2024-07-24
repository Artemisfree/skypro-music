import React from 'react'
import App from '@/app/components/Main/Main'
import Playlist from '@/app/components/Playlist/Playlist'

const IndiePage: React.FC = () => {
	return (
		<App title='Инди-заряд'>
			<Playlist playlistId={4} />
		</App>
	)
}

export default IndiePage
