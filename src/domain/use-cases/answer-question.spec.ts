import { expect, test } from 'vitest'
import { Answer } from '../entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

const fakeAnswersRepository: AnswersRepository = {
	create: async (answer: Answer) => {},
}

test('create an answer', async () => {
	const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)
	const answer = await answerQuestion.execute({
		content: 'Nova resposta',
		questionId: '1',
		instructorId: '1',
	})
	expect(answer.content).toEqual('Nova resposta')
})
