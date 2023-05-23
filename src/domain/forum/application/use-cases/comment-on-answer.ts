import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comment-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'

type CommentOnAnswerInput = {
	authorId: string
	answerId: string
	content: string
}

type CommentOnAnswerOutput = Either<
	ResourceNotFoundError,
	{
		answerComment: AnswerComment
	}
>

export class CommentOnAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private commentAnswerRepository: AnswerCommentsRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
	}: CommentOnAnswerInput): Promise<CommentOnAnswerOutput> {
		const answer = await this.answersRepository.findById(answerId)
		if (!answer) return left(new ResourceNotFoundError())
		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityID(authorId),
			answerId: new UniqueEntityID(answerId),
			content,
		})
		await this.commentAnswerRepository.create(answerComment)
		return right({ answerComment })
	}
}
