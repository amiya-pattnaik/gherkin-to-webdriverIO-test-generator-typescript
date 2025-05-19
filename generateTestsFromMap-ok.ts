// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const stepMapDir = path.join(__dirname, 'stepMaps');
// const pageObjectsDir = path.join(__dirname, 'test/pageobjects');
// const testsDir = path.join(__dirname, 'test/specs');
// const basePagePath = path.join(pageObjectsDir, 'page.ts');


// if (!fs.existsSync(pageObjectsDir)) fs.mkdirSync(pageObjectsDir, { recursive: true });
// if (!fs.existsSync(testsDir)) fs.mkdirSync(testsDir, { recursive: true });

// // Generate base Page.ts if not present
// if (!fs.existsSync(basePagePath)) {
//   const basePageContent = `import { browser } from '@wdio/globals';

// export default class Page {
//   open(path: string) {
//     return browser.url(\`https://the-internet.herokuapp.com/\${path}\`);
//   }
// }`;
//   fs.writeFileSync(basePagePath, basePageContent, 'utf-8');
//   console.log('✅ Generated: page.ts (base page object)');
// }

// function capitalize(str: string) {
//   return str.charAt(0).toUpperCase() + str.slice(1);
// }

// function toCamelCase(str: string) {
//   return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
// }

// function escapeSelectorForTS(str: string) {
//   return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
// }

// function generatePageObjectClass(featureName: string, scenarios: any): string {
//   const className = capitalize(toCamelCase(featureName)) + 'Page';
//   const selectorsMap = new Map<string, string>();
//   const scenarioMethods: string[] = [];
//   let usesPath = false;

//   for (const scenarioName in scenarios) {
//     const steps = scenarios[scenarioName];
//     const methodLines: string[] = [];

//     steps.forEach(step => {
//       const { selectorName, selector, action, note } = step;
//       if (selectorName && selector && !selectorsMap.has(selectorName)) {
//         selectorsMap.set(selectorName, escapeSelectorForTS(selector));
//       }

//       let line = '';
//       switch (action) {
//         case 'setText':
//           line = `    await this.${selectorName}.setValue('${note}');`;
//           break;
//         case 'click':
//           line = `    await this.${selectorName}.click();`;
//           break;
//         case 'hover':
//           line = `    await this.${selectorName}.moveTo();`;
//           break;
//         case 'uploadFile':
//           usesPath = true;
//           line = `    const filePath = path.join(__dirname, '../../uploads/${note}');
//     const remoteFilePath = await browser.uploadFile(filePath);
//     await this.${selectorName}.setValue(remoteFilePath);`;
//           break;
//         case 'assertVisible':
//           line = `    await expect(this.${selectorName}).toBeDisplayed();`;
//           break;
//         default:
//           line = `    // Unknown action: ${action}`;
//       }

//       methodLines.push(line);
//     });

//     const methodName = toCamelCase(scenarioName);
//     scenarioMethods.push(`  async ${methodName}(): Promise<void> {\n${methodLines.join('\n')}\n  }`);
//   }

//   const selectorGetters = Array.from(selectorsMap.entries())
//     .map(([name, selector]) => `  get ${name}() {\n    return $('${selector}');\n  }`)
//     .join('\n\n');

//   return `${usesPath ? "import path from 'path';\n" : ''}import Page from './page';

// /**
//  * Page Object for ${featureName}
//  */
// class ${className} extends Page {
// ${selectorGetters}

// ${scenarioMethods.join('\n\n')}

//   open() {
//     return super.open('/');
//   }
// }

// export default new ${className}();
// `;
// }

// function generateTestFile(featureName: string, scenarios: any): string {
//   const className = toCamelCase(featureName);
//   const importPath = `../pageobjects/${className}.page`;

//   let scenarioBlocks = '';
//   for (const scenarioName in scenarios) {
//     const methodName = toCamelCase(scenarioName);
//     scenarioBlocks += `  it('${scenarioName}', async () => {
//     await ${className}.open();
//     await ${className}.${methodName}();
//   });\n\n`;
//   }

