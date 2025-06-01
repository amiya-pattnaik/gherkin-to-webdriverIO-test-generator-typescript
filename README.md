[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://webdriver.io/)
[![Automation Level](https://img.shields.io/badge/automation-100%25-success)](https://webdriver.io/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.x-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with ❤️](https://img.shields.io/badge/made%20with-%E2%9D%A4-red)](#)

# 🤖 wdio-testgen-from-gherkin-ts 

> CLI tool to generate WebdriverIO Page Objects, utilize AI/NLP for Selector Name, Method Name Inference, and generate Mocha Specs from Gherkin `.feature` files.

> 🚀. What It Does:

1. Generate Step Maps: Parses Gherkin feature files to produce structured .stepMap.json files which contains - `action`, `selectorName`, `selector`, `fallbackSelector`, `note`.

2. Generate Tests: Uses the .stepMap.json to generate:
    - `WebdriverIO-compatible Page Object Model (POM) classes.`
    - `Mocha-based test specs.`

---

## 📦 Installation

### Option 1: Clone for local development

```bash
git clone https://github.com/amiya-pattnaik/wdio-testgen-from-gherkin-ts.git

cd wdio-testgen-from-gherkin-ts

npm install
```

### Option 2: Install from NPM

```bash
npm i wdio-testgen-from-gherkin-ts -D 
```

---

## 🧭 Directory Structure

```
project-root/
├── features/                   # Gherkin .feature files (user input / source file)
├── stepMaps/                   # Auto-generated .stepMap.json files
├── test/                 
│   ├── pageobjects/            # Auto-generated WebdriverIO tests Page Object Model classes
│   └── specs/                  # Auto-generated Mocha test specs
├── src/
│   ├── cli.ts                  # Main CLI logic 
│   ├── generateStepsMap.ts     # Feature-to-stepMap generator
│   ├── generateTestsFromMap.ts # stepMap-to-page/spec generator
│   ├── utils.ts                # Helper methods
│   └── config.ts               # Paths, fallback selectors, aliases
│   └── __tests__/              # Unit tests (Vitest)
├── testgen.ts                  # CLI entry point
│── tsconfig.json               # TypeScript configuration
│── vitest.config.ts            # Vitest unit testing configuration - Optional
│── wdio.config.ts              # WebdriverIO configuration
├── package.json                # Scripts and dependencies
├── selector-aliases.json       # Optional user-defined selector overrides the primary selector

Note: Above directory structure when using Option 1: Clone for local development
```

---

## 🚀 CLI Usage

Ensure you have a `features/` folder in your root directory with Gherkin `.feature` files.

### One-time setup:
```bash
chmod +x testgen.ts
npm link     # If fails, try: sudo npm link
```

> ✅ Prerequisite: `tsx` must be installed globally
```bash
npm install -g tsx
```

### Now run from anywhere:
```bash
testgen steps --all
testgen tests --file login.stepMap.json
testgen run --report        # ⬅️ Runs tests and generate allure report
testgen run --report-only   # ⬅️ Generate report without rerunning tests
```

### Generate step maps from `.feature` files
```bash
testgen steps --all
```
This creates a `stepMaps/` folder with corresponding `.stepMap.json` files.

### Generate Page Object classes and Mocha specs
```bash
testgen tests --all
```
This generates a `test/` folder with:
- `test/pageobjects/*.page.ts`
- `test/specs/*.spec.ts`

> ✅ Skipping logic is built in — to overwrite existing files, use `--force`.

### Watch mode
```bash
testgen steps --all --watch
```
Watches for `.feature` file changes.

## 🧑‍💻 Programmatic Usage
You can also use this in a `.ts` file:

```ts
import { processSteps, processTests } from 'wdio-testgen-from-gherkin-ts';

processSteps({ all: true, force: true, verbose: true });
processTests({ all: true, force: true, verbose: true });
```
Run it with:
```bash
npx tsx mytest.ts
```

### Available Options
Both `processSteps()` and `processTests()` accept:
- `all: true` – generate for all files
- `file: ['filename']` – generate for specific file
- `force: true` – overwrite if file exists
- `dryRun: true` – preview output only
- `watch: true` – auto-regenerate on file changes
- `verbose: true` – detailed logs

## 🗂 Folder Structure Assumption
Your root folder should contain:
```
features/              # Gherkin feature files
stepMaps/              # Will be generated
selector-aliases.json  # Optional
```
The generated output goes to:
```
test/
  ├─ pageobjects/
  └─ specs/
```

---

## ⚙️ Available Commands & Flags

### `testgen steps`
| Flag         | Description                              |
|--------------|------------------------------------------|
| `--all`      | Parse all feature files                  |
| `--file`     | Parse specific feature file(s)           |
| `--watch`    | Watch for changes                        |
| `--verbose`  | Print detailed logs                      |
|`--dry-run`   | Show files that would be created         |
| `--force`    | Overwrite existing stepMap files         |

### `testgen tests`
| Flag         | Description                              |
|--------------|------------------------------------------|
| `--all`      | Generate tests for all step maps         |
| `--file`     | Generate tests for specific step maps    |
| `--watch`    | Watch and regenerate on change           |
| `--verbose`  | Print detailed logs                      |
| `--dry-run`  | Show files that would be created         |
| `--force`    | Overwrite existing test files            |

### `testgen run`
| Flag           | Description                                      |
|----------------|--------------------------------------------------|
| `--report`     | Generate Allure report after test run            |
| `--report-only`| Generate only Allure report (skip running tests) |
---

## 📁 Minimal Example

### `features/login.feature`
```gherkin
Feature: Login
  Scenario: Successful login
    Given I open the login page
    When I enter "admin" into the username field
    And I enter "adminpass" into the password field
    And I click the login button
    Then I should see the dashboard
```

### Generated: `stepMaps/login.stepMap.json`
```json
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
      "note": "adminpass"
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
      "selectorName": "dashboard",
      "selector": "[data-testid=\"dashboard\"]",
      "fallbackSelector": "",
      "note": ""
    }
  ]
}
```

> <span style="color: red;"> Note: Additionally, ensure that you update the relevant selector for the DOM element of your application under test after generating your JSON file. This will serve as your foundation, and your page objects and test spec files will be constructed based on this data.</span>

### Generated: `test/pageobjects/page.ts`
```ts
import { browser, $ } from '@wdio/globals';

export default class Page {
  open(path: string) {
    return browser.url(`https://the-internet.herokuapp.com/${path}`);
  }

  async trySelector(primarySelector: string, fallbackSelectors: string[]) {
    try {
      const primary = await $(primarySelector);
      if (await primary.isExisting() && await primary.isDisplayed()) {
        console.log(`✅ Using primary selector: ${primarySelector}`);
        return primary;
      }
    } catch (e) {
      console.warn(`⚠️ Failed to find element with primary selector: ${primarySelector}`);
    }
    for (const selector of fallbackSelectors) {
      try {
        const alt = await $(selector);
        if (await alt.isExisting() && await alt.isDisplayed()) {
          console.log(`↪️ Using fallback selector: ${selector}`);
          return alt;
        }
      } catch (e) {}
    }
    throw new Error(`❌ All selectors failed:\nPrimary: ${primarySelector}\nFallbacks: ${fallbackSelectors.join(', ')}`);
  }
}
```

### Generated: `test/pageobjects/login.page.ts`
```ts
import Page from './page';

class LoginPage extends Page {
  get userNameField() {
    return this.trySelector('[data-testid="userNameField"]', ['#username', 'input[name="username"]']);
  }

  get passwordField() {
    return this.trySelector('[data-testid="passwordField"]', ['#password', 'input[type="password"]']);
  }

  get loginButton() {
    return this.trySelector('[data-testid="loginButton"]', ['#login', 'button[type="submit"]']);
  }

  get dashboard() {
    return this.trySelector('[data-testid="dashboard"]', []);
  }

  async successfulLogin() {
    await (await this.userNameField).setValue('admin');
    await (await this.passwordField).setValue('adminpass');
    await (await this.loginButton).click();
    await expect(await this.dashboard).toBeDisplayed();
  }

  open(pathSegment: string = 'login') {
    return super.open(pathSegment);
  }
}

export default new LoginPage();
```

### Generated: `test/specs/login.spec.ts`
```ts
import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page';

describe('login feature tests', () => {
  it('successfulLogin', async () => {
    await LoginPage.open();
    await (await LoginPage.userNameField).setValue('admin');
    await (await LoginPage.passwordField).setValue('adminpass');
    await (await LoginPage.loginButton).click();
    await expect(await LoginPage.dashboard).toBeDisplayed();

    // Or simply use:
    // await LoginPage.successfulLogin();
  });
});
```
> <span style="color: red;"> Note: It is recommended to examine the generated code and implement any required adjustments to meet your needs, such as invoking methods from test spec files to the page class, incorporating reusable methods, renaming selector name, method name (if any) and managing your test data etc.</span>

---

## ✅ Unit Testing (optional)

```bash
npm run vitest
```
> Vitest is used for testing core logic in `src/utils.ts`.

---
## ✅ Features Implemented

### 🔁 1. **Two-Step Test Generation Flow**

- **Step 1**: Parse `.feature` files and generate scenario-wise `stepMap.json`.
- **Step 2**: Use `stepMap.json` to auto-generate:
  - WebdriverIO Page Object classes.
  - Mocha test spec files.


### 🧠 2. **AI/NLP-Driven Selector Name Inference**

- Uses the `compromise` NLP library to generate meaningful selector, method names based on verbs/nouns in step text.
- Example:  
  `"When user clicks login"` → `selectorName: "clicklogin"`

### 🧠 3. **Logical Selector Mapping with Fallback Selector**

- Applies regex-based matching to map common UI elements to logical names:
  - e.g., `username` → `userNameField`
  - `login` → `loginButton`

- Logical names are mapped to selector and fallbackSelector:
  ```json
  {
    "selector": "[data-testid=\"loginButton\"]",
    "fallbackSelector": "#login, button[type=\"submit\"]",
  }
  ```
  > <span style="color: green;">The `fallbackSelector` is a palce holder for containing more than one alternative selector. At the run time if the primary selector (i.e. "selector": "[data-testid=\"loginButton\"]") fails to locate the element, it will log `⚠️ Failed to find element with primary selector`, and then it will pick one of the alternative selctor mentioned in the `fallbackSelector`. If it finds the right selector it will log `↪️ Using fallback selector`. If none of the alternative selector found, then it will trrow error `❌ All selectors failed`.</span>

### 🔄 4. User-Defined Selector Aliases (Optional)

- Optional file: `selector-aliases.json`. When implemented it overrides the default primary selector ("selector": "#login-username",) of the generated .stepMap.json. If you don't need the selector-aliases.json then either you rename it or delete it from the root. 
```json
{
  "userNameField": "#login-username",
  "loginButton": "#login-btn"
}
```
`Priority Order:`

  1. Selector aliases (selector-aliases.json), if exists it will take the first priority over the regex-based default `selector` generated by tool.
  2. Fallback selector

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

> <span style="color: green;">Please be advised that any unrecognized actions have been commented out in the generated code for your review. Should you wish to include any additional actions, kindly refer to the source code (src\\) and incorporate the necessary actions, which is quite straightforward. You may utilize any WebdriverIO commands as needed.</span>

---

## 🧰 Troubleshooting

**Error:** `command not found: testgen`  
✅ Run `npm link` again inside the project root.

**Error:** `env: tsx: No such file or directory`  
✅ Install `tsx` globally: `npm install -g tsx`

**Error:** `ENOENT: no such file or directory, open 'package.json'`  
✅ You’re running `npm run` outside the project — run from root.

---

🤝 Contributions

For extension, PRs and suggestions, feel free to fork or connect.

Happy testing! 🚀
