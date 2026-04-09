const CONTRIBUTION_LEVEL = {
  NONE: "NONE",
  FIRST_QUARTILE: "FIRST_QUARTILE",
  SECOND_QUARTILE: "SECOND_QUARTILE",
  THIRD_QUARTILE: "THIRD_QUARTILE",
  FOURTH_QUARTILE: "FOURTH_QUARTILE",
} as const;

type ContributionLevel =
  (typeof CONTRIBUTION_LEVEL)[keyof typeof CONTRIBUTION_LEVEL];

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionsCollection {
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  totalRepositoriesWithContributedCommits: number;
  restrictedContributionsCount: number;
  contributionCalendar: {
    totalContributions: number;
    weeks: ContributionWeek[];
  };
}

interface LanguageEdge {
  size: number;
  node: {
    name: string;
    color: string;
  };
}

interface RepositoryNode {
  name: string;
  stargazerCount: number;
  forkCount: number;
  languages: {
    edges: LanguageEdge[];
  };
}

interface UserStatsResponse {
  data: {
    user: {
      contributionsCollection: ContributionsCollection;
      repositories: {
        totalCount: number;
        nodes: RepositoryNode[];
      };
      followers: {
        totalCount: number;
      };
    };
  };
}

interface MergedStats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalReviews: number;
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  contributedTo: number;
  followers: number;
}

interface MergedLanguage {
  name: string;
  color: string;
  size: number;
  percentage: number;
}

interface MergedCalendarDay {
  date: string;
  count: number;
  level: number;
}

interface MergedData {
  stats: MergedStats;
  languages: MergedLanguage[];
  calendar: MergedCalendarDay[];
  streak: StreakData;
  generatedAt: string;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  currentStart: string;
  longestStart: string;
  longestEnd: string;
  totalContributions: number;
}

export type {
  ContributionDay,
  ContributionLevel,
  ContributionWeek,
  ContributionsCollection,
  LanguageEdge,
  MergedCalendarDay,
  MergedData,
  MergedLanguage,
  MergedStats,
  RepositoryNode,
  StreakData,
  UserStatsResponse,
};
