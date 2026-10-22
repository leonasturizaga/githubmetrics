import { useEffect, useState } from 'react';
import { fetchTeamMetrics } from '../services/api';

export default function KpiDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeamMetrics()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading metrics from GitHub...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="dashboard">
      <h1>Team KPIs – {data.repo}</h1>
      <p>Base branch: <strong>{data.baseBranch}</strong></p>

      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Total PRs</th>
            <th>Merged to DEV</th>
            <th>Open</th>
            <th>Last Activity</th>
          </tr>
        </thead>
        <tbody>
          {data.members.map(m => (
            <tr key={m.username}>
              <td>{m.username}</td>
              <td>{m.totalPrs}</td>
              <td><strong>{m.mergedToDev}</strong></td>
              <td>{m.openPrs}</td>
              <td>{m.lastActivity ? new Date(m.lastActivity).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}