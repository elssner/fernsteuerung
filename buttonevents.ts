
namespace radio { // buttonevents.ts

    export let n_enableButtonFunkgruppe = false
    // n_funkgruppe in bluetooth.ts

    export let n_enableButtonSendReset = false
    export let n_sendReset = false // wird mit A+B halten true gesetzt; bei (bluetooth.ts) sendData false

    export let n_enableButtonGabelstapler = false
    export let n_Gabelstapler = false // wird mit A+B geklickt umgeschaltet, wenn n_enableButtonGabelstapler = true
    export let n_ServoGabelstapler = 0 // 1..16..31 mit A- B+ ändern

    // ========== BUTTON EVENTS "halten"

    // wenn Knopf A halten
    input.onButtonEvent(Button.A, ButtonEvent.Hold, function () {
        if (n_enableButtonFunkgruppe && !(input.buttonIsPressed(Button.B))) {
            if (!between(n_funkgruppe, 0xA1, 0xBF))
                n_funkgruppe = 0xA2
            radio.setGroup(--n_funkgruppe)
            //zeigeBIN(n_funkgruppe - 0xA0, ePlot.bin, 0)
        }
    })

    // wenn Knopf B halten
    input.onButtonEvent(Button.B, ButtonEvent.Hold, function () {
        if (n_enableButtonFunkgruppe && !(input.buttonIsPressed(Button.A))) {
            if (!between(n_funkgruppe, 0xA0, 0xBE))
                n_funkgruppe = 0xBE
            radio.setGroup(++n_funkgruppe)
            //zeigeBIN(n_funkgruppe - 0xA0, ePlot.bin, 0)
        }
    })

    // wenn Knopf A+B halten
    input.onButtonEvent(Button.AB, ButtonEvent.Hold, function () {
        if (n_enableButtonSendReset)
            n_sendReset = true
    })

    // wenn Knopf A+B geklickt
    input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
        if (n_enableButtonGabelstapler) {
            n_Gabelstapler = !n_Gabelstapler
            n_ServoGabelstapler = 16
        }
    })

    // wenn Knopf A geklickt
    input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
        if (n_enableButtonGabelstapler && n_Gabelstapler && n_ServoGabelstapler > 1)
            n_ServoGabelstapler--
    })

    // wenn Knopf B geklickt
    input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
        if (n_enableButtonGabelstapler && n_Gabelstapler && n_ServoGabelstapler < 31)
            n_ServoGabelstapler++
    })






    // ========== group="Button A+B" subcategory="Sender"

    //% group="Button A+B" subcategory="Sender"
    //% block="mit 'A+B halten' Reset senden %enable" weight=6
    //% enable.shadow="toggleYesNo"
    export function enableButtonSendReset(enable: boolean) { n_enableButtonSendReset = enable } 


    //% group="Button A+B" subcategory="Sender"
    //% block="mit 'A+B A- B+ geklickt' M0\\|1 (Gabelstapler) %enable" weight=5
    //% enable.shadow="toggleYesNo"
    export function enableButtonMotor1(enable: boolean) { n_enableButtonGabelstapler = enable } 

    //% group="Button A+B" subcategory="Sender"
    //% block="M0 Fahren und Lenken \\| M1 Gabelstapler" weight=4
    export function getGabelstapler(enable: boolean) { return n_Gabelstapler } 


    //% group="Button A+B" subcategory="Sender"
    //% block="Gabelstapler A- B+ (1 ↖ 16 ↗ 31)" weight=3
    export function getServoGabelstapler(enable: boolean) { return n_ServoGabelstapler } 





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




} // buttonevents.ts
