const js = require('@eslint/js');

module.exports = [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			globals: require('globals').node,
		},
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'error',
		},
	},
];