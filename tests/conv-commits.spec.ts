import { ComparisonResponse } from '../src/common/common.types';
import {
    CCRegex,
    transformCommits,
    getTitle,
    validConvComTypes,
    groupCommitsByType,
} from '../src/core/conv-commit';
import { toMd } from '../src/core/md';
import {
    getTestCommits,
    makeInvalidMsgs,
    makeValidMsgs,
    TestSubject,
} from './data/commit-msg-test-data';
import comparison from './data/commits.json';

// conventional commit tests
describe('conv-commits', () => {
    describe('conventional commit regex', () => {
        let validCommitMsg: TestSubject[] = [];
        let invalidCommitMsg: TestSubject[] = [];

        beforeEach(() => {
            validCommitMsg = makeValidMsgs();
            invalidCommitMsg = makeInvalidMsgs();
        });

        it('should match valid conventional commits of any format', () => {
            validCommitMsg.forEach((subject) => {
                expect(subject.c).toMatch(CCRegex);
            });
        });

        it('should not match non conventional commits', () => {
            invalidCommitMsg.forEach((subject) => {
                expect(subject.c).not.toMatch(CCRegex);
            });
        });

        it('should get named groups from valid conventional commits', () => {
            validCommitMsg.forEach((subject) => {
                const match = subject.c.match(CCRegex);
                expect(match?.groups?.type).toBe(subject.t);
                expect(match?.groups?.scope).toBe(subject.sc);
                expect(match?.groups?.breaking).toBe(subject.b);
                expect(match?.groups?.subject).toBe(subject.s);
            });
        });

        it('should return valid titles for any commit type (including no commit type)', () => {
            expect(getTitle('feature')).toBe('💡 New features');
            expect(getTitle('feat')).toBe('💡 New features');
            expect(getTitle('fix')).toBe('🚑 Bug fixes');
            expect(getTitle('bugfix')).toBe('🚑 Bug fixes');
            expect(getTitle('bug')).toBe('🚑 Bug fixes');
            expect(getTitle('docs')).toBe('📚 Documentation');
            expect(getTitle('refactor')).toBe('🔨 Code refactoring');
            expect(getTitle('refact')).toBe('🔨 Code refactoring');
            expect(getTitle('perf')).toBe('🐎 Performance improvements');
            expect(getTitle('test')).toBe('🧪 Tests');
            expect(getTitle('build')).toBe('🏗️ Build system changes');
            expect(getTitle('ci')).toBe('🔄 Continuous Integration');
            expect(getTitle('workflow')).toBe('🔄 Continuous Integration');
            expect(getTitle('chore')).toBe('🧹 Chore tasks');
            expect(getTitle('deps')).toBe('🧹 Chore tasks');
            expect(getTitle('revert')).toBe('🔙 Reverts');
            expect(getTitle('config')).toBe('🎚️ Configuration changes');
            expect(getTitle('conf')).toBe('🎚️ Configuration changes');
            expect(getTitle('dev')).toBe('🚧 Development WIP');
            expect(getTitle('wip')).toBe('🚧 Development WIP');
            expect(getTitle('i18n')).toBe('🌐 Internazionalization changes');
            expect(getTitle('release')).toBe('🚀 Releases');
            expect(getTitle('rel')).toBe('🚀 Releases');
            expect(getTitle('style')).toBe('🎨 Style changes');
            expect(getTitle('stl')).toBe('🎨 Style changes');
            expect(getTitle('typings')).toBe('🏷️ Typings');
            expect(getTitle('types')).toBe('🏷️ Typings');
            expect(getTitle()).toBe('📝 Other changes');
        });

        it('should parse comparison into a Commit[]', () => {
            const comp = comparison as ComparisonResponse;
            const commits = transformCommits(comp);
            const expected = getTestCommits();

            expect(commits).toEqual(expected);
        });

        it('should group commits by type', () => {
            const commits = getTestCommits();
            const grouped = groupCommitsByType(commits);

            expect(grouped.size).toBe(3);
            expect(grouped.get('💡 New features')).toBeDefined();
            expect(grouped.get('🚀 Releases')).toBeDefined();
            expect(grouped.get('📝 Other changes')).toBeDefined();
            expect(grouped.get('💡 New features')?.length).toBe(2);
            expect(grouped.get('🚀 Releases')?.length).toBe(2);
            expect(grouped.get('📝 Other changes')?.length).toBe(1);
        });

        it('should generate markdown', () => {
            const commits = getTestCommits();
            const grouped = groupCommitsByType(commits);

            const md = toMd(
                grouped,
                'https://github.com/owner/repo/compare/v2.0.2...v2.0.5'
            );

            expect(md).toEqual(
                `## What's Changed\n\n### 💡 New features\n* 💥 a4de96b (core) a new feature, by @jcolombo1\n* a3145cc alert message - binance PROD token, by @jcolombo1\n\n  + adds an alert message when starting\n    the app in development mode, but\n    using PROD binance tokens.\n\n### 📝 Other changes\n* a3145cc this is a non conventional commit, by @jcolombo1\n\n**Full Changelog**: https://github.com/owner/repo/compare/v2.0.2...v2.0.5`
            );
        });

        it('should generate markdown without body author and hash if asked to', () => {
            const commits = getTestCommits();
            const grouped = groupCommitsByType(commits);

            const md = toMd(
                grouped,
                'https://github.com/owner/repo/compare/v2.0.2...v2.0.5',
                { body: false, author: false, hash: false, pr: false }
            );
            
            expect(md).toEqual(
                `## What's Changed\n\n### 💡 New features\n* 💥 (core) a new feature\n* alert message - binance PROD token\n\n### 📝 Other changes\n* this is a non conventional commit\n\n**Full Changelog**: https://github.com/owner/repo/compare/v2.0.2...v2.0.5`
            );
        });
    });
});
