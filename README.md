
> Diese Seite bei [https://calliope-net.github.io/fernsteuerung/](https://calliope-net.github.io/fernsteuerung/) öffnen

### Calliope Bluetooth Erweiterung zur Fernsteuerung und Fernprogrammierung von Modellen mit Motoren und Servo

* fügt der Erweiterung **radio** neue Blöcke zum Bluetooth senden und empfangen hinzu
* macht Funktion **radio.sendBuffer** und Ereignis **radio.onReceivedBuffer** verfügbar
* damit kann ein Buffer bis 19 Byte Länge über Bluetooth zwischen 2 Calliope übertragen werden
* 6 verschiedene "Fahrstrecken" je 3 Byte können gleichzeitig übertragen werden
* in den 3 Byte stehen jeweils Daten für 1. Motor; 2. Servo; 3. Fahrstrecke
* als Betriebsarten werden unterschieden: Fernsteuerung und Programm
* bei Fernsteuerung müssen kontinuierlich Bluetooth Daten gesendet werden (vom Joystick)
* bei Programm werden die 5 "Fahrstrecken" abgefahren, ohne dass Timeout eintritt
* entweder werden die 5 "Fahrstrecken" nacheinander abgefahren, dann Stop
* oder die 5 "Fahrstrecken" werden Ereignissen zugeordnet (Ultraschall und Spursensor)
* 

## Als Erweiterung verwenden

Dieses Repository kann als **Erweiterung** in MakeCode hinzugefügt werden.

* öffne [https://makecode.calliope.cc/](https://makecode.calliope.cc/)
* klicke auf **Neues Projekt**
* klicke auf **Erweiterungen** unter dem Zahnrad-Menü
* nach **https://github.com/calliope-net/fernsteuerung** suchen und importieren

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

hex|bit|Funktion
---|---|---
0x80|7|7 Soft-Reset
0x40|6|6 Status Buffer zurück senden
0x00|5-4|00 Fernsteuerung Motoren
0x10|5-4|10 Fernsteuerung Motor M0 bis Sensor
0x20|5-4|20 Programm 5 Strecken
0x30|5-4|30 Programm Sensoren
0x08|3|3 Schalter
0x04|2|2 Schalter
0x02|1|1 Schalter
0x01|0|0 Hupe

### Steuer Byte 3 Motor Power und Ultraschall Entfernung

* aktiviert die entsprechenden 3 Byte (Motor, Servo, Entfernung) im Buffer
* sind Motoren angeschlossen '00 Fernsteuerung Motoren', wird damit Motor Power geschaltet
* bei Strecken oder Sensor wird geschaltet, ob die Strecke bzw. das Ereignis abgearbeitet werden
* d.h. die Gültigkeit der 3 Bytes im Buffer wird an oder aus geschaltet

hex|bit|Funktion|aktiviert offset|Beschreibung
---|---|---|---|---
0x01|0|M0 \| Fernsteuerung|1-2|2 Byte (Motor, Servo) für Fernsteuerung mit Joystick
0x02|1|M1 \| Ultraschall|4-5-6|wird gefahren nachdem die Entfernung unterschritten wurde
0x04|2|MA \| Spursensor hell hell|7-8-9|wird gefahren nach 'Stop bei schwarzer Linie'
0x08|3|MB \| Spursensor hell dunkel|10-11-12|wird gefahren nach 'Stop bei schwarzer Linie'
0x10|4|MC \| Spursensor dunkel hell|13-14-15|wird gefahren nach 'Stop bei schwarzer Linie'
0x20|5|MD \| Spursensor dunkel dunkel|16-17-18|wird gefahren nach 'Stop bei schwarzer Linie'
0x00|7-6|Ultraschall Entferung||Stop bei 5 cm
0x40|7-6|Ultraschall Entferung||Stop bei 10 cm
0x80|7-6|Ultraschall Entferung||Stop bei 15 cm
0xC0|7-6|Ultraschall Entferung||Stop bei 20 cm





## Blocks preview

This image shows the blocks code from the last commit in master.
This image may take a few minutes to refresh.

![A rendered view of the blocks](https://github.com/calliope-net/fernsteuerung/raw/master/.github/makecode/blocks.png)

#### Metadaten (verwendet für Suche, Rendering)

* for PXT/calliopemini
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
