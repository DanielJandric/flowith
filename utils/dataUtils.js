// Data Utility Functions

/**
 * Formats a numeric value as Swiss Francs (CHF) currency.
 * @param {number|null|undefined} value - The number to format.
 * @param {object} options - Intl.NumberFormat options.
 * @returns {string} Formatted currency string or 'N/A'.
 */
function formatCurrency(value, options = {}) {
  if (value === null || value === undefined || isNaN(parseFloat(value))) {
    return 'N/A';
  }
  const mergedOptions = { style: 'currency', currency: 'CHF', ...options };
  return new Intl.NumberFormat('de-CH', mergedOptions).format(parseFloat(value));
}

/**
 * Formats a numeric value as surface area in square meters (m²).
 * @param {number|null|undefined} value - The number to format (e.g., rentable surface).
 * @param {object} options - Intl.NumberFormat options for the number part.
 * @returns {string} Formatted surface string or 'N/A'.
 */
function formatSurface(value, options = {}) {
  if (value === null || value === undefined || isNaN(parseFloat(value))) {
    return 'N/A';
  }
  const mergedOptions = { maximumFractionDigits: 0, ...options }; // Default to 0 decimal places for m²
  return `${parseFloat(value).toLocaleString('de-CH', mergedOptions)} m²`;
}

/**
 * Formats a numeric value as a percentage.
 * @param {number|null|undefined} value - The number to format (e.g., 5.5 for 5.5%).
 * @param {object} options - Options, e.g., { decimalPlaces: 1 }.
 * @returns {string} Formatted percentage string or 'N/A'.
 */
function formatPercentage(value, options = {}) {
  if (value === null || value === undefined || isNaN(parseFloat(value))) {
    return 'N/A';
  }
  const decimalPlaces = options.decimalPlaces === undefined ? 1 : options.decimalPlaces;
  return `${parseFloat(value).toFixed(decimalPlaces)}%`;
}

/**
 * Sums a specific numeric field from an array of property objects.
 * Handles null, undefined, or non-numeric values by treating them as 0.
 * @param {Array<object>} properties - Array of property objects.
 * @param {string} fieldName - The name of the field to sum.
 * @returns {number} The total sum.
 */
function sumPropertyField(properties, fieldName) {
  if (!Array.isArray(properties)) return 0;
  return properties.reduce((sum, prop) => {
    const value = prop[fieldName];
    return sum + (typeof value === 'number' && !isNaN(value) ? value : 0);
  }, 0);
}

/**
 * Groups properties by a specific field.
 * @param {Array<object>} properties - Array of property objects.
 * @param {string} fieldName - The field name to group by (e.g., 'canton', 'type').
 * @returns {object} An object where keys are field values and values are arrays of properties.
 */
function groupPropertiesByField(properties, fieldName) {
  if (!Array.isArray(properties)) return {};
  return properties.reduce((acc, prop) => {
    const key = prop[fieldName] || 'N/A'; // Group undefined/null keys under 'N/A'
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(prop);
    return acc;
  }, {});
}

/**
 * Calculates the average vacancy rate for a list of properties.
 * Only considers properties that have a numeric vacancyPercent.
 * @param {Array<object>} properties - Array of property objects.
 * @returns {number|null} The average vacancy rate, or null if no valid data.
 */
function calculatePortfolioAverageVacancy(properties) {
  if (!Array.isArray(properties)) return null;
  let totalVacancySum = 0;
  let numPropertiesWithVacancy = 0;
  properties.forEach(prop => {
    if (prop.vacancyPercent !== null && prop.vacancyPercent !== undefined && typeof prop.vacancyPercent === 'number' && !isNaN(prop.vacancyPercent)) {
      totalVacancySum += prop.vacancyPercent;
      numPropertiesWithVacancy++;
    }
  });
  return numPropertiesWithVacancy > 0 ? totalVacancySum / numPropertiesWithVacancy : null;
}

/**
 * Calculates the average vacancy rate for each property type.
 * @param {Array<object>} properties - Array of property objects.
 * @returns {object} An object where keys are property types and values are their average vacancy rates.
 */
function calculateAverageVacancyByPropertyType(properties) {
  if (!Array.isArray(properties)) return {};
  const groupedByType = groupPropertiesByField(properties, 'type');
  const avgVacancyByType = {};
  for (const type in groupedByType) {
    const averageVacancyForType = calculatePortfolioAverageVacancy(groupedByType[type]);
    if (averageVacancyForType !== null) {
        avgVacancyByType[type] = averageVacancyForType;
    } else {
        // Optionally handle types with no vacancy data, e.g. by omitting or setting to a specific value
        avgVacancyByType[type] = 0; // Or null, depending on how Chart.js should handle it
    }
  }
  return avgVacancyByType;
}
