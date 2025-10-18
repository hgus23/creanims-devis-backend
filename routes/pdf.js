const express = require('express');
const router = express.Router();
const generatePDF = require('../utils/generatePDF');

router.post('/generate-pdf', async (req, res) => {
  try {
    const pdfBuffer = await generatePDF(req.body);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=devis.pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la génération du PDF');
  }
});

module.exports = router;
