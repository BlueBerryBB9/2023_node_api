**Pour tester chaque route et certaines erreurs :**

- démarrer le serveur sur un autre terminal avec yarn exe
- copier coller la liste d'opérations séparées par un retour à la ligne et presser entrée

///////////////////////////////////////////////////////////////////////////////

- Pour Operations :

  - POST /operations (all res = 10):

    http POST 127.0.0.1:1234/operations lhs:=5 rhs:=5 kind=ADD
    http POST 127.0.0.1:1234/operations lhs:=12 rhs:=2 kind=SUB
    http POST 127.0.0.1:1234/operations lhs:=5 rhs:=2 kind=MUL
    http POST 127.0.0.1:1234/operations lhs:=30 rhs:=3 kind=DIV
    http POST 127.0.0.1:1234/operations lhs:=32 rhs:=11 kind=MOD
    http GET 127.0.0.1:1234/operations

  - GET /operations :

    http POST 127.0.0.1:1234/operations lhs:=5 rhs:=5 kind=ADD
    http POST 127.0.0.1:1234/operations lhs:=30 rhs:=3 kind=DIV
    http GET 127.0.0.1:1234/operations

  - GET /operations empty :

    http GET 127.0.0.1:1234/operations

  - GET /operations/ID found:

    http POST 127.0.0.1:1234/operations lhs:=5 rhs:=5 kind=ADD
    http GET 127.0.0.1:1234/operations/1

  - GET /operations/ID not found (id: 1) & invalid id (id :0):

    http POST 127.0.0.1:1234/operations lhs:=5 rhs:=5 kind=ADD
    http GET 127.0.0.1:1234/operations/2
    http GET 127.0.0.1:1234/operations/0

///////////////////////////////////////////////////////////////////////////////

- Pour Spans :

  - POST /spans :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/spans start=2024-05-23T18:00:00.000Z end=2024-05-23T18:35:00.000Z desc=C2 title=CC2
    http POST 127.0.0.1:1234/spans start=2024-05-23T20:00:00.000Z end=2024-05-23T20:15:00.000Z desc=C3 title=CC3
    http GET 127.0.0.1:1234/spans

  - POST /spans Error (Span : DatesIncoherent) :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:00:00.000Z desc=C1 title=CC1

  - GET /spans :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/spans start=2024-05-23T18:00:00.000Z end=2024-05-23T18:35:00.000Z desc=C2 title=CC2
    http GET 127.0.0.1:1234/spans

  - GET /spans empty :

    http GET 127.0.0.1:1234/spans

  - GET /spans/ID :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/spans start=2024-05-23T18:00:00.000Z end=2024-05-23T18:35:00.000Z desc=C2 title=CC2
    http GET 127.0.0.1:1234/spans/1
    http GET 127.0.0.1:1234/spans/2

  - GET /spans/ID not found (id: 1 then 2) & invalid id (id :0) :

    http GET 127.0.0.1:1234/spans/1
    http POST 127.0.0.1:1234/spans start=2024-05-23T18:00:00.000Z end=2024-05-23T18:35:00.000Z desc=C2 title=CC2
    http GET 127.0.0.1:1234/spans/2
    http GET 127.0.0.1:1234/spans/0

  - PUT /spans/ID :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z desc=C1 title=CC1
    http PUT 127.0.0.1:1234/spans/1 start=2024-05-23T18:00:00.000Z end=2024-05-23T18:35:00.000Z desc=C2 title=CC2
    http GET 127.0.0.1:1234/spans

  - DELETE /spans/ID :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/spans start=2024-05-23T18:00:00.000Z end=2024-05-23T18:35:00.000Z desc=C2 title=CC2
    http DELETE 127.0.0.1:1234/spans/1
    http GET 127.0.0.1:1234/spans

///////////////////////////////////////////////////////////////////////////////

- Pour Slots :

  - POST /slots :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:45:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:30:00.000Z end=2024-05-23T19:45:00.000Z idSpan:=1
    http GET 127.0.0.1:1234/slots

  - POST /slots Error (Span : NotFound) :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=2

  - POST /slots Error (Slot : DatesIncoherent) :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T18:30:00.000Z idSpan:=1

  - POST /slots Error (Slot: Overlapping) :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1

  - POST /slots (Slot: DatesOutOfSpan) :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:30:00.000Z end=2024-05-23T19:45:00.000Z idSpan:=1

  - POST /slots with users:

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:45:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1 user=martin.leroy
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:30:00.000Z end=2024-05-23T19:45:00.000Z idSpan:=1
    http GET 127.0.0.1:1234/slots

  - POST /slots Error: (User : AlreadyInSpan):

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:45:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1 user=martin.leroy
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:30:00.000Z end=2024-05-23T19:45:00.000Z idSpan:=1 user=martin.leroy

  - POST /slots Error: (User : Busy):

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:45:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:45:00.000Z desc=C2 title=CC2
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1 user=martin.leroy
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=2 user=martin.leroy

  - GET /slots :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:45:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:30:00.000Z end=2024-05-23T19:45:00.000Z idSpan:=1
    http GET 127.0.0.1:1234/slots

  - GET /slots empty :

    http GET 127.0.0.1:1234/slots

  - GET /slots/ID :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:45:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:30:00.000Z end=2024-05-23T19:45:00.000Z idSpan:=1
    http GET 127.0.0.1:1234/slots

  - GET /slots/ID not found (id: 1 then 2) & invalid id (id :0) :

    http GET 127.0.0.1:1234/slots/1
    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:45:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1
    http GET 127.0.0.1:1234/slots/2
    http GET 127.0.0.1:1234/slots/0

  - PUT /slots/ID :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:45:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1
    http PUT 127.0.0.1:1234/slots/1 start=2024-05-23T19:30:00.000Z end=2024-05-23T19:45:00.000Z idSpan:=1 user=martin.leroy
    http GET 127.0.0.1:1234/slots

  - DELETE /slots/ID :

    http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:45:00.000Z desc=C1 title=CC1
    http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1
    http DELETE 127.0.0.1:1234/slots/1
    http GET 127.0.0.1:1234/slots
