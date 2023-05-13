const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo
  let testAnswer
  let testQuestions = []

  const randomData = () => {
    return {
      id: faker.datatype.uuid(),
      summary: faker.lorem.sentence(3).slice(0, -1),
      author: faker.name.firstName() + " " + faker.name.lastName()
    }
  }

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))
    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)

    testAnswer = randomData()

    testQuestions.push(randomData())
    testQuestions[0].answers = []
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  describe("addQuestion", () => {
    test('should return a question', async () => {
      const question = await questionRepo.addQuestion(testQuestions[0])
      expect(question).toEqual(testQuestions[0])
    })
  })

  describe("getQuestions", () => {
    test('should return a list of 1 question', async () => {
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
      expect(await questionRepo.getQuestions()).toHaveLength(1)
    })
  })

  describe("getQuestion:id", () => {
    describe("when question with id exists", () => {
      test('should return 1 question', async () => {
        const question = await questionRepo.getQuestionById(testQuestions[0].id)
        expect(question).toBeTruthy();
      })
    })

    describe("otherwise", () => {
      test("should throw an error", async () => {
        try {
          await questionRepo.getQuestionById(undefined)
        } catch (e) {
          expect(e).toBeInstanceOf(Error)
          expect(e.message).toEqual(`Question #undefined not found!`)
        }
      })
    })
  })

  describe("addAnswer", () => {
    test('should return an answer', async () => {
      const answer = await questionRepo.addAnswer(testQuestions[0].id, testAnswer)
      expect(answer).toEqual(testAnswer)
    })
  })

  describe("getAnswers", () => {
    test('should return a list of 1 answer', async () => {
      const answers = await questionRepo.getAnswers(testQuestions[0].id)
      expect(answers).toHaveLength(1)
    })
  })

  describe("getAnswer:id", () => {
    describe("when answer with id exist", () => {
      test('should return 1 answer', async () => {
        const answer = await questionRepo.getAnswer(testQuestions[0].id, testAnswer.id)
        expect(answer).toBeTruthy()
      })

      describe("otherwise", () => {
        test('should throw an error', async () => {
          try {
            await questionRepo.getAnswer(testQuestions[0].id, undefined)
          } catch (e) {
            expect(e).toBeInstanceOf(Error)
            expect(e.message).toEqual(`Answer #undefined not found!`)
          }
        })
      })
    })
  })
})