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
- Intégrer JWT
    - [Documentation officielle pour express-jwt](https://www.npmjs.com/package/express-jwt) 
	OU
    - [Suggestion de tutoriel avec jsonwebtoken](https://dev.to/hamzakhan/securing-your-expressjs-app-jwt-authentication-step-by-step-aom)

##### Aide
Pour gérer un token, il faut à la fois le générer dans le backend après un login réussi et à la fois le renvoyer au client et faire en sorte que ce dernier le renvoie à chaque requête. 

Pour s’aider on peut utiliser:

- l’entête BEARER
- le storage local
- un cookie

D’ailleurs, express-jwt se base sur l’enête...
