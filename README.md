
> Diese Seite bei [https://calliope-net.github.io/fernsteuerung/](https://calliope-net.github.io/fernsteuerung/) öffnen

### Calliope Bluetooth Erweiterung zur Fernsteuerung und Fernprogrammierung von Robotern mit Motoren und Servo

* fügt der Erweiterung **radio** neue Blöcke zum Bluetooth senden und empfangen hinzu
* macht Funktion **radio.sendBuffer** und Ereignis **radio.onReceivedBuffer** verfügbar
* damit kann ein Buffer bis 19 Byte Länge über Bluetooth zwischen 2 Calliope übertragen werden
* 6 verschiedene 'Fahrstrecken' je 3 Byte können gleichzeitig übertragen werden
* in den 3 Byte stehen jeweils Daten für 1. Motor; 2. Servo; 3. Fahrstrecke
* als Betriebsarten werden unterschieden: Fernsteuerung und Programm
* bei Fernsteuerung müssen kontinuierlich Bluetooth Daten gesendet werden (vom Joystick)
* bei Programm werden die 5 'Fahrstrecken' abgefahren, ohne dass Timeout eintritt
* entweder werden die 5 'Fahrstrecken' nacheinander abgefahren, dann Stop
* oder die 5 'Fahrstrecken' werden Ereignissen zugeordnet (Ultraschall und Spursensor)

## Als Erweiterung verwenden

Dieses Repository kann als **Erweiterung** in MakeCode hinzugefügt werden.

* öffne Makecode in der App oder die Webseite [https://makecode.calliope.cc/](https://makecode.calliope.cc/)
* klicke auf **Neues Projekt** und gib deinem Projekt einen Namen
* wähle die zu deinem Calliope mini passende Hardware v1, v2 oder v3
* klicke auf **Erweiterungen**
* schreibe die folgende **Projekt-URL**:
* **calliope-net/fernsteuerung**
* mit der Tastatur oben in das weiße Feld und klicke auf ENTER
* klicke auf das Rechteck **fernsteuerung** (kann von der Tastatur verdeckt sein)
* jetzt hat die Liste den neuen Eintrag **Funk** bekommen
* das ist die Original Bluetooth Erweiterung mit den 2 zusätzlichen Kategorien:
* Bluetooth (Buffer übertragen) und Fernsteuerung (Buffer vorbereiten und auslesen)

### Beschreibung der Erweiterung 'Fernsteuerung'

#### Kategorie Bluetooth

> a

#### Kategorie Fernsteuerung

> a

### Bluetooth Buffer Struktur (19 Byte)

* Byte 0 und 3 sind Steuer-Bytes
* Byte 1 und 2 senden Position vom Joystick an Motor und Servo
* 3 Byte (Motor, Servo, Entfernung) wiederholen sich 5 Mal im Buffer ab offset 4
* damit kann auf Ereignisse von Sensoren reagiert werden oder bis 6 Motoren gleichzeitig gesteuert werden
* Byte Motor: 8 Bit 0..128..255; 128 ist Stop; 127..0 ist rückwärts
* Byte Servo: 6 Bit 1..16..31; 16 und 0 ist geradeaus
* Byte Servo: 0x20 (Bit 5) Stop bei schwarzer Linie
* Byte Servo: 0x40 (bit 6) Stop bei Ultraschall
* Byte Servo: 0x80 (bit 7) Encoder Auflösung (Entfernung in Impulsen anstatt cm)
* Byte Entfernung: 0..255; bei Encodermotor 0..255 cm bzw. 0..255 Impulse
* Byte Entfernung: 0..255; ohne Encodermotor 0..25,5 Sekunden

offset|Ereignis|Funktion|Beschreibung
---|---|---|---
0||Steuer-Byte 0|Betriebsart und Schalter
1|Joystick|M0 Motor|0..128..255
2||M0 Servo (6 Bit)|1..16..31 \| 0x20 Liniensensor \| 0x40 Ultraschall \| 0x80 Encoder
3||Steuer-Byte 3|Motor Power und Ultraschall Entfernung
4|Ultraschall|M1 Motor|0..128..255
5||M1 Servo (6 Bit)|1..16..31 \| 0x20 Liniensensor \| 0x40 Ultraschall \| 0x80 Encoder
6||M1 Entfernung|0..255 cm oder 0..25,5 Sekunden
7|Linie 00|MA Motor|0..128..255
8||MA Servo (6 Bit)|1..16..31 \| 0x20 Liniensensor \| 0x40 Ultraschall \| 0x80 Encoder
9||MA Entfernung|0..255 cm oder 0..25,5 Sekunden
10|Linie 01|MB Motor|0..128..255
11||MB Servo (6 Bit)|1..16..31 \| 0x20 Liniensensor \| 0x40 Ultraschall \| 0x80 Encoder
12||MB Entfernung|0..255 cm oder 0..25,5 Sekunden
13|Linie 10|MC Motor|0..128..255
14||MC Servo (6 Bit)|1..16..31 \| 0x20 Liniensensor \| 0x40 Ultraschall \| 0x80 Encoder
15||MC Entfernung|0..255 cm oder 0..25,5 Sekunden
16|Linie 11|MD Motor|0..128..255
17||MD Servo (6 Bit)|1..16..31 \| 0x20 Liniensensor \| 0x40 Ultraschall \| 0x80 Encoder
18||MD Entfernung|0..255 cm oder 0..25,5 Sekunden


### Steuer Byte 0 Betriebsart und Schalter

* das erste Byte im Buffer (**receivedData** oder **sendData**)
* die 2 Bit 5-4 steuern die Betriebsart:
* 0x00 die 6 Bereiche je 3 Byte können an bis 6 Motoren (und Servos) gleichzeitig Daten senden, vom Joystick
* 0x10 mit der Fernsteuerung fahren bis zu einem Sensor-Ereignis, dann autonom weiter
* 0x20 die 6 Bereiche je 3 Byte enthalten Teil-Strecken, die als Fahrplan autonom abgefahren werden
* 0x30 die 6 Bereiche je 3 Byte enthalten Fahr-Strecken, um auf ein Ereignis zu reagieren
* ist beim letzten empfangenen Buffer Bit 5 0x20 Programm gesetzt, wird kurzes timeout (1s) unterdrückt
* danach sollen keine Buffer mehr gesendet werden, bis das Programm abgefahren ist

hex|bit|Funktion|bei Ereignis von einem Sensor
---|---|---|---
0x80|<code>1.......</code>|Soft-Reset
0x40|<code>.1......</code>|Status Buffer zurück senden
0x00|<code>..00....</code>|Fernsteuerung max. 6 Motoren|Stop bei Hindernis
0x10|<code>..01....</code>|Fernsteuerung ein Motor M0|wechselt zum *Programm Sensoren*
0x20|<code>..10....</code>|Programm 5 Strecken|Stop bei Hindernis
0x30|<code>..11....</code>|Programm Sensoren|wechselt zum Ereignis-Block
0x08|<code>....1...</code>|Schalter
0x04|<code>.....1..</code>|Schalter
0x02|<code>......1.</code>|Schalter
0x01|<code>.......1</code>|Hupe

### Steuer Byte 3 <code>..xxxxxx</code> Motor Power (6 Bit)

* aktiviert die entsprechenden 3 Byte (Motor, Servo, Entfernung) im Buffer
* sind Motoren angeschlossen '00 Fernsteuerung Motoren', wird damit Motor Power geschaltet
* bei Strecken oder Sensor wird geschaltet, ob die Strecke bzw. das Ereignis abgearbeitet werden
* d.h. die Gültigkeit der 3 Bytes im Buffer wird an oder aus geschaltet

hex|bit|Funktion|aktiviert offset|Beschreibung
---|---|---|---|---
0x01|<code>.......1</code>|M0 <br> Fernsteuerung|1-2|2 Byte (Motor, Servo) für Fernsteuerung mit Joystick
0x02|<code>......1.</code>|M1 <br> Ultraschall|4-5-6|wenn Ultraschall Entfernung <br> unterschritten wurde
0x04|<code>.....1..</code>|MA <br> Spursensor hell hell|7-8-9|wenn Spursensor <br> geändert
0x08|<code>....1...</code>|MB <br> Spursensor hell dunkel|10-11-12|wenn Spursensor <br> geändert
0x10|<code>...1....</code>|MC <br> Spursensor dunkel hell|13-14-15|wenn Spursensor <br> geändert
0x20|<code>..1.....</code>|MD <br> Spursensor dunkel dunkel|16-17-18|wenn Spursensor <br> geändert



### Steuer Byte 3 <code>xx......</code> Ultraschall Entfernung (2 Bit)

* 2 Bit codieren die Entfernung für das Ultraschall Ereignis

hex|bit|Funktion|Beschreibung
---|---|---|---
0x00|<code>00......</code>|Ultraschall Entferung|Stop bei 5 cm
0x40|<code>01......</code>|Ultraschall Entferung|Stop bei 10 cm
0x80|<code>10......</code>|Ultraschall Entferung|Stop bei 15 cm
0xC0|<code>11......</code>|Ultraschall Entferung|Stop bei 20 cm





### Erweiterungen

> [Upates für Erweiterungen; Erweiterungen aus einem Projekt löschen.](https://calliope-net.github.io/i2c-liste#updates)

> [Alle I²C-Erweiterungen von calliope-net (MakeCode-Blöcke).](https://calliope-net.github.io/i2c-liste#erweiterungen)

#### Calliope-Apps, .hex-Dateien, Bildschirmfotos mit Blöcken

> [Alle MakeCode-Projekte von calliope-net (Programmierbeispiele).](https://calliope-net.github.io/i2c-liste#programmierbeispiele)

> GitHub-Profil calliope-net: [https://github.com/calliope-net](https://github.com/calliope-net)

### Bezugsquellen

> [Alle I²C-Module und Bezugsquellen (Hardware).](https://calliope-net.github.io/i2c-liste#bezugsquellen)



## Blocks preview ![Build status badge](https://github.com/calliope-net/fernsteuerung/workflows/MakeCode/badge.svg)

This image shows the blocks code from the last commit in master.
This image may take a few minutes to refresh.

![A rendered view of the blocks](https://github.com/calliope-net/fernsteuerung/raw/master/.github/makecode/blocks.png)

#### Metadaten (verwendet für Suche, Rendering)

* Calliope mini
* Bluetooth (Buffer)
