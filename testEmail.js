import nodemailer from 'nodemailer';

// Konfigurasi transporter untuk mengirim email menggunakan Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail', // Anda bisa mengganti ini dengan layanan email lain atau menggunakan konfigurasi SMTP custom
    auth: {
        user: 'fabricternak@gmail.com', // Ganti dengan email pengirim
        pass: 'qvjn zwjk izjb ivqk' 
    }
});

// Opsi email
const mailOptions = {
    from: 'fabricternak@gmail.com', // Ganti dengan email pengirim
    to: 'alfiaditya12@gmail.com', // Ganti dengan email penerima untuk testing
    subject: 'Testing Nodemailer',
    text: 'This is a test email sent from Node.js'
};

// Kirim email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
