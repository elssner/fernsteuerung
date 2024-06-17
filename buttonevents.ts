
namespace radio { // buttonevents.ts

    export let n_enableButtonFunkgruppe = false
    export let n_enableButtonSendReset = false

    export let n_sendReset = false



    // ========== BUTTON EVENTS "halten"

    // wenn Knopf A halten
    input.onButtonEvent(Button.A, ButtonEvent.Hold, function () {
        if (n_enableButtonFunkgruppe && !(input.buttonIsPressed(Button.B))) {
            if (!between(n_funkgruppe, 0xA1, 0xBF))
                n_funkgruppe = 0xA2
            radio.setGroup(--n_funkgruppe)
            zeigeBIN(n_funkgruppe - 0xA0, ePlot.bin, 0)
        }
    })

    // wenn Knopf B halten
    input.onButtonEvent(Button.B, ButtonEvent.Hold, function () {
        if (n_enableButtonFunkgruppe && !(input.buttonIsPressed(Button.A))) {
            if (!between(n_funkgruppe, 0xA0, 0xBE))
                n_funkgruppe = 0xBE
            radio.setGroup(++n_funkgruppe)
            zeigeBIN(n_funkgruppe - 0xA0, ePlot.bin, 0)
        }
    })

    // wenn Knopf A+B halten
    input.onButtonEvent(Button.AB, ButtonEvent.Hold, function () {
        if (n_enableButtonSendReset)
            n_sendReset = true
    })





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



} // buttonevents.ts
