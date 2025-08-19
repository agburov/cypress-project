export default class GaragePage {
    openGarage() {
        cy.contains('a,button', /garage/i).should('be.visible').click()
        cy.get('body').should('be.visible')
    }

    addCar({ brand, model, mileage }) {
        // Quick check: only cleanup if we're at capacity (25 cars)
        cy.get('body').then(($body) => {
            const carCount = $body.find('.icon.icon-edit').length
            if (carCount >= 25) {
                this.ensureCapacityAndCleanup(25)
            }
        })

        cy.contains('button, a', /add car/i).should('be.visible').click()
        cy.get('.modal-content').should('be.visible')

        // Fast form filling with proper waiting
        cy.get('select#addCarBrand, select[name="brand"]').first().should('be.visible').select(brand)
        cy.get('select#addCarModel, select[name="model"]').first().should('be.visible').select(model)
        cy.get('input#addCarMileage, input[name="mileage"]').first().should('be.visible').clear().type(String(mileage))

        cy.contains('.modal-content button, button, button', /^add$/i).should('be.visible').click()
        cy.get('.modal-content').should('not.exist')
    }

    assertCarExists({ brand, model }) {
        cy.get('body').should('contain.text', brand)
        cy.get('body').should('contain.text', model)
    }

    ensureCapacityAndCleanup(max = 25) {
        const editIconSelector = '.icon.icon-edit'

        const removeOneCar = () => {
            cy.get('body').then(($body) => {
                const $icons = $body.find(editIconSelector)
                if ($icons.length === 0) {
                    cy.log('All cars removed, cleanup complete')
                    return
                }

                cy.log(`Removing car ${$icons.length}/${max}`)

                // Click on the first edit icon
                cy.wrap($icons.eq(0)).should('be.visible').click()

                // Edit modal -> click "Remove car"
                cy.get('.modal-content').should('be.visible')
                cy.contains('.modal-content button, button', /remove car/i)
                    .should('be.visible').click()

                // Confirm modal -> click "Remove"
                cy.get('.modal-content').should('be.visible')
                cy.contains('.modal-content button, button', /^remove$/i)
                    .should('be.visible').click()

                // Wait until all modals are closed before next iteration
                cy.get('.modal-content, [role="dialog"]').should('not.exist')

                // Wait a bit for the page to update, then continue
                cy.wait(500)

                // Continue removing cars until none left
                if ($icons.length > 1) {
                    removeOneCar()
                }
            })
        }

        removeOneCar()
    }
}


