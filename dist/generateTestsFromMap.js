// src/tests.ts
// stepMapJson-to-page/spec generator logic
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { generateShortName, buildActionLine } from './utils';
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
const stepMapDir = path.join(process.cwd(), 'stepMaps'); // Fix here
const testDir = path.join(process.cwd(), 'test');
const pageObjectDir = path.join(testDir, 'pageobjects');
const specDir = path.join(testDir, 'specs');
const basePagePath = path.join(pageObjectDir, 'page.ts');
export function processTests(opts) {
    if (!fs.existsSync(stepMapDir)) {
        fs.mkdirSync(stepMapDir, { recursive: true });
        console.warn(`⚠️ Created missing stepMaps directory: ${stepMapDir}`);
        return; // Exit early since there will be no files yet
    }
    if (!fs.existsSync(testDir))
        fs.mkdirSync(testDir);
    if (!fs.existsSync(pageObjectDir))
        fs.mkdirSync(pageObjectDir, { recursive: true });
    if (!fs.existsSync(specDir))
        fs.mkdirSync(specDir, { recursive: true });
    if (!fs.existsSync(basePagePath)) {
        const basePageContent = `import { browser, $ } from '@wdio/globals';

export default class Page {
  open(path: string) {
    return browser.url(\`https://the-internet.herokuapp.com/\${path}\`);
  }

  async trySelector(primarySelector: string, fallbackSelectors: string[]) {
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
    throw new Error(\`❌ All selectors failed:\nPrimary: \${primarySelector}\nFallbacks: \${fallbackSelectors.join(', ')}\`);
  }
}`;
        fs.writeFileSync(basePagePath, basePageContent, 'utf-8');
        console.log('✅ Created base Page class with open() and trySelector()');
    }
    const filesToGenerate = opts.all
        ? fs.readdirSync(stepMapDir).filter((f) => f.endsWith('.stepMap.json'))
        : opts.file;
    if (!filesToGenerate || filesToGenerate.length === 0) {
        console.error('❌ Please provide --all or --file <filename>');
        process.exit(1);
    }
    for (const file of filesToGenerate) {
        const fullPath = path.join(stepMapDir, file);
        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️ Step map not found: ${file}`);
            continue;
        }
        const baseName = path.basename(file, '.stepMap.json');
        const pageClassName = `${baseName.charAt(0).toUpperCase()}${baseName.slice(1)}Page`;
        const stepMap = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        const defaultPath = baseName.toLowerCase();
        if (opts.verbose)
            console.log(`🔍 Generating files for: ${file}`);
        const usedSelectors = new Map();
        const scenarioMethods = [];
        for (const steps of Object.values(stepMap)) {
            for (const step of steps) {
                const methodName = generateShortName(step.selectorName);
                if (!usedSelectors.has(methodName)) {
                    usedSelectors.set(methodName, {
                        methodName,
                        selector: step.selector,
                        fallback: step.fallbackSelector
                    });
                }
            }
        }
        const pageLines = [];
        pageLines.push(`import Page from './page';`);
        pageLines.push(`class ${pageClassName} extends Page {`);
        for (const { methodName, selector, fallback } of usedSelectors.values()) {
            const fallbackArray = fallback ? fallback.split(',').map((sel) => `'${sel.trim()}'`).join(', ') : '';
            pageLines.push(`  get ${methodName}() {`);
            pageLines.push(`    return this.trySelector('${selector}', [${fallbackArray}]);`);
            pageLines.push('  }');
        }
        for (const [scenarioName, steps] of Object.entries(stepMap)) {
            const scenarioMethodName = generateShortName(scenarioName);
            scenarioMethods.push(scenarioMethodName);
            pageLines.push(`  async ${scenarioMethodName}() {`);
            for (const step of steps) {
                const methodName = generateShortName(step.selectorName);
                const actionLine = buildActionLine(`this.${methodName}`, step.action, step.note);
                if (actionLine)
                    pageLines.push(`    ${actionLine}`);
            }
            pageLines.push('  }');
        }
        pageLines.push(`  open(pathSegment: string = '${defaultPath}') {`);
        pageLines.push('    return super.open(pathSegment);');
        pageLines.push('  }');
        pageLines.push(`}`);
        pageLines.push(`export default new ${pageClassName}();`);
        const pagePath = path.join(pageObjectDir, `${baseName}.page.ts`);
        const testPath = path.join(specDir, `${baseName}.spec.ts`);
        const skipPage = !opts.force && fs.existsSync(pagePath);
        const skipSpec = !opts.force && fs.existsSync(testPath);
        if (skipPage) {
            console.warn(`⚠️ Skipping ${baseName}.page.ts (already exists)`);
        }
        else if (opts.dryRun) {
            console.log(`[dry-run] Would write: ${pagePath}`);
        }
        else {
            fs.writeFileSync(pagePath, pageLines.join('\n'), 'utf-8');
        }
        const testLines = [];
        testLines.push(`import { expect } from '@wdio/globals';`);
        testLines.push(`import ${pageClassName} from '../pageobjects/${baseName}.page';`);
        testLines.push(`describe('${baseName.replace(/-/g, ' ')} feature tests', () => {`);
        for (const [scenarioName, steps] of Object.entries(stepMap)) {
            const scenarioMethodName = generateShortName(scenarioName);
            testLines.push(`  it('${scenarioMethodName}', async () => {`);
            testLines.push(`    await ${pageClassName}.open();`);
            for (const step of steps) {
                const methodName = generateShortName(step.selectorName);
                const actionLine = buildActionLine(`${pageClassName}.${methodName}`, step.action, step.note);
                if (actionLine)
                    testLines.push(`    ${actionLine}`);
            }
            testLines.push(`    // Or simply use:`);
            testLines.push(`    // await ${pageClassName}.${scenarioMethodName}();`);
            testLines.push('  });');
        }
        testLines.push('});');
        if (skipSpec) {
            console.warn(`⚠️ Skipping ${baseName}.spec.ts (already exists)`);
        }
        else if (opts.dryRun) {
            console.log(`[dry-run] Would write: ${testPath}`);
        }
        else {
            fs.writeFileSync(testPath, testLines.join('\n'), 'utf-8');
        }
        if (!skipPage && !skipSpec && !opts.dryRun) {
            console.log(`✅ Generated: ${baseName}.page.ts + ${baseName}.spec.ts`);
        }
    }
    if (opts.watch) {
        chokidar.watch(stepMapDir, { ignoreInitial: true }).on('all', (event, filepath) => {
            if (filepath.endsWith('.stepMap.json')) {
                console.log(`🔁 Detected change: ${event} - ${filepath}`);
                processTests({ ...opts, file: [path.basename(filepath)] });
            }
        });
        console.log('👀 Watching for stepMap changes...');
    }
}
