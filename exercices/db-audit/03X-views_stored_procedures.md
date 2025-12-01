# Views et Stored Procedures : corrigé

## Exercices Views

### Échauffement

#### Question 1 : Sélectionnez le nom et le prénom de tous les étudiants

**Requête SQL :**
```sql
SELECT stuName, stuFirstName 
FROM t_student;
```

#### Question 2 : Sélectionnez le nom, prénom des étudiants avec cours, date et note

**Requête SQL :**
```sql
SELECT 
    s.stuName,
    s.stuFirstName,
    c.courName,
    e.evaDate,
    e.evaGrade
FROM t_student s
INNER JOIN t_evaluation e ON s.idStudent = e.idStudent
INNER JOIN t_course c ON e.idCourse = c.idCourse
ORDER BY s.stuName, s.stuFirstName, e.evaDate;
```

---

### Création des vues

#### Vue 1 : Les étudiants et leurs notes (v_studentsGrades)

**Fichier : 2_create_views.sql**
```sql
-- Vue : Étudiants et leurs notes
CREATE OR REPLACE VIEW v_studentsGrades AS
SELECT 
    s.stuName AS 'Nom',
    s.stuFirstName AS 'Prénom',
    c.courName AS 'Cours',
    e.evaDate AS 'Date évaluation',
    e.evaGrade AS 'Note'
FROM t_student s
INNER JOIN t_evaluation e ON s.idStudent = e.idStudent
INNER JOIN t_course c ON e.idCourse = c.idCourse
ORDER BY s.stuName, s.stuFirstName, e.evaDate;
```

**Fichier : 3_create_users.sql**
```sql
-- Création de l'utilisateur teacher
CREATE USER IF NOT EXISTS 'teacher'@'%' IDENTIFIED BY 'teacher123';

-- Permission de lecture sur la vue v_studentsGrades
GRANT SELECT ON db_students.v_studentsGrades TO 'teacher'@'%';

-- Appliquer les changements
FLUSH PRIVILEGES;
```

**Test de la vue :**
```sql
-- Se connecter avec le compte teacher
-- Puis exécuter :
SELECT * FROM v_studentsGrades;
```

---

#### Vue 2 : Les étudiants en difficulté (v_studentsBadGrades)

**Ajout dans le fichier : 2_create_views.sql**
```sql
-- Vue : Étudiants avec mauvaises notes (< 4.0)
CREATE OR REPLACE VIEW v_studentsBadGrades AS
SELECT 
    s.stuName AS 'Nom',
    s.stuFirstName AS 'Prénom',
    c.courName AS 'Cours',
    e.evaDate AS 'Date évaluation',
    e.evaGrade AS 'Note'
FROM t_student s
INNER JOIN t_evaluation e ON s.idStudent = e.idStudent
INNER JOIN t_course c ON e.idCourse = c.idCourse
WHERE e.evaGrade < 4.0
ORDER BY e.evaGrade ASC, s.stuName;
```

**Ajout dans le fichier : 3_create_users.sql**
```sql
-- Permission de lecture sur la vue v_studentsBadGrades
GRANT SELECT ON db_students.v_studentsBadGrades TO 'teacher'@'%';

FLUSH PRIVILEGES;
```

**Test 2 : Sélectionner les élèves avec mauvaises notes au module I123**
```sql
-- Se connecter avec le compte teacher
SELECT * 
FROM v_studentsBadGrades
WHERE Cours = 'I123';
```

**Résultat attendu :** Aucune ligne retournée car aucun étudiant n'a eu de note < 4.0 pour le cours I123 dans les données fournies.

---

#### Vue 3 : Les étudiants et leurs absences (v_absentStudents)

**Ajout dans le fichier : 2_create_views.sql**
```sql
-- Vue : Étudiants absents avec motifs
CREATE OR REPLACE VIEW v_absentStudents AS
SELECT 
    s.stuName AS 'Nom',
    s.stuFirstName AS 'Prénom',
    a.absDate AS 'Date absence',
    a.absPeriodStart AS 'Période début',
    a.absPeriodEnd AS 'Période fin',
    r.reaDescription AS 'Motif'
FROM t_student s
INNER JOIN t_absence a ON s.idStudent = a.idStudent
INNER JOIN t_reason r ON a.idReason = r.idReason
ORDER BY a.absDate DESC, s.stuName;
```

**Ajout dans le fichier : 3_create_users.sql**
```sql
-- Permission de lecture sur la vue v_absentStudents
GRANT SELECT ON db_students.v_absentStudents TO 'teacher'@'%';

FLUSH PRIVILEGES;
```

