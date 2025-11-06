# LocationMaison - Guide d'utilisation de la Base de Données

## 📋 Vue d'ensemble

Cette application utilise **localStorage** comme base de données côté client. Toutes les données (utilisateurs, propriétés) sont stockées dans le navigateur.

## 🚀 Comment utiliser la base de données

### 1. **Initialisation automatique**

La base de données s'initialise automatiquement lors du chargement de n'importe quelle page. Aucune action requise !

### 2. **Fonctionnalités disponibles**

#### **Gestion des utilisateurs :**
- ✅ **Inscription** : Créez un compte via `register.html`
- ✅ **Connexion** : Connectez-vous via `login.html`
- ✅ **Session** : Restez connecté entre les pages
- ✅ **Déconnexion** : Déconnectez-vous depuis le menu utilisateur

#### **Gestion des propriétés :**
- ✅ **Ajouter** : Ajoutez une maison via `add-house.html` (nécessite d'être connecté)
- ✅ **Afficher** : Consultez toutes les propriétés sur `index.html`
- ✅ **Rechercher** : Utilisez le formulaire de recherche sur la page d'accueil
- ✅ **Lier à l'utilisateur** : Chaque maison est automatiquement liée à l'utilisateur qui l'a créée

### 3. **Page de gestion de la base de données**

Accédez à `db-manager.html` pour :
- 📊 Voir les statistiques (nombre de propriétés, utilisateurs, etc.)
- 👀 Visualiser toutes les données en JSON
- 📥 Exporter la base de données en fichier JSON
- 📤 Importer des données depuis un fichier JSON
- 📋 Importer les données d'exemple depuis `database-sample.json`
- 🗑️ Effacer toutes les données (avec confirmation)

### 4. **Structure de la base de données**

#### **Propriétés (Houses) :**
```json
{
  "id": 1,
  "userId": 1,
  "title": "Maison moderne 3 chambres",
  "propertyType": "maison",
  "address": "123 Boulevard de la Marina",
  "city": "Cotonou",
  "postalCode": "01 BP",
  "country": "Bénin",
  "area": 120,
  "bedrooms": 3,
  "bathrooms": 2,
  "parking": 1,
  "price": 500000,
  "deposit": 1000000,
  "description": "...",
  "features": ["wifi", "heating"],
  "contact": {
    "name": "...",
    "email": "...",
    "phone": "+229 ..."
  },
  "availability": "2024-02-01",
  "status": "available",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### **Utilisateurs (Users) :**
```json
{
  "id": 1,
  "fullName": "Jean Dupont",
  "email": "jean@example.com",
  "password": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## 🔧 Fonctions JavaScript disponibles

### **Propriétés :**
- `getAllHouses()` - Récupère toutes les propriétés
- `getHouseById(id)` - Récupère une propriété par ID
- `addHouse(houseData)` - Ajoute une nouvelle propriété
- `updateHouse(id, houseData)` - Met à jour une propriété
- `deleteHouse(id)` - Supprime une propriété
- `searchHouses(filters)` - Recherche des propriétés avec filtres

### **Utilisateurs :**
- `registerUser(userData)` - Enregistre un nouvel utilisateur
- `loginUser(email, password)` - Connecte un utilisateur
- `logoutUser()` - Déconnecte l'utilisateur
- `getCurrentUser()` - Récupère l'utilisateur connecté
- `isLoggedIn()` - Vérifie si un utilisateur est connecté
- `getUserById(userId)` - Récupère un utilisateur par ID
- `getHousesByUserId(userId)` - Récupère les propriétés d'un utilisateur

### **Base de données :**
- `exportDatabase()` - Exporte la base de données en JSON
- `importDatabase(file)` - Importe depuis un fichier JSON
- `clearDatabase()` - Efface toutes les données
- `getDatabaseStats()` - Récupère les statistiques

## 📝 Exemple d'utilisation

### **Ajouter une propriété :**
```javascript
// L'utilisateur doit être connecté
const houseData = {
    title: "Belle maison",
    propertyType: "maison",
    city: "Cotonou",
    price: 500000,
    // ... autres champs
};

const newHouse = addHouse(houseData);
console.log("Maison ajoutée avec l'ID:", newHouse.id);
```

### **Rechercher des propriétés :**
```javascript
const filters = {
    city: "Cotonou",
    propertyType: "maison",
    maxPrice: 1000000
};

const results = searchHouses(filters);
console.log("Résultats:", results);
```

### **Vérifier la connexion :**
```javascript
if (isLoggedIn()) {
    const user = getCurrentUser();
    console.log("Connecté en tant que:", user.fullName);
} else {
    console.log("Non connecté");
}
```

## ⚠️ Notes importantes

1. **localStorage** : Les données sont stockées dans le navigateur. Si vous effacez les données du navigateur, tout sera perdu.

2. **Sécurité** : Les mots de passe sont stockés en clair (non recommandé pour la production). Pour un environnement de production, utilisez un backend avec hachage de mots de passe.

3. **Limites** : localStorage a une limite de ~5-10MB selon le navigateur.

4. **Export/Import** : Utilisez la page `db-manager.html` pour sauvegarder vos données.

## 🐛 Dépannage

### **La base de données ne fonctionne pas ?**

1. Vérifiez que `database.js` est bien chargé dans votre page :
   ```html
   <script src="database.js"></script>
   ```

2. Ouvrez la console du navigateur (F12) pour voir les erreurs

3. Vérifiez que localStorage est activé dans votre navigateur

4. Utilisez `db-manager.html` pour voir l'état de la base de données

### **Réinitialiser la base de données :**

1. Ouvrez `db-manager.html`
2. Cliquez sur "Tout Effacer"
3. Confirmez l'action

### **Importer des données d'exemple :**

1. Ouvrez `db-manager.html`
2. Cliquez sur "Importer Exemple"
3. Les données de `database-sample.json` seront ajoutées

## 📞 Support

Pour toute question ou problème, consultez la page de gestion de la base de données (`db-manager.html`) pour diagnostiquer les problèmes.

