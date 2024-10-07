module.exports = {
	testEnvironment: 'jest-environment-jsdom',
	transform: {
		// '^.+\\.(ts|tsx)$': 'ts-jest',
		'^.+\\.(ts|tsx)$': 'babel-jest',
	},
	// moduleNameMapper: {
	// 	'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
	// },
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		'^@/store/(.*)$': '<rootDir>/src/store/$1',
		'^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
		'^@/components/(.*)$': '<rootDir>/src/app/components/$1',
		'^@/app/(.*)$': '<rootDir>/src/app/$1',
		'^next/font/google$': '<rootDir>/__mocks__/next/font/google.js',
		// '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		// ...pathsToModuleNameMapper(compilerOptions.paths || {}, {
		// 	prefix: '<rootDir>/',
	},
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
}
