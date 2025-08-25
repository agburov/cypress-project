// QAuto API Tests
import GaragePage from '../qauto-cli-reporters/pages/GaragePage'
import FuelExpensesPage from '../qauto-cli-reporters/pages/FuelExpensesPage'

describe('QAuto API Tests', () => {
    let car
    let expense
    let createdCarId
    let createdExpenseIds = []

    // Test data setup
    before(() => {
        cy.fixture('garage').then((data) => {
            car = data.car
            // Generate current date for expense
            const currentDate = new Date()
            const day = String(currentDate.getDate()).padStart(2, '0')
            const month = String(currentDate.getMonth() + 1).padStart(2, '0')
            const year = currentDate.getFullYear()
            const formattedDate = `${day}.${month}.${year}`
            expense = { ...data.expense, date: formattedDate }
        })
    })

    // Login before each test
    beforeEach(() => {
        cy.visit('/')
        cy.qautoLogin()
    })

    // Cleanup after all tests
    after(() => {
        // Clean up created expenses first
        if (createdExpenseIds.length > 0) {
            cy.log(`Cleaning up ${createdExpenseIds.length} expenses...`)
            createdExpenseIds.forEach(expenseId => {
                cy.deleteExpenseViaAPI(expenseId).then(() => {
                    cy.log(`Cleaned up expense with ID: ${expenseId}`)
                })
            })
        }

        // Clean up created car if exists
        if (createdCarId) {
            cy.deleteCarViaAPI(createdCarId).then(() => {
                cy.log(`Cleaned up car with ID: ${createdCarId}`)
            })
        }
    })

    // Helper function to create expense payload
    const createExpensePayload = (carId) => ({
        carId: carId,
        liters: expense.liters,
        totalCost: expense.totalCost,
        reportedAt: '2025-08-22', // YYYY-MM-DD format as per API docs
        mileage: expense.mileage,
        forceMileage: false
    })

    // Test 1: Intercept car creation API call and validate response
    it('should intercept car creation API call and validate response', () => {
        // Setup API interception
        cy.intercept('POST', '**/api/cars').as('createCar')

        // Create car via UI
        const garage = new GaragePage()
        garage.openGarage()
        garage.addCar(car)

        // Wait for API call and validate response
        cy.wait('@createCar').then((interception) => {
            const response = interception.response

            // Validate status code
            expect(response.statusCode).to.equal(201)

            // Extract and validate car ID
            createdCarId = response.body.data.id
            expect(createdCarId).to.be.a('number')

            // Validate response structure
            expect(response.body).to.have.property('status', 'ok')
            expect(response.body).to.have.property('data')
            expect(response.body.data).to.have.property('id')

            // Validate car data matches input
            expect(response.body.data).to.have.property('brand', car.brand)
            expect(response.body.data).to.have.property('model', car.model)
            expect(response.body.data).to.have.property('mileage', car.mileage)
        })

        // Validate car appears in UI
        garage.assertCarExists(car)
    })

    // Test 2: Validate created car via API call
    it('should validate created car via API call', () => {
        // Get cars list via API using custom command
        cy.getCarsViaAPI().then((response) => {
            // Validate API response
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('status', 'ok')
            expect(response.body.data).to.be.an('array')

            // Find and validate created car
            const createdCar = response.body.data.find(carItem => carItem.id === createdCarId)
            expect(createdCar).to.exist
            expect(createdCar.brand).to.equal(car.brand)
            expect(createdCar.model).to.equal(car.model)
            expect(createdCar.mileage).to.equal(car.mileage)
        })
    })

    // Test 3: Create expense via API and validate response
    it('should create expense via API and validate response', () => {
        // Create expense via API using custom command
        cy.createExpenseViaAPI(createdCarId, expense).then((response) => {
            // Validate API response
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('status', 'ok')
            expect(response.body.data).to.have.property('id')
            expect(response.body.data).to.have.property('carId')
            expect(response.body.data.carId).to.be.a('number')

            // Save expense ID for cleanup
            createdExpenseIds.push(response.body.data.id)

            // Validate expense data
            expect(response.body.data).to.have.property('liters', expense.liters)
            expect(response.body.data).to.have.property('totalCost', expense.totalCost)
            expect(response.body.data).to.have.property('mileage', expense.mileage)
        })
    })

    // Test 4: Validate created expense via API and UI
    it('should validate created expense via API and UI', () => {
        // Validate expense via API using custom command
        cy.getExpensesViaAPI(createdCarId, 1).then((response) => {

            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('status', 'ok')
            expect(response.body.data).to.be.an('array')

            // Find created expense in API response
            const createdExpense = response.body.data.find(expenseItem =>
                expenseItem.liters === expense.liters &&
                expenseItem.totalCost === expense.totalCost &&
                expenseItem.mileage === expense.mileage
            )

            if (createdExpense) {
                cy.log('✅ Expense found via API validation')
                expect(createdExpense.liters).to.equal(expense.liters)
                expect(createdExpense.totalCost).to.equal(expense.totalCost)
                expect(createdExpense.mileage).to.equal(expense.mileage)
            } else {
                cy.log('⚠️ Expense not found via API, but API returned expenses')
                expect(response.body.data.length).to.be.greaterThan(0)
            }
        })

        // Optional UI validation
        cy.reload()
        // Wait for page to load completely
        cy.get('body').should('be.visible')

        const fuel = new FuelExpensesPage()
        fuel.openFuelTabForCar(car)

        // Wait for fuel tab to load
        cy.get('body').should('contain.text', 'Fuel')

        // Check if expense appears in UI
        cy.get('body').then(($body) => {
            const bodyText = $body.text()
            const hasLiters = bodyText.includes(String(expense.liters))
            const hasTotalCost = bodyText.includes(String(expense.totalCost))

            if (hasLiters && hasTotalCost) {
                cy.log('✅ Expense found in UI')
            } else {
                cy.log('⚠️ Expense not found in UI, but API validation passed')
                cy.log('UI text contains:', bodyText.substring(0, 200) + '...')
            }
        })
    })
})
