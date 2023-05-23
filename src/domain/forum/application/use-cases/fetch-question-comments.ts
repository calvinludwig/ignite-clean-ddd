import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comment-repository'

type FetchQuestionCommentsInput = {
	questionId: string
	page: number
}

type FetchQuestionCommentsOutput = Either<
	null,
	{
		questionComments: QuestionComment[]
	}
>

export class FetchQuestionCommentsUseCase {
	constructor(private readonly questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		page,
		questionId,
	}: FetchQuestionCommentsInput): Promise<FetchQuestionCommentsOutput> {
		const questionComments = await this.questionCommentsRepository.findManyByQuestionId(
			questionId,
			{
				page,
			},
		)
		return right({ questionComments })
	}
}
