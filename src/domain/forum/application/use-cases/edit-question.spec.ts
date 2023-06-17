import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from '../../../../../test/factories/make-question-attachment'

describe('Edit Question', () => {
	let inMemoryQuestionsRepository: InMemoryQuestionsRepository
	let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
	let sut: EditQuestionUseCase

	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		sut = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentsRepository,
		)
	})

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('question-1'),
		)
		await inMemoryQuestionsRepository.create(newQuestion)

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

		expect(inMemoryQuestionsRepository.items).toHaveLength(1)
		await sut.execute({
			authorId: 'author-1',
			questionId: newQuestion.id.toValue(),
			title: 'new title',
			content: 'new body',
			attachmentsIds: ['1', '3'],
		})
		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: 'new title',
			content: 'new body',
		})

		expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
		expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
		])
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
			attachmentsIds: [],
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
