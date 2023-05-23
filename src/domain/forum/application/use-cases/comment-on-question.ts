import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comment-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type CommentOnQuestionInput = {
	authorId: string
	questionId: string
	content: string
}

type CommentOnQuestionOutput = Either<
	ResourceNotFoundError,
	{
		questionComment: QuestionComment
	}
>

export class CommentOnQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private commentQuestionRepository: QuestionCommentsRepository,
	) {}

	async execute({
		authorId,
		questionId,
		content,
	}: CommentOnQuestionInput): Promise<CommentOnQuestionOutput> {
		const question = await this.questionsRepository.findById(questionId)
		if (!question) return left(new ResourceNotFoundError())
		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityID(authorId),
			questionId: new UniqueEntityID(questionId),
			content,
		})
		await this.commentQuestionRepository.create(questionComment)
		return right({ questionComment })
	}
}
