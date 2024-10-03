import { input, select, Separator } from '@inquirer/prompts';
import bip39 from 'bip39';
import * as bip32 from 'bip32'
import crypto from 'crypto'

function createWallet(password: string) {
    // 1. Generates mnemonic
    // 2. Derives a private key based in the mnemonic
    // 3. Saves Wallet into the database
    // 4. Returns wallet details
    console.log("Password is: ", password)

    const mnemonic = generateMnemonic();
    derivePrivateKey(mnemonic, password);
}

function generateMnemonic(): string {
    // Size from https://medium.com/@sundar.sat84/bip39-mnemonic-generation-with-detailed-explanation-84abde9da4c1.
    const entropy = crypto.randomBytes(16);

    return bip39.entropyToMnemonic(entropy);
}

function derivePrivateKey(mnemonic: string, password: string): string {
    const seed = bip39.mnemonicToSeed(mnemonic, password);
    bip32.BIP32Factory()
    return '';
}


async function main(): Promise<void> {
    const answer = await select({
        message: "What do you want to do?",
        choices: [{
            name: "Create a new wallet",
            value: "new-wallet",
        }]
    });

    switch (answer) {
        case "new-wallet":
            const password = await input({ message: 'Enter a password to your wallet' });
            createWallet(password);
    }

}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        process.exit(1);
    });