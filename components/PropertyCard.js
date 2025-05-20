// Property Card component for displaying individual properties
function createPropertyCard(property) {
  const {
    id,
    adresse,
    commune,
    canton,
    type,
    constructionYear,
    annualRentSourceCHF,
    annualRentPotentialCBRECHF,
    potentialPercent,
    rentableSurfaceSqM,
    grossYieldCBREPercent,
    cbreValueCHF,
    netYieldCBREPercent,
    vacancyPercent,
    acquisitionPriceCHF,
    numberOfUnits,
    condition,
    heatingType,
    specificUse,
    floor,
    areaWeightedNetRentYearSqMCHF,
    waultYears,
    lastRenovationYear,
  } = property;

  // Format values for display using utility functions
  const formattedAnnualRent = formatCurrency(annualRentSourceCHF);
  const formattedPotentialRent = formatCurrency(annualRentPotentialCBRECHF);
  const formattedPotentialPercent = formatPercentage(potentialPercent);
  const formattedSurface = formatSurface(rentableSurfaceSqM);
  const formattedGrossYield = formatPercentage(grossYieldCBREPercent);
  const formattedCBREValue = formatCurrency(cbreValueCHF);
  const formattedNetYield = formatPercentage(netYieldCBREPercent);
  const formattedVacancy = formatPercentage(vacancyPercent);
  const formattedAcquisitionPrice = formatCurrency(acquisitionPriceCHF);
  const formattedAreaWeightedNetRent = areaWeightedNetRentYearSqMCHF !== null && areaWeightedNetRentYearSqMCHF !== undefined ? `${formatCurrency(areaWeightedNetRentYearSqMCHF, { maximumFractionDigits: 2 })}/m²/year` : 'N/A';
  const formattedWaultYears = waultYears !== null && waultYears !== undefined ? `${parseFloat(waultYears).toFixed(1)} years` : 'N/A';

  let rentSection = `
    <div>
      <p class="text-gray-500 text-xs">Annual Rent (Actual)</p>
      <p class="font-medium text-dark">${formattedAnnualRent}</p>
    </div>
  `;

  // Only show potential rent if it's different from actual and actual exists, or if actual is N/A but potential exists
  if (annualRentPotentialCBRECHF && annualRentPotentialCBRECHF !== annualRentSourceCHF && annualRentSourceCHF) {
    rentSection += `
      <div>
        <p class="text-gray-500 text-xs">Potential Rent</p>
        <p class="font-medium text-dark">${formattedPotentialRent}</p>
      </div>
    `;
  } else if (annualRentPotentialCBRECHF && (annualRentSourceCHF === null || annualRentSourceCHF === undefined)) {
     rentSection = `
      <div>
        <p class="text-gray-500 text-xs">Annual Rent (Potential)</p>
        <p class="font-medium text-dark">${formattedPotentialRent}</p>
      </div>
    `;
  }


  return `
    <div class="property-card bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 overflow-hidden flex flex-col h-full">
      <div class="bg-gray-100 p-4 border-b border-gray-200">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-dark text-lg">${commune || 'N/A'}</h3>
            <p class="text-gray-700 text-sm">${adresse || 'N/A'}</p>
          </div>
          <span class="px-2 py-1 text-xs font-medium rounded-full ${getTypeColorClass(type)} whitespace-nowrap">${type || 'N/A'}</span>
        </div>
      </div>

      <div class="p-4 flex-grow">
        <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <p class="text-gray-500 text-xs">Canton</p>
            <p class="font-medium text-dark">${canton || 'N/A'}</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs">Constructed</p>
            <p class="font-medium text-dark">${constructionYear || 'N/A'}</p>
           </div>
           ${lastRenovationYear ? `
            <div>
              <p class="text-gray-500 text-xs">Renovated</p>
              <p class="font-medium text-dark">${lastRenovationYear}</p>
            </div>
          ` : '<div></div>'}
          <div>
            <p class="text-gray-500 text-xs">Surface</p>
            <p class="font-medium text-dark">${formattedSurface}</p>
          </div>
           <div>
            <p class="text-gray-500 text-xs">CBRE Value</p>
            <p class="font-medium text-dark">${formattedCBREValue}</p>
          </div>
          
          ${rentSection}

          <div>
            <p class="text-gray-500 text-xs">Gross Yield (CBRE)</p>
            <p class="font-medium text-dark">${formattedGrossYield}</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs">Net Yield (CBRE)</p>
            <p class="font-medium text-dark">${formattedNetYield}</p>
          </div>
           <div>
            <p class="text-gray-500 text-xs">Vacancy</p>
            <p class="font-medium text-dark">${formattedVacancy}</p>
          </div>
          ${(potentialPercent !== null && potentialPercent !== undefined && potentialPercent !== 0) ? `
            <div>
              <p class="text-gray-500 text-xs">Rent Potential Gain</p>
              <p class="font-medium text-dark">${formattedPotentialPercent}</p>
            </div>
          ` : '<div></div>'}
          ${(acquisitionPriceCHF !== null && acquisitionPriceCHF !== undefined) ? `
            <div>
              <p class="text-gray-500 text-xs">Acq. Price</p>
              <p class="font-medium text-dark">${formattedAcquisitionPrice}</p>
            </div>
          ` : '<div></div>'}
           ${(numberOfUnits !== null && numberOfUnits !== undefined) ? `
            <div>
              <p class="text-gray-500 text-xs">Units</p>
              <p class="font-medium text-dark">${numberOfUnits}</p>
            </div>
          ` : '<div></div>'}
          ${condition ? `
            <div>
              <p class="text-gray-500 text-xs">Condition</p>
              <p class="font-medium text-dark">${condition}</p>
            </div>
          ` : '<div></div>'}
           ${heatingType ? `
            <div>
              <p class="text-gray-500 text-xs">Heating</p>
              <p class="font-medium text-dark">${heatingType}</p>
            </div>
          ` : '<div></div>'}
           ${specificUse ? `
            <div>
              <p class="text-gray-500 text-xs">Specific Use</p>
              <p class="font-medium text-dark">${specificUse}</p>
            </div>
          ` : '<div></div>'}
          ${floor ? `
            <div>
              <p class="text-gray-500 text-xs">Floor</p>
              <p class="font-medium text-dark">${floor}</p>
            </div>
          ` : '<div></div>'}
          <div>
            <p class="text-gray-500 text-xs">Net Rent/m²/Year</p>
            <p class="font-medium text-dark">${formattedAreaWeightedNetRent}</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs">WAULT</p>
            <p class="font-medium text-dark">${formattedWaultYears}</p>
          </div>
        </div>
      </div>

      <div class="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end mt-auto">
        <button
          class="text-primary hover:text-blue-700 text-sm font-medium"
          onclick="showPropertyDetailsModal(${id})"
        >
          View Details →
        </button>
      </div>
    </div>
  `;
}

