import React from 'react';
import Quiz from "../../../client/src/components/Quiz";
import { mount } from 'cypress/react18';

describe("Quiz Component", () => {
  beforeEach(() => {
    // Default intercept with a single question
    cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
  });

  it("Quiz: Click button to start", () => {
    cy.mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');
    // The fixture question: "correct answer?"
    cy.contains("Which is the correct answer?").should('be.visible');
  });

  it("should answer questions and complete the quiz", () => {
    // Override intercept should simulate progressing through quiz
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

    // Verify question 1 displayed
    cy.contains("Question 1: What is 2+2?").should('be.visible');
    // Click the button next to the answer "4" (correct answer for first question)
    cy.contains('.alert', '4').prev('button').click();

    //  second question 
    cy.contains("Question 2: What is the capital of France?").should('be.visible');
    cy.contains('.alert', 'Paris').prev('button').click();

    // After answering all questions, the quiz should complete and show the score
    cy.contains("Quiz Completed").should('be.visible');
    cy.contains("Your score: 2/2").should('be.visible');
  });

  it("Want to try the Quiz again?", () => {
    // Use single question fixture again
    cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestionsSingle');
    cy.mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestionsSingle');
    cy.contains("Which is the correct answer?").should('be.visible');

    // Answer the question
    cy.contains('.alert', 'correct answer').prev('button').click();
    cy.get('.d-flex.align-items-center').first().within(() => {
      cy.get('button').click();
    });
    cy.contains("Quiz Completed").should('be.visible');

    // Click "Take New Quiz" to restart the quiz
    cy.get('button').contains('Take New Quiz').click();
    cy.wait('@getQuestionsSingle');
    cy.contains("Which is the correct answer?").should('be.visible');
  });
});





