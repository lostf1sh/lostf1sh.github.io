const GITHUB_USERNAME = "lostf1sh";

export const getAllReposWithLanguages = async () => {
  try {
    const repos = [];
    let page = 1;
    const perPage = 100;

    // Fetch all repositories (handle pagination)
    while (true) {
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=${perPage}&page=${page}`
      );

      if (!response.ok) break;

      const data = await response.json();
      if (!data.length) break;

      repos.push(...data);

      if (data.length < perPage) break;
      page++;
    }

    // Count languages across all repos
    const languageCounts = {};

    repos.forEach((repo) => {
      if (repo.language) {
        languageCounts[repo.language] =
          (languageCounts[repo.language] || 0) + 1;
      }
    });

    // Sort by count (descending) and format
    const sortedLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([language, count]) => ({ language, count }));

    return {
      repos,
      languages: sortedLanguages,
      totalRepos: repos.length,
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return {
      repos: [],
      languages: [],
      totalRepos: 0,
    };
  }
};

export const getContributionData = async () => {
  const weeks = 53;
  const today = new Date();
  const year = today.getFullYear();

  try {
    // Use GitHub's contribution calendar API (used by github skyline)
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch contribution data");
    }

    const data = await response.json();

    // Extract contributions from the response
    const contributions = [];

    if (data.contributions) {
      data.contributions.forEach((contribution) => {
        contributions.push({
          date: contribution.date,
          count: contribution.count,
        });
      });
    }

    // If we got contributions, return them
    if (contributions.length > 0) {
      // Ensure we have exactly 53 weeks (371 days) of data
      const targetDays = weeks * 7;
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - targetDays + 1);

      const fullContributions = [];
      for (let i = 0; i < targetDays; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];

        const existing = contributions.find((c) => c.date === dateStr);
        fullContributions.push({
          date: dateStr,
          count: existing ? existing.count : 0,
        });
      }

      return fullContributions;
    }

    throw new Error("No contributions data available");
  } catch (error) {
    console.error("Error fetching contribution data:", error);

    // Fallback: Return empty year of data
    const contributionMap = new Map();
    for (let i = weeks * 7 - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      contributionMap.set(dateStr, 0);
    }

    return Array.from(contributionMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));
  }
};

export const getContributionLevel = (count) => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 8) return 3;
  return 4;
};

export const getGitHubContributionUrl = (date) => {
  // Format: https://github.com/USERNAME?tab=overview&from=YYYY-MM-DD&to=YYYY-MM-DD
  return `https://github.com/${GITHUB_USERNAME}?tab=overview&from=${date}&to=${date}`;
};
