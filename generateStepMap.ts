
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { Parser, AstBuilder, GherkinClassicTokenMatcher } from '@cucumber/gherkin';
// import { IdGenerator } from '@cucumber/messages';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const featureDir = path.join(__dirname, 'features');
// const stepMapDir = path.join(__dirname, 'stepMaps');

// if (!fs.existsSync(stepMapDir)) fs.mkdirSync(stepMapDir, { recursive: true });

// const parser = new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher());

// const selectorFallbacks: Record<string, string> = {
//   userNameField: '#username, input[name="username"]',
//   passwordField: '#password, input[type="password"]',
//   loginButton: '#login, button[type="submit"]',
//   countryDropdown: '#country, select[name="country"]',
//   termsCheckbox: '#terms, input[type="checkbox"]',
//   link: 'a',
//   pageTitle: 'h1, title',
//   currentUrl: 'window.location.href'
// };

// function toLogicalSelectorName(stepText: string): string {
//   const patterns: { regex: RegExp, name: string }[] = [
//     { regex: /username|user name|email/i, name: 'userNameField' },
//     { regex: /password/i, name: 'passwordField' },
//     { regex: /login|submit/i, name: 'loginButton' },
//     { regex: /dropdown.*country|country.*dropdown/i, name: 'countryDropdown' },
//     { regex: /checkbox/i, name: 'termsCheckbox' },
//     { regex: /link/i, name: 'link' },
//     { regex: /title/i, name: 'pageTitle' },
//     { regex: /url/i, name: 'currentUrl' },
//   ];
//   const found = patterns.find(p => p.regex.test(stepText));
//   if (found) return found.name;

//   // Fallback: extract key noun phrases for cleaner selector names
//   const cleaned = stepText
//     .replace(/"/g, '') // remove quotes
//     .replace(/[^a-zA-Z0-9 ]/g, '') // remove special characters
//     .toLowerCase();

//   const keywords = ['i', 'should', 'see', 'the', 'a', 'an', 'is', 'in', 'on', 'page', 'message', 'text'];
//   const shortName = cleaned
//     .split(' ')
//     .filter(word => !keywords.includes(word))
//     .slice(0, 3) // limit to first 3 significant words
//     .join('_');

//   return shortName || 'element';
// }


// function inferActionAndSelector(step: string): { action: string, selectorName: string, selector: string, fallbackSelector: string, note: string } {
//   const text = step.toLowerCase();
//   const selectorName = toLogicalSelectorName(step);
//   let action = 'unknown';
//   let note = '';

//   if (/enters|types|provides/.test(text)) {
//     action = 'setText';
//     note = step.split('"')[1] || '';
//   } else if (/clicks|click|presses/.test(text)) {
//     action = 'click';
//   } else if (/hovers/.test(text)) {
//     action = 'hover';
//   } else if (/uploads/.test(text)) {
//     action = 'uploadFile';
//     note = step.split('"')[1] || '';
//   } else if (/selects|chooses/.test(text)) {
//     action = 'selectDropdown';
//     note = step.split('"')[1] || '';
//   } else if (/scrolls? to/.test(text)) {
//     action = 'scrollTo';
//   } else if (/clears?/.test(text)) {
//     action = 'clearText';
//   } else if (/waits? for.*visible/.test(text)) {
//     action = 'waitForVisible';
//   } else if (/should see|sees/.test(text)) {
//     action = 'assertVisible';
//   } else if (/should have text/.test(text)) {
//     action = 'assertText';
//     note = step.split('"')[1] || '';
//   } else if (/should be enabled/.test(text)) {
//     action = 'assertEnabled';
//   } else if (/should be disabled/.test(text)) {
//     action = 'assertDisabled';
//   } else if (/title should be/.test(text)) {
//     action = 'assertTitle';
//     note = step.split('"')[1] || '';
//   } else if (/url should contain/.test(text)) {
//     action = 'assertUrlContains';
//     note = step.split('"')[1] || '';
//   }

//   const selector = `[data-testid="${selectorName}"]`;
//   const fallbackSelector = selectorFallbacks[selectorName] || '';

//   return { action, selectorName, selector, fallbackSelector, note };
// }

// function generateStepMap(featurePath: string) {
//   const content = fs.readFileSync(featurePath, 'utf-8');
//   const gherkinDocument = parser.parse(content);
//   const feature = gherkinDocument.feature;
//   if (!feature) return;

//   const featureName = path.basename(featurePath, '.feature');
//   const stepMap: Record<string, any[]> = {};

//   for (const child of feature.children) {
//     if (!child.scenario) continue;
//     const scenario = child.scenario;
//     const scenarioName = scenario.name;
//     stepMap[scenarioName] = [];

