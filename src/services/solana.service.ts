import { Adapter } from "@solana/wallet-adapter-base";
import {
    AccountInfo,
    ComputeBudgetProgram,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    RpcResponseAndContext,
    SignatureResult,
    SystemProgram,
    Transaction,
    TransactionMessage,
    VersionedTransaction,
    sendAndConfirmTransaction
} from "@solana/web3.js";
import { Config } from "../configuration/config";

type AirdropResponse = {
    response: RpcResponseAndContext<SignatureResult>,
    amount: number;
};

const PRIORITY_RATE = 100;

export class SolanaService {
    private readonly url: string;

    public constructor(private config: Config) {
        this.url = config.getUrl();
    }

    public async getAccountInfo(pubKey: PublicKey): Promise<AccountInfo<Buffer> | null> {
        const connection = this.getConnection();

        return connection.getAccountInfo(pubKey);
    }

    public getGeneratedPublicKey(): PublicKey {
        return this.config.getPublicKey();
    }

    public async requestAirdrop(publicKey: PublicKey): Promise<AirdropResponse> {
        console.log("ask airdrop for: ", publicKey.toBase58());
        try {
            const amount = 2 * LAMPORTS_PER_SOL;

            const connection = new Connection(
                this.url,
                "confirmed",
            );

            const airdropSignature = await connection.requestAirdrop(
                publicKey,
                amount,
            );

            const latestBlockHash = await connection.getLatestBlockhash();

            const response = await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: airdropSignature
            });

            return {
                response,
                amount
            }
        } catch (error) {
            throw error;
        }

    }

    private getConnection() {
        return new Connection(
            this.url);
    }

    private getPriorityTransaction(from: PublicKey, lamports: number, to: PublicKey): Transaction {
        return new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from,
                toPubkey: to,
                lamports,
            })
        ).add(ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: PRIORITY_RATE
        }));
    }

    public async transferFromPrivateWallet(receiver: PublicKey, amount: number) {
        const account = this.config.getKeyPair();
        const connection = this.getConnection();
        const lamports = LAMPORTS_PER_SOL * amount;

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: account.publicKey,
                toPubkey: receiver,
                lamports,
            })
        );

        const priorityTx = this.getPriorityTransaction(account.publicKey, lamports, receiver);

        console.log("Priority tx: ", priorityTx);

        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [account]
        );

        return {
            signature,
            explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`
        };
    }

    public async makeTransfer(wallet: Adapter, payer: PublicKey, receiver: PublicKey, amount: number) {
        const finalAmount = amount * LAMPORTS_PER_SOL;
        const connection = this.getConnection();
        const blockHash = await connection.getLatestBlockhash();

        const instructions = [
            SystemProgram.transfer({
                fromPubkey: payer,
                toPubkey: receiver,
                lamports: finalAmount,
            }),
        ];

        const message = new TransactionMessage({
            payerKey: payer,
            recentBlockhash: blockHash.blockhash,
            instructions,
        }).compileToV0Message();

        console.log("Message: ", message);
        const baseTx = new VersionedTransaction(message);

        console.log("wallet adapter: ", wallet);

        const signature = await wallet.sendTransaction(baseTx, connection);

        return {
            signature,
            explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`
        }
    }

    public async getSolBalance(pubKey: PublicKey): Promise<number> {
        const connection = this.getConnection();

        const balance = await connection.getBalance(pubKey);

        return balance / LAMPORTS_PER_SOL;
    }

    public async getTokensBalance(publicKey: PublicKey): Promise<Map<String, string>> {
        const connection = this.getConnection();
        const map = new Map<string, string>();

        const accounts = await connection.getTokenLargestAccounts(
            publicKey
        );

        accounts.value.forEach(account => {
            map.set(account.address.toBase58(), account.amount);
        });

        return map;
    }

    public async sendSOlFrom(keyPair: Keypair, toPubKey: PublicKey, amount: number) {
        const fromPubKey = keyPair.publicKey;

        const connection = this.getConnection();

        const lamportsToSend = amount * LAMPORTS_PER_SOL;
        const blockHash = await connection.getLatestBlockhash();

        const transferTransaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromPubKey,
                toPubkey: toPubKey,
                lamports: lamportsToSend,
            }),
        );

        transferTransaction.feePayer = fromPubKey;
        transferTransaction.recentBlockhash = blockHash.blockhash;

        const trans = await sendAndConfirmTransaction(connection, transferTransaction, [
            keyPair,
        ]);

        return trans;
    }

    public async sendSol(toPubKey: PublicKey, amount: number): Promise<string> {
        return this.sendSOlFrom(this.config.getKeyPair(), toPubKey, amount);
    }
}

