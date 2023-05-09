import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Question } from '../../enterprise/entities/question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('get question by slug', () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
	})

	test('it should be able to get a question by slug', async () => {
		const newQuestion = Question.create({
			authorId: new UniqueEntityID(),
			title: 'Example question',
			content: 'question content',
			slug: Slug.create('example-slug'),
		})

		await inMemoryQuestionsRepository.create(newQuestion)

		const { question } = await sut.execute({
			slug: 'example-slug',
		})

		expect(question.id).toEqual(newQuestion.id)
	})
})
