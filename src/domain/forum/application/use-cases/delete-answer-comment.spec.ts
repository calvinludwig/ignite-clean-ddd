import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('delete answer comment', () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
	})

	it('should be able to delete a answer comment', async () => {
		const answerComment = makeAnswerComment()
		inMemoryAnswerCommentsRepository.create(answerComment)
		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1)
		await sut.execute({
			authorId: answerComment.authorId.toValue(),
			answerCommentId: answerComment.id.toValue(),
		})
		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete another user answer comment', async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityID('author-1'),
		})
		inMemoryAnswerCommentsRepository.create(answerComment)
		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1)

		const result = await sut.execute({
			authorId: 'author-2',
			answerCommentId: answerComment.id.toValue(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
