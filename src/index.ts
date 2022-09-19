import { info } from '@actions/core';
import { getOctokit } from '@actions/github';
import { inputs } from './core/input';

const opts = inputs();
const octokit = getOctokit(opts.token);

info('Getting commits');
getCommits();

async function getCommits() {
    const commits = await octokit.paginate(
        octokit.rest.repos.listCommits,
        {
            owner: opts.repo.owner,
            repo: opts.repo.name,
            per_page: 100,
        }
    )

    console.log(commits);
}
