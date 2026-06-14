import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Employes() {
  const [employes, setEmployes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmploye, setEditingEmploye] = useState(null);
  const [formData, setFormData] = useState({ nom: '', telephone: '' });

  const loadEmployes = () => {
    api.get('/employes').then(r => setEmployes(r.data));
  };

  useEffect(() => {
    loadEmployes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmploye) {
        await api.put(`/employes/${editingEmploye._id}`, formData);
        toast.success('Employé mis à jour');
      } else {
        await api.post('/employes', formData);
        toast.success('Employé ajouté');
      }
      setShowModal(false);
      setEditingEmploye(null);
      setFormData({ nom: '', telephone: '' });
      loadEmployes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (employe) => {
    setEditingEmploye(employe);
    setFormData({ nom: employe.nom, telephone: employe.telephone });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet employé ?')) return;
    try {
      await api.delete(`/employes/${id}`);
      toast.success('Employé supprimé');
      loadEmployes();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openAddModal = () => {
    setEditingEmploye(null);
    setFormData({ nom: '', telephone: '' });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Employés</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-800">Liste des employés</h2>
              <p className="text-sm text-gray-500 mt-1">Gérez les employés de l'atelier</p>
            </div>
            <button 
              onClick={openAddModal}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Ajouter un employé
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Nom complet</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Téléphone</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Date d'ajout</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {employes.map(e => (
                  <tr key={e._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{e.nom}</td>
                    <td className="px-5 py-3 text-gray-600">{e.telephone}</td>
                    <td className="px-5 py-3 text-gray-400">{new Date(e.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-5 py-3 text-right">
                      <button 
                        onClick={() => handleEdit(e)}
                        className="text-blue-500 hover:underline text-xs mr-3"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(e._id)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {employes.length === 0 && (
              <p className="text-center py-10 text-gray-400">Aucun employé enregistré</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal ajout/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-bold text-gray-800 mb-4">
              {editingEmploye ? 'Modifier l\'employé' : 'Ajouter un employé'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nom complet</label>
                <input 
                  type="text" 
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="input" 
                  placeholder="Ex: Aminata Sow" 
                  required
                />
              </div>
              <div>
                <label className="label">Numéro de téléphone</label>
                <input 
                  type="tel" 
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="input" 
                  placeholder="+221 7X XXX XX XX" 
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-rose-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-rose-600"
                >
                  {editingEmploye ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}