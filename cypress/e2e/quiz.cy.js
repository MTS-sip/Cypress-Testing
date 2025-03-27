describe("Quiz End-to-End Tests", () => {
  beforeEach(() => {
    // Using default fixture
    cy.intercept("GET", "/api/questions/random", {
      fixture: "questions.json",
    }).as("getQuestions");
    cy.visit("/");
  });

  it("To start the quiz click the button", () => {
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions");
    cy.contains("Which is the correct answer?").should("be.visible");
  });

  it("Are you ready for next question?", () => {
    // Override the API call with multiple questions for this test
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
    ];
    cy.intercept("GET", "/api/questions/random", { body: questionsData }).as(
      "getQuestionsMultiple"
    );
    // Reload page
    cy.reload();
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestionsMultiple");

    // first question
    cy.contains("Question 1: What is 2+2?").should("be.visible");
    cy.contains(".alert", "4").prev("button").click();

    // second question
    cy.contains("Question 2: What is the capital of France?").should(
      "be.visible"
    );
    cy.contains(".alert", "Paris").prev("button").click();

    // Verify quiz completion and view score
    cy.contains("Quiz Completed").should("be.visible");
    cy.contains("Your score: 2/2").should("be.visible");
  });

  it("Do you want to restart?", () => {
    cy.intercept("GET", "/api/questions/random", {
      fixture: "questions.json",
    }).as("getQuestionsSingle");
    cy.reload();
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestionsSingle");
    cy.contains("Which is the correct answer?").should("be.visible");

    // Answer to complete quiz
    cy.get(".d-flex.align-items-center")
      .first()
      .within(() => {
        cy.get("button").click();
      });
    cy.contains("Quiz Completed").should("be.visible");

    //  "Take New Quiz" for restarting quiz
    cy.get("button").contains("Take New Quiz").click();
    cy.wait("@getQuestionsSingle");
    cy.contains("Which is the correct answer?").should("be.visible");
  });
});