function getTypeColorClass(type) {
  switch (type) {
    case 'Résidentiel':
      return 'bg-blue-100 text-blue-800';
    case 'Mixte':
      return 'bg-purple-100 text-purple-800';
    case 'Rés.+Comm.':
      return 'bg-green-100 text-green-800';
    case 'Industriel':
      return 'bg-orange-100 text-orange-800';
    case 'Commercial': // In case this type appears
      return 'bg-teal-100 text-teal-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}

function showPropertyDetailsModal(propertyId) {
  if (!window.realEstateData || !window.realEstateData.properties) {
    alert('Property data not loaded yet. Please wait or refresh.');
    return;
  }
  const property = window.realEstateData.properties.find(p => p.id === propertyId);
  if (!property) {
    alert('Property details not found.');
    return;
  }

  let details = `Property Details (ID: ${property.id}):\n--------------------------\n`;
  
  // Define a preferred order and human-readable names for keys
  const fieldDisplayOrder = [
    { key: 'adresse', name: 'Address' },
    { key: 'commune', name: 'Commune' },
    { key: 'canton', name: 'Canton' },
    { key: 'type', name: 'Type' },
    { key: 'specificUse', name: 'Specific Use' },
    { key: 'constructionYear', name: 'Construction Year' },
    { key: 'lastRenovationYear', name: 'Last Renovation Year' },
    { key: 'condition', name: 'Condition' },
    { key: 'numberOfUnits', name: 'Number of Units' },
    { key: 'floor', name: 'Floor' },
    { key: 'heatingType', name: 'Heating Type' },
    { key: 'rentableSurfaceSqM', name: 'Rentable Surface', formatter: formatSurface },
    { key: 'annualRentSourceCHF', name: 'Annual Rent (Actual)', formatter: formatCurrency },
    { key: 'annualRentPotentialCBRECHF', name: 'Annual Rent (Potential CBRE)', formatter: formatCurrency },
    { key: 'potentialPercent', name: 'Rent Potential Gain', formatter: formatPercentage },
    { key: 'areaWeightedNetRentYearSqMCHF', name: 'Avg. Net Rent/m²/Year', formatter: (val) => val !== null && val !== undefined ? `${formatCurrency(val, {maximumFractionDigits:2})}/m²/year` : 'N/A'},
    { key: 'vacancyPercent', name: 'Vacancy Rate', formatter: formatPercentage },
    { key: 'waultYears', name: 'WAULT', formatter: (val) => val !== null && val !== undefined ? `${parseFloat(val).toFixed(1)} years` : 'N/A' },
    { key: 'cbreValueCHF', name: 'CBRE Value', formatter: formatCurrency },
    { key: 'grossYieldCBREPercent', name: 'Gross Yield (CBRE)', formatter: formatPercentage },
    { key: 'netYieldCBREPercent', name: 'Net Yield (CBRE)', formatter: formatPercentage },
    { key: 'acquisitionPriceCHF', name: 'Acquisition Price', formatter: formatCurrency }
  ];

  // Add fields in specified order
  fieldDisplayOrder.forEach(field => {
    if (Object.prototype.hasOwnProperty.call(property, field.key) && property[field.key] !== null && property[field.key] !== undefined) {
      let value = property[field.key];
      const displayName = field.name;
      
      if (field.formatter) {
        value = field.formatter(value);
      } else if (typeof value === 'number' && (value > 1000 && value < 3000) && (field.key.toLowerCase().includes('year'))) {
        // Year fields like constructionYear, lastRenovationYear already handled if no formatter.
      } else if (typeof value === 'number') {
        value = value.toLocaleString('de-CH'); // Generic number formatting if no specific formatter
      }
      // Only add if value is not 'N/A' or if it's a field that should always show (like address)
      if (value !== 'N/A' || ['adresse', 'commune', 'canton', 'type'].includes(field.key)) {
         details += `${displayName}: ${value}\n`;
      }
    }
  });

  // Add any other fields not in fieldDisplayOrder (and not 'id')
  details += "\nAdditional Data:\n--------------------------\n";
  const displayedKeys = fieldDisplayOrder.map(f => f.key);
  displayedKeys.push('id'); // Also exclude id

  for (const key in property) {
    if (Object.prototype.hasOwnProperty.call(property, key) && !displayedKeys.includes(key)) {
       if (property[key] !== null && property[key] !== undefined && String(property[key]).trim() !== "") {
        let value = property[key];
        // Basic auto-formatting for other fields
        const autoDisplayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        if (typeof value === 'object') value = JSON.stringify(value);
        else if (typeof value === 'number') value = value.toLocaleString('de-CH');
        
        details += `${autoDisplayName}: ${value}\n`;
       }
    }
  }
  alert(details);
  console.log("Selected property for modal:", property);
}
