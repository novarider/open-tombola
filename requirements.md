# Open Tombola

## Ideen

- pre sale (qr code auf los) + online los (stripe)
- gemeinsame excel mit zeitstempel vom ausfüllen
- online mehrere lose per überweisung
- formulare sperren mit wiegedatum (wenn geht automatisch)
- verfizierungsprozess bei stripe anschauen/was braucht man wirklich

### Online workflow

- user füllt formular aus (name, email, anzahl lose)
- formular wird gespeichert mit hinweis auf zahlung ausstehend
- user wird zu stripe weitergeleitet & user bezahlt bei stripe
- nach erfolgreicher zahlung werden die formulardaten mit zahlungsbestätigung verknüpft
- user kommt auf die bestätigung seite mit eingegebenen daten und anzahl lose (mit optionalem pdf download?)

register form --> register backend --> payment url --> payment website ---> payment successfull
                                                                        |-> payment cancelled/failed

### Offline workflow

- user kauft lose bei bergretter
- lose haben qr code aufgedruckt mit eindeutiger los id
- user scannt qr code und kommt auf formular seite
  - user füllt formular aus (name, email, los id wird automatisch übernommen), optional können weitere lose hinzugefügt werden (per qr code scan)
- formular wird gespeichert mit hinweis auf zahlung erfolgt
- user kommt auf die bestätigung seite mit eingegebenen daten und anzahl lose (mit optionalem pdf download?)

scan qr code --> register form --> backend checks validity --> entry successfull
                                                            |-> entry cancelled/failed (retry possible)

### Admin seite/endpoints

- generierung von offline sale ids + qr codes
- download aller eingegebenen daten über das formular als csv
  - schätzwert, name, addresse, zeitstempel der zahlung, los id

### Todo

telefonnummer dazua
zahlengenerator für auslosung
serienbrief für gedruckte lose
[done] domain lösen www.80-jahre-st-gallenkirch.at
[done] 24. Oktober festdatum
[done] 17. Oktober 12:00 Stichtag für Anmeldungen

formular page
  [done] Stückpreise updaten (2,50€)
  delete icon has strange shadown on android
  QR Code scanner lib https://github.com/zxing-js/ngx-scanner/wiki/Getting-Started#usage


## Deployment

- [done] Deployment must happen on OVHCloud hosted in germany
- [done] A PostgresSQL Database in k8s will be used
- [done] A Kubernetescluster will handle the api and frontend as nodes
- [done] A docker registry is needed for the cluster to fetch images
- The webpage should be reachable under https://80-jahre-bergrettung.at
- configure PostgresSQL Database backups
- configure http to https rerouting in nginx for frontend
- configure https proxy to encrypt backend traffic