//   return `import { expect } from '@wdio/globals';
// import ${className} from '${importPath}';

// describe('${featureName}', () => {
// ${scenarioBlocks}});`;
// }

// function generateTests() {
//   const files = fs.readdirSync(stepMapDir);
//   for (const file of files) {
//     if (!file.endsWith('.stepMap.json')) continue;

//     const content = fs.readFileSync(path.join(stepMapDir, file), 'utf-8');
//     const scenarios = JSON.parse(content);
//     const featureName = path.basename(file, '.stepMap.json');

//     const pageObjectCode = generatePageObjectClass(featureName, scenarios);
//     const testCode = generateTestFile(featureName, scenarios);

//     const poFileName = `${toCamelCase(featureName)}.page.ts`;
//     const testFileName = `${toCamelCase(featureName)}.test.ts`;

//     fs.writeFileSync(path.join(pageObjectsDir, poFileName), pageObjectCode, 'utf-8');
//     fs.writeFileSync(path.join(testsDir, testFileName), testCode, 'utf-8');
//     console.log(`✅ Generated: ${poFileName} + ${testFileName}`);
//   }
// }

// generateTests();






// // generateTestsFromMap.ts
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const stepMapDir = path.join(__dirname, 'stepMaps');
// const pageObjectsDir = path.join(__dirname, 'test/pageobjects');
// const testsDir = path.join(__dirname, 'test/specs');
// const basePagePath = path.join(pageObjectsDir, 'page.ts');

// if (!fs.existsSync(pageObjectsDir)) fs.mkdirSync(pageObjectsDir, { recursive: true });
// if (!fs.existsSync(testsDir)) fs.mkdirSync(testsDir, { recursive: true });

// // Generate base Page.ts if not present
// if (!fs.existsSync(basePagePath)) {
//   const basePageContent = `import { browser } from '@wdio/globals';

// export default class Page {
//   open(path: string) {
//     return browser.url(\`https://the-internet.herokuapp.com/\${path}\`);
//   }
// }`;
//   fs.writeFileSync(basePagePath, basePageContent, 'utf-8');
//   console.log('✅ Generated: page.ts (base page object)');
// }

// function capitalize(str: string) {
//   return str.charAt(0).toUpperCase() + str.slice(1);
// }

// function toCamelCase(str: string) {
//   return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
// }

// function escapeSelector(str: string) {
//   return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
// }

// function generatePageObjectClass(featureName: string, scenarios: any): string {
//   const className = capitalize(toCamelCase(featureName)) + 'Page';
//   const selectorsMap = new Map<string, string>();
//   const scenarioMethods: string[] = [];
//   let usesPath = false;

//   for (const scenarioName in scenarios) {
//     const steps = scenarios[scenarioName];
//     const methodLines: string[] = [];

//     steps.forEach(step => {
//       const { selectorName, selector, action, note } = step;
//       if (selectorName && selector && !selectorsMap.has(selectorName)) {
//         selectorsMap.set(selectorName, escapeSelector(selector));
//       }

//       let line = '';
//       switch (action) {
//         case 'setText':
//           line = `    await this.${selectorName}.setValue('${note}');`;
//           break;
//         case 'click':
//           line = `    await this.${selectorName}.click();`;
//           break;
//         case 'hover':
//           line = `    await this.${selectorName}.moveTo();`;
//           break;
//         case 'doubleClick':
//           line = `    await this.${selectorName}.doubleClick();`;
//           break;
//         case 'selectDropdown':
//           line = `    await this.${selectorName}.selectByVisibleText('${note}');`;
//           break;
//         case 'uploadFile':
//           usesPath = true;
//           line = `    const filePath = path.join(__dirname, '../../uploads/${note}');
//     const remoteFilePath = await browser.uploadFile(filePath);
//     await this.${selectorName}.setValue(remoteFilePath);`;
//           break;
//         case 'scrollTo':
//           line = `    await this.${selectorName}.scrollIntoView();`;
//           break;
//         case 'clearText':
//           line = `    await this.${selectorName}.clearValue();`;
//           break;
//         case 'waitForVisible':
//           line = `    await this.${selectorName}.waitForDisplayed();`;
//           break;
//         case 'assertVisible':
//           line = `    await expect(this.${selectorName}).toBeDisplayed();`;
//           break;
//         case 'assertText':
//           line = `    await expect(this.${selectorName}).toHaveText('${note}');`;
//           break;
//         case 'assertEnabled':
//           line = `    await expect(this.${selectorName}).toBeEnabled();`;
//           break;
//         case 'assertDisabled':
//           line = `    await expect(this.${selectorName}).toBeDisabled();`;
//           break;
//         case 'assertTitle':
//           line = `    await expect(browser).toHaveTitle('${note}');`;
//           break;
//         case 'assertUrlContains':
//           line = `    await expect(browser).toHaveUrl(expect.stringContaining('${note}'));`;
//           break;
//         default:
//           line = `    // Unknown action: ${action}`;
//       }

