// server.js (Node.js ve Express)
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Nodemailer konfigürasyonu
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Kullanmakta olduğunuz e-posta servisi
  auth: {
    user: 'your-email@gmail.com', // Gönderim yapan e-posta adresi
    pass: 'your-email-password', // E-posta hesabının şifresi
  },
});

app.post('/send-report', async (req, res) => {
  const { issueDescription } = req.body;

  const mailOptions = {
    from: 'kdrbln172335@gmail.com', // Gönderen e-posta adresi
    to: 'kdrbln17@gmail.com', // Hedef e-posta adresi
    subject: 'Yeni Sorun Raporu',
    text: `Sorun Açıklaması: ${issueDescription}`, // Gövde
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('E-posta başarıyla gönderildi');
  } catch (error) {
    res.status(500).send('E-posta gönderilirken bir hata oluştu');
  }
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});
