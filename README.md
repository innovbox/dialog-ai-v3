# Dialog-ai 🤖

Une bibliothèque moderne de prompts pour intelligences artificielles (ChatGPT, Claude, Midjourney...) avec une interface ultra-minimale inspirée de bolt.new.

## ✨ Fonctionnalités

- 🔐 **Authentification Firebase** (Email/Password + Google)
- 📝 **Publication de prompts** avec upload d'images
- 🔍 **Exploration et recherche** de prompts publics
- ❤️ **Système de likes** et compteur de copies
- 🌙 **Dark/Light mode** avec persistance
- 📱 **Interface responsive** et animations fluides
- 🔒 **Sécurité Firebase** avec règles strictes
- 🎨 **Design moderne** inspiré de bolt.new

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone https://github.com/dialog-ai/dialog-ai.git
cd dialog-ai
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Firebase**
   - Créez un projet Firebase
   - Activez Authentication (Email/Password + Google)
   - Créez une base Firestore
   - Activez Storage
   - Copiez `.env.example` vers `.env` et ajoutez vos clés

4. **Règles de sécurité Firestore**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /prompts/{promptId} {
      allow read: if resource.data.isPublic == true || 
                     (request.auth != null && resource.data.authorId == request.auth.uid);
      allow create: if request.auth != null && 
                       request.auth.uid == resource.data.authorId;
      allow update, delete: if request.auth != null && 
                               resource.data.authorId == request.auth.uid;
    }
    
    match /likes/{likeId} {
      allow read, write: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. **Règles de sécurité Storage**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /prompt-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

6. **Lancer le projet**
```bash
npm run dev
```

## 🏗️ Architecture

```
src/
├── components/          # Composants réutilisables
│   ├── Layout/         # Header, Layout
│   └── UI/             # PromptCard, Modal, Toast...
├── contexts/           # Contextes React (Auth, Toast)
├── hooks/              # Hooks personnalisés
├── lib/                # Configuration Firebase
├── pages/              # Pages de l'application
├── services/           # Services (PromptService)
├── types/              # Types TypeScript
└── App.tsx             # Composant principal
```

## 🛠️ Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Animations**: Framer Motion
- **Icons**: Font Awesome
- **Routing**: React Router
- **Notifications**: Toast personnalisés

## 📱 Pages

- **/** - Landing page avec présentation
- **/explore** - Exploration des prompts publics
- **/login** - Connexion utilisateur
- **/register** - Inscription utilisateur
- **/dashboard** - Tableau de bord utilisateur
- **/create** - Création de nouveaux prompts

## 🔒 Sécurité

- Authentification Firebase obligatoire pour créer/modifier
- Règles Firestore strictes par utilisateur
- Validation côté client et serveur
- Upload d'images sécurisé dans Storage

## 🎨 Design System

- **Couleurs**: Palette minimaliste (blanc/gris/bleu)
- **Typography**: Inter font avec hiérarchie claire
- **Spacing**: Système 8px pour la cohérence
- **Animations**: Transitions fluides avec Framer Motion
- **Responsive**: Mobile-first avec breakpoints Tailwind

## 🚀 Déploiement

Le projet est optimisé pour Netlify :

```bash
npm run build
```

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Ouvrez une issue ou soumettez une pull request.

---

Développé avec ❤️ pour la communauté IA