// ---------- Etat (localStorage) ----------
const CLE = "calisthenie.v1";
let etat = JSON.parse(localStorage.getItem(CLE) || '{"historique":[],"tests":{}}');
const sauver = () => localStorage.setItem(CLE, JSON.stringify(etat));
const aujourdhui = () => new Date().toISOString().slice(0, 10);

// ---------- Navigation ----------
function montrer(id) {
  document.querySelectorAll(".vue").forEach(v => v.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
  if (id === "vue-suivi") dessinerSuivi();
  if (id === "vue-accueil") dessinerAccueil();
}

// ---------- Accueil ----------
function seanceSuggeree() {
  // rotation A -> B -> C -> D -> A : on prend celle qui suit la derniere faite
  const derniere = etat.historique[etat.historique.length - 1];
  if (!derniere) return SEANCES[0];
  const i = SEANCES.findIndex(s => s.id === derniere.seance);
  return SEANCES[(i + 1) % SEANCES.length];
}

function serieEnCours() {
  // nombre de jours consecutifs, en remontant depuis aujourd'hui ou hier
  const jours = [...new Set(etat.historique.map(h => h.date))].sort().reverse();
  if (!jours.length) return 0;
  const ecart = (a, b) => Math.round((new Date(a) - new Date(b)) / 86400000);
  if (ecart(aujourdhui(), jours[0]) > 1) return 0;
  let n = 1;
  for (let i = 1; i < jours.length; i++) {
    if (ecart(jours[i - 1], jours[i]) === 1) n++; else break;
  }
  return n;
}

function dessinerAccueil() {
  const n = serieEnCours();
  document.getElementById("streak").textContent =
    n > 1 ? `${n} jours d'affilee` : n === 1 ? "Seance faite aujourd'hui" : "On commence quand tu veux";

  const s = seanceSuggeree();
  const carte = document.getElementById("carte-suggeree");
  carte.innerHTML = `<span class="lettre">JOUR ${s.id}</span>
    <span class="nom">${s.titre}</span>
    <span class="detail">${s.exercices.length} exercices &middot; 15-20 min</span>
    <span class="fleche">→</span>`;
  carte.style.borderLeftColor = s.couleur;
  carte.onclick = () => ouvrirSeance(s.id);

  const faitesAujourdhui = etat.historique.filter(h => h.date === aujourdhui()).map(h => h.seance);
  document.getElementById("grille-seances").innerHTML = SEANCES.map(x => `
    <button class="tuile ${faitesAujourdhui.includes(x.id) ? "faite" : ""}"
            style="--tuile-couleur:${x.couleur}" onclick="ouvrirSeance('${x.id}')">
      <span class="lettre">JOUR ${x.id}</span>
      <span class="nom">${x.titre}</span>
      <span class="nb">${x.exercices.length} exercices</span>
    </button>`).join("");

  document.getElementById("resume-tests").innerHTML = TESTS.map(t => {
    const v = (etat.tests.S0 || {})[t.id];
    return `<div class="puce"><b>${v || "—"}</b><small>${t.label.split(",")[0]}</small></div>`;
  }).join("");
}

// ---------- Apercu d'une seance ----------
let seanceCourante = null;

function ouvrirSeance(id) {
  seanceCourante = SEANCES.find(s => s.id === id);
  document.getElementById("seance-titre").textContent = `Jour ${id} — ${seanceCourante.titre}`;
  document.getElementById("seance-soustitre").textContent = seanceCourante.sous_titre;
  document.getElementById("liste-exos").innerHTML = seanceCourante.exercices.map((e, i) => `
    <li>
      <span class="num">${i + 1}</span>
      <span>
        <span class="nom">${e.nom}</span><br>
        <span class="meta">${e.series} series &middot; ${e.reps}</span>
        ${e.video ? "" : '<br><span class="sans-video">pas de demo video</span>'}
      </span>
    </li>`).join("");
  document.getElementById("btn-demarrer").onclick = demarrer;
  montrer("vue-seance");
}

// ---------- Seance guidee ----------
let etapes = [], iEtape = 0, minuteur = null, lecteur = null, lecteurPret = false;

function construireEtapes(s) {
  const liste = [{ type: "echauffement" }];
  s.exercices.forEach((exo, ie) => {
    for (let serie = 1; serie <= exo.series; serie++) {
      liste.push({ type: "travail", exo, serie });
      const derniere = ie === s.exercices.length - 1 && serie === exo.series;
      if (derniere) continue;
      // ce qui vient apres le repos : la serie suivante, ou le premier passage de l'exo d'apres
      const apres = serie < exo.series
        ? `${exo.nom} — serie ${serie + 1}`
        : `${s.exercices[ie + 1].nom} — serie 1`;
      liste.push({ type: "repos", duree: exo.repos, apres });
    }
  });
  liste.push({ type: "etirement" });
  return liste;
}

function demarrer() {
  etapes = construireEtapes(seanceCourante);
  iEtape = 0;
  montrer("vue-guide");
  afficherEtape();
}

function afficherEtape() {
  clearInterval(minuteur);
  const e = etapes[iEtape];
  const phase = document.getElementById("guide-phase");
  const nom = document.getElementById("guide-nom");
  const objectif = document.getElementById("guide-objectif");
  const cle = document.getElementById("guide-cle");
  const niveaux = document.getElementById("guide-niveaux");
  const cadre = document.getElementById("cadre-video");
  const chrono = document.getElementById("chrono");
  const btnSuivant = document.getElementById("btn-suivant");
  const btnPasser = document.getElementById("btn-passer");

  document.getElementById("barre-progression").style.width = `${(iEtape / etapes.length) * 100}%`;
  document.getElementById("compteur-etape").textContent = `${iEtape + 1}/${etapes.length}`;
  chrono.className = "chrono";
  btnPasser.style.display = "block";

  if (e.type === "echauffement" || e.type === "etirement") {
    const bloc = e.type === "echauffement" ? ECHAUFFEMENT : ETIREMENT;
    phase.textContent = e.type === "echauffement" ? "Avant de commencer" : "Pour finir";
    nom.textContent = e.type === "echauffement" ? "Echauffement" : "Etirements";
    objectif.textContent = e.type === "echauffement" ? "3 minutes" : "2 minutes";
    cle.innerHTML = bloc.map(l => `• ${l}`).join("<br>");
    niveaux.style.display = "none";
    cadre.style.display = "none";
    btnSuivant.textContent = "C'est fait";
    btnPasser.style.display = "none";
    arreterVideo();
    return;
  }

  if (e.type === "repos") {
    phase.textContent = "Repos";
    nom.textContent = "Souffle";
    objectif.textContent = `Ensuite : ${e.apres}`;
    cle.textContent = "Respire par le nez. Ne t'assois pas, reste debout et bouge un peu.";
    niveaux.style.display = "none";
    cadre.style.display = "none";
    btnSuivant.textContent = "Passer le repos";
    btnPasser.style.display = "none";
    arreterVideo();
    lancerChrono(e.duree, "repos", true);
    return;
  }

  // travail
  const exo = e.exo;
  phase.textContent = `Serie ${e.serie} sur ${exo.series}`;
  nom.textContent = exo.nom;
  objectif.textContent = exo.reps;
  cle.textContent = exo.cle;
  niveaux.style.display = "block";
  document.getElementById("guide-facile").textContent = exo.facile;
  document.getElementById("guide-dur").textContent = exo.dur;
  cadre.style.display = "block";
  btnSuivant.textContent = "Serie faite";
  jouerVideo(exo.video);
  if (exo.duree) lancerChrono(exo.duree, "tenue", true);
}

function lancerChrono(secondes, label, autoAvance) {
  const chrono = document.getElementById("chrono");
  const valeur = document.getElementById("chrono-valeur");
  chrono.className = `chrono actif ${label === "repos" ? "repos" : ""}`;
  document.getElementById("chrono-label").textContent = label === "repos" ? "secondes de repos" : "secondes de tenue";
  let reste = secondes;
  valeur.textContent = reste;
  minuteur = setInterval(() => {
    reste--;
    valeur.textContent = reste;
    if (reste <= 0) {
      clearInterval(minuteur);
      biper();
      if (autoAvance) etapeSuivante();
    }
  }, 1000);
}

// petit bip sans fichier audio : l'enchainement doit s'entendre sans regarder l'ecran
function biper() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880; g.gain.value = 0.15;
    o.start(); o.stop(ctx.currentTime + 0.18);
  } catch (_) { /* le navigateur peut refuser le son avant interaction */ }
}

