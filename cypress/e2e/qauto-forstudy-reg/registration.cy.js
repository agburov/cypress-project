describe('QAuto Registration Tests', () => {
    // Function to generate a unique email
    const generateUniqueEmail = () => {
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 10000)
        return `testuser${timestamp}${random}@example.com`
    }

    beforeEach(() => {
        // Navigate to the application with authentication
        cy.visit('https://guest:welcome2qauto@qauto.forstudy.space/')

        // Wait for page to load
        cy.get('body').should('be.visible')

        // Verify page loaded correctly
        cy.url().should('include', 'qauto.forstudy.space')

        // Wait for buttons to be available and find the Sign Up button
        cy.get('.app-wrapper button').should('exist')

        // Click the "Sign up" button (only this variant as per requirement)
        cy.contains('.app-wrapper button', 'Sign up').click()

        // Wait for registration modal to appear
        cy.get('.modal-content').should('be.visible')

        // Alias commonly used elements
        cy.get('#signupName').as('signupName')
        cy.get('#signupLastName').as('signupLastName')
        cy.get('#signupEmail').as('signupEmail')
        cy.get('#signupPassword').as('signupPassword')
        cy.get('#signupRepeatPassword').as('signupRepeatPassword')
        cy.contains('.modal-footer button', 'Register').as('registerButton')
    })

    it('should display registration form with all required fields', () => {
        // Verify modal title
        cy.get('.modal-title').should('contain', 'Registration')

        // Check all form fields exist
        cy.get('@signupName').should('exist')
        cy.get('@signupLastName').should('exist')
        cy.get('@signupEmail').should('exist')
        cy.get('@signupPassword').should('exist')
        cy.get('@signupRepeatPassword').should('exist')

        // Check Register button exists
        cy.get('.modal-footer button').contains('Register').should('exist')
    })

    it('should validate empty form submission', () => {
        // Check that Register button is disabled when form is empty
        cy.get('@registerButton').should('be.disabled')

        // Try to submit empty form (should not be possible due to disabled button)
        // Instead, verify that all fields show validation errors when touched
        cy.get('@signupName').click().blur()
        cy.get('@signupName').should('have.class', 'is-invalid')

        cy.get('@signupLastName').click().blur()
        cy.get('@signupLastName').should('have.class', 'is-invalid')

        cy.get('@signupEmail').click().blur()
        cy.get('@signupEmail').should('have.class', 'is-invalid')

        cy.get('@signupPassword').click().blur()
        cy.get('@signupPassword').should('have.class', 'is-invalid')

        cy.get('@signupRepeatPassword').click().blur()
        cy.get('@signupRepeatPassword').should('have.class', 'is-invalid')
    })

    it('should validate name field requirements', () => {
        // Test empty name
        cy.get('@signupName').click().blur()
        cy.get('@signupName').should('have.class', 'is-invalid')

        // Test single character name
        cy.get('@signupName').clear().type('A')
        cy.get('@signupName').should('have.class', 'is-invalid')

        // Test valid name (2+ characters)
        cy.get('@signupName').clear().type('John')
        cy.get('@signupName').should('not.have.class', 'is-invalid')

        // Max length 20 characters should be valid
        cy.get('@signupName').clear().type('A'.repeat(20))
        cy.get('@signupName').should('not.have.class', 'is-invalid')
        cy.get('@signupName').invoke('val').should('have.length.at.most', 20)

        // 21 characters should be rejected (should show validation error)
        cy.get('@signupName').clear().type('A'.repeat(21))
        cy.get('@signupName').should('have.class', 'is-invalid')
    })

    it('should validate last name field requirements', () => {
        // Test empty last name
        cy.get('@signupLastName').click().blur()
        cy.get('@signupLastName').should('have.class', 'is-invalid')

        // Test single character last name
        cy.get('@signupLastName').clear().type('D')
        cy.get('@signupLastName').should('have.class', 'is-invalid')

        // Test valid last name (2+ characters)
        cy.get('@signupLastName').clear().type('Doe')
        cy.get('@signupLastName').should('not.have.class', 'is-invalid')

        // Max length 20 characters should be valid
        cy.get('@signupLastName').clear().type('B'.repeat(20))
        cy.get('@signupLastName').should('not.have.class', 'is-invalid')
        cy.get('@signupLastName').invoke('val').should('have.length.at.most', 20)

        // 21 characters should be rejected (should show validation error)
        cy.get('@signupLastName').clear().type('B'.repeat(21))
        cy.get('@signupLastName').should('have.class', 'is-invalid')
    })

    it('should validate email field requirements', () => {
        // Test empty email
        cy.get('@signupEmail').click().blur()
        cy.get('@signupEmail').should('have.class', 'is-invalid')

        // Test invalid email format
        cy.get('@signupEmail').clear().type('invalid-email')
        cy.get('@signupEmail').should('have.class', 'is-invalid')

        // Test email without @ symbol
        cy.get('@signupEmail').clear().type('testemail.com')
        cy.get('@signupEmail').should('have.class', 'is-invalid')

        // Test email without domain
        cy.get('@signupEmail').clear().type('test@')
        cy.get('@signupEmail').should('have.class', 'is-invalid')

        // Test valid email format
        cy.get('@signupEmail').clear().type('test@example.com')
        cy.get('@signupEmail').should('not.have.class', 'is-invalid')
    })

    it('should validate password field requirements', () => {
        // Empty -> invalid
        cy.get('@signupPassword').click().blur()
        cy.get('@signupPassword').should('have.class', 'is-invalid')

        // Less than 8 -> invalid
        cy.get('@signupPassword').clear().type('Abcde1', { sensitive: true }) // 6 chars
        cy.get('@signupPassword').should('have.class', 'is-invalid')

        // More than 15 -> invalid
        cy.get('@signupPassword').clear().type('Abcdefghijklmno1', { sensitive: true }) // 16+ with digit
        cy.get('@signupPassword').should('have.class', 'is-invalid')

        // Missing digit -> invalid
        cy.get('@signupPassword').clear().type('Abcdefgh', { sensitive: true }) // 8, no digit
        cy.get('@signupPassword').should('have.class', 'is-invalid')

        // Missing uppercase -> invalid
        cy.get('@signupPassword').clear().type('abcdefg1', { sensitive: true }) // 8, no uppercase
        cy.get('@signupPassword').should('have.class', 'is-invalid')

        // Missing lowercase -> invalid
        cy.get('@signupPassword').clear().type('ABCDEFG1', { sensitive: true }) // 8, no lowercase
        cy.get('@signupPassword').should('have.class', 'is-invalid')

        // Valid min (8): at least 1 digit, 1 upper, 1 lower
        cy.get('@signupPassword').clear().type('Abcdefg1', { sensitive: true })
        cy.get('@signupPassword').should('not.have.class', 'is-invalid')

        // Valid max (15): at least 1 digit, 1 upper, 1 lower
        cy.get('@signupPassword').clear().type('Abcdefghij1KLm', { sensitive: true }) // length 15
        cy.get('@signupPassword').should('not.have.class', 'is-invalid')
    })

    it('should validate repeat password field requirements', () => {
        // Clear both password fields first to ensure clean state
        cy.get('@signupPassword').clear()
        cy.get('@signupRepeatPassword').clear()

        // Test empty repeat password (should be invalid)
        cy.get('@signupRepeatPassword').click().blur()
        cy.get('@signupRepeatPassword').should('have.class', 'is-invalid')

        // Fill in a valid password first
        cy.get('@signupPassword').type('TestPassword123', { sensitive: true })

        // Test non-matching password (should be invalid)
        cy.get('@signupRepeatPassword').clear().type('DifferentPassword123', { sensitive: true })
        cy.get('@signupRepeatPassword').should('have.class', 'is-invalid')

        // Test matching password (should be valid) - it uses sensitive: false to see the password in logs
        cy.get('@signupRepeatPassword').clear().type('TestPassword123', { sensitive: false })
        cy.get('@signupRepeatPassword').should('not.have.class', 'is-invalid')
    })

    it('should verify password fields match', () => {
        // Fill in both password fields with the same value
        cy.get('@signupPassword').type('TestPassword123', { sensitive: false })
        cy.get('@signupRepeatPassword').type('TestPassword123', { sensitive: false })

        // Verify both password fields contain identical values
        cy.get('@signupPassword').should('have.value', 'TestPassword123')
        cy.get('@signupRepeatPassword').should('have.value', 'TestPassword123')
    })

    it('should successfully register with valid data', () => {
        // Generate unique email to avoid conflicts
        const email = generateUniqueEmail()

        // Fill in all fields with valid data
        cy.get('@signupName').type('John')
        cy.get('@signupLastName').type('Doe')
        cy.get('@signupEmail').type(email)
        cy.get('@signupPassword').type('TestPassword123', { sensitive: true })
        cy.get('@signupRepeatPassword').type('TestPassword123', { sensitive: true })

        // Submit the form
        cy.get('@registerButton').click()

        // Verify successful registration (modal should close and user should be logged in)
        cy.get('.modal-content').should('not.exist')

        // Verify user is on main page
        cy.url().should('include', 'qauto.forstudy.space')

        // Verify user is logged in (Sign In button should not be visible)
        cy.get('body').should('not.contain', 'Sign In')
    })
})
