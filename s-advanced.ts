
namespace sender { // s-advanced.ts



    // ========== wenn Text empfangen (Bluetooth Status zurück senden)

    let n_receivedString = ""
    let n_receivedStringChanged = false

    radio.onReceivedString(function (receivedString) {
        n_receivedStringChanged = n_receivedString != receivedString
        if (n_receivedStringChanged) {
            n_receivedString = receivedString
        }
    })




    //% group="Bluetooth empfangen (Text)" advanced=true
    //% block="Status empfangen Änderung" weight=4
    export function receivedStringChanged() { return n_receivedStringChanged }

    //% group="Bluetooth empfangen (Text)" advanced=true
    //% block="Status empfangen Text" weight=3
    export function receivedStringText() { return n_receivedString.substr(2) }



    // ========== group="lenken mit Tasten A:links B:rechts" advanced=true

    export enum eServoButton {
        //% block="lesen"
        lesen,
        //% block="3° links"
        links,
        //% block="3° rechts"
        rechts,
        //% block="90° gerade"
        gerade
    }

    let n_ServoButton = 16

    //% group="lenken mit Tasten A:links B:rechts" advanced=true
    //% block="Servo Winkel %i" weight=8
    export function setServoButton(i: eServoButton): number {
        if (i == eServoButton.links && n_ServoButton > 1)
            n_ServoButton--
        else if (i == eServoButton.rechts && n_ServoButton < 31)
            n_ServoButton++
        else if (i == eServoButton.gerade)
            n_ServoButton = 16

        return n_ServoButton
    }


} // s-advanced.ts