function etapeSuivante() {
  clearInterval(minuteur);
  iEtape++;
  if (iEtape >= etapes.length) return finirSeance();
  afficherEtape();
}

function finirSeance() {
  arreterVideo();
  etat.historique.push({ date: aujourdhui(), seance: seanceCourante.id });
  sauver();
  montrer("vue-accueil");
  alert(`Jour ${seanceCourante.id} plie. ${serieEnCours() > 1 ? serieEnCours() + " jours d'affilee." : "Premier jour."}`);
}

function quitterSeance() {
  clearInterval(minuteur);
  arreterVideo();
  montrer("vue-accueil");
}

document.getElementById("btn-suivant").onclick = etapeSuivante;
document.getElementById("btn-passer").onclick = etapeSuivante;

// ---------- Video : on lit en boucle le segment exact de la demo ----------
function onYouTubeIframeAPIReady() {
  lecteur = new YT.Player("lecteur", {
    height: "100%", width: "100%",
    playerVars: { controls: 0, modestbranding: 1, rel: 0, playsinline: 1, disablekb: 1 },
    events: {
      onReady: () => { lecteurPret = true; },
      onStateChange: ev => {
        // fin du segment : on revient au debut, la demo tourne en boucle comme un GIF
        if (ev.data === YT.PlayerState.ENDED && segmentCourant) {
          lecteur.seekTo(segmentCourant.debut);
          lecteur.playVideo();
        }
      }
    }
  });
}
let segmentCourant = null;

