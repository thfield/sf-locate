# sf-address
geolocating street addresses in SF

### data sources
- Addresses: [sr5d-tnui](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Addresses-Enterprise-Addressing-System/sr5d-tnui)
- Addresses with units: [dxjs-vqsy](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Addresses-with-Units-Enterprise-Addressing-System-/dxjs-vqsy)
- Business locations: [g8m3-pdis](https://data.sfgov.org/Economy-and-Community/Registered-Business-Locations-San-Francisco/g8m3-pdis)

### geographic
- Current Supervisor Districts: [8nkz-x4ny](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Current-Supervisor-Districts/8nkz-x4ny)
- Neighborhoods: [p5b7-5n3h](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Analysis-Neighborhoods/p5b7-5n3h)
- Neighborhoods with census tracts: [bwbp-wk3r](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Analysis-Neighborhoods-2010-census-tracts-assigned/bwbp-wk3r)
- Election Precincts 2012: [fhns-n8qp](https://data.sfgov.org/City-Management-and-Ethics/Election-Precincts-Current-Defined-2012/fhns-n8qp)
- Census tracts: [rarb-5ahf](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Census-2010-Tracts-for-San-Francisco/rarb-5ahf)

## setup
1. `$ npm run get-geo`
1. `$ npm run get-data`
1. `$ npm run prep-data`

## tests
- `$npm test`
