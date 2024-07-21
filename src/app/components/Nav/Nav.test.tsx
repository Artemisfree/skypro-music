import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Nav from './Nav'
import { useRouter } from 'next/router'

jest.mock('next/image', () => ({ src, alt }: { src: string; alt: string }) => (
	<img src={src} alt={alt} />
))
jest.mock(
	'next/link',
	() =>
		({ children, href }: { children: React.ReactNode; href: string }) =>
			<a href={href}>{children}</a>
)

describe('Nav Component', () => {
	test('renders logo and burger menu', () => {
		const { getByAltText, getByRole } = render(<Nav />)

		expect(getByAltText('Logo')).toBeInTheDocument()
		expect(getByRole('button')).toBeInTheDocument()
	})

	test('toggles menu on burger click', () => {
		const { getByRole, getByText, queryByText } = render(<Nav />)

		const burger = getByRole('button')

		expect(queryByText('Главное')).not.toBeInTheDocument()
		expect(queryByText('Мой плейлист')).not.toBeInTheDocument()
		expect(queryByText('Войти')).not.toBeInTheDocument()

		fireEvent.click(burger)
		expect(getByText('Главное')).toBeInTheDocument()
		expect(getByText('Мой плейлист')).toBeInTheDocument()
		expect(getByText('Войти')).toBeInTheDocument()

		fireEvent.click(burger)
		expect(queryByText('Главное')).not.toBeInTheDocument()
		expect(queryByText('Мой плейлист')).not.toBeInTheDocument()
		expect(queryByText('Войти')).not.toBeInTheDocument()
	})
})
