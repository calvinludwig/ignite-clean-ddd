import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('delete question comment', () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
		sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
	})

	it('should be able to delete a question comment', async () => {
		const questionComment = makeQuestionComment()
		inMemoryQuestionCommentsRepository.create(questionComment)
		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1)
		await sut.execute({
			authorId: questionComment.authorId.toValue(),
			questionCommentId: questionComment.id.toValue(),
		})
		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete another user question comment', async () => {
		const questionComment = makeQuestionComment({
			authorId: new UniqueEntityID('author-1'),
		})
		inMemoryQuestionCommentsRepository.create(questionComment)
		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1)

		const result = await sut.execute({
			authorId: 'author-2',
			questionCommentId: questionComment.id.toValue(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
