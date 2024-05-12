
> Diese Seite bei [https://calliope-net.github.io/fernsteuerung/](https://calliope-net.github.io/fernsteuerung/) öffnen

## Als Erweiterung verwenden

Dieses Repository kann als **Erweiterung** in MakeCode hinzugefügt werden.

* öffne [https://makecode.calliope.cc/](https://makecode.calliope.cc/)
* klicke auf **Neues Projekt**
* klicke auf **Erweiterungen** unter dem Zahnrad-Menü
* nach **https://github.com/calliope-net/fernsteuerung** suchen und importieren

### Steuer Byte 0

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

hex|bit|Funktion|offset|Beschreibung
---|---|---|---|---
0x01|0|M0 \| Fernsteuerung|1-2|2 Byte (Motor, Servo) für Fernsteuerung mit Joystick
0x02|1|M1 \| Ultraschall|4-5-6|wird gefahren nachdem die Entfernung unterschritten wurde









## Blocks preview

This image shows the blocks code from the last commit in master.
This image may take a few minutes to refresh.

![A rendered view of the blocks](https://github.com/calliope-net/fernsteuerung/raw/master/.github/makecode/blocks.png)

#### Metadaten (verwendet für Suche, Rendering)

* for PXT/calliopemini
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
