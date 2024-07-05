
namespace receiver { // r-callibot.ts


    // ========== I²C ==========
    //export enum eADDR {
    //    CB2_x22 = 0x22 //, WR_MOTOR_x20 = 0x20, WR_LED_x21 = 0x21, RD_SENSOR_x21
    //}
    const i2cCallibot2_x22 = 0x22

    let n_CallibotConnected = true // I²C Device ist angesteckt
    let n_c2MotorPower = true
    let qFernsteuerungStop: boolean = false

    export let n_c2EncoderFaktor = 31.25 // Impulse = 31.25 * Fahrstrecke in cm


    // ========== group="Reset"

    //% group="Reset" subcategory="Calli:bot"
    //% block="c2 alles aus Motor, LEDs, Servo"
    export function c2RESET_OUTPUTS() {
        i2cWriteBuffer(Buffer.fromArray([ec2Register.RESET_OUTPUTS]))
        n_c2MotorPower = false
    }



    // ========== group="Motor (Call:bot 2E)" subcategory="Calli:bot"

    //% group="Motor (Call:bot 2E)" subcategory="Calli:bot"
    //% block="Motor c2 (1 ↓ 128 ↑ 255) %speed (128 ist STOP)" weight=9
    //% speed.min=0 speed.max=255 speed.defl=128
    export function c2Motor255(speed: number) {
        let pwm: number, richtung: number

        if (radio.between(speed, 129, 255)) { // vorwärts
            pwm = radio.mapInt32(speed, 128, 255, 0, 255)
            richtung = 0
            // basic.setLedColor(Colors.Red)
        }
        else if (radio.between(speed, 1, 127)) { // rückwärts
            pwm = radio.mapInt32(speed, 1, 128, 255, 0)
            richtung = 1
            // basic.setLedColor(Colors.Green)
        }
        else { // wenn speed 0, 128 oder mehr als 8 Bit
            pwm = 0
            richtung = 0
            //  basic.setLedColor(Colors.White)
        }
        i2cWriteBuffer(Buffer.fromArray([ec2Register.SET_MOTOR, ec2Motor.beide, richtung, pwm, richtung, pwm]))
        //  return pwm
    }



    //% group="Motor (Call:bot 2E)" subcategory="Calli:bot"
    //% block="Motoren links %pPWM1 (1 ↓ 128 ↑ 255) %pRichtung1 rechts %pPWM2 %pRichtung2" weight=2
    //% pwm1.min=0 pwm1.max=255 pwm1.defl=128 pwm2.min=0 pwm2.max=255 pwm2.defl=128
    //% inlineInputMode=inline
    function c2SetMotoren(pwm1: number, pRichtung1: eDirection, pwm2: number, pRichtung2: eDirection) {
        if (radio.between(pwm1, 0, 255) && radio.between(pwm2, 0, 255))
            i2cWriteBuffer(Buffer.fromArray([ec2Register.SET_MOTOR, ec2Motor.beide, pRichtung1, pwm1, pRichtung2, pwm2]))
        else // falscher Parameter -> beide Stop
            i2cWriteBuffer(Buffer.fromArray([ec2Register.SET_MOTOR, ec2Motor.beide, 0, 0, 0, 0]))
    }











    // ========== group="Fernsteuerung Motor (0 .. 128 .. 255) fahren und lenken"

