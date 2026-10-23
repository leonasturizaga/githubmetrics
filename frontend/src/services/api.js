// const API_BASE = 'http://localhost:8080/api';

// export async function fetchTeamMetrics() {
//   const res = await fetch(`${API_BASE}/metrics/team`);
//   if (!res.ok) throw new Error('Failed to fetch metrics');
//   return res.json();
// }

// export async function fetchParticipation() {
//   const res = await fetch(`${API_BASE}/metrics/participation`);
//   if (!res.ok) throw new Error('Failed to fetch participation stats');
//   return res.json();
// }

// export async function fetchContributors() {
//   const res = await fetch(`${API_BASE}/metrics/contributors`);
//   if (!res.ok) throw new Error('Failed to fetch contributors');
//   return res.json();
// }

// export async function fetchAccurateMetrics() {
//   const res = await fetch(`${API_BASE}/metrics/accurate`);
//   if (!res.ok) throw new Error('Failed to fetch accurate metrics');
//   return res.json();
// }


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch ${path}: ${res.status} ${errorText}`);
  }
  return res.json();
}

export const fetchTeamMetrics     = () => fetchJson('/metrics/team');
export const fetchParticipation   = () => fetchJson('/metrics/participation');
export const fetchContributors    = () => fetchJson('/metrics/contributors');
export const fetchAccurateMetrics = () => fetchJson('/metrics/accurate');
export const fetchCommits         = () => fetchJson('/metrics/commits');
export const fetchPrDetails       = () => fetchJson('/metrics/pr-details');