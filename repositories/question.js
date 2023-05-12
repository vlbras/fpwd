const { readFile, writeFile } = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await getQuestions()
    const question = await questions.find(q => q.id === questionId)
    if (!question) throw Error(`Question #${questionId} not found!`)

    return question
  }

  const addQuestion = async question => {
    let questions = await getQuestions()
    question.id = uuidv4()
    if (!question.answers) question.answers = []
    await questions.push(question)
    await writeFile(fileName, JSON.stringify(questions))

    return question
  }

  const getAnswers = async questionId => {
    const { answers } = await getQuestionById(questionId)
    if (!answers) throw Error(`Question #${questionId} not found!`)

    return answers
  }

  const getAnswer = async (questionId, answerId) => {
    const question = await getQuestionById(questionId)
    const answer = await question.answers.find(a => a.id === answerId)
    if (!answer) throw Error (`Answer #${questionId} not found!`)

    return answer
  }

  const addAnswer = async (questionId, answer) => {
    let questions = await getQuestions()
    const index = await questions.findIndex(q => q.id === questionId)
    if (index < 0) throw Error(`Question #${questionId} not found!`)

    answer.id = uuidv4()
    await questions[index].answers.push(answer)
    await writeFile(fileName, JSON.stringify(questions))

    return answer
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
