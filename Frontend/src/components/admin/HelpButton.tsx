import { useState, useEffect } from 'react';
import { HelpCircle, X, FileText, Users, MessageSquare, Building2, Search, Keyboard, BookOpen, Zap } from 'lucide-react';

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'shortcuts' | 'tips'>('guide');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const shortcuts = [
    { key: 'Ctrl/Cmd + ?', description: 'Ouvrir l\'aide' },
    { key: 'Esc', description: 'Fermer l\'aide' },
    { key: 'Ctrl/Cmd + K', description: 'Recherche rapide (à venir)' },
  ];

  const tips = [
    {
      title: '💡 Gagnez du temps',
      content: 'Utilisez les filtres dans Actualités, Candidatures et Demandes de visite pour retrouver rapidement les éléments à traiter.',
    },
    {
      title: '🎯 Visibilité intelligente',
      content: 'Créez vos contenus en mode "Inactif" pour les préparer à l\'avance, puis activez-les quand vous êtes prêt.',
    },
    {
      title: '📊 Suivez vos statistiques',
      content: 'Le dashboard centralise les volumes clés : contenus publiés, messages non lus, utilisateurs actifs et activité générale de la plateforme.',
    },
    {
      title: '� Vérifiez les CV avant analyse',
      content: 'Dans Candidatures, utilisez la prévisualisation du CV avant de prendre une décision sur un dossier.',
    },
    {
      title: '🔐 Contrôle des accès',
      content: 'Certaines fonctions sensibles, comme l’historique des actions admin, sont réservées au super administrateur.',
    },
  ];

  const helpSections = [
    {
      title: 'Dashboard',
      icon: FileText,
      content: [
        {
          subtitle: 'Statistiques',
          description: 'Le dashboard affiche un aperçu des statistiques importantes :',
          items: [
            'Articles, Annonces, Offres : Format "X / Y" où X = publiés (visibles), Y = total',
            'Messages : Nombre de messages non lus',
            'Utilisateurs : Nombre d\'utilisateurs actifs',
            'Le bloc central permet de repérer rapidement les contenus et demandes récents',
          ],
        },
      ],
    },
    {
      title: 'Actualités',
      icon: FileText,
      content: [
        {
          subtitle: 'Gestion des contenus',
          description: 'Gérez tous vos contenus (articles, annonces, offres d\'emploi) :',
          items: [
            'Cliquez sur "Ajouter" pour créer un nouveau contenu',
            'Cliquez sur une ligne pour modifier',
            'Utilisez le filtre pour afficher un type spécifique',
            'Le champ contenu accepte du texte simple dans le formulaire et le convertit automatiquement pour l’affichage public',
          ],
        },
        {
          subtitle: 'Visibilité',
          description: 'Contrôlez la visibilité de vos contenus :',
          items: [
            '👁️ Actif (vert) : Visible sur le site public',
            '👁️‍🗨️ Inactif (gris) : Caché du public (brouillon)',
            'Cliquez sur le bouton pour basculer entre actif/inactif',
          ],
        },
      ],
    },
    {
      title: 'Candidatures',
      icon: FileText,
      content: [
        {
          subtitle: 'Suivi des candidatures',
          description: 'Consultez les réponses aux offres d’emploi depuis un seul écran :',
          items: [
            'Filtrez les candidatures par statut',
            'Ouvrez le détail d’une candidature pour voir le profil complet',
            'Prévisualisez le CV directement dans le dashboard avant analyse',
            'Mettez à jour le statut pour suivre le traitement du dossier',
          ],
        },
      ],
    },
    {
      title: 'Partenaires',
      icon: Building2,
      content: [
        {
          subtitle: 'Gestion des partenaires',
          description: 'Gérez vos partenaires affichés sur le site :',
          items: [
            'Ajoutez le logo et les informations du partenaire',
            'Choisissez la catégorie (maritime, logistics, industrial, institutional)',
            'Définissez l\'ordre d\'affichage',
          ],
        },
        {
          subtitle: 'Statut',
          description: 'Contrôlez l\'affichage des partenaires :',
          items: [
            '👁️ Actif : Apparaît dans le carrousel de la page d\'accueil',
            '👁️‍🗨️ Inactif : Caché du carrousel',
            'Tous les partenaires actifs défilent automatiquement',
          ],
        },
      ],
    },
    {
      title: 'Messages',
      icon: MessageSquare,
      content: [
        {
          subtitle: 'Gestion des messages',
          description: 'Consultez et gérez les messages de contact :',
          items: [
            'Les nouveaux messages apparaissent en gras',
            'Cliquez sur un message pour le marquer comme lu',
            'Supprimez les messages traités',
            'Traitez en priorité les messages non lus indiqués dans les statistiques',
          ],
        },
      ],
    },
    {
      title: 'Demandes & devis',
      icon: MessageSquare,
      content: [
        {
          subtitle: 'Demandes de visite',
          description: 'Suivez les demandes de visite envoyées depuis le site :',
          items: [
            'Consultez la date, le type de visite et l’infrastructure concernée',
            'Confirmez ou annulez une demande selon la disponibilité',
            'Gardez un suivi clair du statut de chaque demande',
          ],
        },
        {
          subtitle: 'Demandes de devis',
          description: 'Centralisez les demandes commerciales dans le dashboard :',
          items: [
            'Mettez à jour le statut d’avancement de chaque devis',
            'Ajoutez des notes administratives pour le suivi interne',
            'Conservez une vue claire des priorités et des demandes à relancer',
          ],
        },
      ],
    },
    {
      title: 'Utilisateurs',
      icon: Users,
      content: [
        {
          subtitle: 'Gestion des utilisateurs',
          description: 'Gérez les comptes administrateurs :',
          items: [
            'Créez de nouveaux comptes admin',
            'Activez/désactivez les comptes',
            'Modifiez les informations utilisateur',
          ],
        },
      ],
    },
    {
      title: 'Paramètres & sécurité',
      icon: HelpCircle,
      content: [
        {
          subtitle: 'Compte administrateur',
          description: 'Gérez la sécurité et le suivi du compte depuis Paramètres :',
          items: [
            'Mettez à jour vos informations personnelles',
            'Changez votre mot de passe sans perdre votre session',
            'Le super administrateur peut consulter l’historique des actions effectuées sur le dashboard',
          ],
        },
      ],
    },
    {
      title: 'Icônes communes',
      icon: HelpCircle,
      content: [
        {
          subtitle: 'Actions rapides',
          description: 'Icônes utilisées dans l\'interface :',
          items: [
            '➕ Plus : Ajouter un nouvel élément',
            '✏️ Edit : Modifier un élément existant',
            '🗑️ Trash : Supprimer un élément',
            '👁️ Eye : Élément actif/visible',
            '👁️‍🗨️ EyeOff : Élément inactif/caché',
          ],
        },
      ],
    },
  ];

  const filteredSections = helpSections.filter(section =>
    searchQuery === '' ||
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.some(c =>
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50 group"
        title="Aide (Ctrl/Cmd + ?)"
      >
        <HelpCircle size={24} />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">?</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HelpCircle className="text-blue-600" size={28} />
                  <h2 className="text-2xl font-bold text-gray-900">Centre d'aide</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'guide'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <BookOpen size={18} />
                  <span>Guide</span>
                </button>
                <button
                  onClick={() => setActiveTab('shortcuts')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'shortcuts'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Keyboard size={18} />
                  <span>Raccourcis</span>
                </button>
                <button
                  onClick={() => setActiveTab('tips')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'tips'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Zap size={18} />
                  <span>Astuces</span>
                </button>
              </div>

              {activeTab === 'guide' && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher dans l'aide..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            <div className="overflow-y-auto p-6 space-y-8">
              {activeTab === 'guide' && (
                <>
                  {searchQuery && filteredSections.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Aucun résultat pour "{searchQuery}"</p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-blue-600 hover:underline mt-2"
                      >
                        Effacer la recherche
                      </button>
                    </div>
                  )}
                  {filteredSections.map((section, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-3">
                    <section.icon className="text-blue-600" size={20} />
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  
                  {section.content.map((subsection, subIdx) => (
                    <div key={subIdx} className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">{subsection.subtitle}</h4>
                      <p className="text-gray-600 mb-2">{subsection.description}</p>
                      <ul className="space-y-1 ml-4">
                        {subsection.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                  ))}
                </>
              )}

              {activeTab === 'shortcuts' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <Keyboard size={20} />
                      Raccourcis clavier
                    </h3>
                    <p className="text-blue-800 text-sm">
                      Utilisez ces raccourcis pour naviguer plus rapidement dans le dashboard.
                    </p>
                  </div>

                  {shortcuts.map((shortcut, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <span className="text-gray-700">{shortcut.description}</span>
                      <kbd className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm font-mono text-gray-800 shadow-sm">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'tips' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                      <Zap size={20} />
                      Astuces & Bonnes pratiques
                    </h3>
                    <p className="text-yellow-800 text-sm">
                      Découvrez des astuces pour utiliser le dashboard plus efficacement.
                    </p>
                  </div>

                  {tips.map((tip, idx) => (
                    <div key={idx} className="bg-white border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2">{tip.title}</h4>
                      <p className="text-gray-700 text-sm">{tip.content}</p>
                    </div>
                  ))}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h3 className="font-bold text-blue-900 mb-2">📞 Besoin d'aide ?</h3>
                    <p className="text-blue-800 text-sm">
                      Pour toute question ou problème technique, contactez l'équipe de support technique.
                      Pensez à sauvegarder régulièrement vos modifications.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
