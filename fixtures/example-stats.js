const DAY_MS = 86400000;
const start = Date.UTC(2025, 8, 7);

const days = Array.from({ length: 371 }, (_, index) => {
  const wave = Math.sin(index * 0.31) + Math.cos(index * 0.13);
  const active = index % 11 === 0 || index % 17 === 0 || wave > 1.42;
  const count = active ? 1 + ((index * 7) % 13) : 0;
  return {
    date: new Date(start + index * DAY_MS).toISOString().slice(0, 10),
    count,
    level: count === 0 ? 0 : count < 4 ? 1 : count < 7 ? 2 : count < 10 ? 3 : 4,
    future: false,
  };
});

const weeklyTotals = Array.from({ length: 53 }, (_, week) => (
  days.slice(week * 7, week * 7 + 7).reduce((sum, day) => sum + day.count, 0)
));

export const exampleStats = {
  profile: {
    login: 'octocat',
    name: 'The Octocat',
    publicRepos: 42,
    followers: 18000,
    activeRepos: [
      { name: 'hello-world', language: 'JavaScript', stars: 82 },
      { name: 'octo-garden', language: 'TypeScript', stars: 34 },
      { name: 'space-lab', language: 'Rust', stars: 21 },
      { name: 'tiny-tools', language: 'Go', stars: 13 }
    ],
    activeRepoStars: 150
  },
  calendar: {
    totalContributions: days.reduce((sum, day) => sum + day.count, 0),
    currentStreak: 8,
    longestStreak: 31,
    activeDays: days.filter((day) => day.count > 0).length,
    firstDate: days[0].date,
    weeklyTotals,
    days
  }
};
