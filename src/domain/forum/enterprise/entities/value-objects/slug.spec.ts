import { Slug } from './slug'

test('should be able to create a slug', () => {
	const slug = Slug.createFromText('  Example question title  ')
	expect(slug.value).toBe('example-question-title')
})
