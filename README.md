# 2023_node_api

**recent changes :**

- TD3 et TD4 fini ! (en théorie)
- Custom Error class usage have been changed --> its now extending Error,
  For tests : it's returning an Error with message
  In a catch : you can call custom method Error() to return an object with a message and a status Code -> more at the bottom of reservation.service.ts

**current tasks :**

- A DEMANDER : span.ts : ajouter au type span une liste des id de tout les slots lié;
- BONUS à faire : créer une route pour inscrire et une autre pour générer des créneaux
