// Dashboard component for consolidated metrics view

// Store chart instances globally to manage updates/destruction
let rentByCantonChartInstance = null;
let propertyTypePieChartInstance = null;
let rentByPropertyTypeChartInstance = null;
let surfaceByPropertyTypePieChartInstance = null;
let vacancyByPropertyTypeChartInstance = null;
let portfolioDistributionByCantonPieChartInstance = null;

const CHART_COLORS = {
  primary: 'rgba(0, 123, 255, 0.7)', // #007BFF
  primaryBorder: 'rgba(0, 123, 255, 1)',
  primaryHover: 'rgba(0, 123, 255, 0.9)',
  green: 'rgba(40, 167, 69, 0.7)',
  greenBorder: 'rgba(40, 167, 69, 1)',
  greenHover: 'rgba(40, 167, 69, 0.9)',
  yellow: 'rgba(255, 193, 7, 0.7)',
  yellowBorder: 'rgba(255, 193, 7, 1)',
  yellowHover: 'rgba(255, 193, 7, 0.9)',
  red: 'rgba(220, 53, 69, 0.7)',
  redBorder: 'rgba(220, 53, 69, 1)',
  redHover: 'rgba(220, 53, 69, 0.9)',
  gray: 'rgba(108, 117, 125, 0.7)', // #6C757D
  grayBorder: 'rgba(108, 117, 125, 1)',
  grayHover: 'rgba(108, 117, 125, 0.9)',
  teal: 'rgba(23, 162, 184, 0.7)',
  tealBorder: 'rgba(23, 162, 184, 1)',
  tealHover: 'rgba(23, 162, 184, 0.9)',
  purple: 'rgba(101, 48, 197, 0.7)',
  purpleBorder: 'rgba(101, 48, 197, 1)',
  purpleHover: 'rgba(101, 48, 197, 0.9)',
  orange: 'rgba(253, 126, 20, 0.7)',
  orangeBorder: 'rgba(253, 126, 20, 1)',
  orangeHover: 'rgba(253, 126, 20, 0.9)',
};

const PIE_CHART_BACKGROUNDS = [
  CHART_COLORS.primary,
  CHART_COLORS.green,
  CHART_COLORS.yellow,
  CHART_COLORS.teal,
  CHART_COLORS.purple,
  CHART_COLORS.red,
  CHART_COLORS.orange,
  CHART_COLORS.gray,
];
const PIE_CHART_BORDERS = PIE_CHART_BACKGROUNDS.map(color => color.replace('0.7', '1'));
const PIE_CHART_HOVER_BACKGROUNDS = PIE_CHART_BACKGROUNDS.map(color => color.replace('0.7', '0.9'));


function renderDashboard(container, consolidatedMetrics, properties) {
  if (!container || !consolidatedMetrics || !properties) {
    console.error('Dashboard: Missing container, consolidatedMetrics, or properties');
    container.innerHTML = '<p class="text-red-500 text-center">Error: Dashboard data could not be loaded.</p>';
    return;
  }

  const totalPortfolioValueCBRE = sumPropertyField(properties, 'cbreValueCHF');
  const portfolioAvgVacancy = calculatePortfolioAverageVacancy(properties);
  const portfolioAvgOccupancy = portfolioAvgVacancy !== null ? (100 - portfolioAvgVacancy) : null;

  container.innerHTML = `
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-dark mb-2">Portfolio Overview</h2>
      <p class="text-gray-600">Consolidated metrics for all properties in the portfolio.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      ${createMetricsCard('Total Properties', consolidatedMetrics.totalProperties !== undefined ? consolidatedMetrics.totalProperties : properties.length, 'Properties in portfolio')}
      ${createMetricsCard('Total Portfolio Value (CBRE)', formatCurrency(totalPortfolioValueCBRE), 'Estimated market value')}
      ${createMetricsCard('Total Annual Rent', formatCurrency(consolidatedMetrics.totalAnnualRentCHF), 'Gross annual income')}
      ${createMetricsCard('Total Rentable Surface', formatSurface(consolidatedMetrics.totalRentableSurfaceSqM), 'Total area m²')}
      ${createMetricsCard('Avg. Rent/m²/Year', formatCurrency(consolidatedMetrics.averageRentPerSqMPerYearCHF, { maximumFractionDigits: 2 }), 'CHF/m²/year')}
      ${createMetricsCard('Avg. Gross Yield (CBRE)', formatPercentage(consolidatedMetrics.averageYieldGrossCBREPercent), 'Portfolio average yield')}
      ${createMetricsCard('Portfolio Avg. Vacancy', formatPercentage(portfolioAvgVacancy), 'Average of reported vacancies')}
      ${createMetricsCard('Portfolio Avg. Occupancy', formatPercentage(portfolioAvgOccupancy, { decimalPlaces: 1 }), 'Derived from avg. vacancy')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-dark mb-4">Total Annual Rent by Canton</h3>
        <div class="chart-container" style="height: 320px;">
          <canvas id="rentByCantonChart"></canvas>
        </div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-dark mb-4">Property Type Distribution (Count)</h3>
        <div class="chart-container" style="height: 320px;">
          <canvas id="propertyTypePieChart"></canvas>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
       <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-dark mb-4">Total Annual Rent by Property Type</h3>
        <div class="chart-container" style="height: 320px;">
          <canvas id="rentByPropertyTypeChart"></canvas>
        </div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-dark mb-4">Rentable Surface by Property Type (Pie)</h3>
        <div class="chart-container" style="height: 320px;">
          <canvas id="surfaceByPropertyTypePieChart"></canvas>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-dark mb-4">Average Vacancy Rate by Property Type</h3>
        <div class="chart-container" style="height: 320px;">
          <canvas id="vacancyByPropertyTypeChart"></canvas>
        </div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-dark mb-4">Portfolio Distribution by Canton (Count)</h3>
        <div class="chart-container" style="height: 320px;">
          <canvas id="portfolioDistributionByCantonPieChart"></canvas>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
      <h3 class="text-lg font-semibold text-dark mb-4">Property Type Distribution Details</h3>
      <div id="propertyTypeDistributionText" class="text-gray-700 space-y-2">
        <!-- Detailed text for property type distribution -->
      </div>
    </div>
  `;

  renderRentByCantonChart(properties, 'rentByCantonChart');
  renderPropertyTypePieChart(consolidatedMetrics.propertyTypeDistribution, 'propertyTypePieChart');
  renderRentByPropertyTypeChart(properties, 'rentByPropertyTypeChart');
  renderSurfaceByPropertyTypePieChart(consolidatedMetrics.propertyTypeDistribution, 'surfaceByPropertyTypePieChart');
  renderVacancyByPropertyTypeChart(properties, 'vacancyByPropertyTypeChart');
  renderPortfolioDistributionByCantonPieChart(properties, 'portfolioDistributionByCantonPieChart');

  renderPropertyTypeDistributionText(consolidatedMetrics.propertyTypeDistribution, properties, 'propertyTypeDistributionText');
}

