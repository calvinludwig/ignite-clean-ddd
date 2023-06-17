import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { QuestionAttachmentsRepostiory } from '../repositories/question-attachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

type EditQuestionInput = {
	authorId: string
	questionId: string
	title: string
	content: string
	attachmentsIds: string[]
}

type EditQuestionOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question
	}
>

export class EditQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionAttachmentsRepository: QuestionAttachmentsRepostiory,
	) {}

	async execute({
		questionId,
		authorId,
		title,
		content,
		attachmentsIds,
	}: EditQuestionInput): Promise<EditQuestionOutput> {
		const question = await this.questionsRepository.findById(questionId)
		if (!question) return left(new ResourceNotFoundError())
		if (question.authorId.toString() !== authorId) return left(new NotAllowedError())
		const currentQuestionAttachments =
			await this.questionAttachmentsRepository.findManyByQuestionId(questionId)
		const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments)
		const questionAttachments = attachmentsIds.map((id) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityID(id),
				questionId: question.id,
			})
		})
		questionAttachmentList.update(questionAttachments)

		question.title = title
		question.content = content
		question.attachments = questionAttachmentList

		await this.questionsRepository.update(question)
		return right({ question })
	}
}
