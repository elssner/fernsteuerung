// Gib deinen Code hier ein
namespace radio { // eventblocks.ts

    // const n_Simulator: boolean = ("€".charCodeAt(0) == 8364) // true, wenn der Code im Simulator läuft

    // ========== group="Bluetooth senden" subcategory="Buffer"

    let n_sendBuffer19 = Buffer.create(19) // wird gesendet mit radio.sendBuffer

    //% blockId=radio_sendBuffer19
    //% group="Bluetooth senden" subcategory="Buffer"
    //% block="sendData" weight=5
    export function radio_sendBuffer19(): Buffer { return n_sendBuffer19 }

    //% group="Bluetooth senden" subcategory="Buffer"
    //% block="sendData löschen" weight=3
    export function fill_sendBuffer19() { n_sendBuffer19.fill(0) }

    //% group="Bluetooth senden" subcategory="Buffer"
    //% block="Buffer senden %sendBuffer" weight=1
    //% sendBuffer.shadow="radio_sendBuffer19"
    export function sendData(sendBuffer: Buffer) {
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
        /*    n_receivedBuffer19 = receivedBuffer
     
           if (carReady()) { // beim ersten Mal warten bis Motor bereit
               if (!n_connected) {
                   //licht(false, false) //  Licht aus und Blinken beenden
                   //   n_MotorChipReady = false
                   n_connected = true // wenn Start und Motor bereit, setze auch Bluetooth connected
               }
               n_lastconnectedTime = input.runningTime() // Connection-Timeout Zähler zurück setzen
     
               if (onReceivedBufferHandler)
                   onReceivedBufferHandler(receivedBuffer) // Ereignis Block auslösen, nur wenn benutzt
                   
           } */

        // die Variable 'onReceivedDataHandler' ist normalerweise undefined, dann passiert nichts
        // die Variable erhält einen Wert, wenn der folgende Ereignis Block 'onReceivedData' einmal im Code vorkommt
        // der Wert der Variable 'onReceivedDataHandler' ist die function, die bei true zurück gerufen wird
        // die function ruft mit dem Parameter vom Typ Buffer die Blöcke auf, die im Ereignis-Block stehen
        if (onReceivedDataHandler)
            onReceivedDataHandler(receivedBuffer) // Ereignis Block auslösen, nur wenn benutzt
    })

    // ========== group="Bluetooth empfangen" subcategory="Buffer"

    // sichtbarer Event-Block

    //% group="Bluetooth empfangen" subcategory="Buffer"
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


} // eventblocks.ts
