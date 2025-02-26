import { Location } from './page';

// Mock data for locations
export const locations: Location[] = [
  {
    id: 1001,
    name: 'Navy Air Station - Building 1828',
    address: '385 South Third St.',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78415',
    customer: {
      name: 'U.S. Navy',
      id: 105
    },
    equipmentCount: 5,
    technicians: 2,
    status: 'active',
    lastService: '2023-02-25',
  },
  {
    id: 1002,
    name: 'Veterans High School',
    address: '3750 Cimarron Blvd',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78414',
    customer: {
      name: 'Corpus Christi ISD',
      id: 108
    },
    equipmentCount: 12,
    technicians: 3,
    status: 'active',
    lastService: '2023-02-20',
  },
  {
    id: 1003,
    name: 'City Hall - HVAC Control Room',
    address: '1201 Leopard St',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78401',
    customer: {
      name: 'City of Corpus Christi',
      id: 112
    },
    equipmentCount: 8,
    technicians: 2,
    status: 'maintenance',
    lastService: '2023-01-15',
  },
  {
    id: 1004,
    name: 'Shoreline Medical Center',
    address: '1305 Shoreline Blvd',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78401',
    customer: {
      name: 'Christus Spohn Health',
      id: 115
    },
    equipmentCount: 20,
    technicians: 5,
    status: 'active',
    lastService: '2023-02-18',
  },
  {
    id: 1005,
    name: 'Texas A&M Corpus Christi - Engineering Building',
    address: '6300 Ocean Drive',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78412',
    customer: {
      name: 'Texas A&M University System',
      id: 120
    },
    equipmentCount: 15,
    technicians: 4,
    status: 'active',
    lastService: '2023-02-10',
  },
  {
    id: 1006,
    name: 'Tuloso-Midway Middle School',
    address: '9768 La Branch Dr',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78410',
    customer: {
      name: 'Tuloso-Midway ISD',
      id: 125
    },
    equipmentCount: 9,
    technicians: 2,
    status: 'inactive',
    lastService: '2022-12-05',
  }
]; 