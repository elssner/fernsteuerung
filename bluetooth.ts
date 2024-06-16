
namespace radio { // bluetooth.ts

    // const n_Simulator: boolean = ("€".charCodeAt(0) == 8364) // true, wenn der Code im Simulator läuft
    export let n_funkgruppe = 240
    let n_start = false
    //  let n_connected = false // Bluetooth connected
    let n_lastconnectedTime = input.runningTime()  // ms seit Start
    let n_programm = false // autonomes fahren nach Programm, kein Bluetooth timeout


    //% group="calliope-net.github.io/fernsteuerung" subcategory="Bluetooth"
    //% block="beim Start Funkgruppe %funkgruppe || mit 'A+B halten' Reset senden %bSendReset"
    //% funkgruppe.min=0 funkgruppe.max=255 funkgruppe.defl=240
    //% bFunkgruppe.shadow="toggleYesNo"
    //% bSendReset.shadow="toggleYesNo"
    export function beimStart(funkgruppe: number, bSendReset = false, bFunkgruppe = false) {
        n_funkgruppe = funkgruppe
        n_enableButtonSendReset = bSendReset
        // n_enableButtonFunkgruppe = bFunkgruppe
        radio.setGroup(n_funkgruppe)
        radio.setTransmitPower(7)
        radio.setTransmitSerialNumber(true)
        // n_connected = false
        // n_lastconnectedTime = input.runningTime() // Laufzeit
        n_start = true
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
        if (n_sendReset) {
            setSchalter(sendBuffer, e0Schalter.b7, true)
            n_sendReset = false
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
    //% block="timeout > %ms ms || Programm-timeout %programm" weight=7
    //% programm.shadow="toggleYesNo"
    //% ms.defl=1000
    export function timeout(ms: number, programm = false) {
        if (!programm) // kurzes Fernsteuerung-timeout (1s) nur bei Joystick, nicht auslösen wenn n_programm=true
            return !n_programm && ((input.runningTime() - n_lastconnectedTime) > ms)
        else // längeres Programm-timeout (60s) immer auslösen falls Programm hängt (zum aus schalten)
            return ((input.runningTime() - n_lastconnectedTime) > ms)
    }




    // ========== wenn Text empfangen (Bluetooth Status zurück senden)

    let n_receivedString = ""
    let n_receivedStringChanged = false

    radio.onReceivedString(function (receivedString) {
        n_receivedStringChanged = n_receivedString != receivedString
        if (n_receivedStringChanged) {
            n_receivedString = receivedString
        }
    })



    // ========== group="Kran Status" subcategory="Status empfangen"

    //% group="Bluetooth empfangen (Text)" subcategory="Sender"
    //% block="Status empfangen Änderung" weight=4
    export function receivedStringChanged() { return n_receivedStringChanged }

    //% group="Bluetooth empfangen (Text)" subcategory="Sender"
    //% block="Status empfangen Text" weight=3
    export function receivedStringText() { return n_receivedString.substr(2) }



} // bluetooth.ts
