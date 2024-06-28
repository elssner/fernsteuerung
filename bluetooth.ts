
namespace radio { // bluetooth.ts

    // const n_Simulator: boolean = ("€".charCodeAt(0) == 8364) // true, wenn der Code im Simulator läuft
    let n_funkgruppe = 0xA0
    let n_start = false

    let n_lastconnectedTime = input.runningTime()  // ms seit Start
    let n_programm = false // autonomes fahren nach Programm, kein Bluetooth timeout


    //% group="calliope-net.github.io/fernsteuerung" subcategory="Bluetooth" 
    //% block="beim Start Funkgruppe %funkgruppe" weight=9
    //% funkgruppe.min=160 funkgruppe.max=191 funkgruppe.defl=160
    //% bFunkgruppe.shadow="toggleYesNo"
    export function beimStart(funkgruppe: number) {
        if (between(funkgruppe, 0xA0, 0xBF))
            n_funkgruppe = funkgruppe
        else
            n_funkgruppe = 0xAF
        //n_enableButtonSendReset = bSendReset
        //   sender.n_enableButtonFunkgruppe = bFunkgruppe // in buttonevents.ts
        radio.setGroup(n_funkgruppe)
        radio.setTransmitPower(7)
        radio.setTransmitSerialNumber(true)

        n_start = true
    }


    export enum eFunkgruppeButton {
        //% block="lesen"
        lesen,
        //% block="lesen und anzeigen"
        anzeigen,
        //% block="-1 und anzeigen"
        minus,
        //% block="+1 und anzeigen"
        plus,
        //% block="175 0xAF und anzeigen"
        reset
    }


    let n_FunkgruppeButton = 0xAF

    //% group="calliope-net.github.io/fernsteuerung" subcategory="Bluetooth" 
    //% block="Funkgruppe %i " weight=8
    export function setFunkgruppeButton(e: eFunkgruppeButton): number {
        if (e == eFunkgruppeButton.lesen)
            return n_FunkgruppeButton
        else {
            if (e == eFunkgruppeButton.minus && n_FunkgruppeButton > 0xA0)
                n_FunkgruppeButton--
            else if (e == eFunkgruppeButton.plus && n_FunkgruppeButton < 0xBF)
                n_FunkgruppeButton++
            else if (e == eFunkgruppeButton.reset)
                n_FunkgruppeButton = 0xAF

            radio.setGroup(n_funkgruppe)
            zeigeBIN(n_funkgruppe, ePlot.hex, 1) // 5x5 x=0-1 y=1-2-3-4 (y=0 ist bei hex immer aus)
            return n_FunkgruppeButton
        }
    }


    //% group="calliope-net.github.io/fernsteuerung" subcategory="Bluetooth" deprecated=true
    //% block="Funkgruppe || ändern %i und anzeigen" weight=8
    //% i.min=-1 i.max=1
    export function getFunkgruppe(i?: number): number {
        if (i != undefined) {
            if (i < 0 && n_funkgruppe + i > 0xA0) {
                n_funkgruppe += i
                radio.setGroup(n_funkgruppe)
            }
            else if (i > 0 && n_funkgruppe + i < 0xBF) {
                n_funkgruppe += i
                radio.setGroup(n_funkgruppe)
            }
            //zeige5x5Funkgruppe()
            zeigeBIN(n_funkgruppe, ePlot.hex, 1) // 5x5 x=0-1 y=1-2-3-4 (y=0 ist bei hex immer aus)
        }
        return n_funkgruppe
    }




    // ========== group="Bluetooth senden" subcategory="Bluetooth"

    let n_sendBuffer19 = Buffer.create(19) // wird gesendet mit radio.sendBuffer

    //% blockId=radio_sendBuffer19
    //% group="Bluetooth senden (19 Byte)" subcategory="Bluetooth"
    //% block="sendData" color="#7E84F7" weight=5
    export function radio_sendBuffer19(): Buffer { return n_sendBuffer19 }

    //% group="Bluetooth senden (19 Byte)" subcategory="Bluetooth"
    //% block="sendData löschen" weight=3
    export function fill_sendBuffer19() { n_sendBuffer19.fill(0) }

    //% group="Bluetooth senden (19 Byte)" subcategory="Bluetooth"
    //% block="Buffer senden %sendBuffer" weight=1
    //% sendBuffer.shadow="radio_sendBuffer19"
    export function sendData(sendBuffer: Buffer) {
        if (sender.n_sendReset) {
            setSchalter(sendBuffer, e0Schalter.b7, true)
            sender.n_sendReset = false
        }
        radio.sendBuffer(sendBuffer)
    }



    // ========== Bluetooth Event radio.onReceivedBuffer behandeln ==========

    // deklariert die Variable mit dem Delegat-Typ '(receivedBuffer: Buffer) => void'
    // ein Delegat ist die Signatur einer function mit den selben Parametern
    // es wird kein Wert zurück gegeben (void)
    // die Variable ist noch undefined, also keiner konkreten Funktion zugeordnet
    let onReceivedDataHandler: (receivedData: Buffer) => void


