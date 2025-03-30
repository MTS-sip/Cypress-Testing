describe("Quiz E2E - With Real DB", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("starts the quiz and shows a DB-seeded question", () => {
    cy.get("button").contains("Start Quiz").click();

    // Wait for question text from the seeded DB
    cy.contains("What is the output of print(2 ** 3)?", {
      timeout: 5000,
    }).should("be.visible");
  });

  it("answers all questions and sees final score", () => {
    cy.get("button").contains("Start Quiz").click();

    // Click through seeded questions
    for (let i = 0; i < 10; i++) {
      cy.get(".d-flex.align-items-center")
        .first()
        .within(() => {
          cy.get("button").click();
        });
    }

    cy.contains("Quiz Completed").should("be.visible");
    cy.contains("Your score:").should("exist");
  });

  it("restarts the quiz from DB", () => {
    cy.get("button").contains("Start Quiz").click();

    // Answer one question
    cy.get(".d-flex.align-items-center")
      .first()
      .within(() => {
        cy.get("button").click();
      });

    // Skip ahead
    for (let i = 0; i < 9; i++) {
      cy.get(".d-flex.align-items-center")
        .first()
        .within(() => {
          cy.get("button").click();
        });
    }

    cy.contains("Quiz Completed").should("be.visible");
    cy.get("button").contains("Take New Quiz").click();

    cy.contains("What is the output of print(2 ** 3)?", {
      timeout: 5000,
    }).should("be.visible");
  });
});
