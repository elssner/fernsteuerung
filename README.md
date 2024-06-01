
> Diese Seite bei [https://calliope-net.github.io/fernsteuerung/](https://calliope-net.github.io/fernsteuerung/) öffnen

### Calliope Bluetooth Erweiterung zur Fernsteuerung und Fernprogrammierung von Robotern mit Motoren und Servo

* fügt der Erweiterung **radio** neue Blöcke zum Bluetooth senden und empfangen hinzu
* macht Funktion **radio.sendBuffer** und Ereignis **radio.onReceivedBuffer** verfügbar
* damit kann ein Buffer bis 19 Byte Länge über Bluetooth zwischen 2 Calliope übertragen werden
* 6 verschiedene 'Fahrstrecken' je 3 Byte können gleichzeitig übertragen werden
* in den 3 Byte stehen jeweils Daten für 1. Motor; 2. Servo; 3. Entfernung
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

### Daten Struktur

#### Steuer Byte 0 <code>..xx....</code> (2 Bit) Betriebsart

hex|bit|Funktion|bei Ereignis von einem Sensor
---|---|---|---
0x00|<code>..00....</code>|Fernsteuerung 6 Motoren|Stop bei Hindernis
0x10|<code>..01....</code>|Fernsteuerung ein Motor M0|wechselt zum *Programm Sensoren*
0x20|<code>..10....</code>|Programm 5 Strecken|Stop bei Hindernis
0x30|<code>..11....</code>|Programm Sensoren|wechselt zum Ereignis-Block

#### Steuer Byte 0 <code>xx..xxxx</code> (6 Bit) Schalter

hex|bit|Funktion|Beschreibung
---|---|---|---
0x80|<code>1.......</code>|Soft-Reset|Calliope *zurücksetzen*
0x40|<code>.1......</code>|Status senden|Empfänger sendet Status über Bluetooth
0x08|<code>....1...</code>|Schalter
0x04|<code>.....1..</code>|Schalter
0x02|<code>......1.</code>|Schalter
0x01|<code>.......1</code>|Hupe|Buzzer; bei v3 Ton aus Lautsprecher


### Betriebsart: Fernsteuerung 6 Motoren (mit Joystick)

* kontinuierliche Bluetooth Übertragung der Daten vom Joystick
* nur 1 Servo (für Fahr-Motor M0)
* Sensoren: Stop bei Hindernis wenn in *Servo Byte 2* aktiviert
* Encoder wird nicht ausgewertet
* zusätzliche Motoren z.B. Gabelstapler oder Kran

#### Buffer-Struktur (19 Byte) Betriebsart: Fernsteuerung 6 Motoren

offset|Funktion|offset|Funktion|offset|Funktion
---|---|---|---|---|---
0|Steuer-Byte 0
1|Motor M0|2|Servo|3|Steuer-Byte 3
4|Motor M1|5||6
7|Motor MA|8||9
10|Motor MB|11||12
13|Motor MC|14||15
16|Motor MD|17||18

#### Steuer Byte 3 <code>..xxxxxx</code> (6 Bit) Betriebsart: Fernsteuerung 6 Motoren

hex|bit|offset|Motor|Beschreibung
---|---|---|---|---
0x01|<code>.......1</code>|1-2|M0|Motor Power
0x02|<code>......1.</code>|4|M1|Motor Power
0x04|<code>.....1..</code>|7|MA|Motor Power
0x08|<code>....1...</code>|10|MB|Motor Power
0x10|<code>...1....</code>|13|MC|Motor Power
0x20|<code>..1.....</code>|16|MD|Motor Power



### Betriebsart: Programm 5 Strecken

* einmalige Bluetooth Übertragung, kein Timeout
* ein Motor und Servo fährt nacheinander die Strecken
* jede Strecke muss in *Steuer Byte 3* aktiviert sein
* Stop nach der letzten Strecke

#### Buffer-Struktur (19 Byte) Betriebsart: Programm 5 Strecken

Strecke|offset|Funktion|offset|Funktion|offset|Funktion
---|---|---|---|---|---|---
_|0|Steuer-Byte 0
(Joystick)|1|Motor|2|Servo|3|Steuer-Byte 3
1\. Strecke|4|Motor|5|Servo|6|Entfernung
2\. Strecke|7|Motor|8|Servo|9|Entfernung
3\. Strecke|10|Motor|11|Servo|12|Entfernung
4\. Strecke|13|Motor|14|Servo|15|Entfernung
5\. Strecke|16|Motor|17|Servo|18|Entfernung

#### Steuer Byte 3 <code>..xxxxxx</code> (6 Bit) Betriebsart: Programm 5 Strecken

hex|bit|offset|Strecke|Beschreibung
---|---|---|---|---
0x01|<code>.......1</code>|1|(Joystick)|
0x02|<code>......1.</code>|4-5-6|1\. Strecke|aktiviert
0x04|<code>.....1..</code>|7-8-9|2\. Strecke|aktiviert
0x08|<code>....1...</code>|10-11-12|3\. Strecke|aktiviert
0x10|<code>...1....</code>|13-14-15|4\. Strecke|aktiviert
0x20|<code>..1.....</code>|16-17-18|5\. Strecke|aktiviert



### Betriebsart: Programm Sensoren

* einmalige Bluetooth Übertragung, kein Timeout
* ein Motor und Servo fährt ereignisgesteuert die Strecken
* jedes Ereignis muss in *Steuer Byte 3* aktiviert sein
* Strecke endet, wenn aktiviertes Ereignis von Sensor eintritt
* Stop Ereignisse: Ultraschallsensor, Spursensor, Encoder
* Fortsetzung mit dem zum Ereignis passenden Block 1 bis 5

#### Buffer-Struktur (19 Byte) Betriebsart: Programm Sensoren

Sensor|offset|Funktion|offset|Funktion|offset|Funktion
---|---|---|---|---|---|---
_|0|Steuer-Byte 0
(Joystick)|1|Motor|2|Servo|3|Steuer-Byte 3
Ultraschall|4|Motor|5|Servo|6|Entfernung
Spursensor 00|7|Motor|8|Servo|9|Entfernung
Spursensor 01|10|Motor|11|Servo|12|Entfernung
Spursensor 10|13|Motor|14|Servo|15|Entfernung
Spursensor 11|16|Motor|17|Servo|18|Entfernung

#### Steuer Byte 3 <code>..xxxxxx</code> (6 Bit) Betriebsart: Programm Sensoren

hex|bit|offset|Ereignis|Beschreibung
---|---|---|---|---
0x01|<code>.......1</code>|1|(Joystick)|
0x02|<code>......1.</code>|4|Ultraschall|Hindernis erkannt
0x04|<code>.....1..</code>|7|Spursensor|00 dunkel dunkel
0x08|<code>....1...</code>|10|Spursensor|01 dunkel hell
0x10|<code>...1....</code>|13|Spursensor|10 hell dunkel
0x20|<code>..1.....</code>|16|Spursensor|11 hell hell



### Konfiguration für alle Betriebsarten

#### Motor Byte 1 4 7 10 13 16 (8 Bit)

* **0..128..255** (128 ist Stop)
* 0..127 rückwärts; 129..255 vorwärts

#### Servo Byte 2 5 8 11 14 17 <code>...xxxxx</code> (5 Bit)

Zur Übertragung wird der Wert (vom Joystick oder vom MakeCode protractorPicker) in 5 Bit (0..31) umgerechnet.
Der Empfänger macht daraus nach der Formel **(x + 14) * 3** Winkel von 45° bis 135° in 3° Schritten.
Servo wird mit einem Winkel von 45° bis 135° angesteuert. 90° ist geradeaus.

* **1..16..31** (16 und 0 ist geradeaus 90°)
* Formel: (x + 14) * 3
* 1=45° 2=48° 3=51° .. 15=87° 16=90° 17=93° .. 30=132° 31=135°

#### Servo Byte 2 5 8 11 14 17 <code>xxx.....</code> (3 Bit)

hex|bit|Funktion
---|---|---
0x20|<code>..1.....</code>|Stop dieser Fahrstrecke bei Ereignis Spursensor
0x40|<code>.1......</code>|Stop dieser Fahrstrecke bei Ereignis Ultraschallsensor
0x00|<code>0.......</code>|Encoder Auflösung (Entfernung in cm oder Zehntelsekunden)
0x80|<code>1.......</code>|Encoder Auflösung (Entfernung in Impulsen) 1U Motor=63,9

#### Entfernung Byte 6 9 12 15 18 (8 Bit)

* **0**: Ereignis (Encoder oder Zeit) ist deaktiviert
* **1..255** 0,01 .. 2,55 Meter oder 0,1 .. 25,5 Sekunden
* mit Encodermotor werden Impulse ausgewertet
* ohne Encodermotor wird die Fahrzeit (Zehntelsekunden) ausgewertet

<!-- 
### Servo Byte 2 5 8 11 14 17 <code>xxx.....</code> (3 Bit)

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
-->



#### Steuer Byte 3 <code>xx......</code> (2 Bit) Ultraschall Entfernung

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
