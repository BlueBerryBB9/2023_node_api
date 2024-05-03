# 2023_node_api

**recent changes :**
- optimized mk_slots (exo5)
- added need of valid spanId in Slot to add them with method add_slots (changed the tests consequently and work right)
- added check of potential overlaps of slots on the same Span (and the message error belonging)

**current tasks :**
- step 5 TD3 : slots generation
- ask how do we need to specify the span (as parameters : by id or by a Span to create) where adding slots in
- add checks for nonsense dates when creating Span or Slot (e.g : the start date after the end date , start and end dates are equal, ...)
- add checks in mk_slots (reservation) if (dates of a slot > the end date of the span) and then stop filling the span with slots
