import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

type DeleteQuestionInput = {
	questionId: string
	authorId: string
}

type DeleteQuestionOutput = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteQuestionUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({ questionId, authorId }: DeleteQuestionInput): Promise<DeleteQuestionOutput> {
		const question = await this.questionsRepository.findById(questionId)
		if (!question) return left(new ResourceNotFoundError())
		if (question.authorId.toString() !== authorId) return left(new NotAllowedError())
		await this.questionsRepository.delete(question)
		return right({})
	}
}
