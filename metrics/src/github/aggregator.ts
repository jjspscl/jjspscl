import { fetchUserStats } from "./client";
import type {
  MergedCalendarDay,
  MergedData,
  MergedLanguage,
  MergedStats,
  StreakData,
  UserStatsResponse,
} from "./types";

interface AccountConfig {
  token: string;
  username: string;
}

async function fetchAndMerge(
  accounts: AccountConfig[],
): Promise<MergedData> {
  const results = await Promise.allSettled(
    accounts.map((a) => fetchUserStats(a.token, a.username)),
  );

  const successful: UserStatsResponse[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      successful.push(result.value);
    } else {
      console.error("Account fetch failed:", result.reason);
    }
  }

  if (successful.length === 0) {
    throw new Error("All GitHub account fetches failed");
  }

  const stats = mergeStats(successful);
  const languages = mergeLanguages(successful);
  const calendar = mergeCalendars(successful);
  const streak = calculateStreak(calendar);

  return {
    stats,
    languages,
    calendar,
    streak,
    generatedAt: new Date().toISOString(),
  };
}

function mergeStats(responses: UserStatsResponse[]): MergedStats {
  let totalCommits = 0;
  let totalPRs = 0;
  let totalIssues = 0;
  let totalReviews = 0;
  let totalStars = 0;
  let totalForks = 0;
  let totalRepos = 0;
  let contributedTo = 0;
  let followers = 0;

  for (const res of responses) {
    const user = res.data.user;
    const contrib = user.contributionsCollection;

    totalCommits +=
      contrib.totalCommitContributions + contrib.restrictedContributionsCount;
    totalPRs += contrib.totalPullRequestContributions;
    totalIssues += contrib.totalIssueContributions;
    totalReviews += contrib.totalPullRequestReviewContributions;
    contributedTo += contrib.totalRepositoriesWithContributedCommits;
    totalRepos += user.repositories.totalCount;
    followers += user.followers.totalCount;

    for (const repo of user.repositories.nodes) {
      totalStars += repo.stargazerCount;
      totalForks += repo.forkCount;
    }
  }

  return {
    totalCommits,
    totalPRs,
    totalIssues,
    totalReviews,
    totalStars,
    totalForks,
    totalRepos,
    contributedTo,
    followers,
  };
}

function mergeLanguages(responses: UserStatsResponse[]): MergedLanguage[] {
  const langMap = new Map<string, { color: string; size: number }>();

  for (const res of responses) {
    for (const repo of res.data.user.repositories.nodes) {
      for (const edge of repo.languages.edges) {
        const existing = langMap.get(edge.node.name);
        if (existing) {
          existing.size += edge.size;
        } else {
          langMap.set(edge.node.name, {
            color: edge.node.color,
            size: edge.size,
          });
        }
      }
    }
  }

  const sorted = [...langMap.entries()]
    .map(([name, data]) => ({ name, ...data, percentage: 0 }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

  const slicedTotal = sorted.reduce((sum, lang) => sum + lang.size, 0);

  for (const lang of sorted) {
    lang.percentage =
      slicedTotal > 0
        ? Math.round((lang.size / slicedTotal) * 1000) / 10
        : 0;
  }

  return sorted;
}

function mergeCalendars(responses: UserStatsResponse[]): MergedCalendarDay[] {
  const dayMap = new Map<string, number>();

  for (const res of responses) {
    const weeks = res.data.user.contributionsCollection.contributionCalendar.weeks;
    for (const week of weeks) {
      for (const day of week.contributionDays) {
        const existing = dayMap.get(day.date) ?? 0;
        dayMap.set(day.date, existing + day.contributionCount);
      }
    }
  }

  const days = [...dayMap.entries()]
    .map(([date, count]) => ({ date, count, level: 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  for (const day of days) {
    if (day.count === 0) {
      day.level = 0;
    } else if (day.count <= maxCount * 0.25) {
      day.level = 1;
    } else if (day.count <= maxCount * 0.5) {
      day.level = 2;
    } else if (day.count <= maxCount * 0.75) {
      day.level = 3;
    } else {
      day.level = 4;
    }
  }

  return days;
}

function calculateStreak(calendar: MergedCalendarDay[]): StreakData {
  if (calendar.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      currentStart: "",
      longestStart: "",
      longestEnd: "",
      totalContributions: 0,
    };
  }

  const totalContributions = calendar.reduce((sum, d) => sum + d.count, 0);

  let longestStreak = 0;
  let longestStart = "";
  let longestEnd = "";
  let tempStreak = 0;
  let tempStart = "";

  for (const day of calendar) {
    if (day.count > 0) {
      if (tempStreak === 0) {
        tempStart = day.date;
      }
      tempStreak++;

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStart = tempStart;
        longestEnd = day.date;
      }
    } else {
      tempStreak = 0;
      tempStart = "";
    }
  }

  const today = new Date().toISOString().split("T")[0]!;
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0]!;

  let currentStreak = 0;
  let currentStart = "";
  const reversed = [...calendar].reverse();

  for (const day of reversed) {
    if (currentStreak === 0 && day.date !== today && day.date !== yesterday) {
      break;
    }
    if (day.count > 0) {
      currentStreak++;
      currentStart = day.date;
    } else if (currentStreak > 0) {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak,
    currentStart,
    longestStart,
    longestEnd,
    totalContributions,
  };
}

export { fetchAndMerge };
export type { AccountConfig };