//       methodLines.push(line);
//     });

//     const methodName = toCamelCase(scenarioName);
//     scenarioMethods.push(`  async ${methodName}(): Promise<void> {\n${methodLines.join('\n')}\n  }`);
//   }

//   const selectorGetters = Array.from(selectorsMap.entries())
//     .map(([name, selector]) => `  get ${name}() {\n    return $('${selector}');\n  }`)
//     .join('\n\n');

//   return `${usesPath ? "import path from 'path';\n" : ''}import Page from './page';

// /**
//  * Page Object for ${featureName}
//  */
// class ${className} extends Page {
// ${selectorGetters}

// ${scenarioMethods.join('\n\n')}

//   open() {
//     return super.open('/');
//   }
// }

// export default new ${className}();
// `;
// }

// function generateTestFile(featureName: string, scenarios: any): string {
//   const className = toCamelCase(featureName);
//   const importPath = `../pageobjects/${className}.page`;

//   let scenarioBlocks = '';
//   for (const scenarioName in scenarios) {
//     const methodName = toCamelCase(scenarioName);
//     scenarioBlocks += `  it('${scenarioName}', async () => {
//     await ${className}.open();
//     await ${className}.${methodName}();
//   });\n\n`;
//   }

//   return `import { expect } from '@wdio/globals';
// import ${className} from '${importPath}';

// describe('${featureName}', () => {
// ${scenarioBlocks}});`;
// }

// function generateTests() {
//   const files = fs.readdirSync(stepMapDir);
//   for (const file of files) {
//     if (!file.endsWith('.stepMap.json')) continue;

//     const content = fs.readFileSync(path.join(stepMapDir, file), 'utf-8');
//     const scenarios = JSON.parse(content);
//     const featureName = path.basename(file, '.stepMap.json');

//     const pageObjectCode = generatePageObjectClass(featureName, scenarios);
//     const testCode = generateTestFile(featureName, scenarios);

//     const poFileName = `${toCamelCase(featureName)}.page.ts`;
//     const testFileName = `${toCamelCase(featureName)}.test.ts`;

//     fs.writeFileSync(path.join(pageObjectsDir, poFileName), pageObjectCode, 'utf-8');
//     fs.writeFileSync(path.join(testsDir, testFileName), testCode, 'utf-8');
//     console.log(`✅ Generated: ${poFileName} + ${testFileName}`);
//   }
// }

// generateTests();






//// below code was before May 10th

// // generateTestsFromMap.ts
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const stepMapDir = path.join(__dirname, 'stepMaps');
// const pageObjectsDir = path.join(__dirname, 'test/pageobjects');
// const specsDir = path.join(__dirname, 'test/specs');
// const basePagePath = path.join(pageObjectsDir, 'page.ts');


// if (!fs.existsSync(pageObjectsDir)) fs.mkdirSync(pageObjectsDir, { recursive: true });
// if (!fs.existsSync(specsDir)) fs.mkdirSync(specsDir, { recursive: true });

// const stepFiles = fs.readdirSync(stepMapDir).filter(f => f.endsWith('.stepMap.json'));

// function toCamelCase(name: string): string {
//   return name.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
// }

