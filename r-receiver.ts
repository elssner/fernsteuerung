//% color=#008272 icon="\uf012" block="Empfänger" weight=94
namespace receiver { // r-receiver.ts
    //radio: color=#E3008C weight=96 icon="\uf012" groups='["Group", "Broadcast", "Send", "Receive"]'

    export enum eModell {
        //% block="Calliope v3 (Maker Kit Car)"
        v3 = 0,     // Index in Arrays
        //% block="Calliope auf Rädern 4 (v1)"
        car4 = 1,   // Index in Arrays
        //% block="Calli:Bot 2 (v1 v2 v3)"
        calli2bot = 2
    }

    export let n_Modell = eModell.v3 // Index in Arrays:// 0:_Calliope v3 Pins_

    // Calliope v3 freie Pins: C8, C9, C12, C13, C14, C15
    export let a_PinRelay: DigitalPin[] = [109, DigitalPin.P0]     // 0:DigitalPin.C9 GPIO2
    let a_PinServo: AnalogPin[] = [108, AnalogPin.C4]       // 0:AnalogPin.C8 GPIO1
    export let a_PinLicht: DigitalPin[] = [112, DigitalPin.C7]    // 0:DigitalPin.C12 GPIO4 Jacdac
    export let a_PinEncoder: DigitalPin[] = [114, DigitalPin.P2]   // 0:DigitalPin.C14 SPI
    export let a_PinSpurrechts: DigitalPin[] = [113, DigitalPin.C9]// 0:DigitalPin.C13 SPI
    export let a_PinSpurlinks: DigitalPin[] = [115, DigitalPin.C11]// 0:DigitalPin.C15 SPI

    // CaR 4 Pins
    //export const pinRelay = DigitalPin.P0          // 5V Grove Relay
    //export const pinFototransistor = AnalogPin.P1  // GND fischertechnik 36134 Fototransistor
    //export const pinEncoder = DigitalPin.P2        // 5V fischertechnik 186175 Encodermotor Competition
    //export const pinBuzzer = DigitalPin.P3         // 5V Grove Buzzer
    //export const pinServo = AnalogPin.C4           // 5V fischertechnik 132292 Servo
    //const pin5 = DigitalPin.C5              // Draht blau
    //const pin6 = DigitalPin.C6              // Draht gelb
    //export const pinLicht = DigitalPin.C7          // 5V Licht
    export const c_PinUltraschall = DigitalPin.C8    // 5V Grove Ultrasonic
    //export const pinSpurrechts = DigitalPin.C9     // 9V fischertechnik 128598 IR-Spursensor
    //const pin10 = DigitalPin.C10
    //export const pinSpurlinks = DigitalPin.C11     // 9V fischertechnik 128598 IR-Spursensor



    // PINs
    //const c_pinServo: AnalogPin = 108 // v3 AnalogPin.C8 GPIO1 // 5V fischertechnik 132292 Servo
    //const c_pinServo = c_pinServov3// <AnalogPin><number>DigitalPin.C8
    //const c_pinEncoder = DigitalPin.P2        // 5V fischertechnik 186175 Encodermotor Competition

    export enum eMotor01 { M0, M1, M0_M1 } // muss mit v3 identisch sein



    //const c_Simulator: boolean = ("€".charCodeAt(0) == 8364)
    // let n_ready = false
    //   let n_StatusChanged = false
    // let n_StatusString = ""

    const c_MotorStop = 128
    // export let n_MotorChipReady = false
    //  let n_MotorPower = false    // aktueller Wert im Chip Motor Power
    let n_Motor0 = c_MotorStop  // aktueller Wert im Chip
    let n_Motor1 = c_MotorStop  // aktueller Wert im Chip

    export const c_Servo_geradeaus = 90
    let n_ServoGeradeaus = c_Servo_geradeaus // Winkel für geradeaus wird beim Start eingestellt
    let n_ServoWinkel = c_Servo_geradeaus // aktuell eingestellter Winkel

    // für Encoder r-pins-encoder.ts
    export function dualEncoderM0Richtung() {
        return n_Motor0 > c_MotorStop // true: vorwärts
    }
    export function dualEncoderM0Stop() {
        motor255(eMotor01.M0, c_MotorStop)
    }

