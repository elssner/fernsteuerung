
namespace radio { // sender.ts


    // ========== group="Button A+B" subcategory="Sender"

    //% group="Sender" subcategory="Sender"
    //% block="%buffer [1] Fahren und Lenken || 128 ± %p128 max ± %pmax" weight=6
    //% buffer.shadow="radio_sendBuffer19"
    //% p128.min=0 p128.max=8 
    //% pmax.min=0 pmax.max=20
    export function sendM0(buffer: Buffer, p128 = 0, pmax = 0) {
        setByte(radio_sendBuffer19(), eBufferPointer.m0, eBufferOffset.b0_Motor, joystickValue(eJoystickValue.xmotor, p128))
        setByte(radio_sendBuffer19(), eBufferPointer.m0, eBufferOffset.b1_Servo, joystickValue(eJoystickValue.servo16, p128, pmax))
        setaktiviert(radio_sendBuffer19(), e3aktiviert.m0, true)
    }



} // sender.ts
