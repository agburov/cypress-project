export default class FuelExpensesPage {
    // Selectors as properties
    carCardSelector = '.car, .car-item, .car-card, .panel'
    fuelTypeSelectSelector = 'select[name="fuelType"], select#addExpenseFuelType'
    modalSelector = '.modal-content:visible, [role="dialog"]:visible'
    litersInputSelector = 'input#addExpenseLiters, input[name="liters"], input[placeholder*="liter"]'
    totalCostInputSelector = 'input#addExpenseTotalCost, input[name="totalCost"], input[placeholder*="cost"]'
    dateInputSelector = 'input#addExpenseDate, input[name="date"], input[type="date"]'
    mileageInputSelector = 'input#addExpenseMileage, input[name="mileage"]'
    addPrimaryButtonSelector = '.modal-footer.d-flex.justify-content-end > button.btn.btn-primary'

    // Element getters
    carCard(brand) {
        return cy.contains(this.carCardSelector, brand, { matchCase: false })
    }

    fuelTabButton() {
        return cy.contains('a,button', /fuel/i)
    }

    modal() {
        return cy.get(this.modalSelector)
    }

    fuelTypeSelectOptional($scope) {
        return $scope.find(this.fuelTypeSelectSelector)
    }

    litersInput() {
        return this.modal().find(this.litersInputSelector).first()
    }

    totalCostInput() {
        return this.modal().find(this.totalCostInputSelector).first()
    }

    dateInput() {
        return this.modal().find(this.dateInputSelector).first()
    }

    mileageInput() {
        return this.modal().find(this.mileageInputSelector).first()
    }

    addPrimaryButtonWithin($modal) {
        // Prefer explicit button in modal footer
        let $btn = $modal.find(`${this.addPrimaryButtonSelector}:visible:enabled`)
        if ($btn.length === 0) {
            $btn = $modal.find(`${this.addPrimaryButtonSelector}:visible`)
        }
        if ($btn.length === 0) {
            $btn = $modal.find('button:visible').filter((i, el) => /^add$/i.test(el.textContent?.trim() || ''))
        }
        return $btn
    }

    // Navigation
    openFuelTabForCar({ brand, model }) {
        this.carCard(brand).should('be.visible').within(() => {
            this.fuelTabButton().should('be.visible').click()
        })
        cy.get('body').should('contain.text', 'Fuel')
    }

    // Actions
    addExpense({ liters, totalCost, date, mileage }) {
        this.modal().should('be.visible')

        // Optional: select fuel type if present (do not fail if absent)
        cy.get('body').then(($body) => {
            const $sel = this.fuelTypeSelectOptional($body)
            if ($sel.length) {
                cy.wrap($sel.eq(0)).should('be.visible').select(1)
            }
        })

        this.litersInput().should('be.visible').clear()
        this.litersInput().type(String(liters))

        this.totalCostInput().should('be.visible').clear()
        this.totalCostInput().type(String(totalCost))

        this.dateInput().should('be.visible').then(($date) => {
            const isHtml5 = (($date.attr('type') || '').toLowerCase() === 'date')
            const value = isHtml5 ? FuelExpensesPage.toYYYYMMDD(date) : FuelExpensesPage.toDDMMYYYY(date)
            if (isHtml5) {
                cy.wrap($date)
                    .invoke('val', value)
                    .trigger('input')
                    .trigger('change')
            } else {
                cy.wrap($date)
                    .clear()
                    .type('{selectall}{backspace}')
                    .type(value)
                    .trigger('input')
                    .trigger('change')
            }
        })

        this.mileageInput().should('be.visible').clear()
        this.mileageInput().type(String(mileage))

        // Submit: find and click the Add button
        this.modal().then(($modal) => {
            const $btn = this.addPrimaryButtonWithin($modal)
            if ($btn.length > 0) {
                cy.wrap($btn.eq(0)).should('be.visible').click()
            } else {
                cy.wrap($modal).contains('button', /^add$/i).should('be.visible').click()
            }
        })

        // Wait for modal to close (success)
        cy.get('.modal-content, [role="dialog"]').should('not.exist')
    }

    // Assertions
    assertExpenseExists({ liters, totalCost }) {
        cy.get('body').should('contain.text', String(liters))
        cy.get('body').should('contain.text', String(totalCost))
    }

    // Utilities
    static toYYYYMMDD(d) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d
        const m = d.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)
        if (m) {
            const dd = m[1].padStart(2, '0')
            const mm = m[2].padStart(2, '0')
            const yyyy = m[3]
            return `${yyyy}-${mm}-${dd}`
        }
        return d
    }

    static toDDMMYYYY(d) {
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(d)) return d
        const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/)
        if (m) {
            return `${m[3]}.${m[2]}.${m[1]}`
        }
        const m2 = d.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)
        if (m2) {
            const dd = m2[1].padStart(2, '0')
            const mm = m2[2].padStart(2, '0')
            const yyyy = m2[3]
            return `${dd}.${mm}.${yyyy}`
        }
        return d
    }
}
