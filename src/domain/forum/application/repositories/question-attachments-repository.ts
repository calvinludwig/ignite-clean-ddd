import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export interface QuestionAttachmentsRepostiory {
	findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
	deleteManyByQuestionId(questionId: string): Promise<void>
}
