import React from 'react'
import App from '@/app/components/Main/Main'
import HitsPlaylist from '@/app/components/Playlist/Hits'

const HitsPage: React.FC = () => {
	return (
		<App title='100 танцевальных хитов'>
			<HitsPlaylist />
		</App>
	)
}

export default HitsPage
