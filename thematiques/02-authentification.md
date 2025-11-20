# Authentification

## Introduction
L’authentification est un aspect fondamental qui comprend plusieurs étapes cruciales afin de garantir
la sécurité d’une application.
De plus, à l’authentification, s’ajoute la notion de [session](03-session.md) qui, n’étant pas prise en compte par HTTP (stateless),
doit être gérée d’une manière ou d’une autre...

Les élément suivants vont donc être abordés:
- Notion générale de session
- Code pour faire la vérification du user/password
- Stockage des mot de passe

## Théorie
- [Authentification-theorie / slides 1..20](../supports/02-Auth.pptx)

## Pratique

### Webapp d’authentification

#### Bases (injection SQL...)
- [Authentification-pratique](../exercices/auth/02-Auth.docx)
- [Auth app - nodejstoken](../exercices/auth/02-nodejstoken.zip)


## Ressources
- [OWASP Password_Storage_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
)
- https://proton.me/fr/business/pass/breach-observatory
- [JWT Handbook](../supports/02-jwt-handbook-v0_14_2.pdf)
