
//% color=#008CE3 icon="\uf012" block="Sender" weight=95
namespace sender {
    //radio: color=#E3008C weight=96 icon="\uf012" groups='["Group", "Broadcast", "Send", "Receive"]'
    // BF3F7F
    // ========== group="Button A+B" subcategory="Sender"

    //% group="Sender" subcategory="Sender"
    //% block="%buffer M0 Fahren und Lenken || 128 ± %p128 max ± %pmax" weight=5
    //% buffer.shadow="radio_sendBuffer19"
    //% p128.min=0 p128.max=8 
    //% pmax.min=0 pmax.max=20
    export function sendM0(buffer: Buffer, p128 = 0, pmax = 0) {
        radio.setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.m0, radio.eBufferOffset.b0_Motor, radio.joystickValue(radio.eJoystickValue.xmotor, p128))
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.m0, radio.eBufferOffset.b1_Servo, radio.joystickValue(radio.eJoystickValue.servo16, p128, pmax))
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.m0, true)
    }

}
