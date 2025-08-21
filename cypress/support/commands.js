// Custom login command for QAuto application
Cypress.Commands.add('login', (email, password) => {
    cy.visit('https://guest:welcome2qauto@qauto.forstudy.space/')

    // Wait for page to load
    cy.get('body').should('be.visible')

    // Check if user is already logged in
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

                    // Wait for login modal to appear
                    cy.get('.modal-content').should('be.visible')

                    // Fill in email
                    cy.get('#signinEmail').type(email)

                    // Fill in password with sensitive option to hide in logs
                    cy.get('#signinPassword').type(password, { sensitive: true })

                    // Click Login button
                    cy.get('.modal-footer button').contains('Login').click()

                    // Verify successful login by checking if user is redirected to main page
                    cy.url().should('include', 'qauto.forstudy.space')
                    cy.get('body').should('not.contain', 'Sign In')
                } else {
                    // If no Sign In button found, user might already be logged in
                    cy.log('No Sign In button found - user might already be logged in')
                    cy.url().should('include', 'qauto.forstudy.space')
                }
            })
        } else {
            // If no buttons found, user might be logged in already
            cy.log('No Sign In button found - user might already be logged in')
            cy.url().should('include', 'qauto.forstudy.space')
        }
    })
})

// Dedicated login for qauto CLI reporters task (isolated, does not affect legacy tests)
Cypress.Commands.add('qautoLogin', (email, password) => {
    const userEmail = email || Cypress.env('userEmail')
    const userPassword = password || Cypress.env('userPassword')

    cy.visit('/')
    cy.get('body').should('be.visible')

    cy.get('body').then(($body) => {
        const signInElement = $body
            .find('a, button')
            .toArray()
            .find((el) => /sign\s*in|signin|login/i.test(el.textContent?.trim() || ''))

        if (signInElement) {
            cy.wrap(signInElement).click()
            cy.get('.modal-content, [role="dialog"]').should('be.visible')
            cy.get('#signinEmail, input[name="email"]').first().type(userEmail)
            cy.get('#signinPassword, input[name="password"]').first().type(userPassword, { sensitive: true })
            cy.contains('.modal-footer button, .modal-content button, [role="dialog"] button, button', /login/i).click({ force: true })
            cy.get('body').should('not.contain.text', 'Sign In')
        } else {
            cy.log('Sign In control not found - assuming already logged in')
            cy.get('body').should('be.visible')
        }
    })
})

// Override type command to hide passwords in logs
Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
    // If sensitive: false is explicitly specified, show password in logs
    if (options && options.sensitive === false) {
        // Enable standard log to display password
        options.log = true
        return originalFn(element, text, options)
    }

    // If sensitive: true is specified or not specified, hide password
    if (options && options.sensitive) {
        // turn off original log
        options.log = false
        // create our own log with masked message
        Cypress.log({
            $el: element,
            name: 'type',
            message: '*'.repeat(text.length),
        })
    }

    return originalFn(element, text, options)
})