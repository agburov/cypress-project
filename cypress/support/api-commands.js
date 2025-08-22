// Create expense via API
Cypress.Commands.add('createExpenseViaAPI', (carId, expenseData) => {
    // Convert date format from DD.MM.YYYY to YYYY-MM-DD for API
    const convertDateForAPI = (dateString) => {
        const parts = dateString.split('.')
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`
        }
        return dateString
    }

    const expensePayload = {
        carId: carId,
        liters: expenseData.liters,
        totalCost: expenseData.totalCost,
        reportedAt: convertDateForAPI(expenseData.date),
        mileage: expenseData.mileage,
        forceMileage: false
    }

    cy.log(`Creating expense for car ${carId} with payload:`, expensePayload)

    return cy.request({
        method: 'POST',
        url: 'https://qauto.forstudy.space/api/expenses',
        headers: { 'Content-Type': 'application/json' },
        body: expensePayload
    })
})

// Get cars list via API
Cypress.Commands.add('getCarsViaAPI', () => {
    return cy.request({
        method: 'GET',
        url: 'https://qauto.forstudy.space/api/cars',
        headers: { 'Content-Type': 'application/json' }
    })
})

// Get expenses for a specific car via API
Cypress.Commands.add('getExpensesViaAPI', (carId, page = 1) => {
    return cy.request({
        method: 'GET',
        url: `https://qauto.forstudy.space/api/expenses?carId=${carId}&page=${page}`,
        headers: { 'Content-Type': 'application/json' }
    })
})

// Delete a car via API (for cleanup purposes)
Cypress.Commands.add('deleteCarViaAPI', (carId) => {
    return cy.request({
        method: 'DELETE',
        url: `https://qauto.forstudy.space/api/cars/${carId}`,
        headers: { 'Content-Type': 'application/json' }
    })
})

// Delete an expense via API (for cleanup purposes)
Cypress.Commands.add('deleteExpenseViaAPI', (expenseId) => {
    return cy.request({
        method: 'DELETE',
        url: `https://qauto.forstudy.space/api/expenses/${expenseId}`,
        headers: { 'Content-Type': 'application/json' }
    })
})
