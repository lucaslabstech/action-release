import gh from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { Commit, ComparisonResponse, ConvComTitle } from '../common/common.types';
import { Logger } from '../common/logger';
import { groupCommitsByType, transformCommits } from './conv-commit';
import { Input } from './input';
import { toMd } from './md';

export class ChangelogGenerator {
    private octokit: InstanceType<typeof GitHub>;
    private comparison?: ComparisonResponse;
    private owner: string;
    private repo: string;
    public commits?: Commit[];
    public groupedCommits?: Map<ConvComTitle, Commit[]>;

    private constructor(private input: Input) {
        this.octokit = gh.getOctokit(input.token);
        this.owner = gh.context.repo.owner;
        this.repo = gh.context.repo.repo;

        console.log('Context:');
        console.log(gh.context);
    }

    static async construct(options: Input) {
        Logger.info(`Creating changelog generator`);
        console.log(options);

        const changelog = new ChangelogGenerator(options);
        await changelog.compareBaseHead();
        changelog.setCommits();

        return changelog;
    }

    private async compareBaseHead() {
        this.comparison = await this.octokit.paginate(
            this.octokit.rest.repos.compareCommitsWithBasehead,
            {
                owner: this.owner,
                repo: this.repo,
                basehead: `${this.input.opts.from}...${this.input.opts.to}`,
                per_page: 100,
            }
        );

        if (!this.comparison) {
            throw new Error(
                `Could not compare ${this.input.opts.from}...${this.input.opts.to}`
            );
        }
    }

    private setCommits() {
        if (this.comparison?.commits) {
            this.commits = transformCommits(this.comparison);
            this.groupedCommits = groupCommitsByType(this.commits);
        }
    }

    /** get markdown changelog */
    public get md(): string {
        if (!this.groupedCommits) return '';
        return toMd(
            this.groupedCommits,
            `https://github.com/${this.owner}/${this.repo}/compare/${this.input.opts.from}...${this.input.opts.nextVersion}`
        );
    }
}
