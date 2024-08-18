import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3003',
    headers: {
        'X-API-Key': 'Peternak',
    }
});

export const uploadToBlockchain = async (req, res) => {
    try {
        const { 
            earTag,
            jenisSapi,
            tanggalMasuk,
            beratAwal,
            arsipSapi,
            umurMasuk,
            beratSekarang,
            umurSekarang,
            waktuPembaruan,
            konfirmasiVaksinasi,
            konfirmasiKelayakan,
            konfirmasiVaksinasiUpdatedAt,
            konfirmasiKelayakanUpdatedAt,
            arsipSertifikat
        } = req.body;

        const payload = [
            earTag,
            jenisSapi,
            tanggalMasuk,
            beratAwal,
            arsipSapi,
            umurMasuk,
            beratSekarang,
            umurSekarang,
            waktuPembaruan,
            konfirmasiVaksinasi,
            konfirmasiKelayakan,
            konfirmasiVaksinasiUpdatedAt,
            konfirmasiKelayakanUpdatedAt,
            arsipSertifikat
        ];

        const axiosResponse = await axiosInstance.put('/submit/ternak-channel/ternak-chaincode/CreateAsset', payload);

        console.log("Axios Response:", axiosResponse);
        const data = axiosResponse.data;
        return res.status(201).json(data);

    } catch (error) {
        console.error("Error details:", error);

        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);

            if (error.response.status === 403) {
                return res.status(403).json({ msg: "Access denied: You do not have permission to perform this action." });
            }
        }

        return res.status(500).json({ msg: error.message });
    }
};

export const getAllPencatatanSapi = async (req, res) => {
    try {
        const axiosResponse = await axiosInstance.put('/evaluate/ternak-channel/ternak-chaincode/GetAllAssets', {});
        const data = axiosResponse.data;
        return res.status(201).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
};

export const getPencatatanSapiByEarTag = async (req, res) => {
    const earTag = req.params.earTag;

    try {
        const axiosResponse = await axiosInstance.put('/evaluate/ternak-channel/ternak-chaincode/ReadAsset', [earTag]);
        const data = axiosResponse.data;
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
