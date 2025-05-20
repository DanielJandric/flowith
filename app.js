// Main application initialization
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load data
    const data = await fetchRealEstateData();
    
    // Initialize components
    const headerElement = document.getElementById('header');
    const dashboardElement = document.getElementById('dashboard-container');
    const propertyGridElement = document.getElementById('property-grid-container');
    
    // Render components
    renderHeader(headerElement); // Assuming renderHeader is defined in Header.js
    renderDashboard(dashboardElement, data.consolidatedMetrics, data.properties);
    renderPropertyGrid(propertyGridElement, data.properties);
    
    console.log('Application initialized successfully with new data.');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    document.getElementById('app').innerHTML = `
      <div class="container mx-auto px-4 py-20 text-center">
        <h2 class="text-2xl font-bold text-red-600 mb-4">Error Loading Application</h2>
        <p class="text-gray-700">${error.message || 'An unknown error occurred while loading data.'}</p>
        <p class="text-gray-500 text-sm">Please ensure 'data/propertiesData.json' is accessible and correctly formatted.</p>
        <button onclick="location.reload()" class="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-blue-700">
          Retry
        </button>
      </div>
    `;
  }
});

// Function to fetch real estate data
async function fetchRealEstateData() {
  try {
    const response = await fetch('data/propertiesData.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (!data || !data.properties || !data.consolidatedMetrics) {
        throw new Error('Fetched data is not in the expected format.');
    }
    return data;
  } catch (error) {
    console.error('Error fetching real estate data:', error);
    throw error; // Re-throw to be caught by the main initializer
  }
}






