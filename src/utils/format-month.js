export function formatMonth(monthStr) {
    if (monthStr.length !== 4) {
      return monthStr; // Return original string if it doesn't match expected format
    }
    
    const monthPart = monthStr.substring(0, 2);
    const yearPart = monthStr.substring(2);
  
    // Create a date object using a date in the specified month and year
    const date = new Date(`20${yearPart}-${monthPart}-01`);
  
    // Options to control the output of toLocaleDateString()
    const options = { year: 'numeric', month: 'long' };
  
    // Format the date to a more readable form
    return date.toLocaleDateString('en-US', options);
  }
  