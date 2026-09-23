describe('Админка — создание тега', () => {
	it('должен создать новый тег и отобразить его в таблице', () => {
		// LOGIN
		cy.visit('/');

		cy.url().should('include', '/login');

		cy.get('input[type="email"]')
			.type('evgeniinaumov04@gmail.com');

		cy.get('input[type="password"]')
			.type('qwrd2yks');

		cy.get('button[type="submit"]').click();

		cy.url().should('include', '/routie');

		// =========================
		// PROFILE → SETTINGS
		// =========================
		cy.contains('Профиль').click();

		cy.url().should('include', '/settings');

		// =========================
		// ADMIN PANEL
		// =========================
		cy.contains('Панель администратора').click();

		cy.url().should('include', '/admin');

		// =========================
		// OPEN TAGS EDIT
		// =========================
		cy.contains('Управление тегами').click();

		cy.url().should('include', '/admin/tags-edit');

		// =========================
		// CREATE TAG
		// =========================
		cy.contains('Создание тега').click();

		cy.get('input')
			.should('be.visible')
			.type('Туристический');

		cy.contains('Создать')
			.click();

		// =========================
		// ASSERT: TAG EXISTS
		// =========================
		cy.contains('Туристический').should('exist');
	});
});