// function escapeSelector(str: string): string {
//   return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
// }

// const actionMethodMap: Record<string, (selector: string, note: string) => string> = {
//   setText: (selector, note) => `await this.${selector}.setValue('${note}');`,
//   click: (selector) => `await this.${selector}.click();`,
//   hover: (selector) => `await this.${selector}.moveTo();`,
//   uploadFile: (selector, note) => `const filePath = path.join(__dirname, '../../uploads/${note}');\n    const remoteFilePath = await browser.uploadFile(filePath);\n    await this.${selector}.setValue(remoteFilePath);`,
//   selectDropdown: (selector, note) => `await this.${selector}.selectByVisibleText('${note}');`,
//   scrollTo: (selector) => `await this.${selector}.scrollIntoView();`,
//   clearText: (selector) => `await this.${selector}.clearValue();`,
//   waitForVisible: (selector) => `await this.${selector}.waitForDisplayed();`,
//   assertVisible: (selector) => `await expect(this.${selector}).toBeDisplayed();`,
//   assertText: (selector, note) => `await expect(this.${selector}).toHaveText('${note}');`,
//   assertEnabled: (selector) => `await expect(this.${selector}).toBeEnabled();`,
//   assertDisabled: (selector) => `await expect(this.${selector}).toBeDisabled();`,
//   assertTitle: (_, note) => `await expect(browser).toHaveTitle('${note}');`,
//   assertUrlContains: (_, note) => `await expect(browser).toHaveUrl(expect.stringContaining('${note}'));`
// };

// function generatePageObjectClass(featureName: string, scenarios: any): string {
//   const className = toCamelCase(featureName) + 'Page';
//   const selectorsMap = new Map<string, string>();
//   const scenarioMethods: string[] = [];
//   let usesPath = false;

//   for (const scenarioName in scenarios) {
//     const steps = scenarios[scenarioName];
//     const methodLines: string[] = [];

//     steps.forEach(step => {
//       const { selectorName, selector, action, note } = step;
//       if (selectorName && selector && !selectorsMap.has(selectorName)) {
//         selectorsMap.set(selectorName, escapeSelector(selector));
//       }
//       const actionFn = actionMethodMap[action];
//       if (actionFn) {
//         const line = actionFn(selectorName, note || '');
//         methodLines.push(`    ${line}`);
//       } else {
//         methodLines.push(`    // Unknown action: ${action}`);
//       }
//       if (action === 'uploadFile') usesPath = true;
//     });

//     const methodName = toCamelCase(scenarioName);
//     scenarioMethods.push(`  async ${methodName}(): Promise<void> {\n${methodLines.join('\n')}\n  }`);
//   }

//   const selectorGetters = Array.from(selectorsMap.entries())
//     .map(([name, selector]) => `  get ${name}() {\n    return super.trySelector('${selector}');\n  }`)
//     .join('\n\n');

//   return `${usesPath ? "import path from 'path';\n" : ''}import Page from './page';

// /**
//  * Page Object for ${featureName}
//  */
// class ${className} extends Page {
// ${selectorGetters}

// ${scenarioMethods.join('\n\n')}

//   open() {
//     return super.open('/');
//   }
// }

// export default new ${className}();
// `;
// }

// function generateTestFile(featureName: string, scenarios: any): string {
//   const className = toCamelCase(featureName);
//   const importPath = `../pageobjects/${className}.page`;

//   let scenarioBlocks = '';
//   for (const scenarioName in scenarios) {
//     const methodName = toCamelCase(scenarioName);
//     scenarioBlocks += `  it('${scenarioName}', async () => {\n    await ${className}.open();\n    await ${className}.${methodName}();\n  });\n\n`;
//   }

//   return `import { expect } from '@wdio/globals';
// import ${className} from '${importPath}';

// describe('${featureName}', () => {
// ${scenarioBlocks}});`;
// }

// function ensurePageBaseClass() {
//   if (!fs.existsSync(basePagePath)) {
//     const basePageContent = `import { browser, $ } from '@wdio/globals';

