import { getOctokit } from '@actions/github';
import { inputs } from './core/input';

const opts = inputs();
const octokit = getOctokit(opts.token);

console.log(opts)
