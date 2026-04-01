const userId = (localStorage.getItem('userId'))
console.log(userId);
const vendorIdentifier = JSON.parse (localStorage.getItem('vendorIdentifier'))
// console.log(vendorIdentifier[0].vendor_identifier);

export const catalogue = [
  {
    id: 1,
    endpoint:`https://service.swiftsuite.app/vendor/all-catalogue/${userId}/`,
    name: 'All',
    // identifier: 
  },
  {
    id: 2,
    endpoint:`https://service.swiftsuite.app/vendor/catalogue-rsr/${userId}/`,
    name: 'rsr',
    endpointName: 'RSR'
  },
  {
    id: 3,
    endpoint:`https://service.swiftsuite.app/vendor/catalogue-zanders/${userId}/`,
    name: 'zanders',
    endpointName: 'Zanders'
  },
  {
    id: 4,
    endpoint: `https://service.swiftsuite.app/vendor/catalogue-cwr/${userId}/`,
    name: 'cwr',
    endpointName: 'CWR'
  },
  {
    id: 5,
    endpoint:`https://service.swiftsuite.app/vendor/catalogue-ssi/${userId}/`,
    name: 'ssi',
    endpointName: 'SSi'
  },
  {
    id: 6,
    endpoint: `https://service.swiftsuite.app/vendor/catalogue-lipsey/${userId}/`,
    name: 'lipsey',
    endpointName: 'Lipsey'
  },
  {
    id: 7,
    endpoint:`https://service.swiftsuite.app/vendor/catalogue-fragrancex/${userId}/`,
    name: 'fragranceX',
    endpointName: 'FragranceX'
  },
];
