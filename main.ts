import { input, select } from '@inquirer/prompts';
import { entropyToMnemonic, mnemonicToSeed } from 'bip39';
import { BIP32Factory } from 'bip32';
import { ethers } from 'ethers';
import { ec } from 'elliptic';
import { randomBytes } from 'crypto';
import * as ecc from 'tiny-secp256k1';
import fs from 'fs';
import path from 'path';
import os from 'os';

import { Wallet, WalletDetails } from './domain/wallet';
import { getAllWallets, initDatabase, insertWallet } from './infraestructure/repository';

async function createWallet(password: string): Promise<WalletDetails> {
    try {
        const mnemonic = generateMnemonic();
        const privateKeyHex = await derivePrivateKey(mnemonic, password);
        const privateKeyEDCSA = hexToEDCSA(privateKeyHex);

        const account = new ethers.Wallet(privateKeyEDCSA.getPrivate().toString('hex'));

        const keystoreDir = path.join(os.homedir(), '.wallet-manager', 'keystores');

        if (!fs.existsSync(keystoreDir)) {
            fs.mkdirSync(keystoreDir, { recursive: true });
        }

        const keystore = await account.encrypt(password);
        const keystorePath = path.join(keystoreDir, `${account.address}.json`);
        fs.writeFileSync(keystorePath, keystore);

        const wallet = { address: account.address, mnemonic, keyStorePath: keystorePath } as Wallet;
        const walletDetails = {
            wallet,
            mnemonic,
            privateKey: privateKeyEDCSA.getPrivate('hex'),
            publicKey: privateKeyEDCSA.getPublic('hex'),
        } as WalletDetails;

        await insertWallet(wallet);

        return walletDetails;
    } catch (error) {
        console.error("Error creating wallet:", error);
        throw new Error("Failed to create the wallet. Please try again.");
    }
}

async function getWallets(): Promise<void> {
    getAllWallets();
}

function hexToEDCSA(privateKeyHex: Uint8Array) {
    try {
        const ecc = new ec('secp256k1');
        const edcsa = ecc.keyFromPrivate(privateKeyHex);
        return edcsa;
    } catch (error) {
        console.error("Error converting private key to EDCSA:", error);
        throw new Error("Invalid private key format");
    }
}

function generateMnemonic(): string {
    try {
        const entropy = randomBytes(16);
        return entropyToMnemonic(entropy);
    } catch (error) {
        console.error("Error generating mnemonic:", error);
        throw new Error("Failed to generate a mnemonic. Please try again.");
    }
}

async function derivePrivateKey(mnemonic: string, password: string): Promise<Uint8Array> {
    try {
        const seed = await mnemonicToSeed(mnemonic, password);
        const keys = BIP32Factory(ecc).fromSeed(seed);

        if (!keys.privateKey) {
            throw new Error("Private key generation failed");
        }

        return keys.privateKey!;
    } catch (error) {
        console.error("Error deriving private key:", error);
        throw new Error("Failed to derive the private key. Please check your mnemonic and password.");
    }
}



async function main(): Promise<void> {
    try {
        await initDatabase();

        const answer = await select({
            message: "What do you want to do?",
            choices: [{ name: "Create a new wallet", value: "new-wallet" }, { name: "Get all wallets", value: "get-wallets" }],
            loop: false
        });

        switch (answer) {
            case "new-wallet":
                const password = await input({ message: 'Enter a password for your wallet' });
                const walletDetails = await createWallet(password);
                console.log("Wallet created successfully:", walletDetails);
                break;
            case "get-wallets":
                await getWallets();
                break;

            default:
                console.log("Unknown option");
        }


    } catch (error: any) {
        console.error("Error during operation:", error.message || error);
        process.exit(1);
    }
}

main()
    .then(() => {
    })
    .catch((error) => {
        console.error("Unhandled error:", error);
    });


