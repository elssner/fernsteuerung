
//% color=#008CE3 icon="\uf012" block="Sender" weight=95
namespace sender {
    //radio: color=#E3008C weight=96 icon="\uf012" groups='["Group", "Broadcast", "Send", "Receive"]'
    // BF3F7F




    //% group="calliope-net.github.io/fernsteuerung"
    //% block="beim Start || Funkgruppe %funkgruppe" weight=8
    //% funkgruppe.min=160 funkgruppe.max=191 funkgruppe.defl=175
    //% bFunkgruppe.shadow="toggleYesNo"
    //% inlineInputMode=inline
    export function beimStart(funkgruppe = 175) {
        // n_ready = false // CaR4 ist nicht bereit: Schleifen werden nicht abgearbeitet
        /* 
                pinRelay(true) // Relais an schalten
        
                n_ServoGeradeaus = servoGeradeaus // Parameter
                pins.servoWritePin(c_pinServo, n_ServoGeradeaus)
        
                pins.setPull(c_pinEncoder, PinPullMode.PullUp) // Encoder PIN Eingang PullUp
        
                //  n_ready = motorReset(ei2cMotor.i2cMotorAB) && motorReset(ei2cMotor.i2cMotorCD)
                //if (qMotorReset())
                qMotorReset() // true wenn qwiicmotor bereit, false wenn Kran nicht angeschlossen
         */
        // in Erweiterung fernsteuerung bluetooth.ts:
        radio.beimStart(funkgruppe) // setzt auch n_start true

        //  addStatus(n_ready)
    }



    // ========== group="Button A+B" subcategory="Sender"

    //% group="00 Sender" subcategory="Sender"
    //% block="%buffer M0 Fahren und Lenken || 128 ± %p128 max ± %pmax" weight=5
    //% buffer.shadow="radio_sendBuffer19"
    //% p128.min=0 p128.max=8 
    //% pmax.min=0 pmax.max=20
    export function sendM0(buffer: Buffer, p128 = 0, pmax = 0) {
        radio.setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.m0, radio.eBufferOffset.b0_Motor, joystickValue(eJoystickValue.xmotor, p128))
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.m0, radio.eBufferOffset.b1_Servo, joystickValue(eJoystickValue.servo16, p128, pmax))
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.m0, true)
    }

    //% group="00 Sender" subcategory="Sender"
    //% block="%buffer M0 Fahren M1 Gabelstapler A- B+ Lenken || 128 ± %p128 * %prozent \\%" weight=4
    //% buffer.shadow="radio_sendBuffer19"
    //% p128.min=0 p128.max=8 
    //% prozent.min=10 prozent.max=100 prozent.defl=100
    export function sendM01(buffer: Buffer, p128 = 0, prozent = 100) {
        radio.setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.m0, radio.eBufferOffset.b0_Motor, radio.motorProzent(joystickValue(eJoystickValue.xmotor, p128), prozent))
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.m0, radio.eBufferOffset.b1_Servo, getServoGabelstapler())
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.m1, radio.eBufferOffset.b0_Motor, joystickValue(eJoystickValue.ymotor, p128))
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.m0, true)
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.m1, true)
    }

    //% group="00 Sender" subcategory="Sender"
    //% block="%buffer MA Seilrolle MB Drehkranz || 128 ± %p128" weight=3
    //% buffer.shadow="radio_sendBuffer19"
    //% p128.min=0 p128.max=8 
    export function sendMAB(buffer: Buffer, p128 = 0) {
        radio.setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.ma, radio.eBufferOffset.b0_Motor, joystickValue(eJoystickValue.xmotor, p128))
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.mb, radio.eBufferOffset.b0_Motor, joystickValue(eJoystickValue.ymotor, p128))
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.ma, true)
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.mb, true)
    }

    //% group="00 Sender" subcategory="Sender"
    //% block="%buffer MC Zahnstange MB Drehkranz || 128 ± %p128" weight=2
    //% buffer.shadow="radio_sendBuffer19"
    //% p128.min=0 p128.max=8 
    export function sendMCB(buffer: Buffer, p128 = 0) {
        radio.setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.mc, radio.eBufferOffset.b0_Motor, joystickValue(eJoystickValue.xmotor, p128))
        radio.setByte(radio.radio_sendBuffer19(), radio.eBufferPointer.mb, radio.eBufferOffset.b0_Motor, joystickValue(eJoystickValue.ymotor, p128))
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.mc, true)
        radio.setaktiviert(radio.radio_sendBuffer19(), radio.e3aktiviert.mb, true)
    }

}
