import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Sidebar from './Sidebar'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '@/app/api'
import { logout } from '@/store/features/authSlice'

jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))
jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	useDispatch: jest.fn(),
	useSelector: jest.fn(),
}))
jest.mock('@/app/api', () => ({
	logoutUser: jest.fn(),
}))

describe('Sidebar Component', () => {
	const mockRouterPush = jest.fn()
	const mockDispatch = jest.fn()
	const mockUseRouter = useRouter as jest.Mock
	const mockUseDispatch = useDispatch as jest.Mock
	const mockUseSelector = useSelector as jest.Mock

	beforeEach(() => {
		jest.clearAllMocks()
		mockUseRouter.mockReturnValue({ push: mockRouterPush })
		mockUseDispatch.mockReturnValue(mockDispatch)
		mockUseSelector.mockImplementation(selector =>
			selector({
				auth: { username: 'reduxUsername' },
			})
		)
		localStorage.setItem('username', 'localUsername')
	})

	afterEach(() => {
		localStorage.clear()
	})

	test('renders correctly with username from Redux', () => {
		const { getByText } = render(<Sidebar />)
		expect(getByText('reduxUsername')).toBeInTheDocument()
	})

	test('renders correctly with username from localStorage', () => {
		mockUseSelector.mockImplementation(selector =>
			selector({
				auth: { username: null },
			})
		)
		const { getByText } = render(<Sidebar />)
		expect(getByText('localUsername')).toBeInTheDocument()
	})

	test('calls logoutUser and dispatch on logout', async () => {
		logoutUser.mockResolvedValueOnce({})
		const { container } = render(<Sidebar />)
		const logoutButton = container.querySelector('.sidebar__icon')

		fireEvent.click(logoutButton)

		await waitFor(() => {
			expect(logoutUser).toHaveBeenCalled()
			expect(mockDispatch).toHaveBeenCalledWith(logout())
			expect(localStorage.getItem('username')).toBeNull()
			expect(mockRouterPush).toHaveBeenCalledWith('/signin')
		})
	})
})
