// hashPassword.mjs
import crypto from "crypto";

// Génération d'un salt aléatoire localement
function generateSalt(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// ⚠️ Pour un vrai projet: mettre ça dans une variable d'environnement
const PEPPER = "SuperSecretPepperChangeMe";

// Fonction de hachage password + salt + pepper
function hashPassword(password, salt) {
  return crypto
    .createHash("sha256")
    .update(password + salt + PEPPER)
    .digest("hex");
}

// Exemple: on veut hasher le mot de passe "1234"
const plainPassword = "1234";
const salt = generateSalt(16);
const hash = hashPassword(plainPassword, salt);

console.log("Salt:", salt);
console.log("Hash:", hash);
 