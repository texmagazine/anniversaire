// --- LISTES DES PHRASES ET INDICES ---
const phrases = [
  "C'EST L'ANNIVERSAIRE DE DAVID ET SOLENE",
  "BON ANNIVERSAIRE SOLENE ET DAVID",
  "AT CHIC At CHIC AT CHIC AILLE IALLE IALLE !",
  "IL FAUT SOUFFLER LES BOUGIES D'ANNIVERSAIRE",
  "DAVID EST TRES SPORTIF",
  "SOLENE EST TRES SERIEUSE"
];

const indicesPhrases = [
  "Aujourd'hui est un jour très spécial",
  "C'est un message spécial le 10 mars",
  "un petit cris célèbre dans la famille Texier",
  "Souffler n'est pas jouer",
  "Cette phrase concerne DAVID",
  "Cette phrase concerne SOLENE"
];

// --- LISTE DES MOTS ---
const mots = [
  "LE MONT SAINT MICHEL",
  "BRETAGNE",
  "VIRGINIE",
  "PLAYSTATION",
  "CHAVAGNE",
  "FERRERO"
];

const indicesMots = [
  "Un endroit qui ressemble à un gros gateau et qui se trouve en Normandie",
  "La plus belle région Francaise",
  "C'est le nom de quelqu'un qui va bientôt est cinquantenaire",
  "Un truc blanc qui sert à jouer à des jeux vidéo",
  "Le nom d'une ville ou va bientot se dérouler quelque chose de spécial et sportif",
  "Une friandise que David aime beaucoup à Noël"
];

// --- INDEX SEQUENTIELS ---
let indexPhrase = 0;
let indexMot = 0;

// --- VARIABLES GLOBALES ---
let mode = ""; 
let phraseSecrete = "";
let indiceSecrete = "";
let affichage = "";

// --- SONS ---
const sonCorrect = new Audio("son/win.mp3");
const sonIncorrect = new Audio("son/pasbon.mp3");
const sonJoyeux = new Audio("son/joyeux.mp3");

// --- ELEMENTS HTML ---
const menu = document.getElementById("menu");
const container = document.getElementById("container");

const btnPhrases = document.getElementById("btn-phrases");
const btnMots = document.getElementById("btn-mots");

const phraseDiv = document.getElementById("phrase");
const lettresDiv = document.getElementById("lettres");
const messageDiv = document.getElementById("message");
const indiceDiv = document.getElementById("indice");
const titreJeu = document.getElementById("titre-jeu");
const instructions = document.getElementById("instructions");

const btnNouvellePartie = document.getElementById("nouvelle-partie");
const btnRetour = document.getElementById("retour-menu");

// --- CHOIX DU MODE ---
btnPhrases.onclick = () => lancerMode("phrases");
btnMots.onclick = () => lancerMode("mots");

function lancerMode(type) {
  mode = type;

  menu.style.display = "none";
  container.style.display = "block";

  if (mode === "phrases") {
    titreJeu.textContent = "Jeu de phrase à découvrir";
    instructions.textContent = "Choisis une lettre. Si elle est dans la phrase, elle s’affiche.";
  } else {
    titreJeu.textContent = "Jeu de mot à trouver";
    instructions.textContent = "Devine le mot en choisissant des lettres.";
  }

  nouvellePartie();
}

// --- NOUVELLE PARTIE (VERSION CORRECTE) ---
function nouvellePartie() {

  // 🔇 Stopper la musique si elle jouait encore
  sonJoyeux.pause();
  sonJoyeux.currentTime = 0;

  choisirPhraseAleatoire();
  initialiserAffichage();
  genererClavier();
}

// --- RETOUR AU MENU ---
btnRetour.onclick = () => {
  mode = "";
  phraseSecrete = "";
  indiceSecrete = "";
  affichage = "";

  phraseDiv.innerHTML = "";
  lettresDiv.innerHTML = "";
  messageDiv.textContent = "";
  indiceDiv.textContent = "";
  titreJeu.textContent = "";
  instructions.textContent = "";

  // 🔇 Stopper la musique si on revient au menu
  sonJoyeux.pause();
  sonJoyeux.currentTime = 0;

  container.style.display = "none";
  menu.style.display = "block";
};

// --- CHOISIR LA PHRASE OU LE MOT ---
function choisirPhraseAleatoire() {
  if (mode === "phrases") {
    phraseSecrete = phrases[indexPhrase];
    indiceSecrete = indicesPhrases[indexPhrase];
    indexPhrase = (indexPhrase + 1) % phrases.length;
  } else {
    phraseSecrete = mots[indexMot];
    indiceSecrete = indicesMots[indexMot];
    indexMot = (indexMot + 1) % mots.length;
  }
}

// --- INITIALISATION ---
function initialiserAffichage() {
  affichage = phraseSecrete.replace(/[A-Z]/g, "_");
  afficherPhrase();
  messageDiv.textContent = "";
  indiceDiv.textContent = "Indice : " + indiceSecrete;
}

// --- AFFICHAGE DE LA PHRASE ---
function afficherPhrase() {
  phraseDiv.innerHTML = "";

  let motActuel = document.createElement("span");
  motActuel.className = "mot";

  for (let i = 0; i < affichage.length; i++) {

    if (phraseSecrete[i] === " ") {
      phraseDiv.appendChild(motActuel);
      motActuel = document.createElement("span");
      motActuel.className = "mot";
      continue;
    }

    const span = document.createElement("span");
    span.className = "case";
    span.textContent = affichage[i] === "_" ? "\u00A0" : affichage[i];

    motActuel.appendChild(span);
  }

  phraseDiv.appendChild(motActuel);
}

// --- GENERATION DU CLAVIER ---
function genererClavier() {
  lettresDiv.innerHTML = "";

  for (let i = 65; i <= 90; i++) {
    const lettre = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.textContent = lettre;
    btn.className = "lettre";
    btn.onclick = () => choisirLettre(lettre, btn);
    lettresDiv.appendChild(btn);
  }
}

// --- CHOIX D'UNE LETTRE ---
function choisirLettre(lettre, bouton) {
  bouton.disabled = true;

  let nouvelleAffichage = "";
  let trouve = false;

  for (let i = 0; i < phraseSecrete.length; i++) {
    if (phraseSecrete[i] === lettre) {
      nouvelleAffichage += lettre;
      trouve = true;
    } else {
      nouvelleAffichage += affichage[i];
    }
  }

  affichage = nouvelleAffichage;
  afficherPhrase();

  if (!trouve) {
    bouton.classList.add("mauvaise");
    messageDiv.textContent = "Raté… essaie une autre lettre.";
    sonIncorrect.currentTime = 0;
    sonIncorrect.play();
  } else {
    sonCorrect.currentTime = 0;
    sonCorrect.play();
  }

  if (!affichage.includes("_")) {
    messageDiv.textContent = "BRAVO !";

    sonJoyeux.currentTime = 0;
    sonJoyeux.play();

    desactiverClavier();
  }
}

// --- DESACTIVER LE CLAVIER ---
function desactiverClavier() {
  const boutons = lettresDiv.querySelectorAll("button.lettre");
  boutons.forEach(b => b.disabled = true);
}

// --- BOUTON NOUVELLE PARTIE ---
btnNouvellePartie.addEventListener("click", nouvellePartie);
