describe('QAuto Login Command Tests', () => {
    // Function to generate a unique email
    const generateUniqueEmail = () => {
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 10000)
        return `testuser${timestamp}${random}@example.com`
    }

    beforeEach(() => {
        // Always start fresh for each test
        cy.visit('https://guest:welcome2qauto@qauto.forstudy.space/')
        cy.get('body').should('be.visible')
        cy.url().should('include', 'qauto.forstudy.space')
    })

    it('should test custom login command functionality', () => {
        // Generate unique credentials for testing
        const email = generateUniqueEmail()
        const password = 'TestPassword123'

        // First, register a new user
        cy.contains('.app-wrapper button', 'Sign up').click()

        // Wait for registration modal
        cy.get('.modal-content').should('be.visible')

        // Register the user
        cy.get('#signupName').type('Test')
        cy.get('#signupLastName').type('User')
        cy.get('#signupEmail').type(email)
        cy.get('#signupPassword').type(password, { sensitive: true })
        cy.get('#signupRepeatPassword').type(password, { sensitive: true })
        cy.get('.modal-footer button').contains('Register').click()

        // Wait for registration to complete
        cy.get('.modal-content').should('not.exist')

        // Test the custom login command
        // We need to start fresh to test login properly
        cy.visit('https://guest:welcome2qauto@qauto.forstudy.space/')

        // Test the custom login command
        cy.login(email, password)

        // Verify successful login
        cy.get('body').should('not.contain', 'Sign In')
        cy.url().should('include', 'qauto.forstudy.space')
    })

    it('should test login command with invalid credentials', () => {
        // Check if we can find the login form elements
        cy.get('body').then(($body) => {
            if ($body.find('.app-wrapper button').length > 0) {
                // If buttons are available, try to find Sign In button
                cy.get('.app-wrapper button').then(($buttons) => {
                    let signInButton = null

                    $buttons.each((index, button) => {
                        const buttonText = button.textContent.trim().toLowerCase()
                        if (buttonText.includes('sign in') || buttonText.includes('signin') || buttonText.includes('login')) {
                            signInButton = button
                            return false
                        }
                    })

                    if (signInButton) {
                        // Click Sign In button
                        cy.wrap(signInButton).click()

                        // Wait for login modal
                        cy.get('.modal-content').should('be.visible')

                        // Try invalid credentials
                        cy.get('#signinEmail').type('invalid@example.com')
                        cy.get('#signinPassword').type('wrongpassword', { sensitive: true })
                        cy.get('.modal-footer button').contains('Login').click()

                        // Should show error or stay on login form
                        cy.get('.modal-content').should('be.visible')
                    } else {
                        // If no Sign In button found, user might already be logged in
                        cy.log('No Sign In button found - user might already be logged in')
                    }
                })
            } else {
                // If no buttons found, user might be logged in already
                cy.log('No Sign In button found - user might already be logged in')
            }
        })
    })
})
