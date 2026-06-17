# PORA QA Automation Class — Session Notes

**Date:** Tuesday, 17 June 2026  
**Instructor:** Ayooluwa Olorunfemi  
**Project Name:** `pora-qa-automation`  
**Test Application:** [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/)

---

## 📌 Overview

This repository contains end-to-end (E2E) automation test scripts built with **Cypress** as part of the PORA QA Automation class. The goal of this session was to introduce students to real-world QA automation concepts — from setting up a project from scratch to writing structured, maintainable test scripts.

---

## 🗂️ Project Structure

```
PORA QA AUTOMATION/
├── cypress/
│   ├── e2e/
│   │   ├── authentication.cy.js      # Login test suite
│   │   └── dataManagement.cy.js      # My Info (Personal Data) test suite
│   ├── fixtures/
│   │   └── ourData.json              # Shared test data & CSS selectors
│   └── screenshots/                  # Auto-generated on test failure
├── cypress.config.js                 # Cypress global configuration
├── env.js                            # Local secrets file (gitignored)
├── .gitignore                        # Git ignore rules
├── package.json                      # Node project config & dependencies
└── README.md                         # This file
```

---

## ✅ Areas Covered in This Session

### 1. 🔧 Project Setup & Tooling

- **Node.js & npm** — Required runtime to install packages
- **Cypress** — The E2E testing framework used in this project
  ```bash
  npm install cypress --save-dev
  ```
- **Opening Cypress:**
  ```bash
  npx cypress open      # Interactive UI mode (use for development)
  npx cypress run       # Headless mode (use for CI/CD pipelines)
  ```
- **`cypress.config.js`** — The Cypress configuration file. We configured:
  - `baseUrl` — The root URL of the app under test, so tests only need `cy.visit('/')` instead of the full URL
  - `viewportWidth` / `viewportHeight` — Sets browser window size for consistent test runs
  - `defaultCommandTimeout` — How long Cypress waits for elements to appear before failing (set to 10,000ms = 10 seconds)

---

### 2. 📁 Fixtures — Centralising Test Data

**File:** `cypress/fixtures/ourData.json`

Fixtures are JSON files that hold reusable test data and CSS selectors. Instead of hardcoding values inside each test, we load them from one central place. This makes tests easier to maintain — if a selector changes, you only update it in one file.

**How to load a fixture in a test:**
```javascript
cy.fixture('ourData').then((data) => {
    usernameField = data.username_field
    myUserName = data.username
    // ...
})
```

**Why we use fixtures:**
- Keeps test logic separate from test data
- Makes tests reusable and maintainable
- Enables easy updates without touching test code

---

### 3. 🔐 Secret / Sensitive Data Handling

**File:** `env.js` *(gitignored — never committed to GitHub)*

We discussed that passwords and sensitive credentials should **never** be stored in version-controlled fixture files. Instead, we created a local `env.js` file to hold secrets:

```javascript
// env.js
const secrets = {
    "password": "admin123",
}
module.exports = secrets
```

This file is listed in `.gitignore` so it never gets pushed to GitHub. Each team member creates their own local copy.

**Importing secrets in a test file:**
```javascript
import secrets from "../../env"
// Then use: secrets.password
```

**Why this matters:**
- Prevents credential leaks in public repositories
- Mirrors real-world CI/CD secret management (e.g. GitHub Secrets, environment variables)

---

### 4. 🧪 Test Structure — `describe` and `it` blocks

Every Cypress test file follows this structure:

```javascript
describe('Feature Name', () => {
    // Variables scoped to the entire suite
    let myVariable

    // Runs before EACH test in this suite
    beforeEach(() => {
        cy.visit('/')
        cy.fixture('ourData').then((data) => {
            myVariable = data.someKey
        })
    })

    // Individual test case
    it('does something specific', () => {
        // Test steps here
    })
})
```

- **`describe`** — Groups related tests together into a **test suite** (usually one feature per file)
- **`it`** — A single test case
- **`beforeEach`** — Runs setup steps before every test (e.g. visiting the page, loading fixture data)
- **`it.only`** — Runs only that specific test and skips others (useful for debugging)

---

### 5. 🔑 Authentication Test Suite

**File:** `cypress/e2e/authentication.cy.js`

We covered three login-related test cases:

#### Test 1: Validate the site is up
```javascript
it('VALIDATES THAT WEBSITE IS UP AND RUNNING', () => {
    cy.url().should('include', '/login')
    cy.get('.orangehrm-login-forgot > .oxd-text')
        .contains('Forgot your password?')
        .should('be.visible')
})
```

