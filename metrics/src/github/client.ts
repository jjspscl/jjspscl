import type { UserStatsResponse } from "./types";
import { USER_STATS_QUERY } from "./queries";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

interface GraphQLResponse {
  data?: UserStatsResponse["data"];
  errors?: Array<{ message: string }>;
}

async function fetchUserStats(
  token: string,
  username: string,
): Promise<UserStatsResponse> {
  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "jjspscl-metrics-worker",
    },
    body: JSON.stringify({
      query: USER_STATS_QUERY,
      variables: { username },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `GitHub API error (${response.status}): ${body.slice(0, 200)}`,
    );
  }

  const json = (await response.json()) as GraphQLResponse;

  if (json.errors?.length) {
    const messages = json.errors.map((e) => e.message).join("; ");
    throw new Error(`GitHub GraphQL errors: ${messages}`);
  }

  if (!json.data?.user) {
    throw new Error(`GitHub user "${username}" not found`);
  }

  return { data: json.data } as UserStatsResponse;
}

export { fetchUserStats };