function renderPropertyTypeDistributionText(propertyTypeDistributionData, properties, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!propertyTypeDistributionData || !properties) {
        if (container) container.innerHTML = '<p class="text-sm text-gray-500">Property type distribution data not available.</p>';
        return;
    }

    const rentsByType = {};
    properties.forEach(prop => {
        if (prop.type && (prop.annualRentSourceCHF !== null && prop.annualRentSourceCHF !== undefined)) {
            rentsByType[prop.type] = (rentsByType[prop.type] || 0) + prop.annualRentSourceCHF;
        }
    });

    let htmlContent = '<ul class="list-disc pl-5 text-sm space-y-1">';
    const types = Object.keys(propertyTypeDistributionData).sort();
    if (types.length === 0) {
        htmlContent += '<li>No property type data to display.</li>';
    } else {
        for (const type of types) {
            const data = propertyTypeDistributionData[type]; // This gives {count, surfaceSqM}
            const totalRentForType = rentsByType[type] || 0;
            htmlContent += `<li><strong>${type}:</strong> ${data.count || 0} properties, ${formatSurface(data.surfaceSqM || 0)}, Total Rent: ${formatCurrency(totalRentForType)}</li>`;
        }
    }
    htmlContent += '</ul>';
    container.innerHTML = htmlContent;
}

function destroyChart(chartInstance) {
  if (chartInstance) {
    chartInstance.destroy();
  }
}

function createChartTooltipCallbacks(isCurrency = true, isPercentage = false, valueFormatter = null) {
    return {
        label: function(context) {
            let label = context.dataset.label || context.label || '';
            if (label) {
                label += ': ';
            }
            let value = context.parsed?.y !== undefined ? context.parsed.y : context.parsed;
            
            if (value !== null && value !== undefined) {
                if (valueFormatter) {
                    label += valueFormatter(value);
                } else if (isCurrency) {
                    label += formatCurrency(value, {notation: 'compact', maximumFractionDigits: 0});
                } else if (isPercentage) {
                     label += formatPercentage(value, {decimalPlaces: 1});
                } else {
                    label += value.toLocaleString ? value.toLocaleString('de-CH') : value;
                }

                if ((context.chart.config.type === 'pie' || context.chart.config.type === 'doughnut') && context.dataset.data) {
                    const total = context.dataset.data.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
                    const percentageValue = total > 0 ? ((value / total) * 100) : 0;
                    label += ` (${percentageValue.toFixed(1)}%)`;
                }
            } else {
                label += 'N/A';
            }
            return label;
        }
    };
}

function renderRentByCantonChart(properties, canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const groupedByCanton = groupPropertiesByField(properties, 'canton');
  const labels = Object.keys(groupedByCanton).sort();
  const data = labels.map(canton =>
    sumPropertyField(groupedByCanton[canton], 'annualRentSourceCHF')
  );

  destroyChart(rentByCantonChartInstance);
  rentByCantonChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Annual Rent (CHF)',
        data: data,
        backgroundColor: CHART_COLORS.primary,
        borderColor: CHART_COLORS.primaryBorder,
        hoverBackgroundColor: CHART_COLORS.primaryHover,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, ticks: { callback: value => formatCurrency(value, {notation: 'compact', maximumFractionDigits: 0}) } } },
      plugins: { tooltip: { callbacks: createChartTooltipCallbacks(true, false) } }
    }
  });
}

