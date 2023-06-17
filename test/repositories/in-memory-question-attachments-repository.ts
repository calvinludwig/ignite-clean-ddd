import { QuestionAttachmentsRepostiory } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepostiory {
	public items: QuestionAttachment[] = []

	async findManyByQuestionId(questionId: string) {
		return this.items.filter((item) => {
			return item.questionId.toValue() === questionId
		})
	}

	async deleteManyByQuestionId(questionId: string) {
		this.items = this.items.filter((item) => item.questionId.toValue() !== questionId)
	}
}
