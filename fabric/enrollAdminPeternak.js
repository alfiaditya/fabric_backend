import pkg from 'fabric-network';
const { Wallets } = pkg;
import FabricCAServices from 'fabric-ca-client';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Mendapatkan __dirname di ES6 module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const ccpPath = path.resolve(__dirname, 'D:/SKRIPSI/backend/fabric.json');
    const ccp = JSON.parse(await fs.readFile(ccpPath, 'utf8'));

    try {
        
        const caInfo = ccp.certificateAuthorities['ca.peternak.peternakan.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

       
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

       
        const adminExists = await wallet.get('peternak.admin@gmail.com');
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        
        try {
            const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
            const identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'PeternakMSP',
                type: 'X.509',
            };
            await wallet.put('peternak.admin@gmail.com', identity);
            console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        } catch (enrollError) {
            console.error('Error during CA enrollment:');
            console.error(enrollError);
            if (enrollError.responses) {
                enrollError.responses.forEach((response, index) => {
                    console.error(`Response ${index}: ${JSON.stringify(response)}`);
                });
            }
            throw enrollError; 
        }
    } catch (error) {
        if (error instanceof AggregateError) {
            console.error('Failed to enroll admin user "admin" due to multiple errors:');
            for (const individualError of error.errors) {
                console.error(`Individual Error: ${individualError.message}`);
            }
        } else {
            console.error(`Failed to enroll admin user "admin": ${error.message}`);
            if (error.stack) {
                console.error(error.stack);
            }
        }
        process.exit(1);
    }
}

main();
