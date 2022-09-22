import { getOctokit } from '@actions/github';
import { Logger } from './common/logger';
import { ChangelogGenerator } from './core/changelog-generator';
import { inputs } from './core/input';

const opts = inputs();
Logger.log('🏁 Changelog generator started');
Logger.log('Options: ');
Logger.log(opts);

generateChangelog();

async function generateChangelog() {
    const gen = await ChangelogGenerator.construct(opts);
    Logger.log('📝 Generating changelog');
    const md = gen.md;
    Logger.log('📝 Changelog generated');
    Logger.log(md);
}