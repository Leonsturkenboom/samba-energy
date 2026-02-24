/**
 * SAMBA Status Page
 * Loads status.json and renders service status UI
 */

(function () {
  'use strict';

  const DATA_URL = 'data/status.json';
  const REFRESH_INTERVAL = 60000; // 60 seconds

  const STATUS_LABELS = {
    operational: 'Operational',
    degraded: 'Degraded',
    down: 'Down',
    unknown: 'Unknown',
  };

  const OVERALL_MESSAGES = {
    operational: 'All systems operational',
    degraded: 'Some systems experiencing issues',
    down: 'Major outage detected',
    unknown: 'Checking services...',
  };

  // ── Fetch data ──────────────────────────────────

  async function fetchStatus() {
    try {
      const res = await fetch(DATA_URL + '?t=' + Date.now());
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch status:', err);
      return null;
    }
  }

  // ── Render ──────────────────────────────────────

  function render(data) {
    if (!data) {
      document.getElementById('overallText').textContent = 'Unable to load status data';
      return;
    }

    // Overall status
    const indicator = document.getElementById('overallIndicator');
    indicator.className = 'status-indicator ' + data.overall_status;
    document.getElementById('overallText').textContent =
      OVERALL_MESSAGES[data.overall_status] || OVERALL_MESSAGES.unknown;

    // Last updated
    const updated = new Date(data.generated_at);
    document.getElementById('lastUpdated').textContent =
      'Last updated: ' + updated.toLocaleString('nl-NL', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });

    // Group services
    const groups = {};
    data.services.forEach(function (svc) {
      if (!groups[svc.group]) groups[svc.group] = [];
      groups[svc.group].push(svc);
    });

    // Render groups
    var html = '';
    Object.keys(groups).forEach(function (groupName) {
      html += '<div class="service-group">';
      html += '<h2 class="group-title">' + escapeHtml(groupName) + '</h2>';

      groups[groupName].forEach(function (svc) {
        html += renderService(svc);
      });

      html += '</div>';
    });

    document.getElementById('serviceGroups').innerHTML = html;
  }

  function renderService(svc) {
    var uptime = svc.uptime_90d !== null ? svc.uptime_90d + '%' : '—';
    var responseTime = svc.response_time_ms !== null ? svc.response_time_ms + 'ms' : '—';
    var statusLabel = STATUS_LABELS[svc.status] || 'Unknown';
    var statusClass = svc.status || 'unknown';

    var html = '<div class="service-card">';

    // Top row: name + badge
    html += '<div class="service-top">';
    html += '<span class="service-name">' + escapeHtml(svc.name) + '</span>';
    html += '<div class="service-meta">';
    html += '<span class="service-uptime">' + uptime + '</span>';
    html += '<span class="service-badge ' + statusClass + '">' + statusLabel + '</span>';
    html += '</div></div>';

    // 90-day timeline
    html += renderTimeline(svc.history);

    // Response time sparkline
    if (svc.response_times_24h && svc.response_times_24h.length > 0) {
      html += renderResponseTimes(svc.response_times_24h, responseTime);
    }

    html += '</div>';
    return html;
  }

  function renderTimeline(history) {
    if (!history || history.length === 0) {
      return '<div class="timeline">' +
        Array(90).fill('<div class="timeline-bar"></div>').join('') +
        '</div>';
    }

    // Build a map of date -> status
    var dateMap = {};
    history.forEach(function (h) { dateMap[h.date] = h; });

    // Generate 90 days
    var bars = '';
    var today = new Date();
    for (var i = 89; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var dateStr = d.toISOString().split('T')[0];
      var day = dateMap[dateStr];

      var cls = day ? day.status : '';
      var tooltipText = formatDate(dateStr);
      if (day) {
        tooltipText += ' — ' + day.uptime_pct + '% uptime';
      } else {
        tooltipText += ' — No data';
      }

      bars += '<div class="timeline-bar ' + cls + '">';
      bars += '<span class="tooltip">' + tooltipText + '</span>';
      bars += '</div>';
    }

    // Labels
    var ninetyAgo = new Date(today);
    ninetyAgo.setDate(ninetyAgo.getDate() - 89);

    var html = '<div class="timeline">' + bars + '</div>';
    html += '<div class="timeline-labels">';
    html += '<span class="timeline-label">' + formatDate(ninetyAgo.toISOString().split('T')[0]) + '</span>';
    html += '<span class="timeline-label">Today</span>';
    html += '</div>';

    return html;
  }

  function renderResponseTimes(data, currentMs) {
    if (!data.length) return '';

    var maxMs = 0;
    data.forEach(function (d) { if (d.ms > maxMs) maxMs = d.ms; });
    if (maxMs === 0) maxMs = 1;

    var bars = '';
    data.forEach(function (d) {
      var pct = Math.max(4, (d.ms / maxMs) * 100);
      bars += '<div class="spark-bar" style="height:' + pct + '%" title="' + d.ms + 'ms"></div>';
    });

    var html = '<div class="response-time-section">';
    html += '<div class="response-time-header">';
    html += '<span class="response-time-label">Response time (24h)</span>';
    html += '<span class="response-time-value">' + currentMs + '</span>';
    html += '</div>';
    html += '<div class="sparkline">' + bars + '</div>';
    html += '</div>';

    return html;
  }

  // ── Helpers ─────────────────────────────────────

  function formatDate(dateStr) {
    var parts = dateStr.split('-');
    var months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
    return parseInt(parts[2], 10) + ' ' + months[parseInt(parts[1], 10) - 1];
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Init ────────────────────────────────────────

  async function init() {
    var data = await fetchStatus();
    render(data);

    // Auto-refresh
    setInterval(async function () {
      var fresh = await fetchStatus();
      render(fresh);
    }, REFRESH_INTERVAL);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