    //% group="calliope-net.github.io/fernsteuerung"
    //% block="beim Start Modell: | %modell Servo ↑ ° %servoGeradeaus Encoder %encoder Funkgruppe (aus Flash lesen) | %storagei32" weight=8
    //% servoGeradeaus.min=81 servoGeradeaus.max=99 servoGeradeaus.defl=90
    //% encoder.shadow="toggleOnOff"
    //% storagei32.min=160 storagei32.max=191 storagei32.defl=175
    // inlineInputMode=inline
    export function beimStart(modell: eModell, servoGeradeaus: number, encoder: boolean, storagei32 = 175) {
        n_Modell = modell
        n_ServoGeradeaus = servoGeradeaus // Parameter

        pinRelay(true) // Relais an schalten (braucht gültiges n_Modell, um den Pin zu finden)

        radio.storageBufferSet(storagei32) // prüft ubd zeigt Funkgruppe an
        radio.zeigeFunkgruppe()

        pins.servoWritePin(a_PinServo[n_Modell], n_ServoGeradeaus)

        //  pins.setPull(a_PinEncoder[n_Modell], PinPullMode.PullUp) // Encoder PIN Eingang PullUp

        //  n_ready = motorReset(ei2cMotor.i2cMotorAB) && motorReset(ei2cMotor.i2cMotorCD)
        //if (qMotorReset())
        qMotorReset() // true wenn qwiicmotor bereit, false wenn Kran nicht angeschlossen

        if (encoder)
            startEncoder(n_Modell)

        radio.beimStartintern() // setzt auch n_start true, muss deshalb zuletzt stehen

        //radio.zeigeBIN(funkgruppe, radio.ePlot.hex, 1)
        //  addStatus(n_ready)
    }



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



