# ts-wallet-manager

1. CreateWallet(password string) (*WalletDetails, error)
Purpose: This function generates a new wallet, creates an Ethereum account, stores the key in a keystore, and saves the wallet details to a repository.
Steps:
Generates a mnemonic phrase.
Derives a private key from the mnemonic.
Converts the private key from hex to an ECDSA private key.
Imports the private key into a keystore and assigns it a password.
Renames the keystore file based on the Ethereum address.
Saves the wallet (address, keystore path, mnemonic) to a repository.
Returns the wallet details (wallet, mnemonic, private key, public key).
2. ImportWallet(mnemonic, password string) (*WalletDetails, error)
Purpose: This function imports an existing wallet using a mnemonic phrase and creates a corresponding Ethereum account.
Steps:
Validates the mnemonic phrase.
Derives the private key from the mnemonic.
Converts the private key to ECDSA format.
Imports the private key into the keystore using a password.
Renames the keystore file based on the Ethereum address.
Saves the wallet (address, keystore path, mnemonic) to a repository.
Returns the wallet details (wallet, mnemonic, private key, public key).
3. LoadWallet(wallet *domain.Wallet, password string) (*WalletDetails, error)
Purpose: This function loads an existing wallet by decrypting its private key from the keystore.
Steps:
Reads the keystore file associated with the wallet.
Decrypts the private key using the provided password.
Returns the wallet details (wallet, mnemonic, private key, public key).
4. GetAllWallets() ([]domain.Wallet, error)
Purpose: This function retrieves all wallets from the repository.
Steps: Calls the repository to return a list of wallets.
5. GenerateMnemonic() (string, error)
Purpose: Generates a new mnemonic phrase for wallet creation.
Steps:
Creates random entropy (128 bits).
Converts the entropy into a mnemonic phrase.
Returns the mnemonic phrase.
6. DerivePrivateKey(mnemonic string) (string, error)
Purpose: Derives a private key from a mnemonic phrase using the BIP-32 derivation path for Ethereum wallets.
Steps:
Validates the mnemonic.
Generates a seed from the mnemonic.
Derives child keys according to the BIP-44, BIP-60, and Ethereum-specific derivation path (m/44'/60'/0'/0/0).
Returns the private key as a hex string.
7. HexToECDSA(hexkey string) (*ecdsa.PrivateKey, error)
Purpose: Converts a hexadecimal string representing a private key into an ECDSA private key object.
Steps:
Decodes the hex string to bytes.
Converts the byte array into an ECDSA private key.
Returns the private key object.
These functions handle core operations for Ethereum wallets, such as generating, importing, loading, and managing private keys using mnemonics, and securely storing them using the keystore file structure.