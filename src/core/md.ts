import { Commit, ConvComTitle } from "../common/common.types";

/** Generates a markdown changelog from a list of commits. */
export function toMd(groups: Map<ConvComTitle, Commit[]>, full?: string) {
    const title = `## What's Changed\n\n`;
    const footer = full ? `**Full Changelog**: ${full}` : '';
    let sections = '';

    groups.forEach((commits, title) => {
        if(title !== '🚀 Releases') {
            sections += commitSection(title, commits);
        }
    })

    return `${title}${sections}${footer}`;
}

function commitSection(title: string, commits: Commit[]) {
    return `### ${title}\n` +
        commits.map(commitItem).join('\n') +
        '\n\n';
}

function commitItem(commit: Commit) {
    const breaking = commit.subject.breaking ? '💥 ' : '';
    const author = commit.author ? `, by ${commit.author}` : '';
    const scope = commit.subject.scope ? `(${commit.subject.scope}) ` : '';

    return `* ${breaking}${commit.hash} ${scope}${commit.subject.msg}${author}`;
}

