# 🤖 Gherkin To WebdriverIO Test Generator With TypeScript

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://webdriver.io/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Automation Level](https://img.shields.io/badge/automation-100%25-success)](https://webdriver.io/)
[![Made with ❤️](https://img.shields.io/badge/made%20with-%E2%9D%A4-red)](#)

Automatically generate **WebdriverIO Page Object classes, AI/NLP-Driven Selector Name Inference** and **Mocha test specs** from Gherkin `.feature` files — reducing manual effort, improving consistency, and speeding up QA automation 🚀. It works in two main steps:

1. Generate Step Maps: Parses Gherkin feature files to produce structured .stepMap.json files which contains - `action`, `selectorName`, `selector`, `fallbackSelector`, `note`.

2. Generate Tests: Uses the .stepMap.json to generate:
    - `WebdriverIO-compatible Page Object Model (POM) classes.`
    - `Mocha-based test specs.`
---

📂 Directory Structure
```
project-root/
├── features/               # Input Gherkin feature files
├── stepMaps/               # Auto-generatedstep stepMap.json (intermediate)
├── test/
│   ├── pageobjects/        # Generated Page Object classes
│   └── specs/              # Generated Mocha/WebdriverIO test specs 
├── selector-aliases.json   # Optional user-defined selector overrides
├── generateStepMap.ts      # StepMap generator script, Step 1: Feature → stepMap.json 
├── generateTestsFromMap.ts # PageObject + test spec generator script, Step 2: stepMap.json → WebdriverIO tests
└── README.md
```
---

## ✅ Features Implemented

### 🔁 1. **Two-Step Test Generation Flow**

- **Step 1**: Parse `.feature` files and generate scenario-wise `stepMap.json`.
- **Step 2**: Use `stepMap.json` to auto-generate:
  - WebdriverIO Page Object classes.
  - Mocha test spec files.
---

### 🧠 2. **AI/NLP-Driven Selector Name Inference**

- Uses the `compromise` NLP library to generate meaningful selector names based on verbs/nouns in step text.
- Example:  
  `"When user clicks login"` → `selectorName: "clicklogin"`
---

### 🧠 3. **Logical Selector Mapping with Fallbacks**

- Applies regex-based matching to map common UI elements to logical names:
  - e.g., `username` → `userNameField`
  - `login` → `loginButton`

- Logical names are mapped to **standard fallback selectors**:
  ```json
  {
    "selector": "[data-testid=\"loginButton\"]",
    "fallbackSelector": "#login, button[type=\"submit\"]",
  }
---

### 🔄 4. User-Defined Selector Aliases (Optional)

- Optional file: selector-aliases.json. When implemented it overrides the default selector (primary)
```json
{
  "userNameField": "#login-username",
  "loginButton": "#login-btn"
}
```
- Priority Order:
    1. Selector alias (if exists)
    2. Fallback selector
---

### 🧪 5. Action Inference Engine

Automatically extracts values from steps:
```gherkin
When user enters "admin" in the username field
```
`→ action: "setValue", note: "admin"`

| Gherkin Step Example    | Action | Notes  |
| ----------------------- | -------| ------ |
| When user enters "admin"  | setValue  | "admin" |
| When user clicks login    | Click     |
| Then user should see the welcome message     | assertVisible    |
| Then title should be "Dashboard"    | assertTitle     | "Dashboard" |
| Then url should contain "success"   | assertUrlContains    |

#### 🧠 Supported Actions Example

Supports a wide range of actions: `setValue`, `click`, `selectDropdown`, `uploadFile`, `hover`, `clearText`, s`crollTo`, `assertVisible`, `assertText`, `assertEnabled`, `assertDisabled`, `assertTitle`, `assertUrlContains`, etc.

| Action    | Description |
| -------- | ------- |
| setValue         | Sets input value    |
| click           | Clicks on the element     |
| hover           | Hovers over an element   |
| doubleClick     | Performs a double-click    |
| selectDropdown  | Selects dropdown option by visible text    |
| uploadFile      | Uploads a file     |
| scrollTo        | Scrolls element into view    |
| assertVisible   | Validates visibility of element    |
| assertText      | Checks element text    |
| clearText       | Clears input field     |
| assertEnabled   | Validates element is enabled    |
| assertDisabled  | Validates element is disabled    |
| assertTitle     | Validates page title    |
| assertUrlContains | Checks partial match on URL     |
| waitForVisible    | Waits until element is visible    |

> Please be advised that any unrecognized actions have been commented out in the generated code for your review. Should you wish to include any additional actions, kindly refer to the source code and incorporate the necessary actions, which is quite straightforward. You may utilize any WebdriverIO commands as needed.
---

### 🧱 6. Generated Page Object Structure

 - One method per scenario
 - Clean method naming (camelCase)
 - Clean and aligned with official [WebdriverIO structure](https://webdriver.io/docs/pageobjects/).

🧪 Example:

📘 Sample Feature File (features/login.feature)

Feature : Login
```gherkin
Feature: login
  Scenario: This is my successful login
    Given I open the login page
    When I enter username in the username field
    When I enter password in the password field
    And I click on the login button
    Then I should see "Welcome Tom!" in the welcome message
```

📦 Generated Step Map (stepMaps/login.stepMap.json)

```JSON
{
  "Successful login": [
    {
      "action": "setValue",
      "selectorName": "userNameField",
      "selector": "[data-testid=\"userNameField\"]",
      "fallbackSelector": "#username, input[name=\"username\"]",
      "note": "admin"
    },
    {
      "action": "setValue",
      "selectorName": "passwordField",
      "selector": "[data-testid=\"passwordField\"]",
      "fallbackSelector": "#password, input[type=\"password\"]",
      "note": "password123"
    },
    {
      "action": "click",
      "selectorName": "loginButton",
      "selector": "[data-testid=\"loginButton\"]",
      "fallbackSelector": "#login, button[type=\"submit\"]",
      "note": ""
    },
    {
      "action": "assertVisible",
      "selectorName": "welcomeBanner",
      "selector": "[data-testid=\"welcomeBanner\"]",
      "fallbackSelector": "#welcome-message, .welcome",
      "note": ""
    }
  ]
}
```

🧱 Generated Page Object (test/pageobjects/login.page.ts)

```ts
import Page from './page.ts';

class LoginPage extends Page {
  async successfulLogin() {
    await this.trySelector('userNameField').setValue("admin");
    await this.trySelector('passwordField').setValue("password123");
    await this.trySelector('loginButton').click();
    await expect(this.trySelector('welcomeBanner')).toBeDisplayed();
  }

  open() {
    return super.open('/login');
  }
}

export default new LoginPage();
```

🧪 Generated Spec File (test/specs/login.spec.ts)
```ts
import loginPage from '../pageobjects/login.page.ts';

describe('Login', () => {
  it('Successful login', async () => {
    await loginPage.open();
    await loginPage.successfulLogin();
  });
});

```
---

### 🛠 Prerequisites

 - Node.js
 - TypeScript

 Install Required Packages
  - `npm install`
---

### 🚀 Usage
Step 1: Generate step map
- `npm run generate:stepmap`

Step 2: Generate WebdriverIO Page Object classes and Mocha test specs
- `npm run generate:tests`

Step 3: To execute Mocha test specs 
- `npm run test:local`

Step 4: To generate test report
- `npm run allure:report`
---

🤝 Contributions
For extension, PRs and suggestions, feel free to fork or connect.

📂 License
MIT © 2025

