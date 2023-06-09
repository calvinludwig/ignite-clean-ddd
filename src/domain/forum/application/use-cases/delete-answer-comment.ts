import { left, Either, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comment-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

type DeleteAnswerCommentInput = {
	authorId: string
	answerCommentId: string
}

type DeleteAnswerCommentOutput = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteAnswerCommentUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({
		authorId,
		answerCommentId,
	}: DeleteAnswerCommentInput): Promise<DeleteAnswerCommentOutput> {
		const answerComment = await this.answerCommentsRepository.findById(answerCommentId)
		if (!answerComment) return left(new ResourceNotFoundError())
		if (answerComment.authorId.toString() !== authorId) return left(new NotAllowedError())

		await this.answerCommentsRepository.delete(answerComment)
		return right({})
	}
}
