module.exports = {
	extends: ['@rocketseat/eslint-config/node', 'plugin:vitest-globals/recommended'],
	rules: {
		'no-useless-constructor': 'off',
		indent: ['error', 'tab'],
		'prettier/prettier': [
			'error',
			{
				noNew: false,
				useTabs: true,
				printWidth: 100,
				tabWidth: 4,
				singleQuote: true,
				trailingComma: 'all',
				arrowParens: 'always',
				semi: false,
			},
		],
	},
	env: {
		'vitest-globals/env': true,
	},
}
