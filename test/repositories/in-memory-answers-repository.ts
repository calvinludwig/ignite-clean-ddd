import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
	constructor(private answerAttachmentsRepository: AnswerAttachmentsRepository) {}

	public items: Answer[] = []

	async create(answer: Answer): Promise<void> {
		this.items.push(answer)
	}

	async findById(id: string) {
		const answer = this.items.find((answer) => answer.id.toValue() === id)
		if (!answer) return null
		return answer
	}

	async delete(answer: Answer) {
		const itemIndex = this.items.findIndex((item) => item.id.toValue() === answer.id.toValue())
		this.items.splice(itemIndex, 1)
		this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
	}

	async update(answer: Answer) {
		const itemIndex = this.items.findIndex((item) => item.id.toValue() === answer.id.toValue())
		this.items[itemIndex] = answer
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const answers = this.items
			.filter((item) => item.questionId.toValue() === questionId)
			.slice((page - 1) * 20, page * 20)

		return answers
	}
}
