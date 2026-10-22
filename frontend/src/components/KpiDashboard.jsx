// import { useEffect, useState } from 'react';
// import { fetchTeamMetrics, fetchParticipation, fetchContributors } from '../services/api';
// import './KpiDashboard.css';

// export default function KpiDashboard() {
//   const [team, setTeam] = useState(null);
//   const [participation, setParticipation] = useState(null);
//   const [contributors, setContributors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     Promise.all([
//       fetchTeamMetrics(),
//       fetchParticipation(),
//       fetchContributors()
//     ])
//       .then(([teamData, partData, contribData]) => {
//         setTeam(teamData);
//         setParticipation(partData);
//         setContributors(contribData);
//       })
//       .catch(err => setError(err.message))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div className="loading">Loading metrics from GitHub...</div>;
//   if (error) return <div className="error">Error: {error}</div>;

//   return (
//     <div className="dashboard">
//       <header>
//         <h1>Team Metrics</h1>
//         <p className="repo-info">
//           {team?.repo} · Base branch: <strong>{team?.baseBranch}</strong>
//         </p>
//       </header>

//       {/* ========== PARTICIPATION BAR ========== */}
//       {participation && (
//         <section className="card participation-card">
//           <h2>Owner Participation (last ~52 weeks)</h2>
//           <div className="participation-info">
//             <span>Owner commits: <strong>{participation.totalOwnerCommits}</strong></span>
//             <span>Total commits: <strong>{participation.totalAllCommits}</strong></span>
//             <span>Owner share: <strong>{participation.ownerParticipationPercentage}%</strong></span>
//           </div>

//           <div className="progress-bar-container">
//             <div
//               className="progress-bar"
//               style={{ width: `${participation.ownerParticipationPercentage}%` }}
//             >
//               {participation.ownerParticipationPercentage > 8 &&
//                 `${participation.ownerParticipationPercentage}%`}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ========== PR TABLE ========== */}
//       <section className="card">
//         <h2>Pull Requests to {team?.baseBranch}</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Member</th>
//               <th>Total PRs</th>
//               <th>Merged</th>
//               <th>Open</th>
//               <th>Last Activity</th>
//             </tr>
//           </thead>
//           <tbody>
//             {team?.members?.map(m => (
//               <tr key={m.username}>
//                 <td>{m.username}</td>
//                 <td>{m.totalPrs}</td>
//                 <td><strong>{m.mergedToDev}</strong></td>
//                 <td>{m.openPrs}</td>
//                 <td>
//                   {m.lastActivity
//                     ? new Date(m.lastActivity).toLocaleDateString()
//                     : '-'}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       {/* ========== CONTRIBUTORS ========== */}
//       <section className="card">
//         <h2>Top Contributors (by commits)</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Member</th>
//               <th>Total Commits</th>
//             </tr>
//           </thead>
//           <tbody>
//             {contributors.map(c => (
//               <tr key={c.username}>
//                 <td>{c.username}</td>
//                 <td>{c.totalCommits}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>
//     </div>
//   );
// }

//---------------- version 2 ----------------
// import { useEffect, useState } from 'react';
// import {
//   fetchTeamMetrics,
//   fetchParticipation,
//   fetchContributors,
//   fetchAccurateMetrics
// } from '../services/api';
// import './KpiDashboard.css';

// export default function KpiDashboard() {
//   const [activeTab, setActiveTab] = useState('accurate'); // 'accurate' | 'github-stats'
//   const [team, setTeam] = useState(null);
//   const [participation, setParticipation] = useState(null);
//   const [contributors, setContributors] = useState([]);
//   const [accurate, setAccurate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       fetchTeamMetrics(),
//       fetchParticipation(),
//       fetchContributors(),
//       fetchAccurateMetrics()
//     ])
//       .then(([teamData, partData, contribData, accurateData]) => {
//         setTeam(teamData);
//         setParticipation(partData);
//         setContributors(contribData);
//         setAccurate(accurateData);
//       })
//       .catch(err => setError(err.message))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div className="loading">Loading metrics...</div>;
//   if (error) return <div className="error">Error: {error}</div>;

//   return (
//     <div className="dashboard">
//       <header>
//         <h1>GitHub Team Metrics</h1>
//         <p className="repo-info">{team?.repo}</p>
//       </header>

