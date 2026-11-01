import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Minor backend task for Moksha:
// 1. Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sahayak API Server',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 2. Services directory route
app.get('/api/services', (req, res) => {
  res.json([
    {
      id: 'pan',
      title: 'PAN Card Application & Guidance',
      forms: ['Form 49A (Indian Citizens)', 'Form 49AA (Foreign Citizens)'],
      officialPortal: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
      fee: {
        physicalCard: 107,
        ePan: 72,
        currency: 'INR'
      },
      status: 'active'
    },
    {
      id: 'ayushman',
      title: 'Ayushman Bharat PM-JAY',
      benefit: '₹5,00,000 cashless medical coverage per year per family',
      officialPortal: 'https://beneficiary.nha.gov.in/',
      status: 'active'
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Sahayak backend running on http://localhost:${PORT}`);
});
