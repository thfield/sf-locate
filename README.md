# sf-locate
Geolocating street addresses in SF

## the goal
You have an address (or an array of addresses) in San Francisco and you want to know:

  - what election precinct is in it?
  - what neighborhood?
  - which census tract?
  - supervisor district?
  - ...?

Only... you don't know PostGIS. You don't want to upload sensitive information to Carto.  You don't have the time to learn spacial joins.

Have no fear. This will (hopefully) make your life easier.

Use the code here to run your analysis offline and locally. The tradeoff is it's not super efficient, so you'll probably have to do some manually and in batches.

### data sources
Data comes from [DataSF](https://data.sfgov.org/)

- Addresses: [sr5d-tnui](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Addresses-Enterprise-Addressing-System/sr5d-tnui)
- Addresses with units: [dxjs-vqsy](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Addresses-with-Units-Enterprise-Addressing-System-/dxjs-vqsy)
- Business locations: [g8m3-pdis](https://data.sfgov.org/Economy-and-Community/Registered-Business-Locations-San-Francisco/g8m3-pdis)

### geographic lineshapes
- Election Precincts 2012: [fhns-n8qp](https://data.sfgov.org/City-Management-and-Ethics/Election-Precincts-Current-Defined-2012/fhns-n8qp)
- Neighborhoods: [p5b7-5n3h](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Analysis-Neighborhoods/p5b7-5n3h)
- Census tracts: [rarb-5ahf](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Census-2010-Tracts-for-San-Francisco/rarb-5ahf)
- Current Supervisor Districts: [8nkz-x4ny](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Current-Supervisor-Districts/8nkz-x4ny)
- Neighborhoods with census tracts: [bwbp-wk3r](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Analysis-Neighborhoods-2010-census-tracts-assigned/bwbp-wk3r)
- Parcels(?): [6b2n-v87s](https://data.sfgov.org/City-Infrastructure/Parcels-With-Planning-Department-Zoning/6b2n-v87s)

## setup
Run once
1. `$ npm run downloads`
1. `$ npm run prep-data`
This creates a lookup table of addresses in San Francisco which gets reused.  It will take a long time (like, 0.5-2hr or more, depending) to process all the addresses, because it is inefficient.

Optional
1. put additional (non-official) addresses into `additional-addresses.csv`, run `additional-munge.js`, copy those addresses into ./data/addressesProcessed.csv

## tests
Oh snap! I actually wrote tests?
- `$npm test`

## use
```javascript
  const SFLocator = require('locator.js')
  let locator = new SFLocator()

  let mainLibrary = locator.findOne({address: '100 Larkin St.', zipcode: '94102'})
  // mainLibrary now contains properties:
  // {
  //   address: '100 LARKIN ST',
  //   zipcode: '94102',
  //   assemdist: '17',
  //   bartdist: '9',
  //   congdist: '12',
  //   nhood: 'Tenderloin',
  //   prec_2010: '3621',
  //   prec_2012: '7617',
  //   supdist: '6',
  //   tractce10: '012402'
  // }

  let someLibraries = locator.findMany([
    {address: '100 Larkin St.', zipcode: '94102'},
    {address: '550 37th Avenue', zipcode: '94121'},
    {address: '123 Main Street', zipcode: '12345'}
  ])
  // someLibraries now looks like:
  // {
  //   result: [
  //     {address: '100 LARKIN ST', assemdist: '17', ...},
  //     {address: '550 37TH AVE', nhood: 'Outer Richmond', ...},
  //     'Not an SF zip code'
  //   ],
  //   unmatched: [
  //     {address: '123 Main Street', zipcode: '12345', reason: 'Not an SF zip code'}
  //   ]}
```
see `example.js` for more (now with streams!)

## improvements
- use the Addresses-with-Units dataset (dxjs-vqsy) to get parcel/blocklot numbers
- make the code more efficient
- make sure this is reusable for other municipalities
- use any geojson files to do geocoding for whatever boundaries desired
- do this in Python, R, whatever
- write some more tests