#### Test 2: Successful login (E2E)
```javascript
it('Performs successful login', () => {
    cy.get(usernameField).type(myUserName)
    cy.get(passwordField).type(myPassword)
    cy.contains(login_btn_selector, loginButton).click({ timeout: 10000 })
    cy.url().should('include', '/dashboard')
})
```

#### Test 3: Network interception (API Integration test)
```javascript
it('Login with valid credentials', () => {
    cy.intercept('POST', `**/${login_endpoint}`).as('login_valid_request')
    cy.get(usernameField).type(myUserName)
    cy.get(passwordField).type(myPassword)
    cy.contains(login_btn_selector, loginButton).click()
    cy.wait('@login_valid_request').then((interception) => {
        expect(interception.response.statusCode).to.eql(200 || 302 || 201)
    })
})
```

**Key concept:** `cy.intercept()` lets us spy on or stub real HTTP requests made by the application. This turns a UI test into a **system integration test** — we verify not just the visual outcome, but that the backend API responded correctly.

---

### 6. 📝 Data Management Test Suite

**File:** `cypress/e2e/dataManagement.cy.js`

We built a test that navigates to the **My Info** section of OrangeHRM and fills in a user's personal details form. This test demonstrates:

- **Navigating within an app** after login
- **Filling form fields** with typed data
- **Interacting with custom dropdowns** (not standard HTML `<select>` elements)
- **Clicking radio buttons**
- **Saving a form** and asserting a success response

#### Key concepts demonstrated:

**Separating selectors from test logic** — all CSS selectors live in `ourData.json`, variables are loaded in `beforeEach`, and test steps only reference the variable names:
```javascript
cy.get(firstName).clear().type(values[0].firstName)
```

**Inline test data object** — a `values` array holds the data to type into each field:
```javascript
let values = [
    {
        firstName: 'Ayooluwa',
        middleName: 'Oluwafemi',
        lastName: 'Olorunfemi',
        nickname: 'Ayo300',
        // ...
    }
]
```

**Custom dropdown interaction** — OrangeHRM uses JavaScript-powered custom dropdowns, not standard `<select>` elements. Standard `cy.select()` will **not** work. The correct approach is:
```javascript
// 1. Click the dropdown to open it
cy.get(Nationality).click()
// 2. Find the option in the dropdown list and click it
cy.get('.oxd-select-dropdown').contains('Nigeria').click()
```

---

### 7. 🌐 Git & Version Control

We used Git throughout the session to save our work:

```bash
git status                 # See what has changed
git add .                  # Stage all changes
git commit -m "message"    # Commit with a descriptive message
git push                   # Push to GitHub (origin/main)
```

**Important rule:** The `env.js` file is in `.gitignore` — this means `git add .` will **never** include it. Every developer creates their own local `env.js` with their credentials.

---

## 🚀 How to Get Started (For Students)

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18+ recommended)
- A code editor (e.g. [VS Code](https://code.visualstudio.com/))
- Git installed

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/sphinx010/PORA_AUTO_CLASS.git
   cd PORA_AUTO_CLASS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create your local secrets file**
   Create a file called `env.js` in the project root (this is gitignored, so you must create it yourself):
   ```javascript
   const secrets = {
       "password": "admin123",
   }
   module.exports = secrets
   ```

4. **Open Cypress**
   ```bash
   npx cypress open
   ```

5. **Select E2E Testing** in the Cypress UI, choose a browser, and click on any spec file to run it.

---

## 🧠 Key Takeaways

| Concept | What We Learned |
|---|---|
| Fixtures | Centralise test data in JSON files to avoid hardcoding |
| `beforeEach` | Run repeated setup steps automatically before each test |
| `cy.intercept()` | Spy on network requests to test API integration |
| Secret management | Keep credentials out of version control using a gitignored file |
| Custom dropdowns | Use `.click()` + `.contains()` instead of `.select()` |
| CSS selectors | Use attribute selectors (`[name='field']`) or class selectors (`.class-name`) to find elements |
| `describe` / `it` | Structure tests into logical suites and individual cases |
| Git workflow | `status → add → commit → push` |

---

## 📚 Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [OrangeHRM Demo App](https://opensource-demo.orangehrmlive.com/) — Username: `Admin`, Password: `admin123`
- [CSS Selectors Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
