import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'fabricternak@gmail.com', 
        pass: 'qvjn zwjk izjb ivqk'
    }
});

export default transporter;
