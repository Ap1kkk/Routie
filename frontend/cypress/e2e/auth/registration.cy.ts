describe('Registration flow', () => {
	it('should register user and redirect to /routie', () => {
		const email = `cypress_${Date.now()}@cypress.test`;

		cy.visit('/login');

		cy.contains('Зарегистрироваться').click();
		cy.url().should('include', '/registration');

		cy.get('input[name="email"]').type(email);

		cy.get('input[name="username"]').type('cypress');

		cy.get('input[name="password"]').type('Test12345!');
		cy.get('input[name="confirmPassword"]').type('Test12345!');

		cy.get('input[type="checkbox"]').first().check({ force: true });
		cy.get('input[type="checkbox"]').last().check({ force: true });

		cy.contains('button', 'Далее').click();

		cy.get('input[name="name"]').clear().type('Сипрес');

		cy.get('[data-testid="add-sex"]').click();

		cy.contains('Мужской')
			.click();

		cy.contains('Дата рождения').click();
		cy.contains('2000').click();
		cy.contains('Янв').click();
		cy.contains('1').click();

		cy.get('input[name="weight"]').type('70');
		cy.get('input[name="height"]').type('180');

		cy.contains('button', 'Далее').click();

		cy.contains('Выберите теги').should('be.visible');

		cy.get('[data-testid="tag-item"]')
			.should('have.length.greaterThan', 3)
			.then(($tags) => {
				cy.wrap($tags[0]).click();
				cy.wrap($tags[1]).click();
				cy.wrap($tags[2]).click();
			});

		cy.contains('button', 'Завершить регистрацию').click();

		cy.url().should('include', '/routie');
	});
});