    //% group="Fernsteuerung (0..128..255) fahren und lenken" subcategory="Calli:bot"
    //% block="fahre mit Joystick h255 %joyHorizontal v255 %joyVertical p (1..8) %joyProzent || blinken %blink Stoßstange %stStange Entfernung %cm cm" weight=6
    //% joyProzent.min=0 joyProzent.max=8
    //% blink.shadow="toggleYesNo" blink.defl=1
    //% stStange.shadow="toggleYesNo"
    //% cm.min=1 cm.max=50
    //% inlineInputMode=inline
    export function fahreJoystick(joyHorizontal: number, joyVertical: number, joyProzent: number, blink = true, stStange = false, cm?: number) {
        let blinkColor = 0x0000FF
        //let joyBuffer32 = Buffer.create(4)
        //joyBuffer32.setNumber(NumberFormat.UInt32LE, 0, pUInt32LE)

        // Buffer[0] Register 3: Horizontal MSB 8 Bit (0 .. 128 .. 255)
        //    let joyHorizontal = joyBuffer32.getUint8(0)
        //    if (0x7C < joyHorizontal && joyHorizontal < 0x83) joyHorizontal = 0x80 // off at the outputs

        // Buffer[1] Register 5: Vertical MSB 8 Bit (0 .. 128 .. 255)
        //    let joyVertical = joyBuffer32.getUint8(1)
        //    if (0x7C < joyVertical && joyVertical < 0x83) joyVertical = 0x80 // off at the outputs

        // Buffer[2] 
        //    let joyProzent = joyBuffer32.getUint8(2) // (0 .. 100)


        // Motor Power ON ...
        /* if (joyBuffer32.getUint8(3) == 1)
            n_c2MotorPower = true // Motor Power ON
        else if (n_c2MotorPower)
            c2RESET_OUTPUTS() // motorPower = false
 */

        // fahren
        let fahren_minus255_0_255: number //= change(joyHorizontal) // (0.. 128.. 255) -> (-255 .. 0 .. +255)
        let signed_128_0_127 = sign(joyHorizontal)
        if (signed_128_0_127 < 0)
            fahren_minus255_0_255 = 2 * (128 + signed_128_0_127) // (u) 128 .. 255 -> (s) -128 .. -1  ->   0 .. 127
        else
            fahren_minus255_0_255 = -2 * (127 - signed_128_0_127) // (u)   0 .. 127 -> (s)    0 .. 127 -> 127 ..   0

        // minus ist rückwärts
        let fahren_Richtung: eDirection = (fahren_minus255_0_255 < 0 ? eDirection.r : eDirection.v)

        let fahren_0_255 = Math.abs(fahren_minus255_0_255)

        if (fahren_Richtung == eDirection.r) {
            qFernsteuerungStop = false
        }
        // wenn Stoßstange r oder l, dann nicht vorwärts fahren
        /* else if (fahren_Richtung == eDirection.v && stStange) {
            if (!qFernsteuerungStop) i2cReadINPUTS() // i2c Sensoren nur lesen, wenn nicht Stop
            if (bitINPUTS(eINPUTS.st4e)) {
                qFernsteuerungStop = true
                fahren_0_255 = 0
                blinkColor = 0xFFFF00
            }
        } */

        // wenn Entfernung angegeben und kleiner, dann nicht vorwärts fahren
        /* else if (fahren_Richtung == eDirection.v && cm != undefined) {
            if (!qFernsteuerungStop) i2cReadINPUT_US() // i2c Sensoren nur lesen, wenn nicht Stop
            if (bitINPUT_US(eVergleich.lt, cm)) {
                qFernsteuerungStop = true
                fahren_0_255 = 0
                blinkColor = 0xFF00FF
            }
        } */


        // max Geschwindigkeit wenn Buffer[2] (10 .. 100)
        if (radio.between(joyProzent, 1, 8)) {
            fahren_0_255 *= (joyProzent + 1) / 10 // (0,2 .. 0,9)
        }

        let fahren_links = fahren_0_255
        let fahren_rechts = fahren_0_255



        // lenken
        let lenken_255_0_255 = sign(joyVertical)
        let lenken_100_50 = Math.round(Math.map(Math.abs(lenken_255_0_255), 0, 128, 50, 100))

        // lenken Richtung
        if (lenken_255_0_255 < 0) // minus ist rechts
            fahren_rechts = Math.round(fahren_rechts * lenken_100_50 / 100)
        else
            fahren_links = Math.round(fahren_links * lenken_100_50 / 100)

        if (n_c2MotorPower)
            c2SetMotoren(fahren_links, fahren_Richtung, fahren_rechts, fahren_Richtung)

        /* if (blink) {
            setRgbLed3(blinkColor, true, true, true, true, true)
        } */

        /* if (qLogEnabled) {
            qLog = ["", ""] // init Array 2 Elemente
            qLog[0] = format4r(joyHorizontal)
                + format4r(fahren_minus255_0_255)
                + format4r(fahren_links)
                + format4r(fahren_rechts)
            qLog[1] = format4r(joyVertical)
                + format4r(lenken_255_0_255)
                + format4r(lenken_100_50)
                + " " + fahren_Richtung.toString().substr(0, 1)
                + " " + qFernsteuerungPower.toString().substr(0, 1)
            //+ " " + format(fahren_Richtung, 1)
            //+ " " + format(motorPower, 1)
        } */

    }






















