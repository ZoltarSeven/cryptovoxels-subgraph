
import { Transfer, MintCall} from '../generated/Parcel/Parcel'
import { Parcel, Account } from '../generated/schema'
import { Address, log, store } from '@graphprotocol/graph-ts'


function getOrCreateAccount(id: string) : Account {
  let exists = Account.load(id)
      if(!exists) {
          let account = new Account(id)
          account.address = Address.fromString(id)
          account.save()
          return account
      } else return Account.load(id) as Account
}

export function handleMintParcel(_: MintCall): void {

  let account = getOrCreateAccount(_.inputs._to.toHex())
      account.address = _.inputs._to
      account.save()

  let parcel = new Parcel(_.inputs._tokenId.toHex())
  parcel.tokenID = _.inputs._tokenId
  parcel.buildHeight = _.inputs.y2 - _.inputs.y1
  parcel.length = _.inputs.x2 - _.inputs.x1
  parcel.width = _.inputs.z2 - _.inputs.z1
  parcel.area = parcel.length * parcel.width + _.inputs.y1
  parcel.volumeInVoxels = parcel.area * parcel.buildHeight * 8
  parcel.owner = account.id
  parcel.createdAt = _.block.timestamp
  parcel.tokenURI = "https://www.cryptovoxels.com/p/" + parcel.tokenID.toString()
  
  let lengthLocation: number
  if (parcel.length % 2 == 1) {
  lengthLocation = parcel.length + 1
  }
  else {
  lengthLocation = parcel.length
  }
  let widthLocation: number
  if (parcel.width % 2 == 1) {
    widthLocation = parcel.width + 1
    }
    else {
    widthLocation = parcel.width
    }
    
  let west:  number = ((lengthLocation/2) - _.inputs.x2)
  let east:  number = ((lengthLocation/2) + _.inputs.x1)
  let north: number = (_.inputs.z1 + (widthLocation/2))
  let south: number = ((widthLocation/2) - _.inputs.z2)
  
  let westString = west.toString().split(".")[0]
  let eastString = east.toString().split(".")[0]
  let northString = north.toString().split(".")[0]
  let southString = south.toString().split(".")[0]
  
  if (_.inputs.x1 < 0 && _.inputs.z1 < 0) {
  parcel.location = westString + "W," + southString + "S"
  parcel.save()}
  else if (_.inputs.x1 < 0 && _.inputs.z1 > 0) {
  parcel.location = westString + "W," + northString + "N"
  parcel.save()}
  else if (_.inputs.x2 > 0 && _.inputs.z1 < 0) {
  parcel.location = eastString + "E," + southString + "S"
  parcel.save()}
  else  {
  parcel.location = eastString + "E," + northString + "N"
  parcel.save()
    }

}

export function handleTransferParcel(event: Transfer): void {

if (event.params._to.toHex() == '0x0000000000000000000000000000000000000000'){
    let id = event.params._to.toHex()
    let account = getOrCreateAccount(id)
    account.address = event.params._to
    account.save()
  
    let parcel = Parcel.load(event.params._tokenId.toHex())
    parcel.save()
    store.remove('Parcel', event.params._tokenId.toHex())
  }
else if (event.params._from.toHex() != '0x0000000000000000000000000000000000000000'){
  
  let id = event.params._to.toHex()
  let account = getOrCreateAccount(id)
  account.address = event.params._to
  account.save()

  let parcel = Parcel.load(event.params._tokenId.toHex())
  parcel.owner = account.id
  parcel.save()
  }

}

