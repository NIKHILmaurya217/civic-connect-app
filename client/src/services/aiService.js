
/**
 * Mock AI Service to simulate issue analysis.
 */
export const aiService = {
  analyzeIssue: async (title, description) => {
    console.log('AI Service: Analyzing issue...');
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

    let aiCategory = 'General > Uncategorized';
    let severity = 'Medium';
    const lowerCaseDesc = description.toLowerCase();
    const lowerCaseTitle = title.toLowerCase();

    if (lowerCaseTitle.includes('pothole') || lowerCaseDesc.includes('road')) {
      aiCategory = 'Infrastructure > Roads';
      severity = 'High';
    } else if (lowerCaseTitle.includes('garbage') || lowerCaseDesc.includes('waste')) {
      aiCategory = 'Sanitation > Waste Management';
    }
    if (lowerCaseDesc.includes('danger') || lowerCaseDesc.includes('accident')) {
      severity = 'Critical';
    }
    
    console.log('AI Service: Analysis complete.', { aiCategory, severity });
    return { aiCategory, severity };
  }
};