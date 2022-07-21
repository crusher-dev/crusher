class CI {
    static getEnvironmentInfo() : { ci: { repoName?: string; commitId: string; branchName: string, commitMessage: string; } } | {} {
        if(process.env.VERCEL) {
            return {
                ci: {
                    repoName: `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`,
                    commitId: `${process.env.VERCEL_GIT_COMMIT_SHA}`,
                    commitMessage: `${process.env.VERCEL_GIT_COMMIT_MESSAGE}`,
                    branchName: `${process.env.VERCEL_GIT_COMMIT_REF}`,
                }
            }
        } else if (process.env.GITHUB_ACTIONS) {
            return {
                ci: {
                    repoName: `${process.env.GITHUB_REPOSITORY}`,
                    commitId: `${process.env.GITHUB_SHA}`,
                    commitMessage: `${process.env.GITHUB_COMMIT_MESSAGE}`,
                    branchName: `${process.env.GITHUB_REF_NAME}`,
                }
            }
        }
        return {};
    }
}

export { CI };