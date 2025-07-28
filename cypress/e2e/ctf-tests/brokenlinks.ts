describe('Broken Links Validation', () => {
  it('should check all links for broken URLs', () => {
    cy.visit('https://ecommerce-playground.lambdatest.io/');

    let brokenLinksCount = 0;
    let invalidLinksCount = 0;
    const startTime = Date.now();

    cy.get('a').each(($link, index) => {
      const url = $link.prop('href');
      if (!url || url.startsWith('javascript:') || url.startsWith('#')) {
        cy.log(`${index + 1}. Invalid Link: ${url}`);
        invalidLinksCount++;
        return;
      }
      if (url.startsWith('http')) {
        cy.request({
          url,
          failOnStatusCode: false,
          method: 'HEAD'
        }).then((response) => {
          if (response.status >= 400) {
            cy.log(`${index + 1}. Broken Link: ${url} - Response Code: ${response.status}`);
            brokenLinksCount++;
          } else {
            cy.log(`${index + 1}. Working Link: ${url} - Response Code: ${response.status}`);
          }
        });
      }
    }).then(($links) => {
      const totalLinks = $links.length;
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