//       {/* TABS */}
//       <div className="tabs">
//         <button
//           className={activeTab === 'accurate' ? 'active' : ''}
//           onClick={() => setActiveTab('accurate')}
//         >
//           Accurate Metrics (Recommended)
//         </button>
//         <button
//           className={activeTab === 'github-stats' ? 'active' : ''}
//           onClick={() => setActiveTab('github-stats')}
//         >
//           GitHub Official Stats
//         </button>
//       </div>

//       {/* ========== TAB 1: ACCURATE ========== */}
//       {activeTab === 'accurate' && accurate && (
//         <>
//           <section className="card">
//             <h2>Owner Participation (real data)</h2>
//             <div className="participation-info">
//               <span>Total commits: <strong>{accurate.totalCommits}</strong></span>
//               <span>Owner share: <strong>{accurate.ownerCommitPercentage}%</strong></span>
//             </div>
//             <div className="progress-bar-container">
//               <div
//                 className="progress-bar"
//                 style={{ width: `${accurate.ownerCommitPercentage}%` }}
//               >
//                 {accurate.ownerCommitPercentage > 5 &&
//                   `${accurate.ownerCommitPercentage}%`}
//               </div>
//             </div>
//           </section>

//           <section className="card">
//             <h2>Commits by Author</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Member</th>
//                   <th>Commits</th>
//                   <th>Additions</th>
//                   <th>Deletions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {accurate.commitAuthors.map(c => (
//                   <tr key={c.username}>
//                     <td>{c.username}</td>
//                     <td><strong>{c.totalCommits}</strong></td>
//                     <td className="green">+{c.totalAdditions}</td>
//                     <td className="red">-{c.totalDeletions}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </section>

//           <section className="card">
//             <h2>Pull Requests to {accurate.baseBranch}</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Title</th>
//                   <th>Author</th>
//                   <th>Commits</th>
//                   <th>Files</th>
//                   <th>+ / -</th>
//                   <th>Merged</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {accurate.pullRequests.map(pr => (
//                   <tr key={pr.number}>
//                     <td>#{pr.number}</td>
//                     <td>{pr.title}</td>
//                     <td>{pr.author}</td>
//                     <td>{pr.commits}</td>
//                     <td>{pr.filesChanged}</td>
//                     <td>
//                       <span className="green">+{pr.additions}</span>
//                       {' / '}
//                       <span className="red">-{pr.deletions}</span>
//                     </td>
//                     <td>{pr.merged ? 'Yes' : 'No'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </section>
//         </>
//       )}

//       {/* ========== TAB 2: GITHUB OFFICIAL STATS ========== */}
//       {activeTab === 'github-stats' && (
//         <>
//           <section className="card">
//             <h2>GitHub Official Participation (often delayed/zero)</h2>
//             <div className="participation-info">
//               <span>Owner commits: {participation?.totalOwnerCommits}</span>
//               <span>Total commits: {participation?.totalAllCommits}</span>
//               <span>Owner share: {participation?.ownerParticipationPercentage}%</span>
//             </div>
//             <div className="progress-bar-container">
//               <div
//                 className="progress-bar"
//                 style={{ width: `${participation?.ownerParticipationPercentage || 0}%` }}
//               />
//             </div>
//           </section>

//           <section className="card">
//             <h2>GitHub Official Contributors</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Member</th>
//                   <th>Total Commits</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {contributors.map(c => (
//                   <tr key={c.username}>
//                     <td>{c.username}</td>
//                     <td>{c.totalCommits}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </section>

//           <section className="card">
//             <h2>PRs (from /team endpoint)</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Member</th>
//                   <th>Total PRs</th>
//                   <th>Merged</th>
//                   <th>Open</th>
//                   <th>Last Activity</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {team?.members?.map(m => (
//                   <tr key={m.username}>
//                     <td>{m.username}</td>
//                     <td>{m.totalPrs}</td>
//                     <td>{m.mergedToDev}</td>
//                     <td>{m.openPrs}</td>
//                     <td>
//                       {m.lastActivity
//                         ? new Date(m.lastActivity).toLocaleDateString()
//                         : '-'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </section>
//         </>
//       )}
//     </div>
//   );
// }

//---------------- version 3 ----------------
import { useEffect, useState } from 'react';
import {
  fetchTeamMetrics,
  fetchParticipation,
  fetchContributors,
  fetchAccurateMetrics
} from '../services/api';
import './KpiDashboard.css';

