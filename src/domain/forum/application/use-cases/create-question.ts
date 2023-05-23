import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, right } from '@/core/either'

type CreateQuestionInput = {
	authorId: string
	title: string
	content: string
}

type CreateQuestionOutput = Either<
	null,
	{
		question: Question
	}
>

export class CreateQuestionUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({
		authorId,
		title,
		content,
	}: CreateQuestionInput): Promise<CreateQuestionOutput> {
		const question = Question.create({
			authorId: new UniqueEntityID(authorId),
			title,
			content,
		})

		await this.questionsRepository.create(question)

		return right({ question })
	}
}
