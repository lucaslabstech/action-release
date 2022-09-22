import { Commit } from '../../src/common/common.types';
import { validConvComTypes } from '../../src/core/conv-commit';

export interface TestSubject {
    t?: string; // type
    sc?: string; // scope
    b?: string; // breaking
    s?: string; // subject
    c: string; // compiled
}

export const makeValidMsgs = () =>
    validConvComTypes
        .map<TestSubject[]>((type) => {
            return generateSubjectList('this is a commit message', type, 'scope', '!');
        })
        .flat();

export const makeInvalidMsgs = () => [
    generateSubjectList('this is a non conventional commit message'),
    generateSubjectList('this: is also a non conventional commit message'),
    generateSubjectList('and(yet): another one'),
    generateSubjectList('and (another) one'),
];

function generateSubjectList(s: string): TestSubject;
function generateSubjectList(s: string, t: string, sc: string, b: string): TestSubject[];
function generateSubjectList(s: string, t?: string, sc?: string, b?: string) {
    if (!t && !sc && !b) return { c: s, s } as TestSubject;

    const resp: TestSubject[] = [
        { c: `${t}: ${s}`, t, s }, // <type>: <subject>
        { c: `${t}:${s}`, t, s }, // <type>:<subject>
        { c: `${t}${b}: ${s}`, t, b, s }, // <type><break>: <subject>
        { c: `${t}${b}:${s}`, t, b, s }, // <type><break>:<subject>
        { c: `${t} (${sc}):    ${s}`, t, sc, s }, // <type> (<scope>): <subject>
        { c: `${t} (${sc}):${s}`, t, sc, s }, // <type> (<scope>):<subject>
        { c: `${t} (${sc})${b}: ${s}`, t, sc, b, s }, // <type> (<scope>)<break>: <subject>
        { c: `${t}    (${sc})${b}:${s}`, t, sc, b, s }, // <type> (<scope>)<break>:<subject>
        { c: `${t}(${sc}): ${s}`, t, sc, s }, // <type> (<scope>): <subject>
        { c: `${t}(${sc}):${s}`, t, sc, s }, // <type> (<scope>):<subject>
        { c: `${t}(${sc})${b}: ${s}`, t, sc, b, s }, // <type> (<scope>)<break>: <subject>
        { c: `${t}(${sc})${b}:${s}`, t, sc, b, s }, // <type> (<scope>)<break>:<subject>
    ];

    return resp;
}

export const getTestCommits = () => {
    return [
        {
            subject: {
                type: 'feat',
                scope: 'core',
                breaking: true,
                msg: 'a new feature',
            },
            body: [],
            hash: 'a4de96b',
            author: '@jcolombo1',
            date: '2022-09-15T22:01:40Z',
        },
        {
            subject: {
                type: 'release',
                scope: undefined,
                breaking: false,
                msg: '🚀 v2.0.9',
            },
            body: [],
            hash: 'a3145cc',
            author: '@jcolombo1',
            date: '2022-09-16T19:10:33Z',
        },
        {
            subject: {
                type: 'feat',
                scope: undefined,
                breaking: false,
                msg: 'alert message - binance PROD token',
            },
            body: [
                '',
                '',
                '+ adds an alert message when starting',
                '  the app in development mode, but',
                '  using PROD binance tokens.',
            ],
            hash: 'a3145cc',
            author: '@jcolombo1',
            date: '2022-09-16T19:10:33Z',
        },
        {
            subject: {
                type: 'release',
                scope: undefined,
                breaking: false,
                msg: 'v2.0.7',
            },
            body: [],
            hash: 'a3145cc',
            author: '@jcolombo1',
            date: '2022-09-16T19:10:33Z',
        },
        {
            subject: {
                msg: 'this is a non conventional commit',
            },
            body: [],
            hash: 'a3145cc',
            author: '@jcolombo1',
            date: '2022-09-16T19:10:33Z',
        },
    ] as Commit[];
};
