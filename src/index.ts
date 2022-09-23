import { setOutput } from '@actions/core';
import { Logger } from './common/logger';
import { ChangelogGenerator } from './core/changelog-generator';
import { inputs } from './core/input';

Logger.log('🏁 Changelog generator started');

const opts = inputs();

Logger.log('Options: ');
Logger.log(opts);

generateChangelog();

async function generateChangelog() {
    const gen = await ChangelogGenerator.construct(opts);
    Logger.log('📝 Generating changelog');
    const md = gen.md;
    Logger.log('📝 Changelog generated');
    Logger.log(md);

    setOutput('changelog', md);

    Logger.log('Done');
}