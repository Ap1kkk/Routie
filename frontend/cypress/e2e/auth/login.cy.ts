describe('Login', () => {
	it('should log in successfully and open /routie', () => {
		cy.visit('/');

		cy.url().should('include', '/login');

		cy.get('input[type="email"]')
			.type('evgeniinaumov04@gmail.com');

		cy.get('input[type="password"]')
			.type('qwrd2yks');

		cy.get('button[type="submit"]')
			.click();

		cy.url().should('include', '/routie');
	});
});