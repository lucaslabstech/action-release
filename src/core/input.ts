import { getInput } from '@actions/core';

export function inputs() {
    const token = getInput('token', { required: true });
    const from = getInput('from', { required: true });
    const to = getInput('to', { required: true });
    const nextVersion = getInput('next-version', { required: true });
    const includeBody = getInput('include-body', { required: false })?.toLowerCase() === 'true';
    const includeHash = getInput('include-hash', { required: false })?.toLowerCase() === 'true';
    const includeAuthor = getInput('include-author', { required: false })?.toLowerCase() === 'true';
    const includePr = getInput('include-pr', { required: false })?.toLowerCase() === 'true';

    return {
        token,
        opts: {
            from,
            to,
            nextVersion,
            include: {
                body: includeBody,
                hash: includeHash,
                author: includeAuthor,
                pr: includePr,
            }
        }
    } as Input;
}

export interface Input {
    token: string;
    opts: {
        from: string;
        to: string;
        nextVersion: string;
        include: {
            body: boolean;
            hash: boolean;
            author: boolean;
            pr: boolean;
        }
    }
}