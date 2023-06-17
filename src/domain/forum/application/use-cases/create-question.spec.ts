import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create a question', () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
	})

	test('it should be able to create a question', async () => {
		const result = await sut.execute({
			authorId: '1',
			title: 'New question',
			content: 'question content',
			attachmentsIds: ['1', '2'],
		})

		expect(result.isRight()).toBe(true)
		const questionInRepository = inMemoryQuestionsRepository.items[0]
		expect(questionInRepository).toEqual(result.value?.question)
		expect(questionInRepository.attachments.currentItems).toHaveLength(2)
		expect(questionInRepository.attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
		])
	})
})
