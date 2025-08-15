describe('QAuto Header and Footer Tests', () => {
    beforeEach(() => {
        // Navigate to the main page with authentication
        cy.visit('/')

        // Wait for page to load
        cy.get('body').should('be.visible')

        // Verify page loaded correctly
        cy.url().should('include', 'qauto.forstudy.space')
    })

    it('should find and verify header section', () => {
        // Check header exists and is visible
        cy.get('header').should('exist')
        cy.get('header').should('be.visible')
    })

    it('should find and verify all header links', () => {
        // Find all links in header
        cy.get('header a').should('exist')

        // Verify each link has href attribute and is visible
        cy.get('header a').each(($link) => {
            cy.wrap($link).should('have.attr', 'href')
            cy.wrap($link).should('be.visible')
        })
    })

    it('should count and verify header buttons', () => {
        // Find and count header buttons
        cy.get('.hero-descriptor button').then(($buttons) => {
            const buttonCount = $buttons.length
            cy.log(`Found ${buttonCount} header buttons`)

            // Verify buttons exist
            expect(buttonCount).to.be.greaterThan(0)

            // Check each button text and visibility
            $buttons.each((index, button) => {
                const $button = cy.wrap(button)
                $button.should('be.visible')

                // Get button text
                const buttonText = button.textContent.trim()
                cy.log(`Header button ${index + 1}: "${buttonText}"`)

                // Verify button has text
                expect(buttonText).to.not.be.empty
            })
        })
    })

    it('should find and verify footer section', () => {
        // Check footer exists and is visible
        cy.get('footer').should('exist')
        cy.get('footer').should('be.visible')
    })

    it('should find and verify footer contact section links', () => {
        // Find and verify footer contact section
        cy.get('#contactsSection').should('exist')
        cy.get('#contactsSection').should('be.visible')

        // Find all links in contact section
        cy.get('#contactsSection a').should('exist')

        // Count and verify each link
        cy.get('#contactsSection a').then(($links) => {
            const linkCount = $links.length
            cy.log(`Found ${linkCount} links in footer contact section`)

            // Verify links exist
            expect(linkCount).to.be.greaterThan(0)

            // Check each link
            $links.each((index, link) => {
                const $link = cy.wrap(link)
                $link.should('be.visible')
                $link.should('have.attr', 'href')

                // Get link text and href
                const linkText = link.textContent.trim()
                const linkHref = link.getAttribute('href')
                cy.log(`Footer contact link ${index + 1}: "${linkText || 'No text'}" -> ${linkHref}`)

                // Verify link has href (text can be empty for icon-only links)
                expect(linkHref).to.not.be.empty
            })
        })
    })
})
