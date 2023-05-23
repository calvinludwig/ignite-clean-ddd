import { makeQuestion } from '../../../../../test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('comment on question', () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
		sut = new CommentOnQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionCommentsRepository,
		)
	})

	it('should be able to comment on a question', async () => {
		const question = makeQuestion({})
		await inMemoryQuestionsRepository.create(question)
		await sut.execute({
			questionId: question.id.toValue(),
			authorId: question.authorId.toValue(),
			content: 'Test comment',
		})

		expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual('Test comment')
	})
})
