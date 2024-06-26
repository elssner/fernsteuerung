//% color=#008272 icon="\uf012" block="Empfänger" weight=94
namespace receiver { // r-receiver.ts
    //radio: color=#E3008C weight=96 icon="\uf012" groups='["Group", "Broadcast", "Send", "Receive"]'

    // PINs
    const c_pinServo: AnalogPin = 108 // v3 AnalogPin.C8 GPIO1 // 5V fischertechnik 132292 Servo
    //const c_pinServo = c_pinServov3// <AnalogPin><number>DigitalPin.C8
    const c_pinEncoder = DigitalPin.P2        // 5V fischertechnik 186175 Encodermotor Competition

    export enum eMotor01 { M0, M1, M0_M1 } // muss mit v3 identisch sein



    //const c_Simulator: boolean = ("€".charCodeAt(0) == 8364)
    // let n_ready = false
    //   let n_StatusChanged = false
    let n_StatusString = ""

    const c_MotorStop = 128
    // export let n_MotorChipReady = false
    //  let n_MotorPower = false    // aktueller Wert im Chip Motor Power
    let n_Motor0 = c_MotorStop  // aktueller Wert im Chip
    let n_Motor1 = c_MotorStop  // aktueller Wert im Chip

    export const c_Servo_geradeaus = 90
    let n_ServoGeradeaus = c_Servo_geradeaus // Winkel für geradeaus wird beim Start eingestellt
    let n_ServoWinkel = c_Servo_geradeaus // aktuell eingestellter Winkel



    //% group="calliope-net.github.io/fernsteuerung"
    //% block="beim Start Servo ↑ %servoGeradeaus ° || Funkgruppe %funkgruppe mit 'A- B+ halten' Funkgruppe ändern %bFunkgruppe" weight=8
    //% servoGeradeaus.min=81 servoGeradeaus.max=99 servoGeradeaus.defl=90
    //% funkgruppe.min=160 funkgruppe.max=191 funkgruppe.defl=175
    //% bFunkgruppe.shadow="toggleYesNo"
    //% inlineInputMode=inline
    export function beimStart(servoGeradeaus: number, funkgruppe = 175, bFunkgruppe = false) {
        // n_ready = false // CaR4 ist nicht bereit: Schleifen werden nicht abgearbeitet

        pinRelay(true) // Relais an schalten

        n_ServoGeradeaus = servoGeradeaus // Parameter
        pins.servoWritePin(c_pinServo, n_ServoGeradeaus)

        pins.setPull(c_pinEncoder, PinPullMode.PullUp) // Encoder PIN Eingang PullUp

        //  n_ready = motorReset(ei2cMotor.i2cMotorAB) && motorReset(ei2cMotor.i2cMotorCD)
        //if (qMotorReset())
        qMotorReset() // true wenn qwiicmotor bereit, false wenn Kran nicht angeschlossen

        // in Erweiterung fernsteuerung bluetooth.ts:
        radio.beimStart(funkgruppe, bFunkgruppe) // setzt auch n_start true

        //radio.zeigeBIN(funkgruppe, radio.ePlot.hex, 1)
        //  addStatus(n_ready)
    }


    // group="calliope-net.github.io/mkc-63"
    // block="Car bereit" weight=6
    /* export function carReady() {
        return n_ready && motorStatus(ei2cMotor.i2cMotorAB) && motorStatus(ei2cMotor.i2cMotorCD)
    } */


    // ========== group="Motor"

    //% group="Motor"
    //% block="Motor Power %pON" weight=7
    //% pON.shadow="toggleOnOff"
    /*  function motorPower(pON: boolean) { // sendet nur wenn der Wert sich ändert
        // if (motorStatus() && (pON !== n_MotorON)) { // !== XOR eine Seite ist true aber nicht beide
        if (pON !== n_MotorPower) {
            //motors.dualMotorPower(Motor.M0_M1, 0)
            n_MotorPower = pON
            if (!n_MotorPower && n_Motor0 != c_MotorStop)
                motors.dualMotorPower(Motor.M0, 0)
            if (!n_MotorPower && n_Motor1 != c_MotorStop)
                motors.dualMotorPower(Motor.M1, 0)
        }
    } */
    // pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([DRIVER_ENABLE, n_MotorON ? 0x01 : 0x00]))



