import React from 'react';
import Quiz from "../../../client/src/components/Quiz.tsx";
import { mount } from 'cypress/react18';

describe("Quiz Component", () => {
  beforeEach(() => {
    // Default intercept with a single question fixture
    cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
  });

  it("Quiz: Click button to start", () => {
    cy.mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');
    // The fixture question is "Which is the correct answer?"
    cy.contains("Which is the correct answer?").should('be.visible');
  });

  it("should answer questions and complete the quiz", () => {
    // Override intercept with two questions to simulate progressing through the quiz
    const questionsData = [
      {
        question: "Question 1: What is 2+2?",
        answers: [
          { text: "3", isCorrect: false },
          { text: "4", isCorrect: true },
          { text: "5", isCorrect: false },
          { text: "6", isCorrect: false }
        ]
      },
      {
        question: "Question 2: What is the capital of France?",
        answers: [
          { text: "Berlin", isCorrect: false },
          { text: "Madrid", isCorrect: false },
          { text: "Paris", isCorrect: true },
          { text: "Rome", isCorrect: false }
        ]
      }
    ];
    cy.intercept('GET', '/api/questions/random', { body: questionsData }).as('getQuestionsMultiple');
    cy.mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestionsMultiple');

    // Verify first question is displayed
    cy.contains("Question 1: What is 2+2?").should('be.visible');
    // Click the button preceding the answer "4"
    cy.contains('.alert', '4').prev('button').click();

    // Verify second question is displayed and answer it
    cy.contains("Question 2: What is the capital of France?").should('be.visible');
    cy.contains('.alert', 'Paris').prev('button').click();

    // Verify the quiz completed view and score
    cy.contains("Quiz Completed").should('be.visible');
    cy.contains("Your score: 2/2").should('be.visible');
  });

  it("Want to try the Quiz again?", () => {
    // Use the single-question fixture again
    cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestionsSingle');
    cy.mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestionsSingle');
    cy.contains("Which is the correct answer?").should('be.visible');

    // Answer the question: the correct answer text from the fixture is "Correct"
    cy.contains('.alert', 'Correct').prev('button').click();
    cy.contains("Quiz Completed").should('be.visible');

    // Click "Take New Quiz" to restart the quiz
    cy.get('button').contains('Take New Quiz').click();
    cy.wait('@getQuestionsSingle');
    cy.contains("Which is the correct answer?").should('be.visible');
  });
});



