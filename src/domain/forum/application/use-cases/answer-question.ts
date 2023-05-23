import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../../enterprise/entities/answer'
import { Either, right } from '@/core/either'

type AnswerQuestionInput = {
	instructorId: string
	questionId: string
	content: string
}

type AnswerQuestionOutput = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}

	async execute({
		instructorId,
		questionId,
		content,
	}: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityID(instructorId),
			questionId: new UniqueEntityID(questionId),
		})
		await this.answersRepository.create(answer)
		return right({ answer })
	}
}
