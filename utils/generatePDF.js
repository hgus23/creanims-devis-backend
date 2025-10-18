const PDFDocument = require('pdfkit');
const axios = require('axios');

module.exports = async (data) => {
  const { client, date, prestations, totalHT, tva, totalTTC } = data;
  const doc = new PDFDocument({ margin: 50 });
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  try {
    const response = await axios.get('https://creanims.com/wp-content/uploads/2020/03/logo.png', { responseType: 'arraybuffer' });
    doc.image(response.data, 50, 40, { width: 100 });
  } catch (err) {
    console.log('Logo non chargé, poursuite du PDF sans logo.');
  }

  doc.fontSize(18).text('DEVIS', { align: 'right' });
  doc.moveDown();
  doc.fontSize(12).text(`Client : ${client}`, { align: 'left' });
  doc.text(`Date : ${date}`);
  doc.moveDown(2);

  doc.fontSize(12).text('Détail des prestations :');
  doc.moveDown(0.5);

  const tableTop = 200;
  let y = tableTop;
  doc.font('Helvetica-Bold');
  doc.text('Libellé', 50, y);
  doc.text('Quantité', 250, y);
  doc.text('PU (€)', 350, y);
  doc.text('Total (€)', 450, y);
  doc.font('Helvetica');

  prestations.forEach((p, i) => {
    const py = tableTop + 25 + i * 20;
    doc.text(p.libelle, 50, py);
    doc.text(p.qte.toString(), 250, py);
    doc.text(p.pu.toFixed(2), 350, py);
    doc.text((p.qte * p.pu).toFixed(2), 450, py);
  });

  doc.moveDown(2);
  doc.text(`Total HT : ${totalHT.toFixed(2)} €`);
  doc.text(`TVA : ${tva.toFixed(2)} €`);
  doc.text(`Total TTC : ${totalTTC.toFixed(2)} €`, { bold: true });
  doc.end();

  return new Promise(resolve => {
    const result = Buffer.concat(buffers);
    resolve(result);
  });
};
