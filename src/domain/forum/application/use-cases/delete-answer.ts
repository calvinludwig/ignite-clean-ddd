import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type DeleteAnswerUseCaseInput = {
	answerId: string
	authorId: string
}

type DeleteAnswerUseCaseOutput = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteAnswerUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}

	async execute({
		answerId,
		authorId,
	}: DeleteAnswerUseCaseInput): Promise<DeleteAnswerUseCaseOutput> {
		const answer = await this.answersRepository.findById(answerId)
		if (!answer) return left(new ResourceNotFoundError())
		if (answer.authorId.toString() !== authorId) return left(new NotAllowedError())
		await this.answersRepository.delete(answer)
		return right({})
	}
}
