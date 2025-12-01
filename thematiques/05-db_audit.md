# Base de données
Le principe d’une application est de présenter des informations à un utilisateur. Ceci implique donc d’avoir accès à des données.

Le but, dans cette situation, est de limiter au maximum cet accès en utilisant tous les outils nécessaires disponibles.

## Privilèges
Au point 4 de [l'exercice sur l'authentification](../exercices/auth/02-Auth.docx), un effort a déjà été entrepris pour réduire l’accès aux données.
Toutefois, cette méthode était drastique et n’est pas toujours applicable en production.

## Vue
Dans la plupart des moteurs de base de données, on peut définir une granularité très fine sur les droits en utilisant des vues.
Ainsi, on peut garder un user ‘root’ pour le DBA (database administrator), qui aura accès à toutes les tables, 
mais tout applicatif aura un compte dédié et pour éviter de complexifier un schéma pour la sécurité, on utilise le concept de ‘vue’
qui est une abstraction d’une table pour laquelle historiquement on ne pouvait que faire de la lecture et désormais on peut 
aussi faire de la modification...

## Procédures stockées
Permettent notamment de réaliser des opérations directes sur la base de données en liens avec des ‘trigger’... Et peut aussi être utilisé pour implémenter de la logique métier indépendante du client...

## Théorie
- [Marketplace](../supports/05-pitch-procedure-pm2etml.pptx)
- [Vues et procédures stockées](../supports/05-db_audit.pptx)

## Pratique
- [Vues](../exercices/db-audit/e-183-ALL-Views.docx)
- [Procédures stockées](../exercices/db-audit/e-183-ALL-StoredProcedure.docx)
- [Ressources docker pour les vues et procédures stockées](../exercices/db-audit/docker-views-stored-procedure.zip)	
