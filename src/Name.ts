import { Transfer, MintCall} from '../generated/Name/Name'
import { Name, Account } from '../generated/schema'
import { Address, store, log } from '@graphprotocol/graph-ts'


function getOrCreateAccount(id: string) : Account {
    let exists = Account.load(id)
        if(!exists) {
            let account = new Account(id)
            account.address = Address.fromString(id)
            account.save()
            return account
        } else return Account.load(id) as Account
  }

export function handleMintName(_:MintCall): void {

    let account = getOrCreateAccount(_.inputs._to.toHex())
    account.address = _.inputs._to
    account.save()

    log.info('The value is: {}', [_.outputs.value0.toHexString()])
    let name = new Name(_.outputs.value0.toHex())
    name.tokenID = _.outputs.value0
    name.name = _.inputs._name
    name.owner = account.id
    name.createdAt = _.block.timestamp
    name.save()
    
}

export function handleTransferName(event: Transfer): void {
    
    if (event.params._to.toHex() == '0x0000000000000000000000000000000000000000'){
      let name = Name.load(event.params._tokenId.toHex())
      name.save()
      store.remove('Name', event.params._tokenId.toHex())

      }
    else {
        let id = event.params._to.toHex()
        let account = getOrCreateAccount(id)
        account.address = event.params._to
        account.save()
      
        let name = Name.load(event.params._tokenId.toHex())
        name.owner = account.id
        name.save()
    }
}
