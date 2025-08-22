# QAuto API Tests

Comprehensive API tests for QAuto application.

## 📋 Tests

1. **Car Creation Interception**
   - Intercepts `POST /api/cars`
   - Validates status code (201)
   - Saves created car ID

2. **Car Validation via API**
   - Uses `GET /api/cars`
   - Validates car data from UI

3. **Expense Creation via API**
   - Creates expense `POST /api/expenses`
   - Custom command `createExpenseViaAPI`
   - Validates response and saves expense ID

4. **Expense Validation**
   - Validates the same expense via API (`GET /api/expenses`)
   - Validates expense appears in UI

## 🚀 Running

### Headless Mode
```bash
npx cypress run --config-file cypress.config.qauto1.js --spec "cypress/e2e/qauto-api/api-tests.cy.js"
```

### Interactive Mode
```bash
npx cypress open --config-file cypress.config.qauto1.js
```

## 🛠 API Commands

- `createExpenseViaAPI(carId, expenseData)` - Create expense
- `getCarsViaAPI()` - Get cars list
- `getExpensesViaAPI(carId, page)` - Get expenses
- `deleteCarViaAPI(carId)` - Delete car
- `deleteExpenseViaAPI(expenseId)` - Delete expense

## 🎯 Features

- **Page Object Model**: Reuses existing classes
- **Smart Waits**: `cy.wait('@alias')` instead of `cy.wait(1000)`
- **Error Handling**: Graceful fallback for UI synchronization
- **Test Isolation**: Each test is independent
- **Logging**: Detailed logs for debugging
- **Cleanup**: Automatic cleanup of created data