import { TransferSingle, TransferBatch } from '../generated/Wearables/Wearables'
import { Wearable, Category, Account, AccountWearable } from '../generated/schema'
import { BigInt, store, ethereum, Address, log } from "@graphprotocol/graph-ts"


function getOrCreateAccount(id: string) : Account {
    let exists = Account.load(id)
        if(!exists) {
            let account = new Account(id)
            account.address = Address.fromString(id)
            account.save()
            return account
        } else return Account.load(id) as Account
  }


export function handleTransferSingle(event: TransferSingle): void {
    if (event.params._from.toHexString() == '0x0000000000000000000000000000000000000000') {
        
        let id = event.params._to.toHex()

        let account = getOrCreateAccount(id)
        account.address = event.params._to
        account.save()
        
        let category = new Category(event.params._id.toHex())
        category.tokenID = event.params._id
        category.save()

        let wearable = new Wearable(event.params._id.toHex())
        wearable.category = category.id
        wearable.initialQuantity = event.params._amount
        wearable.currentQuantity = event.params._amount
        wearable.author = account.address
        wearable.createdAt = event.block.timestamp
        if (wearable.currentQuantity.toI32() < 10){
            wearable.rarity = "Legendary"
        }
        else if (wearable.currentQuantity.toI32() < 100){
            wearable.rarity = "Epic"
        }
        else if (wearable.currentQuantity.toI32() < 1000){
            wearable.rarity = "Rare"
        }
        else if (wearable.currentQuantity.toI32() >= 1000){
            wearable.rarity = "Common"
        }
        wearable.save()

        let accountwearable = new AccountWearable(account.id+wearable.id)
        accountwearable.account = account.id
        accountwearable.wearable = wearable.id
        accountwearable.quantity = wearable.initialQuantity
        accountwearable.save()

    }
    else if (event.params._to.toHexString() == '0x0000000000000000000000000000000000000000'){
        let id = event.params._to.toHex()
        let account = getOrCreateAccount(id)
        account.address = event.params._to
        account.save()
        
        let wearable = Wearable.load(event.params._id.toHex())
        wearable.currentQuantity = wearable.currentQuantity.minus(event.params._amount)
        if (wearable.currentQuantity == BigInt.fromI32(0)){
            store.remove('Wearable', event.params._id.toHex())
        }
        wearable.save()

        let accountwearableTo = AccountWearable.load(account.id+wearable.id)
        if (accountwearableTo == null) {
            accountwearableTo = new AccountWearable(account.id+wearable.id)
        }
        accountwearableTo.account = account.id
        accountwearableTo.wearable = wearable.id
        accountwearableTo.quantity = accountwearableTo.quantity.plus(event.params._amount)
        accountwearableTo.save()

        let accountwearableFrom = AccountWearable.load(event.params._from.toHex()+wearable.id)
        if (accountwearableFrom == null) {
            accountwearableFrom = new AccountWearable(event.params._from.toHex()+wearable.id)
        }
        accountwearableFrom.quantity = accountwearableFrom.quantity.minus(event.params._amount)
        accountwearableFrom.save()
        if (accountwearableFrom.quantity == BigInt.fromI32(0)){
            store.remove('AccountWearable', event.params._from.toHex())
        }
        
    }
    else {
        let id = event.params._to.toHex()
        let account = getOrCreateAccount(id)
        account.address = event.params._to
        account.save()

        let wearable = Wearable.load(event.params._id.toHex())
        wearable.save()

        let accountwearableTo = AccountWearable.load(account.id+wearable.id)
        if (accountwearableTo == null) {
            accountwearableTo = new AccountWearable(account.id+wearable.id)
        }
        accountwearableTo.account = account.id
        accountwearableTo.wearable = wearable.id
        accountwearableTo.quantity = accountwearableTo.quantity.plus(event.params._amount)
        accountwearableTo.save()

        let accountwearableFrom = AccountWearable.load(event.params._from.toHex()+wearable.id)
        if (accountwearableFrom == null) {
            accountwearableFrom = new AccountWearable(event.params._from.toHex()+wearable.id)
        }
        accountwearableFrom.quantity = accountwearableFrom.quantity.minus(event.params._amount)
        accountwearableFrom.save()
        if (accountwearableFrom.quantity == BigInt.fromI32(0)){
            store.remove('AccountWearable', event.params._from.toHex()+wearable.id)
        }

    }
}

