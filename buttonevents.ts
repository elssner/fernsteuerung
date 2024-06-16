
namespace radio { // buttonevents.ts

    export let n_enableButtonFunkgruppe = false
    export let n_enableButtonSendReset = false

    export let n_sendReset = false



    //% group="calliope-net.github.io/fernsteuerung" subcategory="Bluetooth"
    //% block="mit 'A B halten' Funkgruppe ändern %enable" weight=7
    //% enable.shadow="toggleYesNo"
    export function enableButtonFunkgruppe(enable: boolean) { n_enableButtonFunkgruppe = enable }




    // ========== BUTTON EVENTS "halten"

    // wenn Knopf A halten
    input.onButtonEvent(Button.A, ButtonEvent.Hold, function () {
        if (n_enableButtonFunkgruppe && !(input.buttonIsPressed(Button.B))) {
            if (!between(n_funkgruppe, 0xA1, 0xBF))
                n_funkgruppe = 0xA2
            radio.setGroup(--n_funkgruppe)
            plotBIN(n_funkgruppe - 0xA0, 1)
        }
    })

    // wenn Knopf B halten
    input.onButtonEvent(Button.B, ButtonEvent.Hold, function () {
        if (n_enableButtonFunkgruppe && !(input.buttonIsPressed(Button.A))) {
            if (!between(n_funkgruppe, 0xA0, 0xBE))
                n_funkgruppe = 0xBE
            radio.setGroup(++n_funkgruppe)
            plotBIN(n_funkgruppe - 0xA0, 1)
        }
    })

    // wenn Knopf A+B halten
    input.onButtonEvent(Button.AB, ButtonEvent.Hold, function () {
        if (n_enableButtonSendReset)
            n_sendReset = true
    })

} // buttonevents.ts
