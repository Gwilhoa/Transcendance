# Récupérer l'extension de fichier à partir de l'en-tête Content-Type
contentType=$(curl -I -s http://localhost:3000/user/image -H "authorization: bearer $ACCESS_TOKEN" | grep 'Content-Type' | awk -F '/' '{print $2}' | tr -d '\r\n')

# Télécharger l'image en utilisant curl et écrire le contenu dans un fichier avec l'extension correspondante
curl -s http://localhost:3000/user/image -H "authorization: bearer $ACCESS_TOKEN" > test.${contentType}

# Vérifier que le fichier a été créé avec succès
if [ -e test.${contentType} ]
then
  echo "Le fichier test.${contentType} a été créé avec succès."
else
  echo "Erreur: le fichier test.${contentType} n'a pas été créé."
fi