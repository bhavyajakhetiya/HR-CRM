import { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart3, TrendingUp, Users, Calendar, Download } from 'lucide-react';

export default function AdminReports() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [error, setError] = useState('');

  // Hover states for interactive charts
  const [hoveredStatus, setHoveredStatus] = useState(null);
  const [hoveredDayIndex, setHoveredDayIndex] = useState(null);

  // 1. Initialize Date Range (Default: Last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDateString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setEndDate(formatDateString(today));
    setStartDate(formatDateString(thirtyDaysAgo));
  }, []);

  // 2. Fetch Employee List for Dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error('Failed to load employees:', err);
        setError('Failed to load employee list.');
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  // 3. Fetch Report Data when Employee or Dates change
  useEffect(() => {
    if (!selectedEmployeeId || !startDate || !endDate) return;

    const fetchReport = async () => {
      setLoadingReport(true);
      setError('');
      try {
        const res = await api.get(`/reports/employee/${selectedEmployeeId}`, {
          params: { startDate, endDate }
        });
        setReportData(res.data);
      } catch (err) {
        console.error('Failed to load report data:', err);
        setError(err.response?.data?.message || 'Failed to load report analytics.');
      } finally {
        setLoadingReport(false);
      }
    };

    fetchReport();
  }, [selectedEmployeeId, startDate, endDate]);

  // Helper: Format Date & Time for display (e.g. "23 Jun 2026, 12:35")
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  // Helper: Format Date for tooltips (e.g. "23 June 2026")
  const formatDateFull = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = d.getDate();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Helper: Format Date for input formatting / display (e.g. "24/05/2026")
  const formatDateSlash = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Export to CSV Function
  const handleExportCSV = () => {
    if (!reportData || !reportData.activityLogs || reportData.activityLogs.length === 0) {
      alert('No activity logs found to export.');
      return;
    }

    const headers = ['Date & Time', 'Action', 'Candidate', 'Details'];
    const rows = reportData.activityLogs.map((log) => [
      formatDateTime(log.createdAt),
      log.action,
      log.candidate?.name || '-',
      log.details || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportData.employee.name.replace(/\s+/g, '_')}_Activity_Log_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loadingEmployees) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-outline text-body-md">Loading employee list...</p>
      </div>
    );
  }

  // Define status badge styling classes
  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase();
    if (s === 'registered') return 'badge-neutral';
    if (s === 'screening') return 'badge-warning';
    if (s === 'contacted') return 'badge-info';
    if (s === 'interview scheduled' || s === 'screening scheduled') return 'badge-primary';
    if (s === 'offered' || s === 'joined') return 'badge-success';
    if (s === 'rejected') return 'badge-error';
    return 'badge-neutral';
  };

  // Dynamic Action Badge colors for the Activity Log
  const getActionBadgeClass = (action) => {
    const act = action?.toLowerCase();
    if (act?.includes('deselect') || act?.includes('unselect') || act?.includes('delete')) {
      return 'bg-red-50 text-red-700 border border-red-200';
    }
    if (act?.includes('select') || act?.includes('create') || act?.includes('add')) {
      return 'bg-green-50 text-green-700 border border-green-200';
    }
    if (act?.includes('input') || act?.includes('submit') || act?.includes('update')) {
      return 'bg-purple-50 text-purple-700 border border-purple-200';
    }
    return 'badge-neutral';
  };

  // ── Render SVG Donut Chart ──────────────────────────────────────
  const renderDonutChart = () => {
    if (!reportData || !reportData.statusDistribution) return null;

    const distribution = reportData.statusDistribution;
    const statuses = Object.keys(distribution);
    const total = statuses.reduce((sum, key) => sum + distribution[key], 0);

    if (total === 0) {
      return (
        <div className="h-48 flex flex-col items-center justify-center text-outline">
          <span className="material-symbols-outlined text-4xl mb-2">donut_large</span>
          <p className="text-sm font-medium">No candidate data available</p>
        </div>
      );
    }

    const statusColors = {
      'Registered': '#3B82F6',
      'Screening': '#F59E0B',
      'Contacted': '#8B5CF6',
      'Interview Scheduled': '#10B981',
      'Offered': '#EC4899',
      'Joined': '#06B6D4',
      'Rejected': '#EF4444',
    };

    const radius = 40;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius; // ~251.32

    let currentOffset = 0;

    // Hover Details inside center of donut
    const centerCount = hoveredStatus ? distribution[hoveredStatus] : total;
    const centerLabel = hoveredStatus ? hoveredStatus : 'Candidates';
    const centerColor = hoveredStatus ? (statusColors[hoveredStatus] || '#0b1c30') : '#0b1c30';

    return (
      <div className="flex flex-col items-center space-y-6 w-full">
        <div className="relative w-44 h-44">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            {/* Base Circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="#e5eeff"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {statuses.map((status) => {
              const count = distribution[status];
              const percentage = count / total;
              const strokeLength = percentage * circumference;
              const strokeDash = `${strokeLength.toFixed(2)} ${(circumference - strokeLength).toFixed(2)}`;
              const dashOffset = currentOffset;
              currentOffset -= strokeLength;

              const strokeColor = statusColors[status] || '#777587';
              const isHovered = hoveredStatus === status;

              return (
                <circle
                  key={status}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke={strokeColor}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={strokeDash}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 60 60)"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredStatus(status)}
                  onMouseLeave={() => setHoveredStatus(null)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
            <span
              className="text-4xl font-extrabold transition-colors duration-200"
              style={{ color: centerColor }}
            >
              {centerCount}
            </span>
            <span
              className="text-[10px] text-outline font-bold tracking-wider uppercase mt-0.5 truncate max-w-[100px]"
              title={centerLabel}
            >
              {centerLabel}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full grid grid-cols-2 gap-2 text-xs">
          {statuses.map((status) => {
            const count = distribution[status];
            const pct = ((count / total) * 100).toFixed(0);
            const strokeColor = statusColors[status] || '#777587';
            const isHovered = hoveredStatus === status;

            return (
              <div
                key={status}
                onMouseEnter={() => setHoveredStatus(status)}
                onMouseLeave={() => setHoveredStatus(null)}
                className={`flex items-center gap-2 p-1.5 rounded-lg transition-all cursor-pointer ${isHovered ? 'bg-surface-container' : 'hover:bg-surface-container-low'}`}
              >
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: strokeColor }}></span>
                <span className="text-on-surface font-medium truncate" title={status}>{status}</span>
                <span className="text-outline font-bold ml-auto">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Render SVG Line Chart ───────────────────────────────────────
  const renderLineChart = () => {
    if (!reportData || !reportData.timeline || reportData.timeline.length === 0) {
      return (
        <div className="h-64 flex flex-col items-center justify-center text-outline">
          <span className="material-symbols-outlined text-4xl mb-2">show_chart</span>
          <p className="text-sm font-medium">No activity timeline data available</p>
        </div>
      );
    }

    const { timeline } = reportData;
    const N = timeline.length;

    // Find max value in dataset to scale Y axis
    const maxVal = Math.max(
      ...timeline.map(d => Math.max(d.candidatesAssigned, d.clientsAssigned)),
      4 // Default minimum max value of 4 to have nice grids
    );

    const svgWidth = 600;
    const svgHeight = 220;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartWidth = svgWidth - paddingLeft - paddingRight;
    const chartHeight = svgHeight - paddingTop - paddingBottom;

    // Horizontal Grid Lines & Y-Labels
    const gridLines = [];
    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const val = Math.round((maxVal / gridSteps) * i);
      const y = paddingTop + chartHeight - (i / gridSteps) * chartHeight;
      gridLines.push({ val, y });
    }

    // Points calculation
    const pointsCandidates = [];
    const pointsClients = [];

    timeline.forEach((day, idx) => {
      // Calculate X coordinate
      const x = paddingLeft + (idx * chartWidth) / Math.max(N - 1, 1);

      // Calculate Y coordinate
      const yCandidates = paddingTop + chartHeight - (day.candidatesAssigned / maxVal) * chartHeight;
      const yClients = paddingTop + chartHeight - (day.clientsAssigned / maxVal) * chartHeight;

      pointsCandidates.push({ x, y: yCandidates, val: day.candidatesAssigned, date: day.date });
      pointsClients.push({ x, y: yClients, val: day.clientsAssigned, date: day.date });
    });

    // Create Path String Helpers
    const getPathD = (points) => {
      if (points.length === 0) return '';
      return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    };

    const getAreaPathD = (points) => {
      if (points.length === 0) return '';
      const lineD = getPathD(points);
      const bottomY = paddingTop + chartHeight;
      return `${lineD} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
    };

    const pathD_candidates = getPathD(pointsCandidates);
    const pathD_clients = getPathD(pointsClients);

    const areaD_candidates = getAreaPathD(pointsCandidates);
    const areaD_clients = getAreaPathD(pointsClients);

    // Format date string for X Axis (show label every 3rd or 4th item depending on list size)
    const showLabelStep = Math.max(Math.ceil(N / 8), 1);

    const isDayHovered = hoveredDayIndex !== null;

    return (
      <div className="w-full relative">
        <svg className="w-full h-full min-h-[220px]" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="gradCandidates" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0"/>
            </linearGradient>
            <linearGradient id="gradClients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0"/>
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {gridLines.map((g, idx) => (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={g.y}
                x2={svgWidth - paddingRight}
                y2={g.y}
                stroke="#e5eeff"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={g.y + 4}
                textAnchor="end"
                className="text-[10px] font-bold fill-outline"
              >
                {g.val}
              </text>
            </g>
          ))}

          {/* Area under Candidates Line */}
          {areaD_candidates && (
            <path d={areaD_candidates} fill="url(#gradCandidates)" />
          )}

          {/* Area under Clients Line */}
          {areaD_clients && (
            <path d={areaD_clients} fill="url(#gradClients)" />
          )}

          {/* Vertical indicator line on hover */}
          {isDayHovered && pointsCandidates[hoveredDayIndex] && (
            <line
              x1={pointsCandidates[hoveredDayIndex].x}
              y1={paddingTop}
              x2={pointsCandidates[hoveredDayIndex].x}
              y2={paddingTop + chartHeight}
              stroke="#777587"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.6"
            />
          )}

          {/* Candidates Line */}
          {pathD_candidates && (
            <path
              d={pathD_candidates}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Clients Line */}
          {pathD_clients && (
            <path
              d={pathD_clients}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Candidate Dots */}
          {pointsCandidates.map((p, idx) => {
            const isDotHovered = hoveredDayIndex === idx;
            return (
              <circle
                key={`cand-dot-${idx}`}
                cx={p.x}
                cy={p.y}
                r={isDotHovered ? 5.5 : 3.5}
                fill="#10B981"
                stroke="#ffffff"
                strokeWidth={isDotHovered ? 2.5 : 1.5}
                className="transition-all duration-100"
              />
            );
          })}

          {/* Client Dots */}
          {pointsClients.map((p, idx) => {
            const isDotHovered = hoveredDayIndex === idx;
            return (
              <circle
                key={`cli-dot-${idx}`}
                cx={p.x}
                cy={p.y}
                r={isDotHovered ? 5.5 : 3.5}
                fill="#3B82F6"
                stroke="#ffffff"
                strokeWidth={isDotHovered ? 2.5 : 1.5}
                className="transition-all duration-100"
              />
            );
          })}

          {/* Transparent interactive hover columns */}
          {timeline.map((day, idx) => {
            const x = paddingLeft + (idx * chartWidth) / Math.max(N - 1, 1);
            const colWidth = chartWidth / Math.max(N - 1, 1);

            return (
              <rect
                key={`hover-col-${idx}`}
                x={x - colWidth / 2}
                y={paddingTop}
                width={colWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredDayIndex(idx)}
                onMouseLeave={() => setHoveredDayIndex(null)}
              />
            );
          })}

          {/* X Axis Labels */}
          {timeline.map((day, idx) => {
            if (idx % showLabelStep !== 0 && idx !== N - 1) return null;
            const x = paddingLeft + (idx * chartWidth) / Math.max(N - 1, 1);
            const dateParts = day.date.split('-');
            const displayDate = dateParts.length === 3 ? `${dateParts[2]}-${dateParts[1]}` : day.date;

            return (
              <text
                key={`lbl-${idx}`}
                x={x}
                y={svgHeight - 15}
                textAnchor="middle"
                className="text-[9px] font-bold fill-outline"
              >
                {displayDate}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center items-center gap-6 mt-4 text-xs font-semibold text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#10B981] inline-block relative border-t-4 border-[#10B981] rounded-full"></span>
            <span>Candidates Assigned/Handled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#3B82F6] inline-block relative border-t-4 border-[#3B82F6] rounded-full"></span>
            <span>Clients Assigned</span>
          </div>
        </div>

        {/* Floating Tooltip HTML Overlay */}
        {isDayHovered && timeline[hoveredDayIndex] && (() => {
          const idx = hoveredDayIndex;
          const day = timeline[idx];
          const x = paddingLeft + (idx * chartWidth) / Math.max(N - 1, 1);

          // Find min Y coordinate to align tooltip above the highest point
          const yCandidates = paddingTop + chartHeight - (day.candidatesAssigned / maxVal) * chartHeight;
          const yClients = paddingTop + chartHeight - (day.clientsAssigned / maxVal) * chartHeight;
          const yMin = Math.min(yCandidates, yClients);

          const leftPct = (x / svgWidth) * 100;
          const topPct = (yMin / svgHeight) * 100;

          return (
            <div
              className="absolute bg-[#1e293b] text-white p-3 rounded-2xl shadow-card-lg text-xs pointer-events-none space-y-1.5 border border-white/10 z-20 min-w-[160px] transition-all duration-75"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: 'translate(-50%, -100%)',
                marginTop: '-14px',
              }}
            >
              <div className="font-bold text-slate-300 border-b border-slate-700 pb-1 mb-1 text-center">
                {formatDateFull(day.date)}
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block"></span>
                  <span className="text-slate-400">Candidates:</span>
                </div>
                <strong className="text-white font-extrabold">{day.candidatesAssigned}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6] inline-block"></span>
                  <span className="text-slate-400">Clients:</span>
                </div>
                <strong className="text-white font-extrabold">{day.clientsAssigned}</strong>
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Employee Reports</h1>
          <p className="text-outline mt-1.5">Track day-wise activity and candidate conversion for your team.</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={!reportData || !reportData.activityLogs || reportData.activityLogs.length === 0}
          className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-shadow"
        >
          <Download size={18} /> Export Activity CSV
        </button>
      </div>

      {/* Filter Card */}
      <div className="card p-6 border-t-2 border-primary/20 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
          {/* Employee Selector */}
          <div className="lg:col-span-2 space-y-1.5 text-left">
            <label className="input-label flex items-center gap-1.5 font-semibold">
              <Users size={16} className="text-primary" /> View Report By Employee:
            </label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="input-field cursor-pointer font-medium hover:border-primary/50 transition-colors"
            >
              <option value="" disabled>Select an employee</option>
              {employees.map((emp, idx) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} (E{String(idx + 1).padStart(2, '0')})
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-1.5 text-left">
            <label className="input-label flex items-center gap-1.5 font-semibold">
              <Calendar size={16} className="text-primary" /> Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field hover:border-primary/50 transition-colors"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5 text-left">
            <label className="input-label flex items-center gap-1.5 font-semibold">
              <Calendar size={16} className="text-primary" /> End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field hover:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {loadingReport ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-outline text-body-md">Loading report analytics...</p>
        </div>
      ) : reportData ? (
        <>
          {/* Candidates Handled Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface text-left">
                Candidates Handled by {reportData.employee.name}
              </h2>
              <span className="badge badge-primary text-xs py-1 px-3">
                {reportData.candidates.length} Candidates
              </span>
            </div>

            {reportData.candidates.length === 0 ? (
              <div className="card p-8 text-center text-outline">
                No candidates currently handled by this employee.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {reportData.candidates.map((c, idx) => {
                  const candidateCode = `CA${String(idx + 1).padStart(2, '0')}`;
                  return (
                    <div
                      key={c.id}
                      className="card p-5 hover:-translate-y-1 hover:shadow-card-lg transition-all duration-250 flex flex-col justify-between border border-outline-variant/30 text-left space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-on-surface text-body-lg leading-tight truncate max-w-[130px]" title={c.name}>
                            {c.name}
                          </h4>
                          <p className="text-label-md text-outline font-semibold">{candidateCode}</p>
                        </div>
                        <span className={`badge ${getStatusBadgeClass(c.status)}`}>
                          {c.status}
                        </span>
                      </div>
                      
                      <div className="border-t border-outline-variant/20 pt-2.5 flex items-center justify-between text-xs text-on-surface-variant font-medium">
                        <div className="flex items-center gap-1 truncate max-w-[120px]" title={c.jobTitle || 'No title'}>
                          <span className="material-symbols-outlined text-[15px] leading-none text-primary">work</span>
                          <span className="truncate">{c.jobTitle || 'No title'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-outline flex-shrink-0">
                          <span className="material-symbols-outlined text-[15px] leading-none">location_on</span>
                          <span>{c.location || '—'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Charts Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline Line Chart */}
            <div className="card p-6 lg:col-span-2 border border-outline-variant/20 flex flex-col shadow-sm">
              <div className="mb-4 text-left">
                <h3 className="text-title-lg font-bold text-on-surface">Activity Timeline (Daily)</h3>
                <p className="text-xs text-outline mt-0.5">
                  Hover over the timeline to view day-wise selections and assignments from {formatDateSlash(startDate)} to {formatDateSlash(endDate)}.
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                {renderLineChart()}
              </div>
            </div>

            {/* Status Distribution Donut Chart */}
            <div className="card p-6 border border-outline-variant/20 flex flex-col shadow-sm">
              <div className="mb-4 text-left">
                <h3 className="text-title-lg font-bold text-on-surface">Candidate Status Distribution</h3>
                <p className="text-xs text-outline mt-0.5">Hover over chart segments or legends to filter values.</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                {renderDonutChart()}
              </div>
            </div>
          </div>

          {/* Activity Log Table */}
          <div className="card p-0 overflow-hidden border border-outline-variant/20 shadow-sm">
            <div className="p-6 border-b border-outline-variant/30 bg-surface-container-lowest text-left">
              <h3 className="text-title-lg font-bold text-on-surface flex items-center gap-2">
                <TrendingUp className="text-primary" size={20} /> Day-wise Activity Log
              </h3>
            </div>
            {reportData.activityLogs.length === 0 ? (
              <div className="p-10 text-center text-outline">
                No activity logs found for the selected period.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container border-b border-outline-variant text-outline text-label-md font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Candidate</th>
                      <th className="px-6 py-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {reportData.activityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-surface-container-low transition-colors duration-150">
                        <td className="px-6 py-4 text-body-md text-on-surface-variant font-medium">
                          {formatDateTime(log.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge ${getActionBadgeClass(log.action)} font-semibold`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-body-md text-on-surface font-semibold">
                          {log.candidate?.name || '—'}
                        </td>
                        <td className="px-6 py-4 text-body-md text-outline">
                          {log.details || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="py-20 text-center text-outline card p-6">
          Select an employee and date range to display reports.
        </div>
      )}
    </div>
  );
}
