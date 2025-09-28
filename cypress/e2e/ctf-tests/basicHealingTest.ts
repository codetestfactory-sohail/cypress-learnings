
import 'cypress-healing';

describe('Google Search Healing Demo', () => {
  it('should demonstrate cy.waitFor and cy.getLoc', () => {
    cy.visit('https://ecommerce-playground.lambdatest.io/');
    // Wait for the search box to appear
  const searchBoxSelector = 'div[data-id="217822"] input[aria-label="Search For Products"]';
    cy.smartWait(searchBoxSelector, { action: 'appear', timeout: 10000 });
    // Use self-healing locator to get the search box
    cy.smartGet(searchBoxSelector).type('iphone{enter}');
    // Wait for results to appear
    cy.smartWait(5000); // Wait for 5 seconds to observe the result
    cy.smartGet('h1.h4').should('contain.text', 'Search - iphone');
    cy.smartWait('h1.h4', { action: 'appear', timeout: 10000, message: 'Await for heading to appear' });
    
  });
});
