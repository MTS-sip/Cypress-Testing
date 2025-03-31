import React from 'react';
import Quiz from '../../../client/src/components/Quiz';
import { mount } from 'cypress/react18';

describe("Quiz Component", () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');

  it("loads and starts the quiz", () => {
    cy.mount(<Quiz />);
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions");
    cy.contains("Which is the correct answer?").should("be.visible");
  });
});

  beforeEach(() => {
    cy.intercept('GET', '/api/questions/random', { body: mockQuestions }).as('getQuestions');
  });

  it("starts the quiz when button is clicked", () => {
    cy.mount(<Quiz />);
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions");
    cy.contains("What is 2 + 2?").should("be.visible");
  });

  it("progresses through questions and completes quiz", () => {
    const twoQuestions = [
      ...mockQuestions,
      {
        question: "What is the capital of France?",
        answers: [
          { text: "Berlin", isCorrect: false },
          { text: "Paris", isCorrect: true },
          { text: "Madrid", isCorrect: false },
          { text: "Rome", isCorrect: false }
        ]
      }
    ];
    cy.intercept('GET', '/api/questions/random', { body: twoQuestions }).as('getQuestions2');

    cy.mount(<Quiz />);
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions2");

    cy.contains("What is 2 + 2?").should("be.visible");
    cy.contains(".alert", "4").prev("button").click();

    cy.contains("What is the capital of France?").should("be.visible");
    cy.contains(".alert", "Paris").prev("button").click();

    cy.contains("Quiz Completed").should("be.visible");
    cy.contains("Your score: 2/2").should("be.visible");
  });

  it("can restart the quiz", () => {
    cy.mount(<Quiz />);
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions");

    cy.contains("What is 2 + 2?").should("be.visible");
    cy.contains(".alert", "4").prev("button").click();

    cy.contains("Quiz Completed").should("be.visible");
    cy.get("button").contains("Take New Quiz").click();

    cy.wait("@getQuestions");
    cy.contains("What is 2 + 2?").should("be.visible");
  });
});
