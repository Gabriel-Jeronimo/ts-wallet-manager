export type Wallet = {
    address: String,
    keyStorePath: String,
    mnemonic: String
}

export type WalletDetails = {
    wallet: Wallet
    mnemonic: String
    privateKey: String,
    publicKey: String,
}