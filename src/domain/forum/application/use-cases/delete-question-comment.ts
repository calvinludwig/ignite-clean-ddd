import { Either, left, right } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comment-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type DeleteQuestionCommentInput = {
	authorId: string
	questionCommentId: string
}

type DeleteQuestionCommentOutput = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		authorId,
		questionCommentId,
	}: DeleteQuestionCommentInput): Promise<DeleteQuestionCommentOutput> {
		const questionComment = await this.questionCommentsRepository.findById(questionCommentId)
		if (!questionComment) return left(new ResourceNotFoundError())
		if (questionComment.authorId.toString() !== authorId) return left(new NotAllowedError())
		await this.questionCommentsRepository.delete(questionComment)
		return right({})
	}
}