// export default class Page {
//   open(path: string) {
//     return browser.url(\`https://the-internet.herokuapp.com/\${path}\`);
//   }

//   async trySelector(selector: string) {
//     const base = selector.replace(/\[data-testid.*?\]/g, '');
//     try {
//       const primary = await $(selector);
//       if (await primary.isExisting()) {
//         return primary;
//       }
//     } catch (e) {
//       // fallback to base
//     }
//     return $(base);
//   }
// }`;
//     fs.writeFileSync(basePagePath, basePageContent, 'utf-8');
//     console.log('✅ Created base Page class with open() and enhanced trySelector()');
//   }
// }

// ensurePageBaseClass();

// for (const stepFile of stepFiles) {
//   const mapPath = path.join(stepMapDir, stepFile);
//   const scenarios = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
//   const featureName = stepFile.replace('_stepMap.json', '');

//   const pageObjectCode = generatePageObjectClass(featureName, scenarios);
//   const testCode = generateTestFile(featureName, scenarios);

//   const poFileName = `${toCamelCase(featureName)}.page.ts`;
//   const testFileName = `${toCamelCase(featureName)}.test.ts`;

//   fs.writeFileSync(path.join(pageObjectsDir, poFileName), pageObjectCode, 'utf-8');
//   fs.writeFileSync(path.join(specsDir, testFileName), testCode, 'utf-8');

//   console.log(`✅ Generated: ${poFileName} + ${testFileName}`);
// }




//// below code is on 05/10/2025 night


// generateTestsFromMap.ts

// generateTestsFromMap.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stepMapDir = path.join(__dirname, 'stepMaps');
const pageObjectsDir = path.join(__dirname, 'test/pageobjects');
const specsDir = path.join(__dirname, 'test/specs');
const basePagePath = path.join(pageObjectsDir, 'page.ts');



if (!fs.existsSync(pageObjectsDir)) fs.mkdirSync(pageObjectsDir, { recursive: true });
if (!fs.existsSync(specsDir)) fs.mkdirSync(specsDir, { recursive: true });

const stepFiles = fs.readdirSync(stepMapDir).filter(f => f.endsWith('.stepMap.json'));

