// src/steps.ts
// Feature-to-stepMap JSON genaration logic

import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { Parser, AstBuilder, GherkinClassicTokenMatcher } from '@cucumber/gherkin';
import { IdGenerator } from '@cucumber/messages';
import { generateShortName } from './utils';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const featureDir = path.join(__dirname, '..', 'features');
const stepMapDir = path.join(__dirname, '..', 'stepMaps');

const selectorFallbacks: Record<string, string> = {
  userNameField: '#username, input[name="username"]',
  passwordField: '#password, input[type="password"]',
  loginButton: '#login, button[type="submit"]',
  countryDropdown: '#country, select[name="country"]',
  termsCheckbox: '#terms, input[type="checkbox"]',
  link: 'a',
  pageTitle: 'h1, title',
  currentUrl: 'window.location.href',
  welcomeBanner: '#welcome-message, .welcome',
  avatar: 'img.profile-picture'
};

const parser = new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher());

export function processSteps(opts: any) {
  if (!fs.existsSync(stepMapDir)) fs.mkdirSync(stepMapDir);

  const aliasPath = path.join(__dirname, '..', 'selector-aliases.json');
  const selectorAliases: Record<string, string> = fs.existsSync(aliasPath)
    ? JSON.parse(fs.readFileSync(aliasPath, 'utf-8'))
    : {};

  function toLogicalSelectorName(stepText: string): string {
    const patterns = [
      { regex: /username|user name|email/i, name: 'userNameField' },
      { regex: /password/i, name: 'passwordField' },
      { regex: /login|submit/i, name: 'loginButton' },
      { regex: /dropdown.*country|country.*dropdown/i, name: 'countryDropdown' },
      { regex: /checkbox/i, name: 'termsCheckbox' },
      { regex: /link/i, name: 'link' },
      { regex: /title/i, name: 'pageTitle' },
      { regex: /url/i, name: 'currentUrl' },
      { regex: /welcome message/i, name: 'welcomeBanner' },
      { regex: /profile picture/i, name: 'avatar' },
    ];
    const found = patterns.find(p => p.regex.test(stepText));
    return found ? found.name : generateShortName(stepText);
  }

  function inferActionAndSelector(stepText: string) {
    const text = stepText.toLowerCase();
    const selectorName = toLogicalSelectorName(stepText);
    let action = 'unknown';
    let note = '';
    const quoted = stepText.match(/"(.*?)"/);
    const val = quoted ? quoted[1] : '';

    if (/enters?|types?|provides?|inputs?|fills?\s*(in|the|with)?|sets?/.test(text)) {
      action = 'setValue';
      note = val;
    } else if (/clicks|click|presses|taps/.test(text)) {
      action = 'click';
    } else if (/hovers/.test(text)) {
      action = 'hover';
    } else if (/uploads/.test(text)) {
      action = 'uploadFile';
      note = val;
    } else if (/selects|chooses/.test(text)) {
      action = 'selectDropdown';
      note = val;
    } else if (/scrolls? to/.test(text)) {
      action = 'scrollTo';
    } else if (/clears?/.test(text)) {
      action = 'clearText';
    } else if (/waits? for.*visible/.test(text)) {
      action = 'waitForVisible';
    } else if (/should see|sees/.test(text)) {
      action = 'assertVisible';
    } else if (/should have text/.test(text)) {
      action = 'assertText';
      note = val;
    } else if (/should be enabled/.test(text)) {
      action = 'assertEnabled';
    } else if (/should be disabled/.test(text)) {
      action = 'assertDisabled';
    } else if (/title should be/.test(text)) {
      action = 'assertTitle';
      note = val;
    } else if (/url should contain/.test(text)) {
      action = 'assertUrlContains';
      note = val;
    }

    const selector = selectorAliases[selectorName] || `[data-testid="${selectorName}"]`;
    const fallbackSelector = selectorFallbacks[selectorName] || '';
    return { action, selectorName, selector, fallbackSelector, note };
  }

  function generateStepMap(featurePath: string) {
    const content = fs.readFileSync(featurePath, 'utf-8');
    const gherkinDocument = parser.parse(content);
    const feature = gherkinDocument.feature;
    if (!feature) return;

    const featureName = path.basename(featurePath, '.feature');
    const stepMap: Record<string, any[]> = {};

    for (const child of feature.children || []) {
      if (!child.scenario) continue;
      const scenario = child.scenario;
      const scenarioName = scenario.name;
      stepMap[scenarioName] = [];

      for (const step of scenario.steps || []) {
        const entry = inferActionAndSelector(step.text);
        stepMap[scenarioName].push(entry);
      }
    }

    const outPath = path.join(stepMapDir, `${featureName}.stepMap.json`);
    if (opts.dryRun) {
      console.log(`[dry-run] Would write: ${outPath}`);
    } else if (!opts.force && fs.existsSync(outPath)) {
      console.warn(`⚠️ Skipping ${featureName} (already exists)`);
    } else {
      fs.writeFileSync(outPath, JSON.stringify(stepMap, null, 2), 'utf-8');
      
      // console.log(`✅ Generated step map: ${featureName}.stepMap.json`);
      if (opts.dryRun) {
        console.log(`🧪 Dry-run completed: ${featureName}.stepMap.json`);
      } else {
        console.log(`✅ Generated step map: ${featureName}.stepMap.json`);
      }
    }
  }

  const files = opts.all ? fs.readdirSync(featureDir).filter(f => f.endsWith('.feature')) : opts.file;
  if (!files || files.length === 0) {
    console.error('❌ Please provide --all or --file <file>');
    process.exit(1);
  }

  files.forEach(file => {
    const fullPath = path.join(featureDir, file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ File not found: ${file}`);
    } else {
      if (opts.verbose) console.log(`🔍 Processing: ${file}`);
      generateStepMap(fullPath);
    }
  });

  if (opts.watch) {
    chokidar.watch(featureDir, { ignoreInitial: true }).on('all', (event, filepath) => {
      if (filepath.endsWith('.feature')) {
        console.log(`🔁 Detected change: ${event} - ${filepath}`);
        generateStepMap(filepath);
      }
    });
    console.log('👀 Watching for .feature file changes...');
  }
}
