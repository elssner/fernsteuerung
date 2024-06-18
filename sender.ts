
namespace radio { // sender.ts


    // ========== group="Button A+B" subcategory="Sender"

    //% group="Sender" subcategory="Sender"
    //% block="%buffer M0 Fahren und Lenken || 128 ± %p128 max ± %pmax" weight=5
    //% buffer.shadow="radio_sendBuffer19"
    //% p128.min=0 p128.max=8 
    //% pmax.min=0 pmax.max=20
    export function sendM0(buffer: Buffer, p128 = 0, pmax = 0) {
        setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        setByte(radio_sendBuffer19(), eBufferPointer.m0, eBufferOffset.b0_Motor, joystickValue(eJoystickValue.xmotor, p128))
        setByte(radio_sendBuffer19(), eBufferPointer.m0, eBufferOffset.b1_Servo, joystickValue(eJoystickValue.servo16, p128, pmax))
        setaktiviert(radio_sendBuffer19(), e3aktiviert.m0, true)
    }

    //% group="Sender" subcategory="Sender"
    //% block="%buffer M0 Fahren M1 Gabelstapler A- B+ Lenken || 128 ± %p128 * %prozent \\%" weight=4
    //% buffer.shadow="radio_sendBuffer19"
    //% p128.min=0 p128.max=8 
    //% prozent.min=10 prozent.max=100 prozent.defl=100
    export function sendM01(buffer: Buffer, p128 = 0, prozent = 0) {
        setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        setByte(radio_sendBuffer19(), eBufferPointer.m0, eBufferOffset.b0_Motor, motorProzent(joystickValue(eJoystickValue.xmotor, p128), prozent))
        setByte(radio_sendBuffer19(), eBufferPointer.m1, eBufferOffset.b0_Motor, joystickValue(eJoystickValue.ymotor, p128))
        setByte(radio_sendBuffer19(), eBufferPointer.m0, eBufferOffset.b1_Servo, n_ServoGabelstapler)
        setaktiviert(radio_sendBuffer19(), e3aktiviert.m0, true)
        setaktiviert(radio_sendBuffer19(), e3aktiviert.m1, true)
    }

    //% group="Sender" subcategory="Sender"
    //% block="%buffer MA Seilrolle MB Drehkranz || 128 ± %p128" weight=3
    //% buffer.shadow="radio_sendBuffer19"
    //% p128.min=0 p128.max=8 
    export function sendMAB(buffer: Buffer, p128 = 0) {
        setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        setByte(radio_sendBuffer19(), eBufferPointer.ma, eBufferOffset.b0_Motor, joystickValue(eJoystickValue.xmotor, p128))
        setByte(radio_sendBuffer19(), eBufferPointer.mb, eBufferOffset.b0_Motor, joystickValue(eJoystickValue.ymotor, p128))
        setaktiviert(radio_sendBuffer19(), e3aktiviert.ma, true)
        setaktiviert(radio_sendBuffer19(), e3aktiviert.mb, true)
    }

    //% group="Sender" subcategory="Sender"
    //% block="%buffer MC Zahnstange MB Drehkranz || 128 ± %p128" weight=2
    //% buffer.shadow="radio_sendBuffer19"
    //% p128.min=0 p128.max=8 
    export function sendMCB(buffer: Buffer, p128 = 0) {
        setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        setByte(radio_sendBuffer19(), eBufferPointer.mc, eBufferOffset.b0_Motor, joystickValue(eJoystickValue.xmotor, p128))
        setByte(radio_sendBuffer19(), eBufferPointer.mb, eBufferOffset.b0_Motor, joystickValue(eJoystickValue.ymotor, p128))
        setaktiviert(radio_sendBuffer19(), e3aktiviert.mc, true)
        setaktiviert(radio_sendBuffer19(), e3aktiviert.mb, true)
    }


} // sender.ts