    // ========== group="Encoder 2*32 Bit [l,r]" subcategory="Calli:bot"

    //% group="Encoder 2*32 Bit [l,r]" subcategory="Calli:bot"
    //% block="Encoder Zähler löschen"
    export function c2ResetEncoder() {
        i2cWriteBuffer(Buffer.fromArray([ec2Register.RESET_ENCODER, ec2Motor.beide]))
    }

    //% group="Encoder 2*32 Bit [l,r]" subcategory="Calli:bot"
    //% block="Encoder Werte [l,r]"
    export function c2EncoderValues(): number[] {
        i2cWriteBuffer(Buffer.fromArray([ec2Register.GET_ENCODER_VALUE]))
        return i2cReadBuffer(9).slice(1, 8).toArray(NumberFormat.Int32LE)
    }





    // ========== I²C nur diese Datei Callibot

    function i2cWriteBuffer(bu: Buffer) { // repeat funktioniert nicht bei Callibot
        if (n_CallibotConnected) {
            n_CallibotConnected = pins.i2cWriteBuffer(i2cCallibot2_x22, bu) == 0

            if (!n_CallibotConnected)
                basic.showNumber(i2cCallibot2_x22)
        }
        return n_CallibotConnected
    }

    function i2cReadBuffer(size: number): Buffer { // repeat funktioniert nicht bei Callibot
        if (n_CallibotConnected)
            return pins.i2cReadBuffer(i2cCallibot2_x22, size)
        else
            return Buffer.create(size)
    }

    function sign(i: number, e: number = 7): number {
        if (i < 2 ** e) return i
        else return -((~i & ((2 ** e) - 1)) + 1)
    }

    enum ec2Register {
        // Write
        RESET_OUTPUTS = 0x01, // Alle Ausgänge abschalten (Motor, LEDs, Servo)
        SET_MOTOR = 0x02, // Bit0: 1=Motor 1 setzen;  Bit1: 1=Motor 2 setzen
        /*
Bit0: 1=Motor 1 setzen;  Bit1: 1=Motor 2 setzen
wenn beide auf 11, dann Motor2 Daten nachfolgend senden (also 6 Bytes) Richtung (0:vorwärts, 1:rückwärts) von Motor 1 oder 2
PWM (0..255) Motor 1 oder 2
wenn in [1] Motor 1 & Motor 2 aktiviert
Richtung (0:vorwärts, 1:rückwärts) von Motor 2
PWM rechts (0..255) von Motor 2
        */
        SET_LED = 0x03, // Write: LED´s
        RESET_ENCODER = 0x05, // 2 Byte [0]=5 [1]= 1=links, 2=rechts, 3=beide
        // Read
        GET_INPUTS = 0x80, // Digitaleingänge (1 Byte 6 Bit)
        GET_INPUT_US = 0x81, // Ultraschallsensor (3 Byte 16 Bit)
        GET_FW_VERSION = 0x82, // Typ & Firmwareversion & Seriennummer (10 Byte)
        GET_POWER = 0x83, // Versorgungsspannung [ab CalliBot2E] (3 Byte 16 Bit)
        GET_LINE_SEN_VALUE = 0x84, // Spursensoren links / rechts Werte (5 Byte 2x16 Bit)
        GET_ENCODER_VALUE = 0x91 // 9 Byte links[1-4] rechts [5-8] 2* INT32BE mit Vorzeichen
    }


    export enum ec2Motor {
        //% block="beide"
        beide = 0b11,
        //% block="links"
        m1 = 0b01,
        //% block="rechts"
        m2 = 0b10
    }

    export enum ec2RL { rechts = 0, links = 1 } // Index im Array

    enum eDirection {
        //% block="vorwärts"
        v = 0,
        //% block="rückwärts"
        r = 1
    }

} // r-callibot.ts
