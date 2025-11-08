// Utility functions for downloading reports

export async function downloadReportAsPDF(reportData: any, elderData: any) {
  // Create a formatted HTML document for the report
  const htmlContent = generateReportHTML(reportData, elderData);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Please allow popups to download the report');
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print();
    // Close the window after printing (user can cancel)
    setTimeout(() => {
      printWindow.close();
    }, 1000);
  };
}

export function downloadReportAsCSV(reportData: any, elderData: any) {
  const stats = reportData.statistics || {};
  
  // Create CSV content
  const csvRows = [
    // Header
    ['Elder Mood Mirror - Weekly Report'],
    [''],
    // Date Range
    [`Report Period: ${reportData.weekStart} to ${reportData.weekEnd}`],
    [''],
    // Elder Information
    ['Elder Information'],
    ['Name', reportData.elderName || 'N/A'],
    ['Age', elderData?.age || 'N/A'],
    ['Blood Group', elderData?.bloodGroup || 'N/A'],
    ['Guardian', reportData.guardianName || elderData?.guardianName || 'N/A'],
    ['Guardian Email', reportData.guardianEmail || elderData?.guardianEmail || 'N/A'],
    [''],
    // Statistics
    ['Weekly Statistics'],
    ['Surveys Completed', stats.surveysCompleted || 0],
    ['Camera Checks', stats.cameraMoodsCompleted || 0],
    ['Completion Rate', `${stats.completionRate || 0}%`],
    ['Average Energy Level', stats.averageEnergyLevel || 0],
    ['Dominant Mood', stats.dominantMood || 'N/A'],
    ['Camera Detected Mood', stats.dominantCameraMood || 'N/A'],
    [''],
    // Daily Activities
    ['Daily Activities'],
    ['Date', 'Survey', 'Camera', 'Mood', 'Energy Level'],
  ];

  // Add daily activities
  if (reportData.surveys && reportData.surveys.length > 0) {
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const survey = reportData.surveys.find((s: any) => s.date === dateStr);
      const camera = reportData.cameraMoods?.find((c: any) => c.date === dateStr);
      
      csvRows.push([
        dateStr,
        survey ? 'Completed' : 'Pending',
        camera ? 'Completed' : 'Pending',
        survey?.overall_mood || 'N/A',
        survey?.energy_level || 'N/A'
      ]);
    }
  }

  // Convert to CSV string
  const csvContent = csvRows.map(row => 
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `mood-report-${reportData.weekStart || 'latest'}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function generateReportHTML(reportData: any, elderData: any): string {
  const stats = reportData.statistics || {};
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Elder Mood Mirror - Weekly Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #3b82f6;
    }
    
    .logo {
      font-size: 36px;
      margin-bottom: 10px;
    }
    
    h1 {
      color: #1e40af;
      font-size: 32px;
      margin-bottom: 10px;
    }
    
    .report-period {
      color: #6b7280;
      font-size: 18px;
    }
    
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .section-title {
      color: #1e40af;
      font-size: 24px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .info-item {
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
    }
    
    .info-label {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 5px;
    }
    
    .info-value {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
      border-radius: 12px;
      color: white;
    }
    
    .stat-value {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    
    th {
      background: #f3f4f6;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    tr:hover {
      background: #f9fafb;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .badge-success {
      background: #d1fae5;
      color: #065f46;
    }
    
    .badge-pending {
      background: #e5e7eb;
      color: #6b7280;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🌲</div>
    <h1>Elder Mood Mirror</h1>
    <p class="report-period">
      Weekly Report: ${reportData.weekStart ? new Date(reportData.weekStart).toLocaleDateString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric' 
      }) : 'N/A'} - ${reportData.weekEnd ? new Date(reportData.weekEnd).toLocaleDateString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric' 
      }) : 'N/A'}
    </p>
  </div>

  <div class="section">
    <h2 class="section-title">Elder Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Name</div>
        <div class="info-value">${reportData.elderName || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Age</div>
        <div class="info-value">${elderData?.age || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Blood Group</div>
        <div class="info-value">${elderData?.bloodGroup || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Guardian</div>
        <div class="info-value">${reportData.guardianName || elderData?.guardianName || 'N/A'}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Weekly Statistics</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.surveysCompleted || 0}</div>
        <div class="stat-label">Surveys Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.cameraMoodsCompleted || 0}</div>
        <div class="stat-label">Camera Checks</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.completionRate || 0}%</div>
        <div class="stat-label">Completion Rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.averageEnergyLevel || 0}</div>
        <div class="stat-label">Avg Energy Level</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Mood Analysis</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Survey Mood Pattern</div>
        <div class="info-value" style="text-transform: capitalize;">${stats.dominantMood || 'No data'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Camera Detected Mood</div>
        <div class="info-value" style="text-transform: capitalize;">${stats.dominantCameraMood || 'No data'}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Daily Activities</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Survey Status</th>
          <th>Camera Check</th>
          <th>Mood</th>
          <th>Energy Level</th>
        </tr>
      </thead>
      <tbody>
        ${generateDailyActivitiesRows(reportData)}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2 class="section-title">Report Summary</h2>
    <p style="margin-bottom: 15px;">
      This weekly report provides a comprehensive overview of ${reportData.elderName || 'the elder'}'s 
      mood and wellness tracking activities. The report includes daily survey responses, 
      camera-based mood detection results, and key health metrics.
    </p>
    <p style="margin-bottom: 15px;">
      <strong>Tracking Consistency:</strong> ${stats.completionRate || 0}% of activities were completed 
      this week, demonstrating ${
        parseInt(stats.completionRate || 0) >= 80 ? 'excellent' :
        parseInt(stats.completionRate || 0) >= 60 ? 'good' : 'moderate'
      } engagement with the wellness tracking program.
    </p>
    <p>
      <strong>Next Steps:</strong> Continue daily tracking for better trend analysis. 
      Guardian will receive automated weekly email reports for ongoing monitoring and care coordination.
    </p>
  </div>

  <div class="footer">
    <p>Generated by Elder Mood Mirror - Your Daily Wellness Companion</p>
    <p>Report Date: ${new Date().toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric' 
    })}</p>
  </div>
</body>
</html>
  `;
}

function generateDailyActivitiesRows(reportData: any): string {
  const rows: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    const survey = reportData.surveys?.find((s: any) => s.date === dateStr);
    const camera = reportData.cameraMoods?.find((c: any) => c.date === dateStr);
    
    rows.push(`
      <tr>
        <td>${date.toLocaleDateString('en-US', { 
          weekday: 'short', month: 'short', day: 'numeric' 
        })}</td>
        <td>
          <span class="badge ${survey ? 'badge-success' : 'badge-pending'}">
            ${survey ? '✓ Completed' : '- Pending'}
          </span>
        </td>
        <td>
          <span class="badge ${camera ? 'badge-success' : 'badge-pending'}">
            ${camera ? '✓ Completed' : '- Pending'}
          </span>
        </td>
        <td style="text-transform: capitalize;">
          ${survey?.overall_mood ? survey.overall_mood.replace('_', ' ') : '-'}
        </td>
        <td>
          ${survey?.energy_level ? `${survey.energy_level}/10` : '-'}
        </td>
      </tr>
    `);
  }
  
  return rows.join('');
}
