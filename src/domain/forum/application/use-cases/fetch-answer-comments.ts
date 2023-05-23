import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comment-repository'

type FetchAnswerCommentsInput = {
	answerId: string
	page: number
}

type FetchAnswerCommentsOutput = Either<
	null,
	{
		answerComments: AnswerComment[]
	}
>

export class FetchAnswerCommentsUseCase {
	constructor(private readonly answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({
		page,
		answerId,
	}: FetchAnswerCommentsInput): Promise<FetchAnswerCommentsOutput> {
		const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, {
			page,
		})
		return right({ answerComments })
	}
}
