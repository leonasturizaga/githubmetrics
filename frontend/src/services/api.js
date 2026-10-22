const API_BASE = 'http://localhost:8080/api';

export async function fetchTeamMetrics() {
  const res = await fetch(`${API_BASE}/metrics/team`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

export async function fetchParticipation() {
  const res = await fetch(`${API_BASE}/metrics/participation`);
  if (!res.ok) throw new Error('Failed to fetch participation stats');
  return res.json();
}

export async function fetchContributors() {
  const res = await fetch(`${API_BASE}/metrics/contributors`);
  if (!res.ok) throw new Error('Failed to fetch contributors');
  return res.json();
}