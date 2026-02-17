describe('E2E: login and add a product to sale console', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('visit /login then status code 200, add to sale console then status code 200', () => {
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');
    cy.intercept('GET', '**/api/products*').as('getProducts');
    cy.intercept('POST', '**/api/sales').as('addToSale');

    cy.visit('/login');

    cy.get('input[type="email"]')
      .should('exist')
      .clear()
      .type('email@example.com');
    cy.get('input[type="password"]').should('exist').clear().type('qwerty1');
    cy.get('button[type="submit"]').should('exist').click();

    cy.wait('@loginRequest', { timeout: 10000 }).then((interception) => {
      expect(interception.response).to.not.be.undefined;
      expect(interception.response!.statusCode).to.equal(200);
    });

    cy.visit('/products');

    cy.wait('@getProducts', { timeout: 10000 });

    cy.get('[data-cy="product-card"]', { timeout: 10000 })
      .should('have.length.at.least', 2)
      .eq(1)
      .as('secondProduct');

    cy.get('@firstProduct').find('[data-cy="add-to-cart-btn"]').click();

    cy.wait('@addToCart', { timeout: 10000 }).then((interception) => {
      expect(interception.response).not.to.be.undefined;
      expect(interception.response!.statusCode).to.equal(200);
    });
  });
});
