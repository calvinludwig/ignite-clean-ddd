import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('fetch question comments', () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
		sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
	})

	it('should be able to fetch recent questions', async () => {
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityID('question-1'),
			}),
		)
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityID('question-1'),
			}),
		)
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityID('question-1'),
			}),
		)
		const result = await sut.execute({ questionId: 'question-1', page: 1 })
		expect(result.isRight()).toBe(true)
		expect(result.value?.questionComments).toHaveLength(3)
	})

	it('should be able to fetch paginated question comments', async () => {
		for (let i = 0; i < 25; i++) {
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({
					questionId: new UniqueEntityID('question-1'),
				}),
			)
		}
		const result = await sut.execute({
			questionId: 'question-1',
			page: 2,
		})
		expect(result.isRight()).toBe(true)
		expect(result.value?.questionComments).toHaveLength(5)
	})
})
