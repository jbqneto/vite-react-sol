import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

export async function requestAirdrop() {

}

export async function sendSol(amount: number): Promise<string> {
    const fromKeypair = Keypair.generate();
    const toKeypair = Keypair.generate();

    console.log("from: ", fromKeypair);

    const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed",
    );

    const airdropSignature = await connection.requestAirdrop(
        fromKeypair.publicKey,
        LAMPORTS_PER_SOL,
    );

    await connection.confirmTransaction(airdropSignature);

    const lamportsToSend = amount * LAMPORTS_PER_SOL;

    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toKeypair.publicKey,
            lamports: lamportsToSend,
        }),
    );

    const trans = await sendAndConfirmTransaction(connection, transferTransaction, [
        fromKeypair,
    ]);

    return trans;
}
