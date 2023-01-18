/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function () {
	this.beforeEach(() => {
		cy.visit('./src/index.html')
	})

	it('verifica o título da aplicação', function () {
		cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
	})

	it('preenche os campos obrigatórios e envia o formulário', function () {
		cy.get("#firstName").type('teste')
		cy.get('#lastName').type('teste')
		cy.get('#email').type('teste@teste.com')
		cy.get('#open-text-area').type('Lorem Ipsum is simply dummy text of the printing and typesetting industry.', { delay: 0 })
		cy.contains('button', 'Enviar').click()

		cy.get('.success').should('be.visible')
	})

	it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
		cy.get('#firstName').type('nome')
		cy.get('#lastName').type('sobrenome')
		cy.get('#email').type('invalid-mail')
		cy.get('#open-text-area').type('escrevendo qualquer coisa')
		cy.contains('button', 'Enviar').click()

		cy.get('.error').should('be.visible')
	})

	it('campo telefonico continua vazio quando preenchido com um valor não-numerico', () => {
		cy.get('#phone')
			.type('abcderf')
			.should('have.text', '')
	})

	it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
		cy.get('#firstName').type('nome')
		cy.get('#lastName').type('sobrenome')
		cy.get('#email').type('mail@mail.com')
		cy.get('#phone-checkbox').check()
		cy.get('#open-text-area').type('escrevendo qualquer coisa')
		cy.contains('button', 'Enviar').click()

		cy.get('.error').should('be.visible')
	})

	it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
		cy.get('#firstName')
			.type('valor-aqui')
			.should('have.value', 'valor-aqui')
			.clear()
			.should('have.value', '')
	})

	it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
		cy.contains('button', 'Enviar').click()

		cy.get('.error').should('be.visible')
	})

	it('envia o formuário com sucesso usando um comando customizado', () => {
		cy.fillMandatoryFieldsAndSubmit()

		cy.get('.success').should('be.visible')
	})

	it("seleciona um produto (YouTube) por seu texto", () => {
		cy.get('#product')
			.select('YouTube')
			.should('have.value', 'youtube')
	})

	it('seleciona um produto (Mentoria) por seu valor (value)', () => {
		cy.get('#product')
			.select('mentoria')
			.should('have.value', 'mentoria')
	})

	it('seleciona um produto (Blog) por seu índice', () => {
		cy.get('#product')
			.select(1)
			.should('have.value', 'blog')
	})

	it('marca o tipo de atendimento "Feedback"', () => {
		cy.get('input[type="radio"][value="feedback"]')
			.check()
			.should('have.value', "feedback")
			.should('be.checked')
	})

	it('marca o tipo de atendimento "Feedback"', () => {
		cy.get('input[type="radio"]')
			.should('have.length', 3)
			.each(($radio) => {
				cy.wrap($radio).check()
				cy.wrap($radio).should('be.checked')

			})
	})

	it("marca ambos checkboxes, depois desmarca o último", () => {
		// cy.get('input[type="checkbox"][value=email]').check()
		// cy.get('input[type="checkbox"][value=phone]').check()
		cy.get('input[type="checkbox"]')
			.check()
			.should('be.checked')
			.last()
			.uncheck()
			.should('not.be.checked')
	})

	it('seleciona um arquivo da pasta fixtures', () => {
		cy.get('input[type="file"]')
			.should('not.have.value')
			.selectFile('cypress/fixtures/example.json')
			.should(input => {
				expect(input[0].files[0].name).to.equal('example.json')

			})
	})

	it('seleciona um arquivo simulando um drag-and-drop', () => {
		cy.get('input[type="file"]')
			.should('not.have.value')
			.selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
			.should(input => {
				expect(input[0].files[0].name).to.equal('example.json')

			})
	})

	it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
		cy.fixture('example.json', { encoding: null }).as('exampleFile')
		cy.get('input[type="file"]')
			.should('not.have.value')
			.selectFile('@exampleFile')
			.should(input => {
				expect(input[0].files[0].name).to.equal('example.json')

			})
	})

	it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
		cy.get('#privacy a')
			.should('have.attr', 'target', '_blank')

	})

	it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
		cy.get('#privacy a')
			.invoke('removeAttr', 'target')
			.click()
			.url()
			.should('include', '/src/privacy.html')

		cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT - Política de privacidade')

		cy.get('#white-background').should('be.visible')
	})
})

