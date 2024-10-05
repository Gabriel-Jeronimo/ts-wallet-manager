import { input, select, Separator } from '@inquirer/prompts';
import { entropyToMnemonic, mnemonicToSeed } from 'bip39';
import { BIP32Factory } from 'bip32';
// import BN from 'bn.js';
import { ec } from 'elliptic'
import { randomBytes } from 'crypto'
import * as ecc from 'tiny-secp256k1';

async function createWallet(password: string) {
    // 1. Generates mnemonic
    // 2. Derives a private key based in the mnemonic
    // 3. Saves Wallet into the database
    // 4. Returns wallet details

    const mnemonic = generateMnemonic();
    const privateKeyHex = await derivePrivateKey(mnemonic, password);
    const privateKeyEDCSA = hexToEDCSA(privateKeyHex);
    console.log(privateKeyEDCSA);

}

function hexToEDCSA(privateKeyHex: Uint8Array) {
    const ecc = new ec('secp256k1');
    const edcsa = ecc.keyFromPrivate(privateKeyHex);

    return edcsa.getPrivate();
}



function generateMnemonic(): string {
    // Size from https://medium.com/@sundar.sat84/bip39-mnemonic-generation-with-detailed-explanation-84abde9da4c1.
    const entropy = randomBytes(16);
    return entropyToMnemonic(entropy);
}

async function derivePrivateKey(mnemonic: string, password: string): Promise<Uint8Array> {
    const seed = await mnemonicToSeed(mnemonic, password);
    const keys = BIP32Factory(ecc).fromSeed(seed);

    if (!keys.privateKey) {
        throw new Error("Something went wrong creating the private key");
    }

    return keys.privateKey!;
}


async function main(): Promise<void> {
    await createWallet('aaaa');
    // const answer = await select({
    //     message: "What do you want to do?",
    //     choices: [{
    //         name: "Create a new wallet",
    //         value: "new-wallet",
    //     }]
    // });

    // switch (answer) {
    //     case "new-wallet":
    //         const password = await input({ message: 'Enter a password to your wallet' });
    //         await createWallet(password);
    // }

}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        process.exit(1);
    });