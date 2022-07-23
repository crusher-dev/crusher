class CI {
    static getEnvironmentInfo() : { ci: { repoName?: string; commitId: string; branchName: string, commitMessage: string; } } | {} {
        const processEnv = eval("process.env");

        if(processEnv.VERCEL) {
            return {
                ci: {
                    repoName: `${processEnv.VERCEL_GIT_REPO_OWNER}/${processEnv.VERCEL_GIT_REPO_SLUG}`,
                    commitId: `${processEnv.VERCEL_GIT_COMMIT_SHA}`,
                    commitMessage: `${processEnv.VERCEL_GIT_COMMIT_MESSAGE}`,
                    branchName: `${processEnv.VERCEL_GIT_COMMIT_REF}`,
                }
            }
        } else if (process.env.GITHUB_ACTIONS) {
            return {
                ci: {
                    repoName: `${processEnv.GITHUB_REPOSITORY}`,
                    commitId: `${processEnv.GITHUB_SHA}`,
                    commitMessage: `${processEnv.GITHUB_COMMIT_MESSAGE}`,
                    branchName: `${processEnv.GITHUB_REF_NAME}`,
                }
            }
        }
        return {};
    }
}

export { CI };