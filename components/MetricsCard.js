// Metrics Card component for dashboard summary metrics
function createMetricsCard(title, value, subtitle, trend = null) {
  const trendClass = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '';
  
  return `
    <div class="metrics-card bg-white p-6 rounded-lg shadow-sm hover:shadow-md border border-gray-100">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-sm font-medium text-gray-500">${title}</h3>
          <p class="text-2xl font-bold text-dark mt-1">${value}</p>
          ${subtitle ? `<p class="text-sm text-gray-600 mt-1">${subtitle}</p>` : ''}
        </div>
        ${trend ? `
        <div class="${trendClass} flex items-center text-sm font-medium">
          <span>${trendIcon} ${Math.abs(parseFloat(trend))}%</span>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}







