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

function toPascalCase(name: string): string {
  return name.replace(/(^\w|_\w)/g, m => m.replace('_', '').toUpperCase());
}

function toCamelCase(name: string): string {
  return name.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

function escapeSelector(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function normalizeSelectorName(raw: string): string {
  const noiseWords = ['i', 'should', 'see', 'the', 'is', 'be', 'in', 'to', 'and', 'a', 'an', 'on', 'of', 'then', 'that', 'with', 'click', 'doubleclick', 'upload', 'set', 'value', 'text', 'message'];
  const parts = raw
    .replace(/[^a-zA-Z0-9 ]/g, '') // remove punctuation
    .toLowerCase()
    .split(/\s+/)
    .filter(word => !noiseWords.includes(word));

  if (parts.length === 0) return 'element';

  const [first, ...rest] = parts;
  return first + rest.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

const actionMethodMap: Record<string, (selector: string, note: string) => string> = {
  setText: (selector, note) => `(await this.${selector}).setValue('${note}');`,
  click: (selector) => `(await this.${selector}).click();`,
  hover: (selector) => `(await this.${selector}).moveTo();`,
  uploadFile: (selector, note) => `const filePath = path.join(__dirname, '../../uploads/${note}');\n    const remoteFilePath = await browser.uploadFile(filePath);\n    (await this.${selector}).setValue(remoteFilePath);`,
  selectDropdown: (selector, note) => `(await this.${selector}).selectByVisibleText('${note}');`,
  scrollTo: (selector) => `(await this.${selector}).scrollIntoView();`,
  clearText: (selector) => `(await this.${selector}).clearValue();`,
  waitForVisible: (selector) => `(await this.${selector}).waitForDisplayed();`,
  assertVisible: (selector) => `await expect(await this.${selector}).toBeDisplayed();`,
  assertText: (selector, note) => `await expect(await this.${selector}).toHaveText('${note}');`,
  assertEnabled: (selector) => `await expect(await this.${selector}).toBeEnabled();`,
  assertDisabled: (selector) => `await expect(await this.${selector}).toBeDisabled();`,
  assertTitle: (_, note) => `await expect(browser).toHaveTitle('${note}');`,
  assertUrlContains: (_, note) => `await expect(browser).toHaveUrl(expect.stringContaining('${note}'));`
};

function generatePageObjectClass(featureName: string, scenarios: any): string {
  const className = `${toPascalCase(featureName)}Page`;

  const selectorsMap = new Map<string, { selector: string, fallback: string[] }>();
  const scenarioMethods: string[] = [];
  let usesPath = false;

  for (const scenarioName in scenarios) {
    const steps = scenarios[scenarioName];
    const methodLines: string[] = [];

    steps.forEach(step => {
      let { selectorName, selector, fallbackSelector, action, note } = step;

      // Apply normalization if selectorName is raw
      selectorName = normalizeSelectorName(selectorName);

      // Rebuild selector using selectorName for consistency
      const dataTestId = `[data-testid="${selectorName}"]`;

      if (!selectorsMap.has(selectorName)) {
        selectorsMap.set(selectorName, {
          selector: escapeSelector(dataTestId),
          fallback: fallbackSelector ? fallbackSelector.split(',').map(f => escapeSelector(f.trim())) : []
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
    .map(([name, val]) => {
      const fallbackArr = val.fallback.length > 0 ? `[${val.fallback.map(f => `'${f}'`).join(', ')}]` : '[]';
      return `  get ${name}() {\n    return this.trySelector('${val.selector}', ${fallbackArr});\n  }`;
    })
    .join('\n\n');

  return `${usesPath ? "import path from 'path';\n" : ''}import Page from './page';

/**
 * Page Object for ${featureName}
 */
class ${className} extends Page {
${selectorGetters}

${scenarioMethods.join('\n\n')}
  
  // makesure to update the pathSegment. this is your endpoint / specific “point of entry". 
  // This will be appended with the path / baseURL.

  open(pathSegment: string = 'login') {
    return super.open(pathSegment);
  }
}

export default new ${className}();
`;
}

function generateTestFile(featureName: string, scenarios: any): string {
  const className = `${toPascalCase(featureName)}Page`;
  const camelClass = toCamelCase(featureName);
  const importPath = `../pageobjects/${camelClass}.page`;

  let scenarioBlocks = '';
  for (const scenarioName in scenarios) {
    const methodName = toCamelCase(scenarioName);
    scenarioBlocks += `  it('${scenarioName}', async () => {
    await ${className}.open();
    await ${className}.${methodName}();
    // TODO: Add validation checks using expect()
  });\n\n`;
  }

  return `import { expect } from '@wdio/globals';
import ${className} from '${importPath}';

describe('${toPascalCase(featureName)} feature tests', () => {
${scenarioBlocks}});`;
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
        console.log(\`✅ Using primary selector: \${primarySelector}\`);
        return primary;
      }
    } catch (e) {
     console.warn(\`⚠️ Failed to find element with primary selector: \${primarySelector}\`);
    }

    for (const selector of fallbackSelectors) {
      try {
        const alt = await $(selector);
        if (await alt.isExisting() && await alt.isDisplayed()) {
          console.log(\`↪️ Using fallback selector: \${selector}\`);
          return alt;
        }
      } catch (e) {}
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
  const featureName = stepFile.replace('.stepMap.json', '');

  const pageObjectCode = generatePageObjectClass(featureName, scenarios);
  const testCode = generateTestFile(featureName, scenarios);

  const poFileName = `${toCamelCase(featureName)}.page.ts`;
  const testFileName = `${toCamelCase(featureName)}.spec.ts`;

  fs.writeFileSync(path.join(pageObjectsDir, poFileName), pageObjectCode, 'utf-8');
  fs.writeFileSync(path.join(specsDir, testFileName), testCode, 'utf-8');

  console.log(`✅ Generated: ${poFileName} + ${testFileName}`);
}
