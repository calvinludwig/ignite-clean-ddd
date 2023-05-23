import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

type FetchQuestionAnswersInput = {
	questionId: string
	page: number
}

type FetchQuestionAnswersOutput = Either<
	null,
	{
		answers: Answer[]
	}
>

export class FetchQuestionAnswersUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}

	async execute({
		page,
		questionId,
	}: FetchQuestionAnswersInput): Promise<FetchQuestionAnswersOutput> {
		const answers = await this.answersRepository.findManyByQuestionId(questionId, { page })
		return right({ answers })
	}
}
