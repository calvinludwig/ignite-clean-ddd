import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../../enterprise/entities/answer'
import { Either, right } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

type AnswerQuestionInput = {
	instructorId: string
	questionId: string
	content: string
	attachmentsIds: string[]
}

type AnswerQuestionOutput = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}

	async execute({
		instructorId,
		questionId,
		content,
		attachmentsIds,
	}: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityID(instructorId),
			questionId: new UniqueEntityID(questionId),
		})
		const answerAttachments = attachmentsIds.map((id) =>
			AnswerAttachment.create({
				attachmentId: new UniqueEntityID(id),
				answerId: answer.id,
			}),
		)
		answer.attachments = new AnswerAttachmentList(answerAttachments)

		await this.answersRepository.create(answer)
		return right({ answer })
	}
}
