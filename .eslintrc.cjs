module.exports = {
	extends: ['@rocketseat/eslint-config/node'],
	rules: {
		'no-useless-constructor': 'off',
		'no-new': 'off',
		camelcase: 'off',
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
}