**Test : Sélectionner les élèves absents en février 2024**
```sql
-- Se connecter avec le compte teacher
SELECT * 
FROM v_absentStudents
WHERE MONTH(`Date absence`) = 2 
  AND YEAR(`Date absence`) = 2024
ORDER BY `Date absence`, Nom, Prénom;
```

**Résultat attendu :**
```
Nom        | Prénom  | Date absence | Période début | Période fin | Motif
-----------|---------|--------------|---------------|-------------|--------------------------------
Bonnet     | Alex    | 2024-02-09   | 1             | 1           | Raison injustifiée
Bernard    | Lucie   | 2024-02-22   | 1             | 2           | Maladie avec certificat médical
Dubois     | Marie   | 2024-02-24   | 1             | 2           | Maladie avec certificat médical
Lefebvre   | Claire  | 2024-02-26   | 1             | 2           | Maladie avec certificat médical
Martin     | Paul    | 2024-02-20   | 1             | 2           | Maladie avec certificat médical
Dupont     | Jean    | 2024-02-18   | 1             | 2           | Maladie avec certificat médical
...
```

---

## Exercices Stored Procedures

### Première procédure : Paramètre OUT (sp_helloWorld)

**Création de la procédure :**
```sql
-- Dans la base de données db_test
DELIMITER //
CREATE PROCEDURE sp_helloWorld(OUT message VARCHAR(50))
BEGIN
    SET message = 'Bonjour le monde';
END //
DELIMITER ;
```

**Test de la procédure :**
```sql
CALL sp_helloWorld(@message);
SELECT @message;
```

**Résultat attendu :**
```
@message
-------------------
Bonjour le monde
```

**Question : Différence entre DEFINER et INVOKER**

- **DEFINER** : La procédure s'exécute avec les privilèges de l'utilisateur qui l'a créée (celui qui a défini la procédure). C'est le mode par défaut.
  
- **INVOKER** : La procédure s'exécute avec les privilèges de l'utilisateur qui l'appelle (celui qui invoque la procédure).

**Cas d'usage :**
- **DEFINER** : Utile quand on veut donner accès à des données via une procédure sans donner directement accès aux tables sous-jacentes.
- **INVOKER** : Utile quand on veut que chaque utilisateur n'accède qu'aux données auxquelles il a droit.

---

### Question « Délimiteur »

**Réponse :**

Un délimiteur est un caractère (ou une séquence de caractères) qui indique la fin d'une instruction SQL. Par défaut, MySQL utilise le point-virgule `;` comme délimiteur.

**Pourquoi changer le délimiteur ?**

Lors de la création de procédures stockées, le code contient plusieurs instructions SQL terminées par `;`. Si on ne change pas le délimiteur, MySQL interpréterait le premier `;` comme la fin de la commande CREATE PROCEDURE, ce qui causerait une erreur.

**Solution :**
```sql
DELIMITER //  -- Change le délimiteur à //
CREATE PROCEDURE ma_procedure()
BEGIN
    SELECT 'Ligne 1';  -- Le ; n'est plus interprété comme fin de commande
    SELECT 'Ligne 2';
END //            -- // indique la fin de la procédure
DELIMITER ;       -- Rétablit le délimiteur par défaut
```

---

### Deuxième procédure : Paramètre IN (sp_helloWorld2)

**Création de la procédure :**
```sql
DELIMITER //
CREATE PROCEDURE sp_helloWorld2(OUT message VARCHAR(100), IN nom VARCHAR(50))
BEGIN
    SET message = CONCAT('Bonjour ', nom);
END //
DELIMITER ;
```

**Test de la procédure :**
```sql
CALL sp_helloWorld2(@message, 'Bob');
SELECT @message;
```

**Résultat attendu :**
```
@message
------------
Bonjour Bob
```

---

### Troisième procédure : Accès à l'utilisateur (sp_helloWorld3)

**Création de la procédure (complétée) :**
```sql
DELIMITER |
CREATE PROCEDURE sp_helloWorld3(OUT message VARCHAR(100))
BEGIN
    DECLARE currentUser VARCHAR(100);
    SET currentUser = USER();
    SET message = CONCAT('Bonjour ', currentUser);
END |
DELIMITER ;
```

**Test de la procédure :**
```sql
CALL sp_helloWorld3(@message);
SELECT @message;
```

