export default {
  auth: {
    connect: 'se connecter',
    connected: 'connecté',
    createAccount: 'créer mon compte',
    email: 'adresse e-mail',
    emailError: 'veuillez entrer un e-mail valide',
    emailHint: 'un lien de connextion vous sera envoyé',
    emailSent: 'Lien de connexion envoyé',
    googleAccount: 'compte Google',
    loggingOut: 'déconnection en cours',
    noEmailForSignIn: 'Oups... j\'ai oublié votre e-mail',
    pleaseEnterEmailForSignIn: 'Merci de l\'entrer à nouveau',
    pleaseWait: 'Veuillez patienter',
    sendingMail: 'envoi du lien de connexion...'
  },
  editor: {
    changes: {
      cancelChanges: 'Annuler les modifications',
      saveAndContinue: 'Sauvegarder et continuer',
      saveChanges: 'Sauvegarder les modifications',
      stayOnPage: 'Rester sur la page',
      unsavedChanges: 'Changements non sauvegardés'
    },
    station: {
      addRow: {
        text: 'texte',
        image: 'image'
      },
      image: {
        sendImage: 'envoyer une image',
        uploadThenSave: 'Envoyer l\'image, puis sauvegarder tous les changements sur ce poste ?',
        url: 'lien de l\'image',
        warningDeleteImage: 'L\'image précédemment envoyée sera supprimée du serveur.',
        width: 'largeur de l\'image: '
      }
    },
    trail: {
      allStationDataWillBeLost: 'Toutes les données du poste seront perdues.',
      askRemoveStation: 'Supprimer le poste ?',
      askSaveThenRemoveStation: 'Sauvegarder les changements, puis supprimer le poste ?',
      confirmRemoveStation: 'Oui, supprimer le poste',
      doNotCreateStation: 'Ne pas créer le poste',
      doNotRemoveStation: 'Non, ne pas supprimer le poste',
      downloadQrCodes: 'télécharger les codes QR',
      qrCodes: 'Codes QR',
      saveChangesThenCreateStation: 'Sauvegarder les changements, puis créer le poste',
      saveChangesThenRemoveStation: 'Oui, sauvegarder les changements, puis supprimer le poste'
    },
    trailsList: {
      allTrailDataWillBeLost: 'Toutes les données de ce parcours ainsi que celles de tous ses postes seront définitivement perdues !',
      askRemoveTrail: 'Supprimer le parcours ?',
      cancelRemoveTrail: 'Ne pas supprimer',
      confirmRemoveTrail: 'Supprimer',
      createTrail: 'créer un parcours'
    }
  },
  navigation: {
    cancel: 'annuler',
    goHome: 'accueil',
    ok: 'continuer',
    warning: 'Attention !'
  },
  routes: {
    history: 'postes visités',
    editor: 'éditeur',
    home: 'accueil',
    logout: 'se déconnecter',
    map: 'trouver un parcours',
    scanner: 'scanner',
    sign: 'se connecter'
  },
  trail: {
    manage: {
      duration: 'durée',
      foundStationOfTrail: 'Vous avez trouvé le poste "{stationName}" du parcours "{trailName}"',
      inaccessibleStation: 'Le parcours ne peut pas être commencé ici.',
      mentalEffort: 'mental',
      physicalEffort: 'physique',
      start: 'Commencer le parcours',
      trailStartIsOnMap: 'Pour commencer le parcours, rendez-vous au poste figurant sur la carte.'
    },
    station: {
      connectForFullUse: 'Connectez-vous pour sauvegarder votre progression en ligne et pour créer vos propre parcours.',
      waitForStation: 'patientez pendant le chargement du poste...'
    }
  }
}
