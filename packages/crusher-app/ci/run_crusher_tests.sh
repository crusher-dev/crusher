curl --location --request POST 'https://backend.crusher.dev/projects/258/tests/actions/run' --header 'Content-Type: application/x-www-form-urlencoded' --cookie "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjgyIiwidGVhbV9pZCI6MjE5LCJpYXQiOjE2NTI1MDgzODgsImV4cCI6MTY4NDA0NDM4OH0.FVPHPheotR_ib9lqQkaDkrU0TGqgME0ZCdoyWV7Q-7c" --data-urlencode "githubRepoName=crusherdev/crusher" --data-urlencode "host=https://"$VERCEL_URL --data-urlencode "githubCommitId="$VERCEL_GIT_COMMIT_SHA &