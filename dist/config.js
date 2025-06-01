// src/config.ts
// Paths, fallback selectors, aliases
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const paths = {
    root: path.join(__dirname, '..'),
    featuresDir: path.join(__dirname, '..', 'features'),
    stepMapDir: path.join(__dirname, '..', 'stepMaps'),
    testDir: path.join(__dirname, '..', 'test'),
    pageObjectDir: path.join(__dirname, '..', 'test', 'pageobjects'),
    specDir: path.join(__dirname, '..', 'test', 'specs'),
    basePagePath: path.join(__dirname, '..', 'test', 'pageobjects', 'page.ts'),
    selectorAliasPath: path.join(__dirname, '..', 'selector-aliases.json')
};
export const fallbackSelectors = {
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
