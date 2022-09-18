import { getInput } from '@actions/core';
import { getOctokit } from '@actions/github';

const token = getInput('token', { required: true });
const octokit = getOctokit(token);

console.log('Initial setup');