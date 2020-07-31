describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Kalle Kayttaja',
      username: 'kkayt',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('kkayt')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Kalle Kayttaja logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('kkayt')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Kalle Kayttaja logged in')
    })
  })
  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'kkayt', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog') .click()
      cy.get('#title').type('test blog')
      cy.get('#author').type('tester')
      cy.get('#url').type('test.com')
      cy.get('#create-button').click()

      cy.contains('test blog tester')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'first blog',
          author:'Eka',
          url:'1.fi',
          likes:1
        })
        cy.createBlog({
          title: 'second blog',
          author: 'Toka',
          url:'2.fi',
          likes:2
        })
        cy.createBlog({
          title: 'third blog',
          author: 'Kolmas',
          url:'3.fi'
        })
      })

      it('A blog can be liked', function() {
        cy.contains('second blog Toka').find('button').click()
        cy.get('#add-like').click()
        cy.contains('second blog Toka').parent().should('contain', 'likes 3')
      })

      it('a blog can be deleted by by adder', function() {
        cy.contains('second blog Toka').find('button').click()
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'second blog Toka')
      })

      it('blogs are sorted by likes', function() {
        cy.get('.blog').then($blogs => {
          const likeString = $blogs.map($b => $b.likes)
          cy.wrap(likeString).should('equal', likeString.sort())
        })
      })
    })
  })
})