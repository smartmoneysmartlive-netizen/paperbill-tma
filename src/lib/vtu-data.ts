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
    { id: 'MS145', label: '230MB (1 Day)', price: 250, cost: 200, duration: '1 Day', category: 'Quick Data' },
    { id: 'MS149', label: '500MB (1 Day)', price: 400, cost: 350, duration: '1 Day', category: 'Quick Data' },
    { id: 'MS143', label: '1.5GB (7 Days)', price: 1100, cost: 1000, duration: '7 Days', category: 'Weekly Plans' },
    { id: 'MS147', label: '3.5GB (7 Days)', price: 1700, cost: 1500, duration: '7 Days', category: 'Weekly Plans' },
    { id: 'MS141', label: '7GB (30 Days)', price: 3800, cost: 3500, duration: '30 Days', category: 'Monthly Plans' },
    { id: 'MS131', label: '10GB (30 Days)', price: 4800, cost: 4500, duration: '30 Days', category: 'Monthly Plans' },
    { id: 'MS140', label: '20GB (30 Days)', price: 7800, cost: 7500, duration: '30 Days', category: 'Monthly Plans' },
    { id: 'MS148', label: '65GB (30 Days)', price: 16500, cost: 16000, duration: '30 Days', category: 'Mega Plans' },
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
    { id: 'AI2', label: '100MB (1 Day)', price: 150, cost: 100, duration: '1 Day', category: 'Quick Data' },
    { id: 'ART3', label: '1GB (1 Day)', price: 550, cost: 500, duration: '1 Day', category: 'Quick Data' },
    { id: 'ART4', label: '2GB (2 Days)', price: 800, cost: 750, duration: '2 Days', category: 'Quick Data' },
    { id: 'ART6', label: '5GB (7 Days)', price: 1600, cost: 1500, duration: '7 Days', category: 'Weekly Plans' },
    { id: 'ART5', label: '2GB (30 Days)', price: 1100, cost: 1000, duration: '30 Days', category: 'Monthly Plans' },
    { id: 'ATL10', label: '25GB (30 Days)', price: 8500, cost: 8000, duration: '30 Days', category: 'Monthly Plans' },
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
