# On utilise une version légère de Node.js
FROM node:18-slim

# On définit le dossier de travail
WORKDIR /app

# On copie les fichiers de configuration
COPY package*.json ./

# On installe les dépendances
RUN npm install

# On copie tout le reste du code (server.js, etc.)
COPY . .

# L'application écoute sur le port 3000
EXPOSE 3000

# Commande pour lancer le serveur
CMD ["node", "server.js"]