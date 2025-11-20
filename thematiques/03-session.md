# Sessions
Fortement liée à [l'authentification](02-authentification.md), la gestion des sessions en WEB est un défi de part la nature du protocole HTTP qui est ‘stateless’, ce qui veut dire ‘sans état’.
Ainsi une requête, au niveau HTTP, n’a pas de rapport avec une autre...
Il faut donc utiliser un moyen annexe pour donner l’impression à l’utilisateur que son authentification est valide durant un certain temps...

## Théorie
- [Authentification-theorie / slides 20+](../supports/02-Auth.pptx)

## Pratique

### JWT

#### Répondre aux questions théoriques
- JWT [pdf](../exercices/auth/03-jwt.pdf) | [docx](../exercices/auth/03-jwt.docx) | [Ressources](../exercices/auth/03-jwt-data.zip)

#### Implémenter dans l’application
- Générer les clés ?
- Utiliser jwt de Express...
    - [Documentation officielle](https://www.npmjs.com/package/express-jwt) 
    - [Suggestion de tutoriel](https://dev.to/hamzakhan/securing-your-expressjs-app-jwt-authentication-step-by-step-aom)
