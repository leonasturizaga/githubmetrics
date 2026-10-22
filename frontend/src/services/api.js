const API_BASE = 'http://localhost:8080/api';

export async function fetchTeamMetrics() {
  const res = await fetch(`${API_BASE}/metrics/team`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}