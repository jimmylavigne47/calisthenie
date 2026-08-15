# Calisthénie — programme maison

Programme de callisthénie sans matériel, en 4 séances qui tournent en boucle
(A pousser · B jambes · C dos · D gainage), 15-20 min par jour.

**Le site :** https://jimmylavigne47.github.io/calisthenie/

## Ce qu'il fait

- **Séance guidée** — un bouton, les exercices s'enchaînent tout seuls : échauffement,
  séries, repos chronométré avec bip et passage automatique à la suite, étirements.
- **Démo vidéo par exercice** — l'extrait exact du geste, en boucle, muet, pendant
  que tu bosses. Les segments sont lus directement depuis
  [la chaîne de Brieuc Le Dantec](https://www.youtube.com/@brieucledantec7422) :
  rien n'est réhébergé ici.
- **Deux niveaux par exercice** — une version plus facile et une version plus dure,
  parce qu'un programme qu'on ne peut pas adapter, on l'abandonne.
- **Suivi** — séances faites, jours d'affilée, et les 4 chiffres du test de départ
  à refaire à 4 et 8 semaines. Tout reste dans le navigateur (localStorage),
  aucun compte, aucun serveur.

## Le contenu

Les timecodes de chaque démo ont été repérés par analyse vidéo automatique puis
**vérifiés un par un** : 14 extraits retenus, notés 7 à 10/10, tous sans matériel.
Les exercices sans démo satisfaisante sont marqués comme tels plutôt que d'être
illustrés par un extrait approximatif.

## Technique

Trois fichiers, zéro dépendance, zéro build : `index.html`, `style.css`, `app.js`
(+ `data.js` pour le contenu). Hébergé sur GitHub Pages.

Pour modifier le programme, tout est dans `data.js` : séances, exercices, séries,
repos, timecodes vidéo.
