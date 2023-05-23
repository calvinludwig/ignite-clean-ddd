import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type EditQuestionInput = {
	authorId: string
	questionId: string
	title: string
	content: string
}

type EditQuestionOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question
	}
>

export class EditQuestionUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({
		questionId,
		authorId,
		title,
		content,
	}: EditQuestionInput): Promise<EditQuestionOutput> {
		const question = await this.questionsRepository.findById(questionId)
		if (!question) return left(new ResourceNotFoundError())
		if (question.authorId.toString() !== authorId) return left(new NotAllowedError())
		question.title = title
		question.content = content
		await this.questionsRepository.update(question)
		return right({ question })
	}
}
