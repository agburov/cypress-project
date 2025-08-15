# QAuto Header and Footer Tests

This test suite verifies all header and footer elements of the QAuto application according to the assignment.

## Test Description

The tests include the following checks:

### Header Elements
- Find and verify header section
- Find and verify all header links
- **Count and verify header buttons** - checks buttons in `.hero-descriptor` section

### Footer Elements
- Find and verify footer section
- **Find and verify footer contact section links** - checks links in `#contactsSection`

## What the Tests Verify

### Header Buttons
- Counts buttons in `.hero-descriptor` section
- Shows text content of each button
- Verifies buttons are visible and have text

### Footer Contact Section Links
- Finds and verifies `#contactsSection` exists
- Counts all links (`#contactsSection a`)
- Shows text (if available) and href of each link
- Verifies links are visible and have href attributes
- **Note:** Text content is optional (for icon-only links), but href is required

## Running Tests

### Comand Line - UI Mode
```bash
npx cypress open
```

### From IDE - UI Mode (Recommended)
```bash
npm run cy:open
```

### Command Line
```bash
npx cypress run --spec "cypress/e2e/quauto-forstudy/qauto-header-footer.cy.js"
```

### Command Line with browser for debug
```bash
npx cypress run --spec "cypress/e2e/quauto-forstudy/qauto-header-footer.cy.js" --browser chrome --headed
```

## Configuration

Application URL is configured in `cypress.config.js`:
```javascript
baseUrl: 'https://guest:welcome2qauto@qauto.forstudy.space'
```

Authentication happens automatically through URL configuration.

## Requirements

- Node.js 14+
- Cypress 10+
- Internet access for external site testing

## Note

The test verifies the presence and functionality of all buttons in the header and links in the footer, counts buttons in the hero-descriptor section, and checks links in the footer contact section. The application URL is centralized in Cypress configuration for easy management.
