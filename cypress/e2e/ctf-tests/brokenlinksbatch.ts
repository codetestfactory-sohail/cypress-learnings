/// <reference types="cypress" />

function chunkArray(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

describe('Broken Links Validation via Batch', () => {
  it('should check links in batches', () => {
    let batchSize = 50;
    let brokenLinksCount = 0;
    let invalidLinksCount = 0;
    const startTime = Date.now();

    cy.visit('https://ecommerce-playground.lambdatest.io/');
    cy.get('a').then($links => {
      const hrefs = $links
        .map((_, el) => el.getAttribute('href'))
        .get()
        .filter(url => url && url.startsWith('http'));

      const batches = chunkArray(hrefs, batchSize);

      batches.forEach((batch) => {
        batch.forEach((url) => {
          cy.request({ url, failOnStatusCode: false, method: 'HEAD' }).then(response => {
            if (response.status >= 400) {
              brokenLinksCount++;
            }
          });
        });
      });

      // Chain a .then() after all cy.requests are queued
      cy.then(() => {
        const totalLinks = hrefs.length;
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        cy.log('#################################');
        cy.log(`Total Links: ${totalLinks}`);
        cy.log(`Valid Links: ${totalLinks - brokenLinksCount - invalidLinksCount}`);
        cy.log(`Invalid Links: ${invalidLinksCount}`);
        cy.log(`Broken Links: ${brokenLinksCount}`);
        cy.log(`Total time taken to check all links: ${duration} seconds`);
        cy.log('#################################');
      });
    });
  });
});