/// <reference types="Cypress" />

describe("Central de Atendimento ao Cliente TAT", function () {
  const THREE_SECONDS_IN_MS = 3000;
  this.beforeEach(() => {
    cy.visit("./src/index.html");
  });

  it("verifica o título da aplicação", function () {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("preenche os campos obrigatórios e envia o formulário", function () {
    const longText =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
    cy.clock();
    cy.get("#firstName").type("teste");
    cy.get("#lastName").type("teste");
    cy.get("#email").type("teste@teste.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".success").should("not.be.visible");
  });

  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.clock();
    cy.get("#firstName").type("nome");
    cy.get("#lastName").type("sobrenome");
    cy.get("#email").type("invalid-mail");
    cy.get("#open-text-area").type("escrevendo qualquer coisa");
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("campo telefonico continua vazio quando preenchido com um valor não-numerico", () => {
    cy.get("#phone").type("abcderf").should("have.text", "");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.clock();
    cy.get("#firstName").type("nome");
    cy.get("#lastName").type("sobrenome");
    cy.get("#email").type("mail@mail.com");
    cy.get("#phone-checkbox").check();
    cy.get("#open-text-area").type("escrevendo qualquer coisa");
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName")
      .type("valor-aqui")
      .should("have.value", "valor-aqui")
      .clear()
      .should("have.value", "");
  });

  Cypress._.times(5, () => {
    it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
      cy.clock();
      cy.contains("button", "Enviar").click();

      cy.get(".error").should("be.visible");
      cy.tick(THREE_SECONDS_IN_MS);
      cy.get(".error").should("not.be.visible");
    });
  });

  it("envia o formuário com sucesso usando um comando customizado", () => {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit();

    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".success").should("not.be.visible");
  });

  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("seleciona um produto (Blog) por seu índice", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("have.value", "feedback")
      .should("be.checked");
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(($radio) => {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("marca ambos checkboxes, depois desmarca o último", () => {
    // cy.get('input[type="checkbox"][value=email]').check()
    // cy.get('input[type="checkbox"][value=phone]').check()
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json")
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json", { encoding: null }).as("exampleFile");
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("@exampleFile")
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });

  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.get("#privacy a")
      .invoke("removeAttr", "target")
      .click()
      .url()
      .should("include", "/src/privacy.html");

    cy.title().should(
      "be.equal",
      "Central de Atendimento ao Cliente TAT - Política de privacidade"
    );

    cy.get("#white-background").should("be.visible");
  });
  it("exibe e esconde as mensagens de sucesso e erro usando o .invoke", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it("preenche a area de texto usando o comando invoke('val')", function () {
    const longText = Cypress._.repeat("0123456789", 20);

    cy.get("#open-text-area")
      .invoke("val", longText)
      .should("have.value", longText);
  });

  it("faz uma requisição HTTP", () => {
    cy.request({
      method: "GET",
      url: "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html",
    }).should((response) => {
      const { status, statusText, body } = response;
      expect(status).to.equal(200),
        expect(statusText).to.equal("OK"),
        expect(body).to.include("CAC TAT");
    });
  });

  it("find a cat in app", () => {
    cy.get("#cat").should("not.be.visible").invoke("show").should("be.visible");
    cy.get("#title").invoke("text", "CAT TAT");
    cy.get("#subtitle").invoke("text", "miau miau");
  });
});
