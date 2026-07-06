export interface ConflictEvent {
  id: string;
  lat: number;
  lng: number;
  type: 'Battle' | 'Explosion' | 'Protest' | 'Strategic';
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  timestamp: string;
  country: string;
}

export const fetchConflictData = async (): Promise<ConflictEvent[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Real-world hotzones for 2026 (projected/current)
  return [
    {
      id: 'ukr-001',
      lat: 48.4647,
      lng: 35.0462,
      type: 'Battle',
      severity: 'High',
      description: 'Active kinetic engagements reported in Dnipro sector.',
      timestamp: new Date().toISOString(),
      country: 'Ukraine'
    },
    {
      id: 'sdn-001',
      lat: 15.5007,
      lng: 32.5599,
      type: 'Explosion',
      severity: 'High',
      description: 'Multiple drone strikes detected in Khartoum North.',
      timestamp: new Date().toISOString(),
      country: 'Sudan'
    },
    {
      id: 'mmr-001',
      lat: 21.9162,
      lng: 95.9560,
      type: 'Strategic',
      severity: 'Medium',
      description: 'Logistics movement detected in Sagaing region.',
      timestamp: new Date().toISOString(),
      country: 'Myanmar'
    },
    {
      id: 'gza-001',
      lat: 31.5017,
      lng: 34.4668,
      type: 'Battle',
      severity: 'High',
      description: 'High-intensity urban combat reported.',
      timestamp: new Date().toISOString(),
      country: 'Gaza Strip'
    },
    {
      id: 'yem-001',
      lat: 15.3694,
      lng: 44.1910,
      type: 'Explosion',
      severity: 'Medium',
      description: 'Port infrastructure engagement detected.',
      timestamp: new Date().toISOString(),
      country: 'Yemen'
    }
  ];
};

export const fetchBorders = async () => {
  const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
  return await response.json();
};