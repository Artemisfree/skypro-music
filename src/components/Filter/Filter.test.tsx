import React from 'react'
import renderer from 'react-test-renderer'
import Filter from './Filter'
import { FilteredTracksProvider } from '@/contexts/FilteredTracksContext'



jest.mock('@/app/api', () => ({
	getAllTracks: jest.fn().mockResolvedValue({
		data: [
			{ id: 1, author: 'Author1', genre: ['Genre1'], year: 2020 },
			{ id: 2, author: 'Author2', genre: ['Genre2'], year: 2021 },
		],
	}),
}))

describe('Filter component', () => {
	it('renders correctly and matches snapshot', async () => {
		const component = renderer.create(
			<FilteredTracksProvider>
				<Filter />
			</FilteredTracksProvider>
		)

		await renderer.act(async () => {
			await Promise.resolve()
		})

		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
