import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type GetQuestionBySlugInput = {
	slug: string
}

type GetQuestionBySlugOutput = Either<
	ResourceNotFoundError,
	{
		question: Question
	}
>

export class GetQuestionBySlugUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({ slug }: GetQuestionBySlugInput): Promise<GetQuestionBySlugOutput> {
		const question = await this.questionsRepository.findBySlug(slug)
		if (!question) return left(new ResourceNotFoundError())
		return right({ question })
	}
}