    //% group="Motor"
    //% block="Motor %motor (1 ↓ 128 ↑ 255) %speed (128 ist STOP)" weight=6
    //% speed.min=0 speed.max=255 speed.defl=128
    export function motor255(motor: eMotor01, speed: number) { // sendet nur an MotorChip, wenn der Wert sich ändert
        //  if (n_MotorPower) {
        if (radio.between(speed, 1, 255)) {
            //let duty_percent = (speed == c_MotorStop ? 0 : Math.map(speed, 1, 255, -100, 100))
            //            let duty_percent = Math.round(Math.map(speed, 1, 255, -100, 100))
            let duty_percent = radio.mapInt32(speed, 1, 255, -100, 100)
            //n_StatusString = duty_percent.toString()

            if (motor == eMotor01.M0 && speed != n_Motor0) {
                n_Motor0 = speed
                motors.dualMotorPower(<number>motor, duty_percent)
            }
            else if (motor == eMotor01.M1 && speed != n_Motor1) {
                n_Motor1 = speed
                motors.dualMotorPower(<number>motor, duty_percent)
            }
            else if (motor == eMotor01.M0_M1 && (speed != n_Motor0 || speed != n_Motor1)) {
                n_Motor0 = speed
                n_Motor1 = speed
                motors.dualMotorPower(<number>motor, duty_percent)
            }
        } else { // n_MotorPower false oder speed=0
            motor255(motor, c_MotorStop) // 128

            //n_Motor0 = c_MotorStop
            //n_Motor1 = c_MotorStop
            //motors.dualMotorPower(Motor.M0_M1, 0)
        }
    }


    // group="Motor"
    // block="Motor %motor (1 ↓ 128 ↑ 255)" weight=3
    export function motor_get(motor: eMotor01) {
        if (motor == eMotor01.M1)
            return n_Motor1
        else
            return n_Motor0
    }


    // ========== group="Servo"

    //% group="Servo"
    //% block="Servo (135° ↖ 90° ↗ 45°) %winkel °" weight=4
    //% winkel.min=45 winkel.max=135 winkel.defl=90
    export function servo_set90(winkel: number) {
        // Richtung ändern: 180-winkel
        // (0+14)*3=42 keine Änderung, gültige Werte im Buffer 1-31  (1+14)*3=45  (16+14)*3=90  (31+14)*3=135
        if (radio.between(winkel, 45, 135) && n_ServoWinkel != winkel) {
            n_ServoWinkel = winkel
            pins.servoWritePin(c_pinServo, winkel + n_ServoGeradeaus - c_Servo_geradeaus)
        }
    }

    //% group="Servo"
    //% block="Servo (1 ↖ 16 ↗ 31) %winkel" weight=3
    //% winkel.min=1 winkel.max=31 winkel.defl=16
    export function servo_set16(winkel: number) {
        if (radio.between(winkel, 1, 31))
            // Formel: (x+14)*3
            // winkel 1..16..31 links und rechts tauschen (32-winkel) 32-1=31 32-16=16 32-31=1
            // winkel 31..16..1
            // 32+14=46 46-1=45     46-16=30    46-31=15
            //          45*3=135    30*3=90     15*3=45
            servo_set90((46 - winkel) * 3)  // 1->135 16->90 31->45
        //  servo_set90((14 + winkel) * 3)  // 1->135 16->90 31->45
        else
            servo_set90(90)
    }


    // group="Servo"
    // block="Servo (135° ↖ 90° ↗ 45°)" weight=2
    function servo_get() { return n_ServoWinkel }



    // ========== group="Status zurück senden"

    //% group="Status zurück senden"
    //% block="Status += any %pStatus" weight=6
    export function addStatus(pStatus: any) {
        n_StatusString += " " + convertToText(pStatus)
    }

    //% group="Status zurück senden"
    //% block="Status += hex %pStatus" weight=5
    export function addStatusHEX(pStatus: number) {
        n_StatusString += " " + Buffer.fromArray([pStatus]).toHex()
    }

    //% group="Status zurück senden"
    //% block="Status Änderung" weight=4
    export function chStatus(): boolean { return n_StatusString.length > 0 }

    //% group="Status zurück senden"
    //% block="Status Text || löschen %clear" weight=3
    //% clear.shadow="toggleYesNo"
    //% clear.defl=1
    export function getStatus(clear = true) {
        let s = n_StatusString
        if (clear)
            n_StatusString = ""
        return "1" + s
    }




} // r-receiver.ts
