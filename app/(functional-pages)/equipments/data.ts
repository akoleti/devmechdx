export interface Equipment {
  id: string;
  name: string;
  location: {
    id: string;
    name: string;
  };
  serialNumber: string;
  model: string;
  manufacturer: string;
  installedDate: string;
  lastService: string;
  status: 'Active' | 'Inactive';
  inefficiencyCost: number;
  specifications: {
    capacity: string;
    refrigerantType: string;
    coolingCapacity: string;
    powerConsumption: string;
    cop: string;
    eer: string;
  };
}

export const equipments: Equipment[] = [
  {
    id: '1',
    name: 'York YKF4507 Chiller #1',
    location: {
      id: '1',
      name: 'Headquarters'
    },
    serialNumber: 'YK-45678-C1',
    model: 'YKF4507',
    manufacturer: 'York',
    installedDate: '2018-05-15',
    lastService: '2023-11-08',
    status: 'Active',
    inefficiencyCost: 15780.25,
    specifications: {
      capacity: '450 tons',
      refrigerantType: 'R-134a',
      coolingCapacity: '1,582 kW',
      powerConsumption: '320 kW',
      cop: '4.94',
      eer: '16.9'
    }
  },
  {
    id: '2',
    name: 'York YKF4507 Chiller #2',
    location: {
      id: '1',
      name: 'Headquarters'
    },
    serialNumber: 'YK-45679-C2',
    model: 'YKF4507',
    manufacturer: 'York',
    installedDate: '2018-05-15',
    lastService: '2023-10-22',
    status: 'Active',
    inefficiencyCost: 12450.75,
    specifications: {
      capacity: '450 tons',
      refrigerantType: 'R-134a',
      coolingCapacity: '1,582 kW',
      powerConsumption: '320 kW',
      cop: '4.94',
      eer: '16.9'
    }
  },
  {
    id: '3',
    name: 'York YKF4507 Chiller #3',
    location: {
      id: '1',
      name: 'Headquarters'
    },
    serialNumber: 'YK-45680-C3',
    model: 'YKF4507',
    manufacturer: 'York',
    installedDate: '2018-05-15',
    lastService: '2023-12-01',
    status: 'Inactive',
    inefficiencyCost: 8320.50,
    specifications: {
      capacity: '450 tons',
      refrigerantType: 'R-134a',
      coolingCapacity: '1,582 kW',
      powerConsumption: '320 kW',
      cop: '4.94',
      eer: '16.9'
    }
  }
]; 