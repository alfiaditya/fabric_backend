import pkg from 'fabric-network';
const { Wallets, Gateway, X509Identity } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import FabricCAServices from 'fabric-ca-client';

// Mendapatkan __dirname di ES6 module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const ccpPath = path.resolve(__dirname, 'D:/SKRIPSI/backend/fabric.json'); 
    const ccp = JSON.parse(await fs.readFile(ccpPath, 'utf8'));
    try {
       
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        
        const userExists = await wallet.get('peternak.user2@gmail.com');
        if (userExists) {
            console.log('An identity for the user "peternak.user2@gmail.com" already exists in the wallet');
            return;
        }

        
        const adminExists = await wallet.get('peternak.admin@gmail.com');
        if (!adminExists) {
            console.log('An identity for the admin user "peternak.admin@gmail.com" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'peternak.admin@gmail.com', discovery: { enabled: true, asLocalhost: true } });

       
        const caURL = ccp.certificateAuthorities['ca.peternak.peternakan.com'].url;
        const ca = new FabricCAServices(caURL, { verify: false });
        const adminIdentity = await wallet.get('peternak.admin@gmail.com');

        
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'peternak.admin@gmail.com');

     
        const secret = await ca.register({ affiliation: 'peternak.department1', enrollmentID: 'peternak.user2@gmail.com', role: 'client' }, adminUser);
        const enrollment = await ca.enroll({ enrollmentID: 'peternak.user2@gmail.com', enrollmentSecret: secret });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'PeternakMSP',
            type: 'X.509',
        };
        await wallet.put('peternak.user2@gmail.com', x509Identity);
        console.log('Successfully registered and enrolled admin user "peternak.user2@gmail.com" and imported it into the wallet');
    } catch (error) {
        console.error(`Failed to register user "peternak.user2@gmail.com": ${error}`);
        process.exit(1);
    }
}

main();
