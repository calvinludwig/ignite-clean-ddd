import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

type ChooseQuestionBestAnswerInput = {
	authorId: string
	answerId: string
}

type ChooseQuestionBestAnswerOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question
	}
>

export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private answersRepository: AnswersRepository,
	) {}

	async execute({
		answerId,
		authorId,
	}: ChooseQuestionBestAnswerInput): Promise<ChooseQuestionBestAnswerOutput> {
		const answer = await this.answersRepository.findById(answerId)

		if (!answer) return left(new ResourceNotFoundError())

		const question = await this.questionsRepository.findById(answer.questionId.toString())

		if (!question) return left(new ResourceNotFoundError())
		if (authorId !== question.authorId.toValue()) return left(new NotAllowedError())

		question.bestAnswerId = answer.id

		await this.questionsRepository.update(question)

		return right({ question })
	}
}
