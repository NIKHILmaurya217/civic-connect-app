export const mockIssuesData = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'Dangerous pothole causing vehicle damage near the market',
    category: 'roads',
    priority: 'high',
    status: 'pending',
    location: { lat: 23.6345, lng: 85.3803, address: 'Main Street, Ranchi' },
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Pothole',
    reportedBy: 'Amit Kumar',
    reportedAt: new Date('2024-01-15T10:30:00'),
    upvotes: 15,
    verified: true,
    aiCategory: 'Infrastructure > Roads',
    severity: 'High'
  },
  {
    id: '2',
    title: 'Overflowing garbage bin',
    description: 'Garbage bin near school is overflowing, creating unhygienic conditions.',
    category: 'sanitation',
    priority: 'medium',
    status: 'in-progress',
    location: { lat: 23.6245, lng: 85.3703, address: 'School Road, Ranchi' },
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Garbage+Bin',
    reportedBy: 'Priya Singh',
    reportedAt: new Date('2024-01-14T14:20:00'),
    upvotes: 8,
    verified: true,
    aiCategory: 'Sanitation > Waste Management',
    severity: 'Medium'
  }
];

export const categories = [
  { id: 'roads', name: 'Roads & Infrastructure', icon: '🛣️' },
  { id: 'sanitation', name: 'Sanitation', icon: '🗑️' },
  { id: 'electricity', name: 'Electricity', icon: '⚡' },
  { id: 'water', name: 'Water Supply', icon: '💧' },
  { id: 'public-safety', name: 'Public Safety', icon: '🚨' },
  { id: 'environment', name: 'Environment', icon: '🌱' }
];