    //% group="Motor 0 1 (Calliope v3)"
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
                dualMotorPower(motor, duty_percent)
            }
            else if (motor == eMotor01.M1 && speed != n_Motor1) {
                n_Motor1 = speed
                dualMotorPower(motor, duty_percent)
            }
            else if (motor == eMotor01.M0_M1 && (speed != n_Motor0 || speed != n_Motor1)) {
                n_Motor0 = speed
                n_Motor1 = speed
                dualMotorPower(motor, duty_percent)
            }
        } else { // n_MotorPower false oder speed=0
            motor255(motor, c_MotorStop) // 128

            //n_Motor0 = c_MotorStop
            //n_Motor1 = c_MotorStop
            //motors.dualMotorPower(Motor.M0_M1, 0)
        }
    }


    let onDualMotorPowerHandler: (motor: number, duty_percent: number) => void

    export function onDualMotorPower(cb: (motor: number, duty_percent: number) => void) {
        onDualMotorPowerHandler = cb
    }


    function dualMotorPower(motor: number, duty_percent: number) {
        if (onDualMotorPowerHandler)
            onDualMotorPowerHandler(motor, duty_percent) // v3 Ereignis Block auslösen, nur wenn benutzt
        //else
        //     basic.setLedColor(n_rgbled[0]) // v1 v2
    }


    // group="Motor"
    // block="Motor %motor (1 ↓ 128 ↑ 255)" weight=3
    /* export function motor_get(motor: eMotor01) {
        if (motor == eMotor01.M1)
            return n_Motor1
        else
            return n_Motor0
    } */


    // ========== group="Servo"

    //% group="Servo"
    //% block="Servo (135° ↖ 90° ↗ 45°) %winkel °" weight=4
    //% winkel.min=45 winkel.max=135 winkel.defl=90
    export function servo_set90(winkel: number) {
        // Richtung ändern: 180-winkel
        // (0+14)*3=42 keine Änderung, gültige Werte im Buffer 1-31  (1+14)*3=45  (16+14)*3=90  (31+14)*3=135
        if (radio.between(winkel, 45, 135) && n_ServoWinkel != winkel) {
            n_ServoWinkel = winkel
            pins.servoWritePin(a_PinServo[n_Modell], winkel + n_ServoGeradeaus - c_Servo_geradeaus)
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
    //function servo_get() { return n_ServoWinkel }




    // ========== group="RGB LEDs (v3)" subcategory="Aktoren"

    export enum eRGBled { a, b, c } // Index im Array
    let n_rgbled = [0, 0, 0] // speichert 3 LEDs, wenn nur eine geändert wird
    let n_rgbledtimer = input.runningTime() // ms seit Start, zwischen zwei Aufrufen ist eine Pause erforderlich


    // deklariert die Variable mit dem Delegat-Typ '(color1: number, color2: number, color3: number, brightness: number) => void'
    // ein Delegat ist die Signatur einer function mit den selben Parametern
    // es wird kein Wert zurück gegeben (void)
    // die Variable ist noch undefined, also keiner konkreten Funktion zugeordnet
    let onSetLedColorsHandler: (color1: number, color2: number, color3: number, brightness: number) => void


    // sichtbarer Event-Block; deprecated=true
    // wird bei v3 automatisch im Code r-aktoren-v3.ts aufgerufen und deshalb nicht als Block angezeigt

    //% group="RGB LEDs (Calliope v3)" deprecated=true
    //% block="SetLedColors" weight=9
    //% draggableParameters=reporter
    export function onSetLedColors(cb: (a: number, b: number, c: number, brightness: number) => void) {
        // das ist der sichtbare Ereignis Block 'SetLedColors (a, b, c, brightness)'
        // hier wird nur der Delegat-Variable eine konkrete callback function zugewiesen
        // dieser Block speichert in der Variable, dass er beim Ereignis zurückgerufen werden soll
        onSetLedColorsHandler = cb
        // aufgerufen wird in der function 'rgbLEDs' die der Variable 'onSetLedColorsHandler' zugewiesene function
        // das sind die Blöcke, die später im Ereignis Block 'SetLedColors (a, b, c, brightness)' enthalten sind
    }



    //% group="RGB LEDs (Calliope v3)"
    //% block="RGB LEDs %led %color %on || Helligkeit %helligkeit \\%" weight=6
    //% color.shadow="colorNumberPicker"
    //% on.shadow="toggleOnOff"
    //% helligkeit.min=5 helligkeit.max=100 helligkeit.defl=20
    //% inlineInputMode=inline 
    export function rgbLEDon(led: eRGBled, color: number, on: boolean, helligkeit = 20) {
        rgbLEDs(led, (on ? color : 0), false, helligkeit)
    }

    //% group="RGB LEDs (Calliope v3)"
    //% block="RGB LEDs %led %color blinken %blinken || Helligkeit %helligkeit \\%" weight=5
    //% color.shadow="colorNumberPicker"
    //% blinken.shadow="toggleYesNo"
    //% helligkeit.min=5 helligkeit.max=100 helligkeit.defl=20
    //% inlineInputMode=inline 
    export function rgbLEDs(led: eRGBled, color: number, blinken: boolean, helligkeit = 20) {
        if (blinken && n_rgbled[led] != 0)
            n_rgbled[led] = 0
        else
            n_rgbled[led] = color

        while (input.runningTime() < (n_rgbledtimer + 1)) { // mindestens 1 ms seit letztem basic.setLedColors warten
            control.waitMicros(100)
        }
        n_rgbledtimer = input.runningTime()  // ms seit Start

        //basic.setLedColors(n_rgbled[0], n_rgbled[1], n_rgbled[2])

        // die Variable 'onSetLedColorsHandler' ist normalerweise undefined, dann passiert nichts
        // die Variable erhält einen Wert, wenn der Ereignis Block 'onSetLedColors' einmal im Code vorkommt
        // der Wert der Variable 'onSetLedColorsHandler' ist die function, die bei true zurück gerufen wird
        // die function ruft mit den 4 Parametern die Blöcke auf, die im Ereignis-Block stehen
        if (onSetLedColorsHandler)
            onSetLedColorsHandler(n_rgbled[0], n_rgbled[1], n_rgbled[2], helligkeit) // v3 Ereignis Block auslösen, nur wenn benutzt
        else
            basic.setLedColor(n_rgbled[0]) // v1 v2
    }



} // r-receiver.ts