export function handleTransferBatch(event: TransferBatch): void {
    let ids = event.params._ids
    let amounts = event.params._amounts
    for (let i = 0; i < ids.length; i++) {

    if (event.params._from.toHexString() == '0x0000000000000000000000000000000000000000') {
        

        let account = getOrCreateAccount(event.params._to.toHex())
        account.address = event.params._to
        account.save()
        
        let category = new Category(ids[i].toHex())
        category.tokenID = ids[i]
        category.save()

        let wearable = new Wearable(ids[i].toHex())
        wearable.category = category.id
        wearable.initialQuantity = amounts[i]
        wearable.currentQuantity = amounts[i]
        wearable.author = account.address
        wearable.createdAt = event.block.timestamp
        if (wearable.currentQuantity.toI32() < 10){
            wearable.rarity = "Legendary"
        }
        else if (wearable.currentQuantity.toI32() < 100){
            wearable.rarity = "Epic"
        }
        else if (wearable.currentQuantity.toI32() < 1000){
            wearable.rarity = "Rare"
        }
        else if (wearable.currentQuantity.toI32() >= 1000){
            wearable.rarity = "Common"
        }
        wearable.save()

        let accountwearable = new AccountWearable(account.id+wearable.id)
        accountwearable.account = account.id
        accountwearable.wearable = wearable.id
        accountwearable.quantity = wearable.initialQuantity
        accountwearable.save()

    }
    else if (event.params._to.toHexString() == '0x0000000000000000000000000000000000000000'){
        

        let account = getOrCreateAccount(event.params._to.toHex())
        account.address = event.params._to
        account.save()
        
        let wearable = Wearable.load(ids[i].toHex())
        wearable.currentQuantity = wearable.currentQuantity.minus(amounts[i])
        if (wearable.currentQuantity == BigInt.fromI32(0)){
            store.remove('Wearable', ids[i].toHex())
        }
        wearable.save()

        let accountwearableTo = AccountWearable.load(account.id+wearable.id)
        if (accountwearableTo == null) {
            accountwearableTo = new AccountWearable(account.id+wearable.id)
        }
        accountwearableTo.account = account.id
        accountwearableTo.wearable = wearable.id
        accountwearableTo.quantity = accountwearableTo.quantity.plus(amounts[i])
        accountwearableTo.save()

        let accountwearableFrom = AccountWearable.load(event.params._from.toHex()+wearable.id)
        if (accountwearableFrom == null) {
            accountwearableFrom = new AccountWearable(event.params._from.toHex()+wearable.id)
        }
        accountwearableFrom.quantity = accountwearableFrom.quantity.minus(amounts[i])
        accountwearableFrom.save()
        if (accountwearableFrom.quantity == BigInt.fromI32(0)){
            store.remove('AccountWearable', event.params._from.toHex())
        }
        
    }
    else {
        

        let account = getOrCreateAccount(event.params._to.toHex())
        account.address = event.params._to
        account.save()

        let wearable = Wearable.load(ids[i].toHex())
        wearable.save()

        let accountwearableTo = AccountWearable.load(account.id+wearable.id)
        if (accountwearableTo == null) {
            accountwearableTo = new AccountWearable(account.id+wearable.id)
        }
        accountwearableTo.account = account.id
        accountwearableTo.wearable = wearable.id
        accountwearableTo.quantity = accountwearableTo.quantity.plus(amounts[i])
        accountwearableTo.save()

        let accountwearableFrom = AccountWearable.load(event.params._from.toHex()+wearable.id)
        if (accountwearableFrom == null) {
            accountwearableFrom = new AccountWearable(event.params._from.toHex()+wearable.id)
        }
        accountwearableFrom.quantity = accountwearableFrom.quantity.minus(amounts[i])
        accountwearableFrom.save()
        if (accountwearableFrom.quantity == BigInt.fromI32(0)){
            store.remove('AccountWearable', event.params._from.toHex()+wearable.id)
        }
    }
    }}
