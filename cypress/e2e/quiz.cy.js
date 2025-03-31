describe("Quiz E2E - xDB", () => {
  beforeEach(() => {
    // Default intercept
    cy.intercept("GET", "/api/questions/random", {
      fixture: "questions.json",
    }).as("getQuestions");
    cy.visit("/");
  });

  it("starts the quiz and shows a fixture question", () => {
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions");
    cy.contains("Which is the correct answer?").should("be.visible");
  });

  it("answers all questions and reaches completion", () => {
    const questionsData = [
      {
        question: "Question 1: What is 2+2?",
        answers: [
          { text: "3", isCorrect: false },
          { text: "4", isCorrect: true },
          { text: "5", isCorrect: false },
          { text: "6", isCorrect: false },
        ],
      },
      {
        question: "Question 2: What is the capital of France?",
        answers: [
          { text: "Berlin", isCorrect: false },
          { text: "Madrid", isCorrect: false },
          { text: "Paris", isCorrect: true },
          { text: "Rome", isCorrect: false },
        ],
      },
      {
        question: "What does the method append() do in a list?",
        answers: [
          {
            text: "Adds a new element at the end of the list",
            isCorrect: true,
          },
          { text: "Removes the last element of the list", isCorrect: false },
          { text: "Sorts the list in ascending order", isCorrect: false },
          { text: "Removes all elements from the list", isCorrect: false },
        ],
      },
      {
        question: "How do you create a tuple in Python?",
        answers: [
          { text: "[]", isCorrect: false },
          { text: "{}", isCorrect: false },
          { text: "()", isCorrect: true },
          { text: "tuple[]", isCorrect: false },
        ],
      },
      {
        question: "What is the output of print(3 == 3.0)?",
        answers: [
          { text: "False", isCorrect: false },
          { text: "True", isCorrect: true },
          { text: "3", isCorrect: false },
          { text: "3.0", isCorrect: false },
        ],
      },
      {
        question: "What is the keyword to define a class in Python?",
        answers: [
          { text: "function", isCorrect: false },
          { text: "def", isCorrect: false },
          { text: "class", isCorrect: true },
          { text: "module", isCorrect: false },
        ],
      },
      {
        question:
          "Which of the following is not a built-in data type in Python?",
        answers: [
          { text: "list", isCorrect: false },
          { text: "dict", isCorrect: false },
          { text: "tuple", isCorrect: false },
          { text: "array", isCorrect: true },
        ],
      },
      {
        question: "How do you start a comment in Python?",
        answers: [
          { text: "//", isCorrect: false },
          { text: "/*", isCorrect: false },
          { text: "#", isCorrect: true },
          { text: "<!--", isCorrect: false },
        ],
      },
    ];

    cy.intercept("GET", "/api/questions/random", {
      body: questionsData,
    }).as("getMultipleQuestions");

    cy.visit("/");
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getMultipleQuestions");

    // Loop through each question and select correct answer
    questionsData.forEach((question) => {
      cy.contains(question.question).should("be.visible");

      const correctAnswerText = question.answers.find((a) => a.isCorrect).text;

      // Find alert with correct text and click sibling button
      cy.contains(".alert", correctAnswerText)
        .prev("button")
        .should("be.visible")
        .click();
    });

    // This Verifies quiz completion
    cy.contains("Quiz Completed").should("be.visible");
    cy.contains("Your score:").should("exist");
  });

  it("restarts the quiz with new fixture questions", () => {
    cy.intercept("GET", "/api/questions/random", {
      fixture: "questions.json",
    }).as("getQuestionsSingle");
    cy.reload();
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestionsSingle");
    cy.contains("Which is the correct answer?").should("be.visible");

    cy.get(".d-flex.align-items-center")
      .first()
      .within(() => {
        cy.get("button").click();
      });
    cy.contains("Quiz Completed").should("be.visible");

    cy.get("button").contains("Take New Quiz").click();
    cy.wait("@getQuestionsSingle");
    cy.contains("Which is the correct answer?").should("be.visible");
  });
});
