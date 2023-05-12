const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo
  let testAnswer
  let testQuestions = []

  let random = async () =>{
    return {
      id: faker.datatype.uuid(),
      summary: faker.lorem.sentence(3).slice(0, -1),
      author: faker.name.firstName() + " " + faker.name.lastName()
    }
  }

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  beforeAll(async () => {
    testAnswer = await random()

    testQuestions = [
      await random(),
      await random()
    ]
    testQuestions[0].answers= []
    testQuestions[1].answers= []
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return 1 question', async () => {
    const question = await questionRepo.getQuestionById(testQuestions[0].id)
    expect(question).toBeTruthy();
  })

  test('should return a list of 0 answers', async () => {
    const answers = await questionRepo.getAnswers(testQuestions[0].id)
    expect(answers).toHaveLength(0)
  })

  test('should return 1 answer', async () => {
    const index = testQuestions.findIndex(q => q.id === testQuestions[0].id)
    await testQuestions[index].answers.push(testAnswer)
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    expect(testQuestions[index].answers).toHaveLength(1)
  })

  test('should return 1 answer', async () => {
    const answer = await testQuestions[0].answers.find(a => a.id === testAnswer.id)
    expect(answer).toBeTruthy()
  })
})
