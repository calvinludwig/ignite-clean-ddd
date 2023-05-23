import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from './errors/not-allowed-error'

describe('Edit Question', () => {
	let inMemoryQuestionsRepository: InMemoryQuestionsRepository
	let sut: EditQuestionUseCase

	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
		sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('question-1'),
		)
		await inMemoryQuestionsRepository.create(newQuestion)
		expect(inMemoryQuestionsRepository.items).toHaveLength(1)
		await sut.execute({
			authorId: 'author-1',
			questionId: newQuestion.id.toValue(),
			title: 'new title',
			content: 'new body',
		})
		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: 'new title',
			content: 'new body',
		})
	})

	it('should not be able to edit a question from another user', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('question-1'),
		)
		await inMemoryQuestionsRepository.create(newQuestion)

		const result = await sut.execute({
			authorId: 'author-2',
			questionId: newQuestion.id.toValue(),
			title: 'new title',
			content: 'new body',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
