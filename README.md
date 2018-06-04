# sf-address  
geolocating street addresses in SF

### data sources
- Addresses: [sr5d-tnui](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Addresses-Enterprise-Addressing-System/sr5d-tnui)
- Addresses with units: [dxjs-vqsy](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Addresses-with-Units-Enterprise-Addressing-System-/dxjs-vqsy)
- Business locations: [g8m3-pdis](https://data.sfgov.org/Economy-and-Community/Registered-Business-Locations-San-Francisco/g8m3-pdis)

### geographic
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
This creates a lookup table of addresses in San Francisco which gets reused.  It will take a long time (like, half an hour) to process all the addresses, because it is inefficient.

## tests
- `$npm test`

## use
```
  const SFLocator = require('index.js')
  let locator = new SFLocator()

```
