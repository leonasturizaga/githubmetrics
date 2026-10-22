// import { useEffect, useState } from 'react';
// import { fetchTeamMetrics } from '../services/api';

// export default function KpiDashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchTeamMetrics()
//       .then(setData)
//       .catch(err => setError(err.message))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div className="loading">Loading metrics from GitHub...</div>;
//   if (error) return <div className="error">Error: {error}</div>;
//   if (!data) return null;

//   return (
//     <div className="dashboard">
//       <h1>Team KPIs – {data.repo}</h1>
//       <p>Base branch: <strong>{data.baseBranch}</strong></p>

//       <table>
//         <thead>
//           <tr>
//             <th>Member</th>
//             <th>Total PRs</th>
//             <th>Merged to DEV</th>
//             <th>Open</th>
//             <th>Last Activity</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.members.map(m => (
//             <tr key={m.username}>
//               <td>{m.username}</td>
//               <td>{m.totalPrs}</td>
//               <td><strong>{m.mergedToDev}</strong></td>
//               <td>{m.openPrs}</td>
//               <td>{m.lastActivity ? new Date(m.lastActivity).toLocaleDateString() : '-'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { fetchTeamMetrics, fetchParticipation, fetchContributors } from '../services/api';
import './KpiDashboard.css';

export default function KpiDashboard() {
  const [team, setTeam] = useState(null);
  const [participation, setParticipation] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchTeamMetrics(),
      fetchParticipation(),
      fetchContributors()
    ])
      .then(([teamData, partData, contribData]) => {
        setTeam(teamData);
        setParticipation(partData);
        setContributors(contribData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading metrics from GitHub...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard">
      <header>
        <h1>Team Metrics</h1>
        <p className="repo-info">
          {team?.repo} · Base branch: <strong>{team?.baseBranch}</strong>
        </p>
      </header>

      {/* ========== PARTICIPATION BAR ========== */}
      {participation && (
        <section className="card participation-card">
          <h2>Owner Participation (last ~52 weeks)</h2>
          <div className="participation-info">
            <span>Owner commits: <strong>{participation.totalOwnerCommits}</strong></span>
            <span>Total commits: <strong>{participation.totalAllCommits}</strong></span>
            <span>Owner share: <strong>{participation.ownerParticipationPercentage}%</strong></span>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${participation.ownerParticipationPercentage}%` }}
            >
              {participation.ownerParticipationPercentage > 8 &&
                `${participation.ownerParticipationPercentage}%`}
            </div>
          </div>
        </section>
      )}

      {/* ========== PR TABLE ========== */}
      <section className="card">
        <h2>Pull Requests to {team?.baseBranch}</h2>
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Total PRs</th>
              <th>Merged</th>
              <th>Open</th>
              <th>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {team?.members?.map(m => (
              <tr key={m.username}>
                <td>{m.username}</td>
                <td>{m.totalPrs}</td>
                <td><strong>{m.mergedToDev}</strong></td>
                <td>{m.openPrs}</td>
                <td>
                  {m.lastActivity
                    ? new Date(m.lastActivity).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ========== CONTRIBUTORS ========== */}
      <section className="card">
        <h2>Top Contributors (by commits)</h2>
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Total Commits</th>
            </tr>
          </thead>
          <tbody>
            {contributors.map(c => (
              <tr key={c.username}>
                <td>{c.username}</td>
                <td>{c.totalCommits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
