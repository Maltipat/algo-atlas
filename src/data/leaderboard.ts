/** Other learners shown on the leaderboard in mock mode. */
export interface LeaderboardPeer {
  id: string;
  name: string;
  username: string;
  country: string;
  xp: number;
  weeklyXp: number;
  solved: number;
  streak: number;
  avatarHue: number;
}

const names: [string, string][] = [
  ["Ananya Iyer", "IN"], ["Rohan Gupta", "IN"], ["Wei Ling Tan", "SG"], ["Nur Aisyah", "MY"], ["Kavya Reddy", "IN"],
  ["Arjun Nair", "IN"], ["Putri Lestari", "ID"], ["Siddharth Rao", "IN"], ["Mei Chen", "SG"], ["Farhan Hakim", "MY"],
  ["Ishaan Kapoor", "IN"], ["Dewi Kusuma", "ID"], ["Priya Menon", "IN"], ["Haziq Rahman", "MY"], ["Neha Joshi", "IN"],
  ["Rizky Pratama", "ID"], ["Aditya Kulkarni", "IN"], ["Jun Hao Lim", "SG"], ["Sneha Pillai", "IN"], ["Aiman Zulkifli", "MY"],
  ["Vikram Singh", "IN"], ["Sari Wulandari", "ID"], ["Tanvi Shah", "IN"], ["Daniel Ong", "SG"],
];

export const leaderboardPeers: LeaderboardPeer[] = names.map(([name, country], i) => {
  const seed = (i * 7919 + 104729) % 997;
  const solved = 230 - i * 8 - (seed % 9);
  return {
    id: `peer-${i + 1}`,
    name,
    username: name.toLowerCase().replace(/[^a-z]+/g, "_"),
    country,
    solved,
    xp: solved * 27 + (seed % 400),
    weeklyXp: 120 + ((seed * 13) % 520),
    streak: (seed % 45) + 1,
    avatarHue: (seed * 37) % 360,
  };
});
