
namespace receiver { // r-callibot.ts


    // ========== I²C ==========
    //export enum eADDR {
    //    CB2_x22 = 0x22 //, WR_MOTOR_x20 = 0x20, WR_LED_x21 = 0x21, RD_SENSOR_x21
    //}
    const i2cCallibot2_x22 = 0x22

    let n_Callibot2_x22Connected = true // I²C Device ist angesteckt
    // let n_c2MotorPower = true
    //  let qFernsteuerungStop: boolean = false

    export let n_c2EncoderFaktor = 31.25 // Impulse = 31.25 * Fahrstrecke in cm


    // ========== group="Reset"

    //% group="Reset" subcategory="Calli:bot"
    //% block="C Reset Motoren, LEDs" weight=4
    export function c2RESET_OUTPUTS() {
        i2cWriteBuffer(Buffer.fromArray([ec2Register.RESET_OUTPUTS]))
        // n_c2MotorPower = false
    }

    //% group="Reset" subcategory="Calli:bot"
    //% block="C Call:bot Typ [1]" weight=3
    export function c2Version() { // [1]=4:CB2(Gymnasium) =3:CB2E (=2:soll CB2 sein)
        i2cWriteBuffer(Buffer.fromArray([ec2Register.GET_FW_VERSION]))
        return i2cReadBuffer(10).toArray(NumberFormat.UInt8LE)
    }


    // ========== group="Motor (Call:bot 2E)" subcategory="Calli:bot"

    //% group="Motor (Call:bot 2E)" subcategory="Calli:bot"
    //% block="Motor c2 (1 ↓ 128 ↑ 255) %speed (128 ist STOP)" weight=9
    //% speed.min=0 speed.max=255 speed.defl=128
    /* export function c2Motor255(speed: number) {
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

    } */



    //% group="Motor (Call:bot 2E)" subcategory="Calli:bot"
    //% block="Motoren links %pPWM1 (1 ↓ 128 ↑ 255) %pRichtung1 rechts %pPWM2 %pRichtung2" weight=3
    //% pwm1.min=0 pwm1.max=255 pwm1.defl=128 pwm2.min=0 pwm2.max=255 pwm2.defl=128
    //% inlineInputMode=inline
    /* function c2SetMotoren(pwm1: number, pRichtung1: eDirection, pwm2: number, pRichtung2: eDirection) {
        if (radio.between(pwm1, 0, 255) && radio.between(pwm2, 0, 255))
            i2cWriteBuffer(Buffer.fromArray([ec2Register.SET_MOTOR, ec2Motor.beide, pRichtung1, pwm1, pRichtung2, pwm2]))
        else // falscher Parameter -> beide Stop
            i2cWriteBuffer(Buffer.fromArray([ec2Register.SET_MOTOR, ec2Motor.beide, 0, 0, 0, 0]))
    } */