**Résultat attendu :**
```
@message
---------------------------------
Bonjour root@localhost
```
(Le résultat varie selon l'utilisateur connecté)

---

### Création de la table t_audit_access_absences

**Retour dans la base db_students**

**Ajout dans le fichier : 1_db_student_setup.sql (ou créer un nouveau fichier 4_audit_table.sql)**
```sql
-- Table d'audit des accès à la vue des absences
CREATE TABLE IF NOT EXISTS t_audit_access_absences (
    idAuditAbsences INT AUTO_INCREMENT PRIMARY KEY,
    audAbsDate DATETIME NOT NULL,
    audAbsUser VARCHAR(50) NOT NULL
);
```

---

### Procédure stockée pour auditer les accès (sp_get_absences)

**Création dans un fichier : 5_create_procedures.sql**
```sql
DELIMITER //

CREATE PROCEDURE sp_get_absences()
BEGIN
    -- Insérer un enregistrement d'audit
    INSERT INTO t_audit_access_absences (audAbsDate, audAbsUser)
    VALUES (NOW(), USER());
    
    -- Retourner les données de la vue
    SELECT * FROM v_absentStudents;
END //

DELIMITER ;
```

---

## Trigger pour l'audit automatique

### Problématique
La procédure `sp_get_absences` enregistre un audit, mais seulement quand elle est appelée. Si quelqu'un accède directement à la vue `v_absentStudents` (avec les bonnes permissions), l'accès n'est pas tracé.

### Solution avec Trigger

**Limitation MySQL :** MySQL ne permet **pas** de créer des triggers directement sur des vues. 
On ne peut donc pas écrire cela:
```sql
-- Trigger pour auditer les modifications d'absences
DELIMITER //

CREATE TRIGGER trg_audit_absence_select
AFTER SELECT ON t_absence
FOR EACH ROW
BEGIN
    INSERT INTO t_audit_access_absences (audAbsDate, audAbsUser)
    VALUES (NOW(), USER());
END //

DELIMITER ;
```
**Solutions alternatives :**

#### Solution 1 : Trigger sur INSERT dans la table d'audit
Si on veut automatiser l'insertion, on peut ajouter des valeurs par défaut :
```sql
-- Modifier la table d'audit
ALTER TABLE t_audit_access_absences 
MODIFY COLUMN audAbsDate DATETIME DEFAULT CURRENT_TIMESTAMP,
MODIFY COLUMN audAbsUser VARCHAR(50) DEFAULT (USER());
```

#### [Solution 2 : Utiliser INSTEAD OF trigger (non supporté par MySQL)]
Cette fonctionnalité existe dans d'autres SGBD (SQL Server, PostgreSQL) mais pas MySQL.

### Solution réelle avec MySQL

**La seule vraie solution avec MySQL** est d'obliger tout le monde à passer par la procédure stockée :
```sql
-- Révoquer l'accès direct à la vue pour teacher
REVOKE SELECT ON db_students.v_absentStudents FROM 'teacher'@'%';

-- Donner uniquement l'accès via la procédure
GRANT EXECUTE ON PROCEDURE db_students.sp_get_absences TO 'teacher'@'%';

FLUSH PRIVILEGES;
```

**Ainsi :**
- Personne ne peut accéder directement à la vue
- Tout le monde doit utiliser `sp_get_absences`
- Tous les accès sont automatiquement audités

### Test de la solution
```sql
-- Se connecter avec teacher
-- Ceci échoue maintenant :
SELECT * FROM v_absentStudents;
-- Erreur : SELECT command denied

-- Ceci fonctionne et est audité :
CALL sp_get_absences();
-- Succès + enregistrement dans t_audit_access_absences
```

### Vérification de l'audit
```sql
-- Se connecter avec root
SELECT * FROM t_audit_access_absences ORDER BY audAbsDate DESC;
```

**Résultat :**
```
idAuditAbsences | audAbsDate          | audAbsUser
----------------|---------------------|------------------
1               | 2024-11-30 14:23:15 | teacher@172.18.0.1
2               | 2024-11-30 14:25:42 | john@172.18.0.1
3               | 2024-11-30 14:30:18 | teacher@172.18.0.1
```

---


### Définir les permissions pour l'utilisateur John

**Ajout dans le fichier : 3_create_users.sql (ou créer 6_create_user_john.sql)**
```sql
-- Création de l'utilisateur John
CREATE USER IF NOT EXISTS 'john'@'%' IDENTIFIED BY 'John';

-- Permission d'exécuter uniquement la procédure sp_get_absences
GRANT EXECUTE ON PROCEDURE db_students.sp_get_absences TO 'john'@'%';

-- Appliquer les changements
FLUSH PRIVILEGES;
```

**Test avec l'utilisateur John :**
```sql
-- Se connecter avec le compte john / John
-- Puis exécuter :
CALL sp_get_absences();
```

**Vérification de l'audit :**
```sql
-- Se reconnecter avec root
-- Puis vérifier la table d'audit :
SELECT * FROM t_audit_access_absences;
```

**Résultat attendu dans t_audit_access_absences :**
```
idAuditAbsences | audAbsDate          | audAbsUser
----------------|---------------------|------------------
1               | 2024-11-30 14:23:15 | john@172.18.0.1
2               | 2024-11-30 14:25:42 | john@172.18.0.1
...
```

---

## Vérifications et tests supplémentaires

### Test de sécurité pour John

**Essayer des requêtes non autorisées avec le compte John :**

```sql
-- Test 1 : Accès direct à la vue (devrait échouer)
SELECT * FROM v_absentStudents;
-- Erreur attendue : SELECT command denied to user 'john'

-- Test 2 : Accès direct à la table (devrait échouer)
SELECT * FROM t_student;
-- Erreur attendue : SELECT command denied to user 'john'

-- Test 3 : Accès via la procédure (devrait réussir)
CALL sp_get_absences();
-- Succès : Les données sont affichées
```

### Test de sécurité pour Teacher

```sql
-- Test 1 : Lecture des vues (devrait réussir)
SELECT * FROM v_studentsGrades LIMIT 5;
SELECT * FROM v_studentsBadGrades LIMIT 5;
SELECT * FROM v_absentStudents LIMIT 5;

-- Test 2 : Insertion dans une table (devrait échouer)
INSERT INTO t_student (stuName, stuFirstName, stuBirthDate)
VALUES ('Test', 'Test', '2000-01-01');
-- Erreur attendue : INSERT command denied to user 'teacher'
```

---

## Concepts clés

### Views

1. **Définition** : Une vue est une table virtuelle basée sur le résultat d'une requête SELECT
2. **Avantages** :
   - Simplifie les requêtes complexes
   - Améliore la sécurité (masque les colonnes sensibles)
   - Facilite la gestion des permissions
3. **Syntaxe** : `CREATE OR REPLACE VIEW nom_vue AS SELECT ...`

### Stored Procedures

1. **Définition** : Programme stocké côté serveur qui peut être exécuté
2. **Paramètres** :
   - **IN** : Paramètre d'entrée (lecture seule)
   - **OUT** : Paramètre de sortie (retour de valeur)
   - **INOUT** : Paramètre d'entrée/sortie
3. **Avantages** :
   - Centralisation de la logique métier
   - Amélioration de la sécurité
   - Réduction du trafic réseau
   - Réutilisabilité du code

### Sécurité

1. **Principe du moindre privilège** : Accorder uniquement les permissions nécessaires
2. **Isolation** : Utiliser des vues et procédures pour contrôler l'accès aux données
3. **Audit** : Tracer les accès aux données sensibles

---

## Commandes utiles

### Gestion des utilisateurs
```sql
-- Créer un utilisateur
CREATE USER 'username'@'host' IDENTIFIED BY 'password';

-- Supprimer un utilisateur
DROP USER 'username'@'host';

-- Changer le mot de passe
ALTER USER 'username'@'host' IDENTIFIED BY 'new_password';

-- Voir les utilisateurs
SELECT User, Host FROM mysql.user;
```

### Gestion des permissions
```sql
-- Accorder des permissions
GRANT SELECT ON database.table TO 'user'@'host';
GRANT EXECUTE ON PROCEDURE database.procedure TO 'user'@'host';

-- Révoquer des permissions
REVOKE SELECT ON database.table FROM 'user'@'host';

-- Voir les permissions d'un utilisateur
SHOW GRANTS FOR 'user'@'host';

-- Appliquer les changements
FLUSH PRIVILEGES;
```

### Gestion des vues
```sql
-- Voir toutes les vues
SHOW FULL TABLES WHERE Table_type = 'VIEW';

-- Voir la définition d'une vue
SHOW CREATE VIEW nom_vue;

-- Supprimer une vue
DROP VIEW IF EXISTS nom_vue;
```

### Gestion des procédures
```sql
-- Voir toutes les procédures
SHOW PROCEDURE STATUS WHERE Db = 'nom_base';

-- Voir la définition d'une procédure
SHOW CREATE PROCEDURE nom_procedure;

-- Supprimer une procédure
DROP PROCEDURE IF EXISTS nom_procedure;
```
