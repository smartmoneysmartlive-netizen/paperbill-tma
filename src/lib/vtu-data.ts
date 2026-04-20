export type UtilityPlan = {
  id: number;
  label: string;
  price: number;
  cost: number;
  duration?: string;
  category?: 'Quick Data' | 'Weekly Plans' | 'Monthly Plans' | 'Mega Plans' | 'Cable' | 'Electricity';
};

export const DATA_PLANS: Record<string, UtilityPlan[]> = {
  mtn: [
    { id: 43, label: '110MB', price: 100, cost: 99, duration: '1 Day', category: 'Quick Data' },
    { id: 74, label: '230MB', price: 250, cost: 230, duration: '1 Day', category: 'Quick Data' },
    { id: 76, label: '500MB', price: 299, cost: 280, duration: '2 Days', category: 'Quick Data' },
    { id: 78, label: '1GB', price: 300, cost: 300, duration: '1 Day', category: 'Quick Data' },
    { id: 45, label: '1GB', price: 499, cost: 450, duration: '7 Days', category: 'Weekly Plans' },
    { id: 47, label: '2GB', price: 950, cost: 930, duration: '7 Days', category: 'Weekly Plans' },
    { id: 71, label: '2GB', price: 1000, cost: 950, duration: '7 Days', category: 'Weekly Plans' },
    { id: 46, label: '1GB', price: 600, cost: 570, duration: '30 Days', category: 'Monthly Plans' },
    { id: 48, label: '2GB', price: 1250, cost: 1199, duration: '30 Days', category: 'Monthly Plans' },
    { id: 49, label: '3GB', price: 1500, cost: 1399, duration: '30 Days', category: 'Monthly Plans' },
    { id: 50, label: '5GB', price: 2300, cost: 2099, duration: '30 Days', category: 'Monthly Plans' },
    { id: 67, label: '10GB', price: 5000, cost: 4700, duration: '30 Days', category: 'Monthly Plans' },
    { id: 57, label: '36GB', price: 11000, cost: 10900, duration: '30 Days', category: 'Mega Plans' },
    { id: 51, label: '75GB', price: 18500, cost: 17999, duration: '30 Days', category: 'Mega Plans' },
  ],
  glo: [
    { id: 42, label: '200 MB', price: 100, cost: 95, duration: '1 Day', category: 'Quick Data' },
    { id: 68, label: '1GB', price: 330, cost: 300, duration: '3 Days', category: 'Quick Data' },
    { id: 54, label: '5GB', price: 1800, cost: 1699, duration: '7 Days', category: 'Weekly Plans' },
    { id: 35, label: '500MB', price: 250, cost: 230, duration: '30 Days', category: 'Monthly Plans' },
    { id: 36, label: '1GB', price: 450, cost: 430, duration: '30 Days', category: 'Monthly Plans' },
    { id: 40, label: '2GB', price: 900, cost: 850, duration: '30 Days', category: 'Monthly Plans' },
    { id: 37, label: '3GB', price: 1400, cost: 1299, duration: '30 Days', category: 'Monthly Plans' },
    { id: 38, label: '5GB', price: 2250, cost: 2199, duration: '30 Days', category: 'Monthly Plans' },
    { id: 39, label: '10GB', price: 4500, cost: 4399, duration: '30 Days', category: 'Monthly Plans' },
    { id: 59, label: '20.5GB', price: 6000, cost: 5500, duration: '30 Days', category: 'Mega Plans' },
    { id: 58, label: '107GB', price: 20000, cost: 19500, duration: '30 Days', category: 'Mega Plans' },
  ],
  airtel: [
    { id: 70, label: '1GB Social', price: 350, cost: 330, duration: '3 Days', category: 'Quick Data' },
    { id: 69, label: '1.5GB', price: 530, cost: 520, duration: '1 Day', category: 'Quick Data' },
    { id: 66, label: '1.5GB', price: 650, cost: 630, duration: '2 Days', category: 'Quick Data' },
    { id: 13, label: '500MB', price: 500, cost: 495, duration: '7 Days', category: 'Weekly Plans' },
    { id: 15, label: '1GB', price: 800, cost: 790, duration: '7 Days', category: 'Weekly Plans' },
    { id: 52, label: '5GB', price: 1599, cost: 1575, duration: '7 Days', category: 'Weekly Plans' },
    { id: 22, label: '6GB', price: 2599, cost: 2495, duration: '7 Days', category: 'Weekly Plans' },
    { id: 17, label: '2GB', price: 1500, cost: 1485, duration: '30 Days', category: 'Monthly Plans' },
    { id: 18, label: '3GB', price: 2100, cost: 1999, duration: '30 Days', category: 'Monthly Plans' },
    { id: 19, label: '4GB', price: 2650, cost: 2599, duration: '30 Days', category: 'Monthly Plans' },
    { id: 20, label: '8GB', price: 3200, cost: 3100, duration: '30 Days', category: 'Monthly Plans' },
    { id: 21, label: '10GB', price: 4200, cost: 4099, duration: '30 Days', category: 'Monthly Plans' },
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