    //% group="Motor" subcategory="Calli:bot"
    //% block="C Motor (1 ↓ 128 ↑ 255) %x1_128_255 Servo (1 ↖ 16 ↗ 31) %y1_16_31 || (10\\%..90\\%) %prozent" weight=2
    //% x1_128_255.min=1 x1_128_255.max=255 x1_128_255.defl=128 
    //% y1_16_31.min=1 y1_16_31.max=31 y1_16_31.defl=16
    //% prozent.min=10 prozent.max=90 prozent.defl=50
    export function c2motor128lenken16(x1_128_255: number, y1_16_31: number, prozent = 50) {

        let setMotorBuffer = Buffer.create(6)
        setMotorBuffer[0] = ec2Register.SET_MOTOR   // 2
        setMotorBuffer[1] = 3 // ec2Motor.beide     // 3

        // fahren (beide Motoren gleich)
        if (radio.between(x1_128_255, 129, 255)) { // vorwärts
            setMotorBuffer[2] = 0
            setMotorBuffer[3] = radio.mapInt32(x1_128_255, 128, 255, 0, 255)
            setMotorBuffer[4] = 0
            setMotorBuffer[5] = setMotorBuffer[3]
        }
        else if (radio.between(x1_128_255, 1, 127)) { // rückwärts
            setMotorBuffer[2] = 1
            setMotorBuffer[3] = radio.mapInt32(x1_128_255, 1, 128, 255, 0)
            setMotorBuffer[4] = 1
            setMotorBuffer[5] = setMotorBuffer[3]
        }
        else { // wenn x fahren 0, 128 oder mehr als 8 Bit
            setMotorBuffer[2] = 0 // Motor 1 Richtung 0:vorwärts, 1:rückwärts
            setMotorBuffer[3] = 0 // Motor 1 PWM (0..255)
            setMotorBuffer[4] = 0 // Motor 2 Richtung 0:vorwärts, 1:rückwärts
            setMotorBuffer[5] = 0 // Motor 2 PWM (0..255)
        }

        // lenken (ein Motor wird langsamer)
        if (radio.between(y1_16_31, 1, 15)) { // links
            setMotorBuffer[3] *= Math.map(y1_16_31, 0, 16, prozent / 100, 1) // 0=linkslenken50% // 16=nichtlenken=100%
        }
        else if (radio.between(y1_16_31, 17, 31)) { // rechts
            setMotorBuffer[5] *= Math.map(y1_16_31, 16, 32, 1, prozent / 100) // 16=nichtlenken=100% // 32=rechtslenken50%
        }
        else { // wenn y lenken 0, 16 oder mehr als 5 Bit
        }

        i2cWriteBuffer(setMotorBuffer)

        // return setMotorBuffer
    }

    //% group="Motor" subcategory="Calli:bot"
    //% block="C Motoren (1 ↓ 128 ↑ 255) M1 %m1_1_128_255 M2 %m2_1_128_255" weight=1
    //% m1_1_128_255.min=0 m1_1_128_255.max=255 m1_1_128_255.defl=0
    //% m2_1_128_255.min=0 m2_1_128_255.max=255 m2_1_128_255.defl=0
    export function c2motoren128(m1_1_128_255: number, m2_1_128_255: number) {
        let m1 = radio.between(m1_1_128_255, 1, 255)
        let m2 = radio.between(m2_1_128_255, 1, 255)
        // if (m1 || m2) {
        let setMotorBuffer: Buffer
        let offset = 0
        if (m1 && m2) {
            setMotorBuffer = Buffer.create(6)
            setMotorBuffer[offset++] = ec2Register.SET_MOTOR
            setMotorBuffer[offset++] = 3
        } else if (m1) {
            setMotorBuffer = Buffer.create(4)
            setMotorBuffer[offset++] = ec2Register.SET_MOTOR
            setMotorBuffer[offset++] = 1
        } else if (m2) {
            setMotorBuffer = Buffer.create(4)
            setMotorBuffer[offset++] = ec2Register.SET_MOTOR
            setMotorBuffer[offset++] = 2
        }

        // M1 offset 2:Richtung, 3:PWM
        if (m1 && radio.between(m1_1_128_255, 128, 255)) { // M1 vorwärts
            setMotorBuffer[offset++] = 0
            setMotorBuffer[offset++] = radio.mapInt32(m1_1_128_255, 128, 255, 0, 255)
        } else if (m1) { // 1..127 M1 rückwärts
            setMotorBuffer[offset++] = 1
            setMotorBuffer[offset++] = radio.mapInt32(m1_1_128_255, 1, 128, 255, 0)
        }

        // M2 wenn !m1 offset 2:Richtung, 3:PWM sonst offset 4:Richtung, 5:PWM
        if (m2 && radio.between(m2_1_128_255, 128, 255)) { // M2 vorwärts
            setMotorBuffer[offset++] = 0
            setMotorBuffer[offset++] = radio.mapInt32(m2_1_128_255, 128, 255, 0, 255)
        } else if (m2) { // 1..127 M2 rückwärts
            setMotorBuffer[offset++] = 1
            setMotorBuffer[offset++] = radio.mapInt32(m2_1_128_255, 1, 128, 255, 0)
        }

        if (setMotorBuffer)
            i2cWriteBuffer(setMotorBuffer)

    }

