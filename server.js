const express = require('express');
const cors = require('cors');
const generatePDF = require('./utils/generatePDF');

const app = express();
app.use(cors());
app.use(express.json());

// Route principale
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const pdfBuffer = await generatePDF(req.body);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Erreur PDF:', err);
    res.status(500).send('Erreur lors de la génération du PDF.');
  }
});

// Export obligatoire pour Vercel
module.exports = app;
