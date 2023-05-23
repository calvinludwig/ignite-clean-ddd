import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowedError } from './errors/not-allowed-error'

describe('Edit Answer', () => {
	let inMemoryAnswersRepository: InMemoryAnswersRepository
	let sut: EditAnswerUseCase

	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository()
		sut = new EditAnswerUseCase(inMemoryAnswersRepository)
	})

	it('should be able to edit a answer', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('answer-1'),
		)
		await inMemoryAnswersRepository.create(newAnswer)
		expect(inMemoryAnswersRepository.items).toHaveLength(1)
		await sut.execute({
			authorId: 'author-1',
			answerId: newAnswer.id.toValue(),
			content: 'new body',
		})
		expect(inMemoryAnswersRepository.items[0]).toMatchObject({
			content: 'new body',
		})
	})

	it('should not be able to edit a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('answer-1'),
		)
		await inMemoryAnswersRepository.create(newAnswer)
		const result = await sut.execute({
			authorId: 'author-2',
			answerId: newAnswer.id.toValue(),
			content: 'new body',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