    //function c2lenk16(y1_16_31: number) {
    //    //let x = y1_16_31 - 16 // -15..0..15
    //    return Math.map(Math.abs(y1_16_31 - 16), 0, 15, 1, 0.5)// 1=0.5 16=1.0 31=0.5
    //}




    // ========== group="Sensoren" subcategory="Calli:bot"



    // interner Speicher für Sensoren
    let n_input_Digital: number



    //% group="INPUT digital" subcategory="Calli:bot"
    //% block="C Digitaleingänge einlesen || 0x21 %i2" weight=8
    export function c2ReadINPUTS(x21 = false) {
        if (x21)
            n_input_Digital = pins.i2cReadBuffer(0x21, 1).getUint8(0)
        else {
            i2cWriteBuffer(Buffer.fromArray([ec2Register.GET_INPUTS]))
            n_input_Digital = i2cReadBuffer(1).getUint8(0)
        }
    }


    //% group="INPUT digital" subcategory="Calli:bot"
    //% block="C Spursensor %plr schwarz" weight=6
    export function c2Spursensor_lr(plr: elr) {
        if (plr == elr.links)
            return (n_input_Digital & 0x02) == 0 // 0 ist schwarz
        else
            return (n_input_Digital & 0x01) == 0 // 0 ist schwarz
    }

    //% group="INPUT digital" subcategory="Calli:bot"
    //% block="C Spursensor 00 01 10 11" weight=5
    export function c2Spursensor_2bit() {
        return ~n_input_Digital & 0x03
    }



    //% group="Ultraschall Sensor" subcategory="Calli:bot"
    //% block="C Ultraschall Entfernung in %e" weight=4
    export function c2UltraschallEntfernung(e: eDist) {
        i2cWriteBuffer(Buffer.fromArray([ec2Register.GET_INPUT_US]))
        let mm = i2cReadBuffer(3).getNumber(NumberFormat.UInt16LE, 1) // 16 Bit (mm)
        if (e == eDist.cm)
            return Math.idiv(mm, 10)
        else
            return mm
    }



    //% group="Encoder (Call:bot 2E)" subcategory="Calli:bot"
    //% block="C Encoder Zähler löschen" weight=2
    export function c2ResetEncoder() {
        i2cWriteBuffer(Buffer.fromArray([ec2Register.RESET_ENCODER, 3]))
    }

    //% group="Encoder (Call:bot 2E)" subcategory="Calli:bot"
    //% block="C Encoder Werte [l,r]" weight=1
    export function c2EncoderValues(): number[] {
        i2cWriteBuffer(Buffer.fromArray([ec2Register.GET_ENCODER_VALUE]))
        return i2cReadBuffer(9).slice(1, 8).toArray(NumberFormat.Int32LE)
    }

    export function c2EncoderMittelwert() {
        let encoderValues = c2EncoderValues()
        return Math.idiv(Math.abs(encoderValues[0]) + Math.abs(encoderValues[1]), 2)
    }








    // ========== I²C nur diese Datei Callibot

    function i2cWriteBuffer(bu: Buffer) { // repeat funktioniert nicht bei Callibot
        if (n_Callibot2_x22Connected) {
            n_Callibot2_x22Connected = pins.i2cWriteBuffer(i2cCallibot2_x22, bu) == 0

            if (!n_Callibot2_x22Connected)
                basic.showNumber(i2cCallibot2_x22)
        }
        return n_Callibot2_x22Connected
    }

    function i2cReadBuffer(size: number): Buffer { // repeat funktioniert nicht bei Callibot
        if (n_Callibot2_x22Connected)
            return pins.i2cReadBuffer(i2cCallibot2_x22, size)
        else
            return Buffer.create(size)
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


    /* export enum ec2Motor {
        //% block="beide"
        beide = 0b11,
        //% block="links"
        m1 = 0b01,
        //% block="rechts"
        m2 = 0b10
    } */

    //export enum ec2RL { rechts = 0, links = 1 } // Index im Array

    /* enum eDirection {
        //% block="vorwärts"
        v = 0,
        //% block="rückwärts"
        r = 1
    } */

} // r-callibot.ts
