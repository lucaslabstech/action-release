import { Commit, ConvComTitle } from '../common/common.types';
import { InputIncludes } from './input';
import { Logger } from '../common/logger';

/** Generates a markdown changelog from a list of commits. */
export function toMd(
    groups: Map<ConvComTitle, Commit[]>,
    full?: string,
    includes: InputIncludes = {
        author: true,
        body: true,
        hash: true,
        pr: true,
    }
): string {
    Logger.debug('md: Generating markdown changelog');
    const title = `## What's Changed\n\n`;
    const footer = full ? `**Full Changelog**: ${full}` : '';
    let sections = '';

    groups.forEach((commits, title) => {
        if (title !== '🚀 Releases') {
            sections += sectionMd(title, commits, includes);
        }
    });

    const md = `${title}${sections}${footer}`;

    return md;
}

export function sectionMd(title: string, commits: Commit[], includes: InputIncludes) {
    return (
        `### ${title}\n` +
        commits.map((commit) => itemMd(commit, includes)).join('\n') +
        '\n\n'
    );
}

export function itemMd(commit: Commit, includes: InputIncludes) {
    const breaking = commit.subject.breaking ? '💥 ' : '';
    const author = commit.author && includes.author ? `, by ${commit.author}` : '';
    const scope = commit.subject.scope ? `(${commit.subject.scope}) ` : '';
    const hash = includes.hash ? commit.hash + ' ' : '';
    const body =
        includes.body && commit.body && commit.body.length > 0
            ? `\n\n  ${commit.body.filter(v=>v).join('\n  ')}`
            : '';

    return `* ${breaking}${hash}${scope}${commit.subject.msg}${author}${body}`;
}
