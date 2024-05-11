// Gib deinen Code hier ein
namespace radio { // eventblocks.ts

    const n_Simulator: boolean = ("€".charCodeAt(0) == 8364) // true, wenn der Code im Simulator läuft

    // ========== Bluetooth Event ==========

    let onReceivedBufferHandler: (receivedBuffer: Buffer) => void

    // Event-Handler (aus radio) wenn Buffer empfangen
    radio.onReceivedBuffer(function (receivedBuffer) {
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

        if (onReceivedBufferHandler)
            onReceivedBufferHandler(receivedBuffer) // Ereignis Block auslösen, nur wenn benutzt
    })

    // ========== group="Bluetooth Verbindung" subcategory="Buffer 19"

    // Event-Block

    //% group="Bluetooth Verbindung" subcategory="Buffer 19"
    //% block="wenn Buffer empfangen" weight=9
    //% draggableParameters=reporter
    export function onReceivedData(cb: (receivedBuffer: Buffer) => void) {
        onReceivedBufferHandler = cb
    }



    // Bluetooth senden


    //  export let n_sendBuffer19 = Buffer.create(19) // wird gesendet mit radio.sendBuffer

    //% group="Bluetooth Verbindung" subcategory="Buffer 19"
    //% block="Buffer senden %msg" weight=9
    export function sendBuffer19(msg: Buffer) {
        radio.sendBuffer(msg)
    }



} // eventblocks.ts
