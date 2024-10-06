import sqlite3 from 'sqlite3';
import { Wallet } from '../domain/wallet';

const dbName = 'Wallet.db';
const db = new sqlite3.Database(dbName);


export async function initDatabase() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS wallets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                address TEXT NOT NULL,
                keyStorePath TEXT NOT NULL,
                mnemonic TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error("Error creating table:", err.message);
            } else {
            }
        });
    });


}

export async function insertWallet(wallet: Wallet) {
    db.run(`
            INSERT INTO wallets (address, keyStorePath, mnemonic) VALUES (?, ?, ?)    
        `, [wallet.address, wallet.keyStorePath, wallet.mnemonic], function (err) {

        if (err) {
            console.error("Error inserting:", err.message);
        }

    })

}

export async function getAllWallets() {
    const sql = `SELECT * FROM wallets`;
    try {
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err);
                throw err;
            }

            rows.forEach((row) => {
                console.log(row);
            });
        })
    } catch (err) {
        console.log(err);
    }

}

export module repository {}