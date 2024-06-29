
namespace sender { // s-buttonevents.ts

    //export let n_enableButtonFunkgruppe = false
    // n_funkgruppe in bluetooth.ts

    let n_enableButtonSendReset = false
    export let n_sendReset = false // wird mit A+B halten true gesetzt; bei (bluetooth.ts) sendData false

    let n_enableButtonGabelstapler = false
    let n_Gabelstapler = false // wird mit A+B geklickt umgeschaltet, wenn n_enableButtonGabelstapler = true
    let n_ServoGabelstapler = 0 // 1..16..31 mit A- B+ ändern

    // ========== BUTTON EVENTS "halten"
    /* 
        function aHold() {
    
            let a = 0
    
            // wenn Knopf A halten
            input.onButtonEvent(Button.A, ButtonEvent.Hold, function () {
                if (n_enableButtonFunkgruppe && !(input.buttonIsPressed(Button.B))) {
                    if (!radio.between(radio.n_funkgruppe, 0xA1, 0xBF))
                        radio.n_funkgruppe = 0xA2
                    radio.setGroup(--radio.n_funkgruppe)
                    //zeigeBIN(n_funkgruppe - 0xA0, ePlot.bin, 0)
                 if(a==0){}
                }
            })
        }
     */
    /* 
        // wenn Knopf A halten
        input.onButtonEvent(Button.A, ButtonEvent.Hold, function () {
            if (n_enableButtonFunkgruppe && !(input.buttonIsPressed(Button.B))) {
                if (!radio.between(radio.n_funkgruppe, 0xA1, 0xBF))
                    radio.n_funkgruppe = 0xA2
                radio.setGroup(--radio.n_funkgruppe)
                //zeigeBIN(n_funkgruppe - 0xA0, ePlot.bin, 0)
            }
        })
    
        // wenn Knopf B halten
        input.onButtonEvent(Button.B, ButtonEvent.Hold, function () {
            if (n_enableButtonFunkgruppe && !(input.buttonIsPressed(Button.A))) {
                if (!radio.between(radio.n_funkgruppe, 0xA0, 0xBE))
                    radio.n_funkgruppe = 0xBE
                radio.setGroup(++radio.n_funkgruppe)
                //zeigeBIN(n_funkgruppe - 0xA0, ePlot.bin, 0)
            }
        })
     */
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
    input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
        if (n_enableButtonGabelstapler && n_Gabelstapler && n_ServoGabelstapler < 31)
            n_ServoGabelstapler++
    })






    // ========== group="Button A+B" subcategory="Sender"

    //% group="Button A+B"
    //% block="mit 'A+B halten' Reset senden %enable" weight=6
    //% enable.shadow="toggleYesNo"
    export function enableButtonSendReset(enable: boolean) { n_enableButtonSendReset = enable }


    //% group="Button A+B"
    //% block="mit 'A+B A- B+ geklickt' M0\\|M1 (Gabelstapler) %enable" weight=5
    //% enable.shadow="toggleYesNo"
    export function enableButtonMotor1(enable: boolean) { n_enableButtonGabelstapler = enable }

    //% group="Button A+B"
    //% block="M0 Fahren und Lenken \\| M1 Gabelstapler" weight=4
    export function getGabelstapler() { return n_Gabelstapler }


    //% group="Button A+B"
    //% block="Gabelstapler A- B+ (1 ↖ 16 ↗ 31)" weight=3
    export function getServoGabelstapler() { return n_ServoGabelstapler }





} // s-buttonevents.ts
