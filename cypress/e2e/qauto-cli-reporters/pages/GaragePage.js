export default class GaragePage {
    // Selectors as properties
    garageLinkSelector = 'a,button'
    garageLinkText = /garage/i
    addCarButtonSelector = 'button, a'
    addCarButtonText = /add car/i
    modalSelector = '.modal-content'
    brandSelectSelector = 'select#addCarBrand, select[name="brand"]'
    modelSelectSelector = 'select#addCarModel, select[name="model"]'
    mileageInputSelector = 'input#addCarMileage, input[name="mileage"]'
    editIconSelector = '.icon.icon-edit'
    removeCarButtonText = /remove car/i
    removeConfirmButtonText = /^remove$/i

    // Element getters
    garageLink() {
        return cy.contains(this.garageLinkSelector, this.garageLinkText)
    }

    addCarButton() {
        return cy.contains(this.addCarButtonSelector, this.addCarButtonText)
    }

    modal() {
        return cy.get(this.modalSelector)
    }

    brandSelect() {
        return cy.get(this.brandSelectSelector).first()
    }

    modelSelect() {
        return cy.get(this.modelSelectSelector).first()
    }

    mileageInput() {
        return cy.get(this.mileageInputSelector).first()
    }

    editIconsInBody($body) {
        return $body.find(this.editIconSelector)
    }

    // Navigation
    openGarage() {
        this.garageLink().should('be.visible').click()
        cy.get('body').should('be.visible')
    }

    // Actions
    addCar({ brand, model, mileage }) {
        // Quick check: only cleanup if we're at capacity (25 cars)
        cy.get('body').then(($body) => {
            const carCount = this.editIconsInBody($body).length
            if (carCount >= 25) {
                this.ensureCapacityAndCleanup(25)
            }
        })

        this.addCarButton().should('be.visible').click()
        this.modal().should('be.visible')

        // Fast form filling with proper waiting
        this.brandSelect().should('be.visible').select(brand)
        this.modelSelect().should('be.visible').select(model)
        this.mileageInput().should('be.visible').clear().type(String(mileage))

        cy.contains('.modal-content button, button', /^add$/i).should('be.visible').click()
        this.modal().should('not.exist')
    }

    // Assertions
    assertCarExists({ brand, model }) {
        cy.get('body').should('contain.text', brand)
        cy.get('body').should('contain.text', model)
    }

    // Utilities
    ensureCapacityAndCleanup(max = 25) {
        const removeOneCar = () => {
            cy.get('body').then(($body) => {
                const $icons = this.editIconsInBody($body)
                if ($icons.length === 0) {
                    cy.log('All cars removed, cleanup complete')
                    return
                }

                cy.log(`Removing car ${$icons.length}/${max}`)

                // Click on the first edit icon
                cy.wrap($icons.eq(0)).should('be.visible').click()

                // Edit modal -> click "Remove car"
                this.modal().should('be.visible')
                cy.contains('.modal-content button, button', this.removeCarButtonText)
                    .should('be.visible').click()

                // Confirm modal -> click "Remove"
                this.modal().should('be.visible')
                cy.contains('.modal-content button, button', this.removeConfirmButtonText)
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
