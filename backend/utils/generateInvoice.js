const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateInvoicePDF(commande, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    
    doc.pipe(stream);
    
    // En-tête
    doc.fontSize(20).text('NKG Couture', { align: 'center' });
    doc.fontSize(12).text('Facture de Commande', { align: 'center' });
    doc.moveDown();
    
    // Infos facture
    doc.fontSize(10).text(`Numéro de commande: ${commande._id}`, { align: 'left' });
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'left' });
    doc.moveDown();
    
    // Infos client
    doc.fontSize(14).text('Informations Client', { underline: true });
    doc.fontSize(10).text(`Nom: ${commande.client?.nom || 'N/A'}`);
    doc.text(`Téléphone: ${commande.client?.telephone || 'N/A'}`);
    doc.moveDown();
    
    // Détails commande
    doc.fontSize(14).text('Détails de la Commande', { underline: true });
    doc.fontSize(10).text(`Type de vêtement: ${commande.typeVetement}`);
    doc.text(`Description: ${commande.description}`);
    doc.text(`Sexe: ${commande.sexe || 'N/A'}`);
    if (commande.dateLivraison) {
      doc.text(`Date de livraison: ${new Date(commande.dateLivraison).toLocaleDateString('fr-FR')}`);
    }
    doc.moveDown();
    
    // Mesures
    if (commande.mesures && Object.keys(commande.mesures).length > 0) {
      doc.fontSize(12).text('Mesures (cm)', { underline: true });
      const labels = {
        cou: 'Cou', tourPoitrine: 'Tour de poitrine', longueurMancheCourte: 'Longueur manche courte',
        longueurMancheLongue: 'Longueur manche longue', tourManche: 'Tour de manche',
        tourPoignet: 'Tour de poignet', longueurBoubou: 'Longueur boubou',
        epaules: 'Epaules', ceinture: 'Ceinture', tourFesse: 'Tour de fesse',
        tourCuisse: 'Tour de cuisse', tourGenou: 'Tour de genou', tourMollet: 'Tour de mollet',
        longueurPantalon: 'Longueur pantalon', longueurDemiSaison: 'Longueur demi-saison',
        tourTaille: 'Tour de taille', longueurHaut: 'Longueur haut', longueurMariniere: 'Longueur marinière',
        longueurBoubou3Quart: 'Longueur boubou 3/4', longueurJupe: 'Longueur jupe',
        longueurPagne: 'Longueur pagne', autres: 'Autres',
        hauteurTotal: 'Hauteur totale', hauteurDos: 'Hauteur du dos',
        longueurBras: 'Longueur des bras', tourBras: 'Tour de bras', tourHanches: 'Tour de hanches',
      };
      
      Object.entries(commande.mesures)
        .filter(([k, v]) => v && k !== 'autres')
        .forEach(([k, v]) => {
          doc.fontSize(9).text(`${labels[k] || k}: ${v} cm`);
        });
      doc.moveDown();
    }
    
    // Paiements
    doc.fontSize(14).text('Récapitulatif Financier', { underline: true });
    doc.fontSize(10).text(`Prix total: ${commande.prixTotal?.toLocaleString()} FCFA`);
    doc.text(`Avance payée: ${commande.avancePaye?.toLocaleString()} FCFA`);
    doc.text(`Reste à payer: ${(commande.prixTotal - commande.avancePaye)?.toLocaleString()} FCFA`);
    doc.moveDown();
    
    // Statut
    doc.fontSize(12).text('Statut de la Commande', { underline: true });
    doc.fontSize(10).text(`Statut actuel: ${commande.statut.replace('_', ' ')}`);
    doc.moveDown();
    
    // Historique
    if (commande.historiqueStatut?.length > 0) {
      doc.fontSize(12).text('Historique des Statuts', { underline: true });
      commande.historiqueStatut.forEach((h, i) => {
        doc.fontSize(9).text(`${i + 1}. ${h.statut.replace('_', ' ')} - ${new Date(h.date).toLocaleDateString('fr-FR')}${h.note ? ` (${h.note})` : ''}`);
      });
    }
    
    // Pied de page
    doc.moveDown(2);
    doc.fontSize(10).text('Merci de votre confiance !', { align: 'center' });
    
    doc.end();
    
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

module.exports = generateInvoicePDF;