function jouerVideo(v) {
  const cadre = document.getElementById("cadre-video");
  if (!v) { segmentCourant = null; cadre.classList.add("vide"); arreterVideo(); return; }
  cadre.classList.remove("vide");
  segmentCourant = v;
  if (!lecteurPret) { setTimeout(() => jouerVideo(v), 400); return; }
  lecteur.loadVideoById({ videoId: v.id, startSeconds: v.debut, endSeconds: v.fin });
  lecteur.mute();  // sans le mute, les navigateurs mobiles refusent la lecture auto
  lecteur.playVideo();
  // filet : certains navigateurs bloquent la lecture tant qu'il n'y a pas eu de vrai
  // appui. On repasse deux fois, et le prochain appui sur l'ecran relance de toute facon.
  [1200, 3000].forEach(d => setTimeout(() => {
    if (segmentCourant === v && lecteur.getPlayerState() !== YT.PlayerState.PLAYING) lecteur.playVideo();
  }, d));
}

document.addEventListener("pointerdown", () => {
  if (segmentCourant && lecteurPret && lecteur.getPlayerState() !== YT.PlayerState.PLAYING) lecteur.playVideo();
});

function arreterVideo() {
  if (lecteurPret && lecteur) lecteur.stopVideo();
}

// ---------- Suivi ----------
function dessinerSuivi() {
  const colonnes = ["S0", "S4", "S8"];
  const entetes = { S0: "Depart", S4: "4 semaines", S8: "8 semaines" };
  document.getElementById("table-tests").innerHTML =
    `<tr><th>Test</th>${colonnes.map(c => `<th>${entetes[c]}</th>`).join("")}</tr>` +
    TESTS.map(t => `<tr><td>${t.label}</td>${colonnes.map(c => `
      <td><input type="number" inputmode="numeric" value="${(etat.tests[c] || {})[t.id] || ""}"
           onchange="noterTest('${c}','${t.id}',this.value)"></td>`).join("")}</tr>`).join("");

  // 8 semaines de cases : une par jour, remplie si une seance a ete faite
  const jours = new Set(etat.historique.map(h => h.date));
  let cases = "";
  for (let i = 55; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    cases += `<div class="${jours.has(d) ? "fait" : ""}" title="${d}"></div>`;
  }
  document.getElementById("calendrier").innerHTML = cases;

  document.getElementById("historique").innerHTML = etat.historique.length
    ? [...etat.historique].reverse().slice(0, 30).map(h => {
        const s = SEANCES.find(x => x.id === h.seance);
        return `<li><span>Jour ${h.seance} — ${s ? s.titre : ""}</span><span class="date">${h.date}</span></li>`;
      }).join("")
    : "<li>Aucune seance pour l'instant.</li>";
}

function noterTest(colonne, test, valeur) {
  etat.tests[colonne] = etat.tests[colonne] || {};
  etat.tests[colonne][test] = valeur;
  sauver();
  dessinerAccueil();
}

function effacerTout() {
  if (!confirm("Effacer toutes tes seances et tes chiffres ?")) return;
  etat = { historique: [], tests: {} };
  sauver();
  dessinerSuivi();
  dessinerAccueil();
}

dessinerAccueil();
