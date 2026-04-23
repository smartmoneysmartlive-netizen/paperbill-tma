export type UtilityPlan = {
  id: number | string;
  label: string;
  price: number;
  cost: number;
  duration?: string;
  category?: 'Quick Data' | 'Weekly Plans' | 'Monthly Plans' | 'Mega Plans' | 'Cable' | 'Electricity';
};

export const DATA_PLANS: Record<string, UtilityPlan[]> = {
  mtn: [
    { id: 'MT003', label: '1GB (1 Day)', price: 350, cost: 300, duration: '1 Day', category: 'Quick Data' },
    { id: 'MT004', label: '2.5GB (2 Days)', price: 650, cost: 600, duration: '2 Days', category: 'Quick Data' },
    { id: 'MT008', label: '11GB (7 Days)', price: 4000, cost: 3500, duration: '7 Days', category: 'Weekly Plans' },
    { id: 'MB5', label: '5.5GB (30 Days)', price: 3200, cost: 3000, duration: '30 Days', category: 'Monthly Plans' },
    { id: 'MT011', label: '15GB (30 Days)', price: 5500, cost: 5000, duration: '30 Days', category: 'Monthly Plans' },
    { id: 'MD3', label: '70GB (30 Days)', price: 21000, cost: 20000, duration: '30 Days', category: 'Mega Plans' },
  ],
  glo: [
    { id: '18', label: '45MB (1 Day)', price: 70, cost: 50, duration: '1 Day', category: 'Quick Data' },
    { id: 'GD3', label: '120MB (1 Day)', price: 120, cost: 100, duration: '1 Day', category: 'Quick Data' },
    { id: 'GD5', label: '550MB (7 Days)', price: 550, cost: 500, duration: '7 Days', category: 'Weekly Plans' },
    { id: 'GD6', label: '2.6GB (30 Days)', price: 1100, cost: 1000, duration: '30 Days', category: 'Monthly Plans' },
    { id: 'GL1', label: '10.5GB (30 Days)', price: 4200, cost: 4000, duration: '30 Days', category: 'Monthly Plans' },
    { id: 'GL7', label: '105GB (30 Days)', price: 21000, cost: 20000, duration: '30 Days', category: 'Mega Plans' },
  ],
  airtel: [
    { id: 'ANR14', label: '200MB (5 Days)', price: 150, cost: 100, duration: '5 Days', category: 'Quick Data' },
    { id: 'ANR18', label: '1GB (3 Days)', price: 350, cost: 300, duration: '3 Days', category: 'Quick Data' },
    { id: 'ANR3', label: '1GB (7 Days)', price: 900, cost: 800, duration: '7 Days', category: 'Weekly Plans' },
    { id: 'ANR4', label: '1.5GB (7 Days)', price: 1100, cost: 1000, duration: '7 Days', category: 'Weekly Plans' },
    { id: 'ANR5', label: '4GB (30 Days)', price: 2700, cost: 2500, duration: '30 Days', category: 'Monthly Plans' },
    { id: 'ANR12', label: '18GB (30 Days)', price: 6500, cost: 6000, duration: '30 Days', category: 'Monthly Plans' },
  ],
  '9mobile': [
    { id: 'ET1', label: '40MB (1 Day)', price: 70, cost: 50, duration: '1 Day', category: 'Quick Data' },
    { id: 'ET2', label: '85MB (1 Day)', price: 120, cost: 100, duration: '1 Day', category: 'Quick Data' },
    { id: 'ET5', label: '250MB (1 Day)', price: 250, cost: 200, duration: '1 Day', category: 'Quick Data' },
    { id: 'EQ1', label: '1GB (1 Day)', price: 350, cost: 300, duration: '1 Day', category: 'Quick Data' },
    { id: 'EQ2', label: '5.3GB (30 Days)', price: 2700, cost: 2500, duration: '30 Days', category: 'Monthly Plans' },
    { id: 'EQ3', label: '35GB (30 Days)', price: 7500, cost: 7000, duration: '30 Days', category: 'Monthly Plans' },
  ]
};

export const CABLE_PLANS: Record<string, UtilityPlan[]> = {
  dstv: [
    { id: 3, label: 'DStv Padi', price: 4400, cost: 4400 },
    { id: 6, label: 'DStv Yanga', price: 6000, cost: 6000 },
    { id: 7, label: 'DStv Confam', price: 11000, cost: 11000 },
    { id: 8, label: 'DStv Compact', price: 19000, cost: 19000 },
    { id: 9, label: 'DStv Compact Plus', price: 30000, cost: 30000 },
    { id: 10, label: 'DStv Premium', price: 44500, cost: 44500 },
  ],
  gotv: [
    { id: 4, label: 'GOtv Smallie-monthly', price: 1900, cost: 1900 },
    { id: 11, label: 'GOtv Jinja', price: 3900, cost: 3900 },
    { id: 12, label: 'Gotv Jolli', price: 5800, cost: 5800 },
    { id: 13, label: 'GOtv Max', price: 8500, cost: 8500 },
    { id: 14, label: 'GOtv Supa', price: 11400, cost: 11400 },
    { id: 15, label: 'GOtv Supa Plus', price: 16800, cost: 16800 },
  ],
  startimes: [
    { id: 17, label: 'Nova (Antenna) - 1 Month', price: 2100, cost: 2100 },
    { id: 20, label: 'Basic (Antenna)- 1 month', price: 4000, cost: 4000 },
    { id: 21, label: 'Basic (dish) - 1Month', price: 5100, cost: 5100 },
    { id: 23, label: 'Classic (Dish) -1 Month', price: 7400, cost: 7400 },
    { id: 26, label: 'Super (Antenna) -1 Month', price: 9500, cost: 9500 },
  ]
};

export const ELECTRICITY_DISCOS = [
  { id: 1, name: 'Abuja Electric AEDC' },
  { id: 2, name: 'Eko Electric (EKEDC)' },
  { id: 3, name: 'Ibadan Electric (IBEDC)' },
  { id: 4, name: 'Ikeja Electric (IKEDC)' },
  { id: 5, name: 'Kaduna Electric' },
  { id: 6, name: 'Port Harcourt Electric' },
  { id: 7, name: 'Jos Electricity Distribution PLC (JEDplc)' },
  { id: 8, name: 'Enugu Electric' },
  { id: 9, name: 'Yola Electric' },
  { id: 10, name: 'Benin Electric' },
];
