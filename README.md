Cryptovoxels Subgraph

This subgraph tracks parcels, names, wearables and accounts in the Cryptovoxels virtual world. 

Installation
This repo is using yarn. After cloning, run :

$ yarn install && yarn codegen

Key Entity Overviews

Parcel
Contains data concerning parcels such as buildHeight, length, width, area and has relationship with the Account entity.

Name
Contains data regarding a name and its relationship with the Account entity.

Wearables
Contains data regarding a wearable edition, such as its rarity and derives an array of the owners via the AccounWearable entity.

Account
Contains information concerning each account and its parcels, names and wearables derived from each respective entity.



Example Queries
Querying Cryptovoxels Data
This example query fetches information about a parcel with a specific tokenID and various data points for it.

{
  parcels(where: {tokenID: 7}) {
    id
    tokenID
    location
    buildHeight
    area
    owner {
      id
    }
  }
}