function renderPropertyTypePieChart(propertyTypeDistribution, canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !propertyTypeDistribution) return;

  const labels = Object.keys(propertyTypeDistribution).sort();
  const dataCounts = labels.map(type => propertyTypeDistribution[type]?.count || 0);

  destroyChart(propertyTypePieChartInstance);
  propertyTypePieChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Property Count',
        data: dataCounts,
        backgroundColor: labels.map((_, i) => PIE_CHART_BACKGROUNDS[i % PIE_CHART_BACKGROUNDS.length]),
        borderColor: labels.map((_, i) => PIE_CHART_BORDERS[i % PIE_CHART_BORDERS.length]),
        hoverBackgroundColor: labels.map((_, i) => PIE_CHART_HOVER_BACKGROUNDS[i % PIE_CHART_HOVER_BACKGROUNDS.length]),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: { callbacks: createChartTooltipCallbacks(false, false, val => val.toLocaleString('de-CH')) }
      }
    }
  });
}

function renderRentByPropertyTypeChart(properties, canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const groupedByType = groupPropertiesByField(properties, 'type');
  const labels = Object.keys(groupedByType).sort();
  const data = labels.map(type =>
    sumPropertyField(groupedByType[type], 'annualRentSourceCHF')
  );

  destroyChart(rentByPropertyTypeChartInstance);
  rentByPropertyTypeChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Annual Rent (CHF)',
        data: data,
        backgroundColor: CHART_COLORS.green,
        borderColor: CHART_COLORS.greenBorder,
        hoverBackgroundColor: CHART_COLORS.greenHover,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, ticks: { callback: value => formatCurrency(value, {notation: 'compact', maximumFractionDigits: 0}) } } },
      plugins: { tooltip: { callbacks: createChartTooltipCallbacks(true, false) } }
    }
  });
}

function renderSurfaceByPropertyTypePieChart(propertyTypeDistribution, canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !propertyTypeDistribution) return;

  const labels = Object.keys(propertyTypeDistribution).sort();
  const dataSurfaces = labels.map(type => propertyTypeDistribution[type]?.surfaceSqM || 0);

  destroyChart(surfaceByPropertyTypePieChartInstance);
  surfaceByPropertyTypePieChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Rentable Surface (m²)',
        data: dataSurfaces,
        backgroundColor: labels.map((_, i) => PIE_CHART_BACKGROUNDS[i % PIE_CHART_BACKGROUNDS.length]),
        borderColor: labels.map((_, i) => PIE_CHART_BORDERS[i % PIE_CHART_BORDERS.length]),
        hoverBackgroundColor: labels.map((_, i) => PIE_CHART_HOVER_BACKGROUNDS[i % PIE_CHART_HOVER_BACKGROUNDS.length]),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: { callbacks: createChartTooltipCallbacks(false, false, value => formatSurface(value, {maximumFractionDigits:0})) }
      }
    }
  });
}

function renderVacancyByPropertyTypeChart(properties, canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const vacancyData = calculateAverageVacancyByPropertyType(properties);

    const labels = Object.keys(vacancyData).sort();
    const data = labels.map(type => vacancyData[type]);

    destroyChart(vacancyByPropertyTypeChartInstance);
    vacancyByPropertyTypeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Vacancy Rate (%)',
                data: data,
                backgroundColor: CHART_COLORS.yellow,
                borderColor: CHART_COLORS.yellowBorder,
                hoverBackgroundColor: CHART_COLORS.yellowHover,
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatPercentage(value, {decimalPlaces: 1});
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: createChartTooltipCallbacks(false, true)
                }
            }
        }
    });
}

function renderPortfolioDistributionByCantonPieChart(properties, canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const groupedByCanton = groupPropertiesByField(properties, 'canton');
  const labels = Object.keys(groupedByCanton).sort();
  const dataCounts = labels.map(canton => groupedByCanton[canton].length);

  destroyChart(portfolioDistributionByCantonPieChartInstance);
  portfolioDistributionByCantonPieChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Property Count',
        data: dataCounts,
        backgroundColor: labels.map((_, i) => PIE_CHART_BACKGROUNDS[i % PIE_CHART_BACKGROUNDS.length]),
        borderColor: labels.map((_, i) => PIE_CHART_BORDERS[i % PIE_CHART_BORDERS.length]),
        hoverBackgroundColor: labels.map((_, i) => PIE_CHART_HOVER_BACKGROUNDS[i % PIE_CHART_HOVER_BACKGROUNDS.length]),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: { callbacks: createChartTooltipCallbacks(false, false, val => val.toLocaleString('de-CH')) }
      }
    }
  });
}
