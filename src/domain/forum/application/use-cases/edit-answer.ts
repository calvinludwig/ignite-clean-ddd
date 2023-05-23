import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type EditAnswerInput = {
	authorId: string
	answerId: string
	content: string
}

type EditAnswerOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		answer: Answer
	}
>

export class EditAnswerUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}
	async execute({ answerId, authorId, content }: EditAnswerInput): Promise<EditAnswerOutput> {
		const answer = await this.answersRepository.findById(answerId)
		if (!answer) return left(new ResourceNotFoundError())
		if (answer.authorId.toString() !== authorId) return left(new NotAllowedError())
		answer.content = content
		await this.answersRepository.update(answer)
		return right({ answer })
	}
}