function toCamelCase(name: string): string {
  return name.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

function escapeSelector(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const actionMethodMap: Record<string, (selector: string, note: string) => string> = {
  setText: (selector, note) => `await this.${selector}.setValue('${note}');`,
  click: (selector) => `await this.${selector}.click();`,
  hover: (selector) => `await this.${selector}.moveTo();`,
  uploadFile: (selector, note) => `const filePath = path.join(__dirname, '../../uploads/${note}');\n    const remoteFilePath = await browser.uploadFile(filePath);\n    await this.${selector}.setValue(remoteFilePath);`,
  selectDropdown: (selector, note) => `await this.${selector}.selectByVisibleText('${note}');`,
  scrollTo: (selector) => `await this.${selector}.scrollIntoView();`,
  clearText: (selector) => `await this.${selector}.clearValue();`,
  waitForVisible: (selector) => `await this.${selector}.waitForDisplayed();`,
  assertVisible: (selector) => `await expect(this.${selector}).toBeDisplayed();`,
  assertText: (selector, note) => `await expect(this.${selector}).toHaveText('${note}');`,
  assertEnabled: (selector) => `await expect(this.${selector}).toBeEnabled();`,
  assertDisabled: (selector) => `await expect(this.${selector}).toBeDisabled();`,
  assertTitle: (_, note) => `await expect(browser).toHaveTitle('${note}');`,
  assertUrlContains: (_, note) => `await expect(browser).toHaveUrl(expect.stringContaining('${note}'));`
};

function generatePageObjectClass(featureName: string, scenarios: any): string {
  const className = toCamelCase(featureName) + 'Page';
  const selectorsMap = new Map<string, { selector: string, fallback: string }>();
  const scenarioMethods: string[] = [];
  let usesPath = false;

  for (const scenarioName in scenarios) {
    const steps = scenarios[scenarioName];
    const methodLines: string[] = [];

    steps.forEach(step => {
      const { selectorName, selector, fallbackSelector, action, note } = step;
      if (selectorName && selector && !selectorsMap.has(selectorName)) {
        selectorsMap.set(selectorName, {
          selector: escapeSelector(selector),
          fallback: fallbackSelector
            ? fallbackSelector.split(',').map(s => `'${escapeSelector(s.trim())}'`).join(', ')
            : ''
        });
      }

      const actionFn = actionMethodMap[action];
      if (actionFn) {
        const line = actionFn(selectorName, note || '');
        methodLines.push(`    ${line}`);
      } else {
        methodLines.push(`    // Unknown action: ${action}`);
      }

      if (action === 'uploadFile') usesPath = true;
    });

    const methodName = toCamelCase(scenarioName);
    scenarioMethods.push(`  async ${methodName}(): Promise<void> {\n${methodLines.join('\n')}\n  }`);
  }

  const selectorGetters = Array.from(selectorsMap.entries())
    .map(([name, val]) => `  get ${name}() {\n    return this.trySelector('${val.selector}', [${val.fallback}]);\n  }`)
    .join('\n\n');

  return `${usesPath ? "import path from 'path';\n" : ''}import Page from './page';

/**
 * Page Object for ${featureName}
 */
class ${className} extends Page {
${selectorGetters ? '\n' + selectorGetters + '\n' : ''}

${scenarioMethods.join('\n\n')}

  open() {
    return super.open('/');
  }
}

export default new ${className}();
`;
}

function generateTestFile(featureName: string, scenarios: any): string {
  const className = toCamelCase(featureName);
  const importPath = `../pageobjects/${className}.page`;

  let scenarioBlocks = '';
  for (const scenarioName in scenarios) {
    const methodName = toCamelCase(scenarioName);
    scenarioBlocks += `  it('${scenarioName}', async () => {\n    await ${className}.open();\n    await ${className}.${methodName}();\n  });\n\n`;
  }

  return `import { expect } from '@wdio/globals';\nimport ${className} from '${importPath}';\n\ndescribe('${featureName}', () => {\n${scenarioBlocks}});`;
}

function ensurePageBaseClass() {
  if (!fs.existsSync(basePagePath)) {
    const basePageContent = `import { browser, $ } from '@wdio/globals';

export default class Page {
  open(path: string) {
    return browser.url(\`https://the-internet.herokuapp.com/\${path}\`);
  }

  async trySelector(primarySelector: string, fallbackSelectors: string[]): Promise<WebdriverIO.Element> {
    try {
      const primary = await $(primarySelector);
      if (await primary.isExisting() && await primary.isDisplayed()) {
        return primary;
      }
    } catch (e) {
      // primary failed
    }

    for (const selector of fallbackSelectors) {
      try {
        const alt = await $(selector);
        if (await alt.isExisting() && await alt.isDisplayed()) {
          return alt;
        }
      } catch (e) {
        // try next fallback
      }
    }

    throw new Error(\`All selectors failed:\\nPrimary: \${primarySelector}\\nFallbacks: \${fallbackSelectors.join(', ')}\`);
  }
}`;
    fs.writeFileSync(basePagePath, basePageContent, 'utf-8');
    console.log('✅ Created base Page class with open() and trySelector()');
  }
}

// Ensure base class exists
ensurePageBaseClass();

// Generate page objects and tests
for (const stepFile of stepFiles) {
  const mapPath = path.join(stepMapDir, stepFile);
  const scenarios = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
  const featureName = stepFile.replace('_stepMap.json', '');

  const pageObjectCode = generatePageObjectClass(featureName, scenarios);
  const testCode = generateTestFile(featureName, scenarios);

  const poFileName = `${toCamelCase(featureName)}.page.ts`;
  const testFileName = `${toCamelCase(featureName)}.test.ts`;

  fs.writeFileSync(path.join(pageObjectsDir, poFileName), pageObjectCode, 'utf-8');
  fs.writeFileSync(path.join(specsDir, testFileName), testCode, 'utf-8');

  console.log(`✅ Generated: ${poFileName} + ${testFileName}`);
}