export default function KpiDashboard() {
  const [activeTab, setActiveTab] = useState('accurate');
  const [team, setTeam] = useState(null);
  const [participation, setParticipation] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [accurate, setAccurate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTeamMetrics(),
      fetchParticipation(),
      fetchContributors(),
      fetchAccurateMetrics()
    ])
      .then(([t, p, c, a]) => {
        setTeam(t);
        setParticipation(p);
        setContributors(c);
        setAccurate(a);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="state">Loading metrics from GitHub…</div>;
  if (error)   return <div className="state error">Error: {error}</div>;

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>GitHub Team Metrics</h1>
          <p className="repo">{team?.repo} · base branch <strong>{team?.baseBranch}</strong></p>
        </div>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'accurate' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('accurate')}
        >
          Accurate Metrics
        </button>
        <button
          className={activeTab === 'github-stats' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('github-stats')}
        >
          GitHub Official Stats
        </button>
      </nav>

      {/* ===================== ACCURATE TAB ===================== */}
      {activeTab === 'accurate' && accurate && (
        <div className="content">
          {/* Summary cards */}
          <div className="cards-row">
            <div className="stat-card">
              <span className="label">Total Commits (via PRs)</span>
              <span className="value">{accurate.totalCommits}</span>
            </div>
            <div className="stat-card">
              <span className="label">Owner Share</span>
              <span className="value">{accurate.ownerCommitPercentage}%</span>
            </div>
            <div className="stat-card">
              <span className="label">Pull Requests</span>
              <span className="value">{accurate.pullRequests.length}</span>
            </div>
          </div>

          {/* Participation bar */}
          <section className="panel">
            <h2>Owner Participation</h2>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${accurate.ownerCommitPercentage}%` }}
              >
                {accurate.ownerCommitPercentage >= 12 &&
                  `${accurate.ownerCommitPercentage}%`}
              </div>
            </div>
          </section>

          {/* Commits by author */}
          <section className="panel">
            <h2>Commits by Author</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Commits</th>
                    <th>Additions</th>
                    <th>Deletions</th>
                  </tr>
                </thead>
                <tbody>
                  {accurate.commitAuthors.map(c => (
                    <tr key={c.username}>
                      <td className="member">{c.username}</td>
                      <td><strong>{c.totalCommits}</strong></td>
                      <td className="add">+{c.totalAdditions.toLocaleString()}</td>
                      <td className="del">−{c.totalDeletions.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* PR details */}
          <section className="panel">
            <h2>Pull Requests to {accurate.baseBranch}</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Commits</th>
                    <th>Files</th>
                    <th>Changes</th>
                    <th>Merged</th>
                  </tr>
                </thead>
                <tbody>
                  {accurate.pullRequests.map(pr => (
                    <tr key={pr.number}>
                      <td>#{pr.number}</td>
                      <td className="title">{pr.title}</td>
                      <td>{pr.author}</td>
                      <td>{pr.commits}</td>
                      <td>{pr.filesChanged}</td>
                      <td>
                        <span className="add">+{pr.additions}</span>
                        {' / '}
                        <span className="del">−{pr.deletions}</span>
                      </td>
                      <td>
                        <span className={pr.merged ? 'badge yes' : 'badge no'}>
                          {pr.merged ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ===================== GITHUB STATS TAB ===================== */}
      {activeTab === 'github-stats' && (
        <div className="content">
          <section className="panel">
            <h2>Official Participation (often delayed)</h2>
            <div className="participation-info">
              <span>Owner: {participation?.totalOwnerCommits ?? 0}</span>
              <span>Total: {participation?.totalAllCommits ?? 0}</span>
              <span>Share: {participation?.ownerParticipationPercentage ?? 0}%</span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill muted"
                style={{ width: `${participation?.ownerParticipationPercentage || 0}%` }}
              />
            </div>
          </section>

          <section className="panel">
            <h2>Official Contributors</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Commits</th>
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
            </div>
          </section>

          <section className="panel">
            <h2>PR Summary (from /team)</h2>
            <div className="table-wrapper">
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
                      <td>{m.mergedToDev}</td>
                      <td>{m.openPrs}</td>
                      <td>
                        {m.lastActivity
                          ? new Date(m.lastActivity).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}