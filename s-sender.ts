
//% color=#008CE3 icon="\uf012" block="Sender" weight=95
namespace sender {
    //radio: color=#E3008C weight=96 icon="\uf012" groups='["Group", "Broadcast", "Send", "Receive"]'
    // BF3F7F




    //% group="calliope-net.github.io/fernsteuerung"
    //% block="beim Start || Funkgruppe %funkgruppe" weight=8
    //% funkgruppe.min=160 funkgruppe.max=191 funkgruppe.defl=175
    //% inlineInputMode=inline
    export function beimStart(funkgruppe = 175) {

        
        radio.beimStart(funkgruppe) // setzt auch n_start true, muss deshalb zuletzt stehen
    }



    // ========== group="Button A+B" subcategory="Sender"

    //% group="00 Sender" subcategory="Sender"
    //% block="%buffer M0 Fahren und Lenken" weight=5
    //% buffer.shadow="radio_sendBuffer19"
    export function sendM0(buffer: Buffer) {
        radio.setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.m0, radio.eBufferOffset.b0_Motor, joystickValue(eJoystickValue.xmotor))
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.m0, radio.eBufferOffset.b1_Servo, joystickValue(eJoystickValue.servo16))
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.m0, true)
    }

    //% group="00 Sender" subcategory="Sender"
    //% block="%buffer M0 Fahren M1 Gabelstapler A- B+ Lenken || * %prozent \\%" weight=4
    //% buffer.shadow="radio_sendBuffer19"
    //% prozent.min=10 prozent.max=100 prozent.defl=100
    export function sendM01(buffer: Buffer, prozent = 100) {
        radio.setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.m0, radio.eBufferOffset.b0_Motor, radio.motorProzent(joystickValue(eJoystickValue.xmotor), prozent))
        //radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.m0, radio.eBufferOffset.b1_Servo, getServoGabelstapler())
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.m1, radio.eBufferOffset.b0_Motor, joystickValue(eJoystickValue.ymotor))
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.m0, true)
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.m1, true)
    }

    //% group="00 Sender" subcategory="Sender"
    //% block="%buffer MA Seilrolle MB Drehkranz" weight=3
    //% buffer.shadow="radio_sendBuffer19"
    export function sendMAB(buffer: Buffer) {
        radio.setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.ma, radio.eBufferOffset.b0_Motor, joystickValue(eJoystickValue.xmotor))
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.mb, radio.eBufferOffset.b0_Motor, joystickValue(eJoystickValue.ymotor))
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.ma, true)
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.mb, true)
    }

    //% group="00 Sender" subcategory="Sender"
    //% block="%buffer MC Zahnstange MB Drehkranz" weight=2
    //% buffer.shadow="radio_sendBuffer19"
    export function sendMCB(buffer: Buffer) {
        radio.setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.mc, radio.eBufferOffset.b0_Motor, joystickValue(eJoystickValue.xmotor))
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.mb, radio.eBufferOffset.b0_Motor, joystickValue(eJoystickValue.ymotor))
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.mc, true)
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.mb, true)
    }

}
