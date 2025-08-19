// UI flow: login -> add car in Garage -> add fuel expense for created car

import GaragePage from './pages/GaragePage'
import FuelExpensesPage from './pages/FuelExpensesPage'

describe('Garage: add car and fuel expense', () => {
    let car
    let expense

    before(() => {
        cy.fixture('garage').then((data) => {
            car = data.car
            const d = new Date()
            const dd = String(d.getDate()).padStart(2, '0')
            const mm = String(d.getMonth() + 1).padStart(2, '0')
            const yyyy = d.getFullYear()
            const localDate = `${dd}.${mm}.${yyyy}`
            expense = { ...data.expense, date: localDate }
        })
    })

    beforeEach(() => {
        cy.visit('/')
    })

    it('should add a car and a fuel expense', () => {
        cy.qautoLogin()

        const garage = new GaragePage()
        garage.openGarage()
        garage.addCar(car)
        garage.assertCarExists(car)

        const fuel = new FuelExpensesPage()
        fuel.openFuelTabForCar(car)
        fuel.addExpense(expense)
        fuel.assertExpenseExists(expense)
    })
})


