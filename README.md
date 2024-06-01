# 2023_node_api

**recent changes :**

- TD3 et TD4 fini ! (en théorie)
- Custom Error class usage have been changed --> its now extending Error,
  For tests : it's returning an Error with message
  In a catch : you can call custom method Error() to return an object with a message and a status Code -> more at the bottom of reservation.service.ts
- Une Route a été ajoutée pour générer des slots : spans/gen_slots dans server.ts

POUR LANCER LE SERVEUR : yarn nodemon

POUR TESTER : insomnia ou http cli avec les différents test dans _"server.test.md"_
