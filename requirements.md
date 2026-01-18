# Ideen

- pre sale (qr code auf los) + online los (stripe)
- gemeinsame excel mit zeitstempel vom ausfüllen
- online mehrere lose per überweisung
- formulare sperren mit wiegedatum (wenn geht automatisch)
- verfizierungsprozess bei stripe anschauen/was braucht man wirklich

# Online workflow

- user füllt formular aus (name, email, anzahl lose)
- formular wird gespeichert mit hinweis auf zahlung ausstehend
- user wird zu stripe weitergeleitet & user bezahlt bei stripe
- nach erfolgreicher zahlung werden die formulardaten mit zahlungsbestätigung verknüpft
- user kommt auf die bestätigung seite mit eingegebenen daten und anzahl lose (mit optionalem pdf download?)

# Offline workflow

- user kauft lose bei bergretter
- lose haben qr code aufgedruckt mit eindeutiger los id
- user scannt qr code und kommt auf formular seite
  - user füllt formular aus (name, email, los id wird automatisch übernommen), optional können weitere lose hinzugefügt werden (per qr code scan)
- formular wird gespeichert mit hinweis auf zahlung erfolgt
- user kommt auf die bestätigung seite mit eingegebenen daten und anzahl lose (mit optionalem pdf download?)

# Admin seite

- generierung von offline sale ids + qr codes
- download aller eingegebenen daten über das formular als csv
  - schätzwert, name, addresse, zeitstempel der zahlung, los id
