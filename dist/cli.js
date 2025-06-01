// src/cli.ts
// // common cli actions
import { execSync } from 'child_process';
import { Command } from 'commander';
import { processSteps } from './generateStepsMap';
import { processTests } from './generateTestsFromMap';
export function runCLI() {
    const program = new Command();
    program
        .name('testgen')
        .description('Unified CLI for generating step maps and test specs');
    program
        .command('steps')
        .description('Generate stepMap JSON files from feature files')
        .option('--all', 'Parse all .feature files')
        .option('--file <files...>', 'Parse specific .feature file(s)')
        .option('--verbose', 'Print detailed processing info')
        .option('--force', 'Overwrite existing files without warning')
        .option('--watch', 'Watch for file changes and regenerate')
        .option('--dry-run', 'Preview without writing files')
        .action((opts) => processSteps(opts));
    program
        .command('tests')
        .description('Generate page objects and spec files from stepMap JSON files')
        .option('--all', 'Generate tests for all step map files')
        .option('--file <files...>', 'Generate tests for specific step map file(s)')
        .option('--force', 'Overwrite existing files without warning')
        .option('--watch', 'Watch for changes and regenerate')
        .option('--verbose', 'Print detailed processing info')
        .option('--dry-run', 'Preview without writing files')
        .action((opts) => processTests(opts));
    program
        .command('run')
        .description('Execute tests and/or generate Allure report')
        .option('--report', 'Generate Allure report after running tests')
        .option('--report-only', 'Only generate Allure report (no test execution)')
        .action((opts) => {
        if (opts.reportOnly) {
            console.log('📊 Generating Allure report (report-only mode)...');
            try {
                execSync('npm run allure:report', { stdio: 'inherit' });
            }
            catch (err) {
                console.error('❌ Failed to generate Allure report:', err.message || err);
            }
            return;
        }
        let testFailed = false;
        try {
            console.log('🚀 Running tests...');
            execSync('npx wdio run wdio.conf.js', { stdio: 'inherit' });
        }
        catch (err) {
            testFailed = true;
            console.error('⚠️ Some tests failed.');
        }
        if (opts.report) {
            try {
                console.log('📊 Generating Allure report...');
                execSync('npm run allure:generate', { stdio: 'inherit' });
                execSync('npm run allure:open', { stdio: 'inherit' });
            }
            catch (err) {
                console.error('❌ Failed to generate Allure report:', err.message || err);
            }
        }
        if (testFailed) {
            process.exit(1);
        }
    });
    program.parse(process.argv);
}
