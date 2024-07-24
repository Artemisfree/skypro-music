import React from 'react'
import App from '@/app/components/Main/Main'
import Playlist from '@/app/components/Playlist/Playlist'

const HitsPage: React.FC = () => {
	return (
		<App title='100 танцевальных хитов'>
			<Playlist playlistId={3} />
		</App>
	)
}

export default HitsPage
