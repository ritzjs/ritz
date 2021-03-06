describe("index page", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("Has title and H1", () => {
    cy.contains("h1", "Ritz Store Example")
    cy.title().should("eq", "Ritz Example Store")
    cy.get("#referer").contains("http://localhost:3099")
  })

  it("goes to products page", () => {
    cy.contains("a", "Static Product Listings").click()
    cy.location("pathname").should("equal", "/products")
  })

  it("goes to admin page", () => {
    cy.contains("a", "Admin Section (client-rendered)").click()
    cy.location("pathname").should("equal", "/admin/products")
  })
})

export {}
