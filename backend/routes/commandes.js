const router   = require('express').Router();
const Commande = require('../models/Commande');
const Client   = require('../models/Client');
const upload   = require('../middleware/upload');
const { protect, adminOnly, clientOnly } = require('../middleware/auth');
const generateInvoicePDF = require('../utils/generateInvoice');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

router.post('/public', upload.fields([
  { name: 'photoModele_0', maxCount: 1 },
  { name: 'photoTissu_0', maxCount: 1 },
]), async (req, res) => {
  try {
    const { nom, telephone, description, sexe, dateLivraison, prixTotal, avancePaye } = req.body;
    const vetements = JSON.parse(req.body.vetements || '[]');
    
    let client = await Client.findOne({ telephone });
    if (!client) {
      const tempPassword = crypto.randomBytes(16).toString('hex');
      client = await Client.create({ 
        nom, 
        telephone, 
        email: `${telephone}@temp.com`, 
        passwordHash: tempPassword 
      });
      
      res.status(201).json({ 
        message: 'Commande reçue', 
        id: client._id,
        temporaryPassword: tempPassword,
        note: 'Conservez ce mot de passe temporaire. Vous devrez le changer lors de votre première connexion.'
      });
      return;
    }

    const photos = req.files || {};
    vetements.forEach((v, idx) => {
      if (photos[`photoModele_${idx}`]) v.photoModele = photos[`photoModele_${idx}`][0].path;
      if (photos[`photoTissu_${idx}`]) v.photoTissu = photos[`photoTissu_${idx}`][0].path;
    });

    const commande = await Commande.create({
      client: client._id,
      description,
      sexe: sexe || 'homme',
      vetements,
      prixTotal: Number(prixTotal) || 0,
      avancePaye: Number(avancePaye) || 0,
      dateLivraison: dateLivraison || null,
      sourceCommande: 'public',
    });
    res.status(201).json({ message: 'Commande reçue', id: commande._id });
  } catch (err) {
    console.error('Commande POST public error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { statut, clientId } = req.query;
    const query = {};
    
    if (req.user.role === 'client') {
      query.client = req.user.clientId;
    } else {
      if (statut) query.statut = statut;
      if (clientId) query.client = clientId;
    }
    
    const commandes = await Commande.find(query)
      .populate('client', 'nom telephone')
      .sort({ createdAt: -1 });
    res.json(commandes);
  } catch (err) {
    console.error('Commandes GET error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id)
      .populate('client');
    if (!commande) return res.status(404).json({ message: 'Commande introuvable' });
    
    if (req.user.role === 'client' && commande.client._id.toString() !== req.user.clientId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    res.json(commande);
  } catch (err) {
    console.error('Commande GET by ID error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/client/:clientId', async (req, res) => {
  try {
    if (req.user.role === 'client' && req.params.clientId !== req.user.clientId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const commandes = await Commande.find({ client: req.params.clientId })
      .sort({ createdAt: -1 });
    res.json(commandes);
  } catch (err) {
    console.error('Commandes GET by client error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', protect, upload.fields([
  { name: 'photoModele_0', maxCount: 1 },
  { name: 'photoTissu_0', maxCount: 1 },
  { name: 'photoModele_1', maxCount: 1 },
  { name: 'photoTissu_1', maxCount: 1 },
  { name: 'photoModele_2', maxCount: 1 },
  { name: 'photoTissu_2', maxCount: 1 },
  { name: 'photoModele_3', maxCount: 1 },
  { name: 'photoTissu_3', maxCount: 1 },
  { name: 'photoModele_4', maxCount: 1 },
  { name: 'photoTissu_4', maxCount: 1 },
  { name: 'photoModele_5', maxCount: 1 },
  { name: 'photoTissu_5', maxCount: 1 },
  { name: 'photoModele_6', maxCount: 1 },
  { name: 'photoTissu_6', maxCount: 1 },
  { name: 'photoModele_7', maxCount: 1 },
  { name: 'photoTissu_7', maxCount: 1 },
  { name: 'photoModele_8', maxCount: 1 },
  { name: 'photoTissu_8', maxCount: 1 },
  { name: 'photoModele_9', maxCount: 1 },
  { name: 'photoTissu_9', maxCount: 1 },
]), async (req, res) => {
  try {
    if (req.user.role === 'client') {
      req.body.client = req.user.clientId;
    }
    
    const { description, sexe, dateLivraison, prixTotal, avancePaye } = req.body;
    const vetements = JSON.parse(req.body.vetements || '[]');
    
    const photos = req.files || {};
    vetements.forEach((v, idx) => {
      if (photos[`photoModele_${idx}`]) v.photoModele = photos[`photoModele_${idx}`][0].path;
      if (photos[`photoTissu_${idx}`]) v.photoTissu = photos[`photoTissu_${idx}`][0].path;
    });

    const commande = await Commande.create({
      client: req.body.client,
      description,
      sexe: sexe || 'homme',
      vetements,
      prixTotal: Number(prixTotal) || 0,
      avancePaye: Number(avancePaye) || 0,
      dateLivraison: dateLivraison || null,
    });
    res.status(201).json(commande);
  } catch (err) {
    console.error('Commande POST error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id', adminOnly, upload.fields([
  { name: 'photoModele_0', maxCount: 1 },
  { name: 'photoTissu_0', maxCount: 1 },
  { name: 'photoModele_1', maxCount: 1 },
  { name: 'photoTissu_1', maxCount: 1 },
  { name: 'photoModele_2', maxCount: 1 },
  { name: 'photoTissu_2', maxCount: 1 },
  { name: 'photoModele_3', maxCount: 1 },
  { name: 'photoTissu_3', maxCount: 1 },
  { name: 'photoModele_4', maxCount: 1 },
  { name: 'photoTissu_4', maxCount: 1 },
  { name: 'photoModele_5', maxCount: 1 },
  { name: 'photoTissu_5', maxCount: 1 },
  { name: 'photoModele_6', maxCount: 1 },
  { name: 'photoTissu_6', maxCount: 1 },
  { name: 'photoModele_7', maxCount: 1 },
  { name: 'photoTissu_7', maxCount: 1 },
  { name: 'photoModele_8', maxCount: 1 },
  { name: 'photoTissu_8', maxCount: 1 },
  { name: 'photoModele_9', maxCount: 1 },
  { name: 'photoTissu_9', maxCount: 1 },
]), async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) return res.status(404).json({ message: 'Introuvable' });

    const { description, sexe, dateLivraison, prixTotal, avancePaye, vetements, note } = req.body;
    
    if (description) commande.description = description;
    if (sexe) commande.sexe = sexe;
    if (dateLivraison) commande.dateLivraison = dateLivraison;
    if (prixTotal !== undefined) commande.prixTotal = Number(prixTotal);
    if (avancePaye !== undefined) commande.avancePaye = Number(avancePaye);
    
    if (vetements) {
      const newVetements = JSON.parse(vetements);
      const photos = req.files || {};
      
      newVetements.forEach((v, idx) => {
        if (photos[`photoModele_${idx}`]) {
          v.photoModele = photos[`photoModele_${idx}`][0].path;
        } else if (commande.vetements[idx]) {
          v.photoModele = commande.vetements[idx].photoModele;
        }
        if (photos[`photoTissu_${idx}`]) {
          v.photoTissu = photos[`photoTissu_${idx}`][0].path;
        } else if (commande.vetements[idx]) {
          v.photoTissu = commande.vetements[idx].photoTissu;
        }
      });
      
      commande.vetements = newVetements;
    }

    if (note) {
      const lastVetementIndex = commande.vetements.length - 1;
      if (lastVetementIndex >= 0 && req.body.statutIndex !== undefined) {
        const idx = Number(req.body.statutIndex);
        if (commande.vetements[idx] && req.body.statut) {
          commande.vetements[idx].statut = req.body.statut;
        }
      }
    }

    await commande.save();
    res.json(commande);
  } catch (err) {
    console.error('Commande PUT error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await Commande.findByIdAndDelete(req.params.id);
    res.json({ message: 'Commande supprimée' });
  } catch (err) {
    console.error('Commande DELETE error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/:id/facture', adminOnly, async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id)
      .populate('client', 'nom telephone');
    if (!commande) return res.status(404).json({ message: 'Commande introuvable' });

    const invoiceDir = path.join(__dirname, '..', 'invoices');
    if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });
    
    const fileName = `facture_${commande._id}_${Date.now()}.pdf`;
    const filePath = path.join(invoiceDir, fileName);
    
    await generateInvoicePDF(commande, filePath);
    
    res.download(filePath, fileName, (err) => {
      if (err) console.error('Erreur téléchargement:', err);
      setTimeout(() => fs.unlinkSync(filePath), 1000);
    });
  } catch (err) {
    console.error('Facture GET error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;