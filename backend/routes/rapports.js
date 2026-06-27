const router = require('express').Router();
const Paiement = require('../models/Paiement');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/rapport', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Dates de début et fin requises' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const paiements = await Paiement.find({
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 });
    
    const rapport = {
      cash: 0,
      wave: 0,
      orange_money: 0,
      carte_bancaire: 0,
      total: 0,
      transactions: [],
    };
    
    const counts = {
      cash: 0,
      wave: 0,
      orange_money: 0,
      carte_bancaire: 0,
    };
    
    paiements.forEach(p => {
      const mode = p.mode;
      rapport.total += p.montant;
      rapport.transactions.push(p);
      
      if (mode === 'cash') {
        rapport.cash += p.montant;
        counts.cash++;
      } else if (mode === 'wave') {
        rapport.wave += p.montant;
        counts.wave++;
      } else if (mode === 'orange_money') {
        rapport.orange_money += p.montant;
        counts.orange_money++;
      } else if (mode === 'carte_bancaire') {
        rapport.carte_bancaire += p.montant;
        counts.carte_bancaire++;
      }
    });
    
    res.json({
      ...rapport,
      counts,
      period: { startDate, endDate },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;