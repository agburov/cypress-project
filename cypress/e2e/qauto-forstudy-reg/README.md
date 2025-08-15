# QAuto Registration Tests

This directory contains comprehensive tests for the QAuto application registration functionality.

## Test Coverage

The registration tests cover the following requirements based on the provided specifications:

### Form Field Validation
- **Name field**: Minimum 2 characters, maximum 20 characters required
- **Last Name field**: Minimum 2 characters, maximum 20 characters required  
- **Email field**: Valid email format required (must contain @ symbol and domain)
- **Password field**: Minimum 8 characters, maximum 15 characters, must contain at least 1 digit, 1 uppercase letter, and 1 lowercase letter
- **Repeat Password field**: Must match the password field

### Test Scenarios
1. **Form Display**: Verifies all registration form fields are present
2. **Empty Form Validation**: Tests submission of empty form and error display
3. **Field-specific Validation**: Individual validation for each form field with min/max length requirements
4. **Successful Registration**: Complete registration flow with valid data
5. **Password Matching**: Verifies that both password fields contain the same value

**Note**: Login testing is covered by:
- **Custom command testing** in `login-command.cy.js` tests the `cy.login()` command implementation

## Custom Commands

### Login Command
A custom `login()` command has been implemented in `cypress/support/commands.js` that:
- Navigates to the application
- Checks if user is already logged in
- If not logged in, clicks the "Sign In" button
- Enters email and password
- Submits the login form
- Verifies successful login

**Usage:**
```javascript
cy.login('user@example.com', 'password123')
```

**Testing:**
The `cy.login()` command is thoroughly tested in `login-command.cy.js` to ensure:
- Command works correctly with valid credentials
- Command handles invalid credentials appropriately
- Command is reliable across different test scenarios
- Command integrates properly with the application's login flow

### Type Command Override
The `type` command has been overridden to hide passwords in Cypress logs when using the `{ sensitive: true }` option.

Usage:
```javascript
// Hide password in logs
cy.get('#password').type('superSecret123', { sensitive: true })

// Show password in logs (for debugging)
cy.get('#password').type('superSecret123', { sensitive: false })
```

## Test Files

### registration.cy.js
**Main registration test suite covering:**
- Form validation for all fields
- Field length requirements (min/max)
- Password complexity requirements
- Successful registration flow
- Password field matching verification

### login-command.cy.js
**Dedicated tests for the custom `cy.login()` command functionality:**
- **Custom login command testing**: Tests the `cy.login()` command implementation
- **Invalid credentials handling**: Tests how the command handles invalid login attempts
- **Command isolation**: Tests the command in isolation from registration flow
- **Command reliability**: Ensures the custom command works consistently across different scenarios

**Note**: This file specifically tests the custom `cy.login()` command implementation. Registration tests focus solely on registration functionality.

## Key Differences Between Test Files

| Aspect | registration.cy.js | login-command.cy.js |
|--------|-------------------|---------------------|
| **Purpose** | Tests registration functionality | Tests custom `cy.login()` command |
| **Scope** | Registration form validation and flow | Command implementation testing |
| **Dependencies** | Independent tests | Requires registration setup |
| **Focus** | User interface and form validation | Command reliability and behavior |

## Running the Tests

To run the registration tests:

```bash
# Run all registration tests
npx cypress run --spec "cypress/e2e/qauto-forstudy-reg/registration.cy.js"

# Run login command tests
npx cypress run --spec "cypress/e2e/qauto-forstudy-reg/login-command.cy.js"

# Run all tests one by one
npx cypress run --spec "cypress/e2e/qauto-forstudy-reg/*.cy.js"

# Run tests in interactive mode
npx cypress open
```

## Test Data

The tests generate unique email addresses using timestamps and random numbers to avoid conflicts when running multiple times:

```javascript
const generateUniqueEmail = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    return `testuser${timestamp}${random}@example.com`
}
```

This ensures that:
- Each test run uses different email addresses
- No conflicts occur when running tests multiple times
- Tests can be run in parallel without interference
- Email format follows standard conventions

## Requirements Met

✅ **Registration Form Validation**: All form fields are validated according to requirements
✅ **Field Length Limits**: Name and Last Name fields respect 20 character maximum
✅ **Password Complexity**: Password validation includes length (8-15), digit, uppercase, and lowercase requirements
✅ **Custom Login Command**: Implemented `login()` command for UI-based authentication
✅ **Password Logging Security**: Overridden `type` command to hide passwords in logs
✅ **Comprehensive Test Coverage**: Tests cover all validation scenarios and edge cases
✅ **Unique Test Data**: Email addresses are generated uniquely for each test to avoid conflicts
✅ **Proper Locators**: Using `.app-wrapper button` for button selection
✅ **Password Matching**: Verification that both password fields contain identical values
✅ **Focused Testing**: Tests focus solely on registration requirements without unnecessary complexity

## Notes

- Tests use the authentication URL: `https://guest:welcome2qauto@qauto.forstudy.space/`
- Password fields use the `{ sensitive: true }` option to hide values in logs by default
- Tests handle both successful and error scenarios for robust coverage
- Each test is independent and can be run individually
- Email addresses are automatically generated to prevent registration conflicts
- Button selection uses `.app-wrapper button` locator for better accuracy
- Password validation includes verification that both password fields match

## Login Testing Strategy

The project implements **focused login testing** through:

**Custom Command Testing** (`login-command.cy.js`):
- Tests the `cy.login()` command implementation
- Verifies command reliability and error handling
- Ensures the custom command works consistently across scenarios

This approach ensures comprehensive coverage of the custom login command while keeping registration tests focused solely on registration functionality as required by the assignment.
