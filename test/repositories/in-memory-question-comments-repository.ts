import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
	public items: QuestionComment[] = []

	async create(questionComment: QuestionComment) {
		this.items.push(questionComment)
	}

	async findById(id: string) {
		const questionComment = this.items.find((item) => item.id.toValue() === id)
		if (!questionComment) return null
		return questionComment
	}

	async delete(questionComment: QuestionComment) {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toValue() === questionComment.id.toValue(),
		)
		this.items.splice(itemIndex, 1)
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const questionComments = this.items
			.filter((item) => item.questionId.toValue() === questionId)
			.slice((page - 1) * 20, page * 20)

		return questionComments
	}
}