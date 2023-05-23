import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type FetchRecentQuestionsUseCaseInput = {
	page: number
}

type FetchRecentQuestionsUseCaseOutput = Either<
	null,
	{
		questions: Question[]
	}
>

export class FetchRecentQuestionsUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({
		page,
	}: FetchRecentQuestionsUseCaseInput): Promise<FetchRecentQuestionsUseCaseOutput> {
		const questions = await this.questionsRepository.findManyRecent({ page })
		return right({ questions })
	}
}
