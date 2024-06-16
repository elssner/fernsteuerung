
namespace radio { // buttonevents.ts

    let n_enableButtonFunkgruppe = false
    let n_enableButtonSendReset = false

    let n_sendReset = false


    //% group="calliope-net.github.io/fernsteuerung" subcategory="Bluetooth"
    //% block="mit 'A B halten' Funkgruppe ändern %enable" weight=7
    //% enable.shadow="toggleYesNo"
    export function enableButtonFunkgruppe(enable: boolean) { n_enableButtonFunkgruppe = enable }


    //% group="calliope-net.github.io/fernsteuerung" subcategory="Bluetooth"
    //% block="mit 'A+B halten' Reset senden %enable" weight=6
    //% enable.shadow="toggleYesNo"
    export function enableButtonSendReset(enable: boolean) { n_enableButtonSendReset = enable }


    //% group="calliope-net.github.io/fernsteuerung" subcategory="Bluetooth"
    //% block="send Reset || Status löschen %clear" weight=4
    //% clear.shadow="toggleOnOff" clear.defl=1
    export function sendReset(clear = true): boolean {
        if (n_sendReset && clear)
            n_sendReset = false
        return n_sendReset
    }



    // ========== BUTTON EVENTS "halten"

    // wenn Knopf A halten
    input.onButtonEvent(Button.A, ButtonEvent.Hold, function () {
        if (n_enableButtonFunkgruppe && !(input.buttonIsPressed(Button.B))) {
            if (n_funkgruppe > 0xA1) {
                n_funkgruppe--
                radio.setGroup(n_funkgruppe)
                plot25LED(n_funkgruppe - 0xA0, 3)
            }
        }
        basic.setLedColor(Colors.Red)
    })

    // wenn Knopf B halten
    input.onButtonEvent(Button.B, ButtonEvent.Hold, function () {
        if (n_enableButtonFunkgruppe && !(input.buttonIsPressed(Button.A))) {
            if (n_funkgruppe < 0xBE) {
                n_funkgruppe++
                radio.setGroup(n_funkgruppe)
                plot25LED(n_funkgruppe - 0xA0, 3)
            }
        }
        basic.setLedColor(Colors.Blue)
    })

    // wenn Knopf A+B halten
    input.onButtonEvent(Button.AB, ButtonEvent.Hold, function () {
        if (n_enableButtonSendReset)
            n_sendReset = true
    })

} // buttonevents.ts
