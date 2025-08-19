export default class FuelExpensesPage {
    openFuelTabForCar({ brand, model }) {
        cy.contains('.car, .car-item, .car-card, .panel', brand, { matchCase: false }).as('carCard')
        cy.get('@carCard').should('be.visible')

        cy.get('@carCard').within(() => {
            cy.contains('a,button', /fuel/i).should('be.visible').click()
        })
        cy.get('body').should('contain.text', 'Fuel')
    }

    addExpense({ liters, totalCost, date, mileage }) {
        const modal = '.modal-content:visible, [role="dialog"]:visible'
        cy.get(modal).should('be.visible')

        // Optional: select fuel type if present (do not fail if absent)
        cy.get('body').then(($body) => {
            const $sel = $body.find('select[name="fuelType"], select#addExpenseFuelType')
            if ($sel.length) {
                cy.wrap($sel.eq(0)).should('be.visible').select(1)
            }
        })

        cy.get(modal).find('input#addExpenseLiters, input[name="liters"], input[placeholder*="liter"]').first()
            .should('be.visible').clear()
        cy.get(modal).find('input#addExpenseLiters, input[name="liters"], input[placeholder*="liter"]').first()
            .type(String(liters))

        cy.get(modal).find('input#addExpenseTotalCost, input[name="totalCost"], input[placeholder*="cost"]').first()
            .should('be.visible').clear()
        cy.get(modal).find('input#addExpenseTotalCost, input[name="totalCost"], input[placeholder*="cost"]').first()
            .type(String(totalCost))

        cy.get(modal).find('input#addExpenseDate, input[name="date"], input[type="date"]').first()
            .should('be.visible').then($date => {
                const toYYYYMMDD = (d) => {
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
                const toDDMMYYYY = (d) => {
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

                const isHtml5 = ($date.attr('type') || '').toLowerCase() === 'date'
                const value = isHtml5 ? toYYYYMMDD(date) : toDDMMYYYY(date)

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

        cy.get(modal).find('input#addExpenseMileage, input[name="mileage"]').first()
            .should('be.visible').clear()
        cy.get(modal).find('input#addExpenseMileage, input[name="mileage"]').first()
            .type(String(mileage))

        // Submit: find and click the Add button
        cy.get(modal).then(($modal) => {
            // Try exact selector first
            let $btn = $modal.find('.modal-footer.d-flex.justify-content-end > button.btn.btn-primary:visible:enabled')

            if ($btn.length === 0) {
                // Fallback: same without :enabled
                $btn = $modal.find('.modal-footer.d-flex.justify-content-end > button.btn.btn-primary:visible')
            }

            if ($btn.length === 0) {
                // Last resort: any button with text Add
                $btn = $modal.find('button:visible').filter((i, el) => /^add$/i.test(el.textContent?.trim() || ''))
            }

            if ($btn.length > 0) {
                cy.wrap($btn.eq(0)).should('be.visible').click()
            } else {
                // If no button found, try clicking by text
                cy.wrap($modal).contains('button', /^add$/i).should('be.visible').click()
            }
        })

        // Wait for modal to close (success)
        cy.get('.modal-content, [role="dialog"]').should('not.exist')
    }

    assertExpenseExists({ liters, totalCost }) {
        cy.get('body').should('contain.text', String(liters))
        cy.get('body').should('contain.text', String(totalCost))
    }
}


