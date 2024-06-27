
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
        //% block="nur lesen"
        lesen,
        //% block="links"
        links,
        //% block="rechts"
        rechts,
        //% block="gerade"
        gerade
    }

    let n_ServoWinkel = 16

    //% group="lenken mit Tasten A:links B:rechts" advanced=true
    //% block="Servo Winkel %i" weight=8
    export function setServoButton(i: eServoButton): number {
        if (i == eServoButton.links && n_ServoWinkel > 1)
            n_ServoWinkel--
        else if (i == eServoButton.rechts && n_ServoWinkel < 31)
            n_ServoWinkel++
        else if (i == eServoButton.gerade)
            n_ServoWinkel = 16

        return n_ServoWinkel
    }


} // s-advanced.ts
