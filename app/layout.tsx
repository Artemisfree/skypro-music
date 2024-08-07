'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { CurrentTrackProvider } from '@/contexts/CurrentTrackProvider'
import { FilteredTracksProvider } from '@/contexts/FilteredTracksContext'
import './globals.css'

const RootLayout = ({ children }) => {
	return (
		<Provider store={store}>
			<FilteredTracksProvider>
				<CurrentTrackProvider>
					<html lang='en'>
						<head />
						<body>{children}</body>
					</html>
				</CurrentTrackProvider>
			</FilteredTracksProvider>
		</Provider>
	)
}

export default RootLayout
