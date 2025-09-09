// src/components/admin/AnalyticsChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { categories } from '../../data/mockData';

const AnalyticsChart = ({ issues }) => {
  // Process the issues data to count issues per category
  const processDataForChart = () => {
    const categoryCounts = {};
    
    // Initialize counts for all categories to 0
    categories.forEach(cat => {
      categoryCounts[cat.name] = 0;
    });

    // Count the issues
    issues.forEach(issue => {
      const categoryInfo = categories.find(c => c.id === issue.category);
      if (categoryInfo) {
        categoryCounts[categoryInfo.name]++;
      }
    });

    // Format the data for the chart
    return Object.keys(categoryCounts).map(categoryName => ({
      name: categoryName,
      Issues: categoryCounts[categoryName],
    }));
  };

  const chartData = processDataForChart();

  return (
    <div className="card p-6" style={{ height: '400px' }}>
      <h3 className="card-title mb-4">Issues by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Issues" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;