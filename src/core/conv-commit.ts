import {
    Commit,
    CommitSubject,
    ComparisonResponse,
    ConvComTitle,
    ConvComType,
    ConventionalCommitTypes,
    FALLBACK_TYPE,
} from '../common/common.types';
import { trimLeftNonAlpha } from '../common/utils';

//  validCommitTypes is an array of all the aliases of every conventionalCommitType except if it contains the fallback
export const validConvComTypes = ConventionalCommitTypes.filter(
    (type) => !(type.aliases as unknown as string[]).includes(FALLBACK_TYPE)
)
    .map((type) => type.aliases)
    .flat() as ConvComType[];

/** Conventional commit regex */
export const CCRegex = generateConvCommitRegex();
export const SubjectBodyRegex = /(?<subject>[^\n]{1,}){0,}(?<body>.*\n*){0,}/s;

/** Generate conventional commit regex */
function generateConvCommitRegex() {
    const types = validConvComTypes.join('|');
    return new RegExp(
        `^(?<type>${types})(?:\\s{0,})(?:\\((?<scope>.*)\\))?(?<breaking>!{0,1})?(?:\\s{0,}\\:\\s*)?(?<subject>.*)?$`,
        'i'
    );
}

export function shortenHash(hash: string) {
    if (!hash || hash.length < 7) return hash || '';
    return hash.slice(0, 7);
}

// get ConventionalCommitTypes title by alias
export function getTitle(type?: ConvComType) {
    const alias = type || FALLBACK_TYPE;

    return ConventionalCommitTypes.find((type) =>
        (type.aliases as unknown as string[]).includes(alias)
    )?.title || '📝 Other changes';
}

/* get Commit[] from ComparisonResponse */
export function transformCommits(comparisonResponse: ComparisonResponse) {
    return comparisonResponse.commits.map((obj) => {
        let subject: CommitSubject;
        const commit = obj.commit;
        const matchCommit = commit.message.match(SubjectBodyRegex);
        const msg = trimLeftNonAlpha(matchCommit?.groups?.subject);
        const body = matchCommit?.groups?.body?.split('\n') || [];
        const matchConvCom: RegExpMatchArray | null = msg.match(CCRegex);

        if (!matchConvCom || !matchConvCom.groups) {
            subject = { msg };
        } else {
            const { type, scope, breaking, subject: msg } = matchConvCom.groups;
            subject = {
                type: type as ConvComType,
                scope,
                breaking: breaking ? true : false,
                msg
            };
        }

        return {
            subject,
            body,
            hash: shortenHash(obj.sha) || '',
            author: obj.author?.login ? `@${obj.author?.login}` : '',
            date: commit.author?.date || '',
        } as Commit;
    });
}

export function groupCommitsByType(commits: Commit[]) {
    const groups = new Map<ConvComTitle, Commit[]>();

    commits.forEach((commit) => {
        const title = getTitle(commit.subject.type);
        const group = groups.get(title);
        if (group) {
            group.push(commit);
        } else {
            groups.set(title, [commit]);
        }
    });

    return groups;
}
