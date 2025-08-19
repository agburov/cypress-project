# QAuto Garage & Fuel Expenses Tests

This directory contains end-to-end tests for QAuto applications (qauto and qauto2) covering the Garage flow and Fuel Expenses using the Page Object Model (POM).

## Test Coverage

1. Garage: create a car (brand, model, mileage)
2. Fuel: add a fuel expense (liters, total cost, date, mileage) for the created car
3. Limit protection: if there are 25 cars (max capacity), automatically delete all cars (Edit → Remove car → Remove) and then create a new one
4. Date validation: expense date is set to today (dd.MM.yyyy), which satisfies both constraints: it is not less than the car creation date and is strictly less than tomorrow

## Custom Commands

### qautoLogin Command
A dedicated `qautoLogin()` command is used to log in with credentials from the active Cypress configuration.

Usage:
```javascript
cy.qautoLogin()
```

Configuration-driven credentials:
- `cypress.config.qauto1.js` — baseUrl and `env.userEmail` / `env.userPassword` for qauto
- `cypress.config.qauto2.js` — baseUrl and `env.userEmail` / `env.userPassword` for qauto2

### Type Command Override
The `type` command is overridden to hide passwords in Cypress logs when using `{ sensitive: true }`.

Usage:
```javascript
// hides password in logs
cy.get('#signinPassword').type('Password123', { sensitive: true })

// shows password in logs (for debugging)
cy.get('#signinPassword').type('Password123', { sensitive: false })
```

## Test Files

### garage.cy.js
Main E2E suite that:
- logs in via `cy.qautoLogin()`
- opens Garage, creates a car, asserts its presence
- opens Fuel tab, creates a fuel expense, asserts its presence

### Page Objects
- `pages/GaragePage.js` — navigation to Garage, car creation, assertions, capacity cleanup (25 cars)
- `pages/FuelExpensesPage.js` — navigation to Fuel tab, expense creation, assertions

## Running the Tests

Run with qauto1 (forstudy):
```bash
npm run cy:open:qauto1   # interactive
npm run cy:run:qauto1    # headless
```

Run with qauto2 (forstudy2):
```bash
npm run cy:open:qauto2   # interactive
npm run cy:run:qauto2    # headless
```

## Reports (Mochawesome)

Generate a combined HTML report:
```bash
npm run report:merge && npm run report:generate
```

Outputs:
- HTML: `cypress/reports/mochawesome/index.html`
- merged JSON: `cypress/reports/mochawesome/mochawesome.json`

## Cleanup

Artifacts cleanup:
```bash
npm run cy:clean        # screenshots + videos
npm run cy:clean:all    # screenshots + videos + reports (recreates reports folder)
npm run reports:clean:all
npm run report:clean    # only merged report JSON
```

## Test Data

Fixture:
- `cypress/fixtures/garage.json` — car and fuel expense defaults (date is assigned dynamically to today in the test)

Dynamic date:
- expense date is set to today in the spec to satisfy validation (≥ car creation date and < tomorrow)

## Requirements Met

✅ Separate configs for qauto and qauto2 with baseUrl and user creds
✅ Scripts to run tests per configuration (open and headless)
✅ Mochawesome is configured in the main Cypress config; merge and HTML generation scripts added
✅ Garage create and Fuel expense flows are covered via POM
✅ Tests pass for both configurations
✅ Logic to handle 25-cars limit to keep flows stable

## Notes

- Tests rely on credentials stored in Cypress configs; do not hardcode them in specs
- Modal interactions are scoped to visible modals for stability
- Date formatting adapts to input type (HTML5 date vs text input)
