// Property Grid component for displaying all properties
function renderPropertyGrid(container, properties) {
  if (!container || !properties) {
    console.error('PropertyGrid: Missing container or properties array.');
    container.innerHTML = '<p class="text-red-500">Error: Properties could not be loaded.</p>';
    return;
  }
  
  // Store properties globally for access by showPropertyDetailsModal in PropertyCard.js
  // This is a simple approach for vanilla JS; state management would be different in frameworks.
  window.realEstateData = { properties };

  const uniqueTypes = [...new Set(properties.map(p => p.type).filter(Boolean))].sort();

  container.innerHTML = `
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-dark mb-1 sm:mb-0">Properties</h2>
        <p class="text-gray-600">All properties in the portfolio.</p>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
        <div class="relative w-full sm:w-auto">
          <select id="property-filter-type" class="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm">
            <option value="all">All Types</option>
            ${uniqueTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <div class="relative w-full sm:w-auto">
          <select id="property-sort" class="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm">
            <option value="value-desc">Value (High to Low)</option>
            <option value="value-asc">Value (Low to High)</option>
            <option value="yield-desc">Yield (High to Low)</option>
            <option value="yield-asc">Yield (Low to High)</option>
            <option value="rent-desc">Rent (High to Low)</option>
            <option value="rent-asc">Rent (Low to High)</option>
            <option value="surface-desc">Surface (High to Low)</option>
            <option value="surface-asc">Surface (Low to High)</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <div id="property-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 property-grid">
      ${properties.map(property => createPropertyCard(property)).join('')}
    </div>
    
    <div id="empty-state" class="hidden text-center py-16">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No properties found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your filters.</p>
    </div>
  `;
  
  // Add event listeners for filtering and sorting
  // Corrected to pass the 'properties' array (which is the initial full list for this render cycle)
  // to setupPropertyFilteringAndSorting.
  setupPropertyFilteringAndSorting(container, properties); 
}

// Setup filtering and sorting functionality
function setupPropertyFilteringAndSorting(container, initialProperties) {
  const filterTypeSelect = container.querySelector('#property-filter-type');
  const sortSelect = container.querySelector('#property-sort');
  const propertyList = container.querySelector('#property-list');
  const emptyState = container.querySelector('#empty-state');
  
  if (!filterTypeSelect || !sortSelect || !propertyList || !emptyState) {
    console.warn('Filter/Sort elements not found in PropertyGrid. Skipping setup.');
    return;
  }
  
  // Ensure initialProperties is an array
  const propertiesToFilterSort = Array.isArray(initialProperties) ? initialProperties : [];

  const updatePropertyList = () => {
    const filterTypeValue = filterTypeSelect.value;
    const sortValue = sortSelect.value;
    
    // Apply filters
    let filteredProperties = propertiesToFilterSort;
    if (filterTypeValue !== 'all') {
      filteredProperties = propertiesToFilterSort.filter(property => property.type === filterTypeValue);
    }
    
    // Apply sorting
    let sortedProperties = [...filteredProperties]; // Create a new array for sorting
    switch (sortValue) {
      case 'value-desc':
        sortedProperties.sort((a, b) => (b.cbreValueCHF || 0) - (a.cbreValueCHF || 0));
        break;
      case 'value-asc':
        sortedProperties.sort((a, b) => (a.cbreValueCHF || 0) - (b.cbreValueCHF || 0));
        break;
      case 'yield-desc':
        sortedProperties.sort((a, b) => (b.grossYieldCBREPercent || 0) - (a.grossYieldCBREPercent || 0));
        break;
      case 'yield-asc':
        sortedProperties.sort((a, b) => (a.grossYieldCBREPercent || 0) - (b.grossYieldCBREPercent || 0));
        break;
      case 'rent-desc':
        // Handle cases where annualRentSourceCHF might be null or undefined
        sortedProperties.sort((a, b) => {
            const rentA = a.annualRentSourceCHF === null || a.annualRentSourceCHF === undefined ? (a.annualRentPotentialCBRECHF || 0) : (a.annualRentSourceCHF || 0);
            const rentB = b.annualRentSourceCHF === null || b.annualRentSourceCHF === undefined ? (b.annualRentPotentialCBRECHF || 0) : (b.annualRentSourceCHF || 0);
            return rentB - rentA;
        });
        break;
      case 'rent-asc':
        sortedProperties.sort((a, b) => {
            const rentA = a.annualRentSourceCHF === null || a.annualRentSourceCHF === undefined ? (a.annualRentPotentialCBRECHF || 0) : (a.annualRentSourceCHF || 0);
            const rentB = b.annualRentSourceCHF === null || b.annualRentSourceCHF === undefined ? (b.annualRentPotentialCBRECHF || 0) : (b.annualRentSourceCHF || 0);
            return rentA - rentB;
        });
        break;
      case 'surface-desc':
        sortedProperties.sort((a, b) => (b.rentableSurfaceSqM || 0) - (a.rentableSurfaceSqM || 0));
        break;
      case 'surface-asc':
        sortedProperties.sort((a, b) => (a.rentableSurfaceSqM || 0) - (b.rentableSurfaceSqM || 0));
        break;
    }
    
    if (sortedProperties.length === 0) {
      propertyList.innerHTML = ''; // Clear list
      emptyState.classList.remove('hidden');
    } else {
      propertyList.innerHTML = sortedProperties.map(property => createPropertyCard(property)).join('');
      emptyState.classList.add('hidden');
    }
  };
  
  filterTypeSelect.addEventListener('change', updatePropertyList);
  sortSelect.addEventListener('change', updatePropertyList);

  // Initial population of the list based on default filter/sort
  updatePropertyList(); 
}




