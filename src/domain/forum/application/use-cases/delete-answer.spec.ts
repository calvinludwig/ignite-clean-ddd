import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'

describe('Delete Answer', () => {
	let inMemoryAnswersRepository: InMemoryAnswersRepository
	let sut: DeleteAnswerUseCase

	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository()
		sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
	})

	it('should be able to delete a answer', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('answer-1'),
		)
		await inMemoryAnswersRepository.create(newAnswer)
		expect(inMemoryAnswersRepository.items).toHaveLength(1)
		const result = await sut.execute({ answerId: 'answer-1', authorId: 'author-1' })
		expect(result.isRight()).toBe(true)
		expect(inMemoryAnswersRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('answer-1'),
		)
		await inMemoryAnswersRepository.create(newAnswer)
		const result = await sut.execute({ answerId: 'answer-1', authorId: 'author-2' })
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
