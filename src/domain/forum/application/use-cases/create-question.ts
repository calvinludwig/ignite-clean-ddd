import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

type CreateQuestionInput = {
	authorId: string
	title: string
	content: string
	attachmentsIds: string[]
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
		attachmentsIds,
	}: CreateQuestionInput): Promise<CreateQuestionOutput> {
		const question = Question.create({
			authorId: new UniqueEntityID(authorId),
			title,
			content,
		})

		const questionAttachments = attachmentsIds.map((id) => {
			return QuestionAttachment.create({
				questionId: question.id,
				attachmentId: new UniqueEntityID(id),
			})
		})

		question.attachments = new QuestionAttachmentList(questionAttachments)

		await this.questionsRepository.create(question)

		return right({ question })
	}
}