//     for (const step of scenario.steps) {
//       const { action, selectorName, selector, fallbackSelector, note } = inferActionAndSelector(step.text);
//       stepMap[scenarioName].push({ action, selectorName, selector, fallbackSelector, note });
//     }
//   }

//   const baseName = path.basename(featurePath, '.feature');
//   const outPath = path.join(stepMapDir, `${baseName}.stepMap.json`);
//   fs.writeFileSync(outPath, JSON.stringify(stepMap, null, 2), 'utf-8');
//   console.log(`✅ Generated step map: ${baseName}.stepMap.json`);
// }

// const featureFiles = fs.readdirSync(featureDir).filter(f => f.endsWith('.feature'));
// featureFiles.forEach(file => generateStepMap(path.join(featureDir, file)));




// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { Parser, AstBuilder, GherkinClassicTokenMatcher } from '@cucumber/gherkin';
// import { IdGenerator } from '@cucumber/messages';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const featureDir = path.join(__dirname, 'features');
// const stepMapDir = path.join(__dirname, 'stepMaps');
// const aliasFile = path.join(__dirname, 'selector-aliases.json');





import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Parser, AstBuilder, GherkinClassicTokenMatcher } from '@cucumber/gherkin';
import { IdGenerator } from '@cucumber/messages';
import nlp from 'compromise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const featureDir = path.join(__dirname, 'features');
const stepMapDir = path.join(__dirname, 'stepMaps');

const aliasPath = path.join(__dirname, 'selector-aliases.json');
const selectorAliases: Record<string, string> = fs.existsSync(aliasPath)
  ? JSON.parse(fs.readFileSync(aliasPath, 'utf-8')) : {};

if (!fs.existsSync(stepMapDir)) fs.mkdirSync(stepMapDir, { recursive: true });

const parser = new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher());

// Default fallback selectors
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

// Use NLP to convert sentence to compact selector name
function toNLPSelectorName(stepText: string): string {
  const doc = nlp(stepText).normalize();
  const nouns = doc.nouns().toSingular().out('array');
  const verbs = doc.verbs().out('array');
  const words = [...verbs, ...nouns].slice(0, 3); // Use up to 3 words max
  return words.length > 0
    ? words.join('').toLowerCase()
    : stepText.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '');
}

function toLogicalSelectorName(stepText: string): string {
  const patterns: { regex: RegExp, name: string }[] = [
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
  return found ? found.name : toNLPSelectorName(stepText);
}

function inferActionAndSelector(step: string): {
  action: string,
  selectorName: string,
  selector: string,
  fallbackSelector: string,
  note: string
} {
  const text = step.toLowerCase();
  const selectorName = toLogicalSelectorName(step);
  let action = 'unknown';
  let note = '';

  if (/enters|types|provides|fills? in/.test(text)) {
    action = 'setText';
    note = step.split('"')[1] || '';
  } else if (/clicks|click|presses|taps/.test(text)) {
    action = 'click';
  } else if (/hovers/.test(text)) {
    action = 'hover';
  } else if (/uploads/.test(text)) {
    action = 'uploadFile';
    note = step.split('"')[1] || '';
  } else if (/selects|chooses/.test(text)) {
    action = 'selectDropdown';
    note = step.split('"')[1] || '';
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
    note = step.split('"')[1] || '';
  } else if (/should be enabled/.test(text)) {
    action = 'assertEnabled';
  } else if (/should be disabled/.test(text)) {
    action = 'assertDisabled';
  } else if (/title should be/.test(text)) {
    action = 'assertTitle';
    note = step.split('"')[1] || '';
  } else if (/url should contain/.test(text)) {
    action = 'assertUrlContains';
    note = step.split('"')[1] || '';
  }

  const selectorFromAlias = selectorAliases[selectorName];
  const selector = selectorFromAlias || `[data-testid="${selectorName}"]`;

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

  for (const child of feature.children) {
    if (!child.scenario) continue;
    const scenario = child.scenario;
    const scenarioName = scenario.name;
    stepMap[scenarioName] = [];

    for (const step of scenario.steps) {
      const { action, selectorName, selector, fallbackSelector, note } = inferActionAndSelector(step.text);
      stepMap[scenarioName].push({
        action,
        selectorName,
        selector,
        fallbackSelector,
        note
      });
    }
  }

  const outPath = path.join(stepMapDir, `${featureName}.stepMap.json`);
  fs.writeFileSync(outPath, JSON.stringify(stepMap, null, 2), 'utf-8');
  console.log(`✅ Generated step map: ${featureName}.stepMap.json`);
}

// Process all feature files
const featureFiles = fs.readdirSync(featureDir).filter(f => f.endsWith('.feature'));
featureFiles.forEach(file => generateStepMap(path.join(featureDir, file)));
