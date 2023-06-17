import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from '../../../../../test/factories/make-question-attachment'

describe('Delete Question', () => {
	let inMemoryQuestionsRepository: InMemoryQuestionsRepository
	let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
	let sut: DeleteQuestionUseCase

	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		)
		sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to delete a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('question-1'),
		)
		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID('1'),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID('2'),
			}),
		)
		await inMemoryQuestionsRepository.create(newQuestion)
		expect(inMemoryQuestionsRepository.items).toHaveLength(1)
		const result = await sut.execute({ questionId: 'question-1', authorId: 'author-1' })
		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionsRepository.items).toHaveLength(0)
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a question from another user', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('question-1'),
		)
		await inMemoryQuestionsRepository.create(newQuestion)
		const result = await sut.execute({ questionId: 'question-1', authorId: 'author-2' })
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
