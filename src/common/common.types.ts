import { Endpoints } from '@octokit/types';

/** FALLBACK for non conventional commit */
export const FALLBACK_TYPE = 'other';

/** Tipo de commit (release, fix, feat, etc) */
export interface CommitType {
    title: string;
    aliases: readonly string[];
}

export type ComparisonResponse =
    Endpoints['GET /repos/{owner}/{repo}/compare/{basehead}']['response']['data'];

/** Tipos de commit disponibles */
export const ConventionalCommitTypes = [
    { title: '💡 New features', aliases: ['feature', 'feat'] },
    { title: '🚑 Bug fixes', aliases: ['fix', 'bugfix', 'bug'] },
    { title: '📚 Documentation', aliases: ['docs'] },
    { title: '🔨 Code refactoring', aliases: ['refactor', 'refact'] },
    { title: '🐎 Performance improvements', aliases: ['perf'] },
    { title: '🧪 Tests', aliases: ['test'] },
    { title: '🏗️ Build system changes', aliases: ['build'] },
    { title: '🔄 Continuous Integration', aliases: ['ci', 'workflow'] },
    { title: '🧹 Chore tasks', aliases: ['chore', 'deps'] },
    { title: '🔙 Reverts', aliases: ['revert'] },
    { title: '🎚️ Configuration changes', aliases: ['config', 'conf', 'cfg'] },
    { title: '🚧 Development WIP', aliases: ['dev', 'wip'] },
    { title: '🌐 Internazionalization changes', aliases: ['i18n'] },
    { title: '🚀 Releases', aliases: ['release', 'rel'] },
    { title: '🎨 Style changes', aliases: ['style', 'stl'] },
    { title: '🏷️ Typings', aliases: ['typings', 'types'] },
    { title: '📝 Other changes', aliases: [FALLBACK_TYPE] },
] as const;

/* Valid conventional commit types */
export type ConvComType = Exclude<
    typeof ConventionalCommitTypes[number]['aliases'][number],
    'other'
>;

/* Valid conventional commit Titles */
export type ConvComTitle = typeof ConventionalCommitTypes[number]['title'];

export interface CommitSubject {
    type?: ConvComType;
    scope?: string;
    breaking?: boolean;
    msg: string;
}

/** representa un commit en el repo */
export interface Commit {
    hash: string;
    author: string;
    date: string;
    subject: CommitSubject;
    body: string[];
}