    // Event-Handler (aus radio) wenn Buffer empfangen (Event Block ist dort hidden und soll hiermit wieder sichtbar werden)
    // die function 'radio.onReceivedBuffer(cb)' hat einen Parameter 'cb' (das heißt callback)
    // der Parameter 'cb' hat den Typ '(receivedBuffer: Buffer) => void'
    // als Parabeter 'cb' übergeben wird die function 'function (receivedBuffer) {}'
    // was in den Klammern {} steht, wird bei dem Ereignis 'radio.onReceivedBuffer' abgearbeitet (callback = Rückruf)
    radio.onReceivedBuffer(function (receivedBuffer: Buffer) {

        if (n_start && receivedBuffer.length == 19) { // beim ersten Mal warten bis Motor bereit

            if ((receivedBuffer[0] & 0x80) == 0x80) // Bit 7 reset
                control.reset() // Soft-Reset, Calliope zurücksetzen

            n_programm = (receivedBuffer[0] & 0x20) == 0x20 // Bit 5 Programm=1 / Fernsteuerung=0

            //if (!n_connected) {
            //licht(false, false) //  Licht aus und Blinken beenden
            //   n_MotorChipReady = false
            //    n_connected = true // wenn Start und Motor bereit, setze auch Bluetooth connected
            //}
            n_lastconnectedTime = input.runningTime() // Connection-Timeout Zähler zurück setzen


            // die Variable 'onReceivedDataHandler' ist normalerweise undefined, dann passiert nichts
            // die Variable erhält einen Wert, wenn der folgende Ereignis Block 'onReceivedData' einmal im Code vorkommt
            // der Wert der Variable 'onReceivedDataHandler' ist die function, die bei true zurück gerufen wird
            // die function ruft mit dem Parameter vom Typ Buffer die Blöcke auf, die im Ereignis-Block stehen
            if (onReceivedDataHandler)
                onReceivedDataHandler(receivedBuffer) // Ereignis Block auslösen, nur wenn benutzt
        }
    })

    // ========== group="Bluetooth empfangen" subcategory="Buffer"

    // sichtbarer Event-Block

    //% group="Bluetooth empfangen (19 Byte)" subcategory="Bluetooth"
    //% block="wenn Buffer empfangen" weight=9
    //% draggableParameters=reporter
    export function onReceivedData(cb: (receivedData: Buffer) => void) {
        // das ist der sichtbare Ereignis Block 'wenn Buffer empfangen (receivedData)'
        // hier wird nur der Delegat-Variable eine konkrete callback function zugewiesen
        // dieser Block speichert in der Variable, dass er beim Ereignis zurückgerufen werden soll
        onReceivedDataHandler = cb
        // aufgerufen wird beim Ereignis 'radio.onReceivedBuffer' die der Variable 'onReceivedDataHandler' zugewiesene function
        // das sind die Blöcke, die später im Ereignis Block 'wenn Buffer empfangen (receivedData)' enthalten sind
    }



    //% group="Bluetooth empfangen (19 Byte)" subcategory="Bluetooth"
    //% block="timeout > %ms ms || abschalten %abschalten" weight=7
    //% programm.shadow="toggleYesNo"
    //% ms.defl=1000
    export function timeout(ms: number, abschalten = false) {
        if (!abschalten) // kurzes Fernsteuerung-timeout (1s) nur bei Joystick, nicht auslösen wenn n_programm=true
            return !n_programm && ((input.runningTime() - n_lastconnectedTime) > ms)
        else // längeres Programm-timeout (60s) immer auslösen falls Programm hängt (zum aus schalten)
            return ((input.runningTime() - n_lastconnectedTime) > ms)
    }




    /* 
    
        // ========== wenn Text empfangen (Bluetooth Status zurück senden)
    
        let n_receivedString = ""
        let n_receivedStringChanged = false
    
        radio.onReceivedString(function (receivedString) {
            n_receivedStringChanged = n_receivedString != receivedString
            if (n_receivedStringChanged) {
                n_receivedString = receivedString
            }
        })
    
    
        //% group="Bluetooth empfangen (Text)" subcategory="Sender"
    
        //% group="Bluetooth empfangen (Text)" subcategory="Sender"
        //% block="Status empfangen Änderung" weight=4
        export function receivedStringChanged() { return n_receivedStringChanged }
    
        //% group="Bluetooth empfangen (Text)" subcategory="Sender"
        //% block="Status empfangen Text" weight=3
        export function receivedStringText() { return n_receivedString.substr(2) }
    
    
    
    // ========== group="Button A+B" subcategory="Sender"
    
        //% group="Button A+B" subcategory="Sender"
        //% block="mit 'A+B halten' Reset senden %enable" weight=6
        //% enable.shadow="toggleYesNo"
        export function enableButtonSendReset(enable: boolean) { n_enableButtonSendReset = enable } // buttonevents.ts
    
     */

} // bluetooth.ts
