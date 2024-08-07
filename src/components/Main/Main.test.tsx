import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import App from './Main'

import '@testing-library/jest-dom'

jest.mock('../Nav/Nav', () => {
	const MockNav = () => <div>Mocked Nav</div>
	MockNav.displayName = 'MockNav'
	return MockNav
})
jest.mock('../Search/Search', () => {
	const MockSearch = () => <div>Mocked Search</div>
	MockSearch.displayName = 'MockSearch'
	return MockSearch
})
jest.mock('../Filter/Filter', () => {
	const MockFilter = () => <div>Mocked Filter</div>
	MockFilter.displayName = 'MockFilter'
	return MockFilter
})
jest.mock('../Sidebar/Sidebar', () => {
	const MockSidebar = () => <div>Mocked Sidebar</div>
	MockSidebar.displayName = 'MockSidebar'
	return MockSidebar
})
jest.mock('../Bar/Bar', () => {
	const MockBar = () => <div>Mocked Bar</div>
	MockBar.displayName = 'MockBar'
	return MockBar
})


describe('App Component', () => {
	test('renders correctly with given title and children', () => {
		const title = 'Test Title'
		const children = <div>Test Children</div>

		const { getByText } = render(
			<Provider store={store}>
				<App title={title}>{children}</App>
			</Provider>
		)

		expect(getByText(title)).toBeInTheDocument()

		expect(getByText('Test Children')).toBeInTheDocument()

		expect(getByText('Mocked Nav')).toBeInTheDocument()
		expect(getByText('Mocked Search')).toBeInTheDocument()
		expect(getByText('Mocked Filter')).toBeInTheDocument()
		expect(getByText('Mocked Sidebar')).toBeInTheDocument()
		expect(getByText('Mocked Bar')).toBeInTheDocument()
	})
})
