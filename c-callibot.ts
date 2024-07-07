//% color=#005F7F icon="\uf188" block="Calli:bot 2" weight=93
namespace cb2 { // c-callibot.ts



    // ========== I²C ==========
    //export enum eADDR {
    //    CB2_x22 = 0x22 //, WR_MOTOR_x20 = 0x20, WR_LED_x21 = 0x21, RD_SENSOR_x21
    //}
    const i2cCallibot2_x22 = 0x22

    let n_Callibot2_x22Connected = true // I²C Device ist angesteckt
    // let n_c2MotorPower = true
    //  let qFernsteuerungStop: boolean = false

    export let n_EncoderFaktor = 31.25 // Impulse = 31.25 * Fahrstrecke in cm


    // ========== group="Reset"

    //% group="Reset" subcategory="Calli:bot"
    //% block="C Reset Motoren, LEDs" weight=4
    export function reset() {
        i2cWriteBuffer(Buffer.fromArray([eRegister.RESET_OUTPUTS]))
        // n_c2MotorPower = false
    }

    //% group="Reset" subcategory="Calli:bot"
    //% block="C Call:bot Typ [1]" weight=3
    export function version() { // [1]=4:CB2(Gymnasium) =3:CB2E (=2:soll CB2 sein)
        i2cWriteBuffer(Buffer.fromArray([eRegister.GET_FW_VERSION]))
        return i2cReadBuffer(10).toArray(NumberFormat.UInt8LE)
    }



    //% group="Motor" subcategory="Calli:bot"
    //% block="C Motor (1 ↓ 128 ↑ 255) %x1_128_255 Servo (1 ↖ 16 ↗ 31) %y1_16_31 || (10\\%..90\\%) %prozent" weight=2
    //% x1_128_255.min=1 x1_128_255.max=255 x1_128_255.defl=128 
    //% y1_16_31.min=1 y1_16_31.max=31 y1_16_31.defl=16
    //% prozent.min=10 prozent.max=90 prozent.defl=50
    export function motor128lenken16(x1_128_255: number, y1_16_31: number, prozent = 50) {

        let setMotorBuffer = Buffer.create(6)
        setMotorBuffer[0] = eRegister.SET_MOTOR   // 2
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
    export function motoren128(m1_1_128_255: number, m2_1_128_255: number) {
        let m1 = radio.between(m1_1_128_255, 1, 255)
        let m2 = radio.between(m2_1_128_255, 1, 255)
        // if (m1 || m2) {
        let setMotorBuffer: Buffer
        let offset = 0
        if (m1 && m2) {
            setMotorBuffer = Buffer.create(6)
            setMotorBuffer[offset++] = eRegister.SET_MOTOR
            setMotorBuffer[offset++] = 3
        } else if (m1) {
            setMotorBuffer = Buffer.create(4)
            setMotorBuffer[offset++] = eRegister.SET_MOTOR
            setMotorBuffer[offset++] = 1
        } else if (m2) {
            setMotorBuffer = Buffer.create(4)
            setMotorBuffer[offset++] = eRegister.SET_MOTOR
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




    // ========== group="Sensoren" subcategory="Calli:bot"



    // interner Speicher für Sensoren
    let n_input_Digital: number



    //% group="INPUT digital" subcategory="Calli:bot"
    //% block="C Digitaleingänge einlesen || 0x21 %i2" weight=8
    export function c2ReadINPUTS(x21 = false) {
        if (x21)
            n_input_Digital = pins.i2cReadBuffer(0x21, 1).getUint8(0)
        else {
            i2cWriteBuffer(Buffer.fromArray([eRegister.GET_INPUTS]))
            n_input_Digital = i2cReadBuffer(1).getUint8(0)
        }
    }

    //% group="INPUT digital" subcategory="Calli:bot"
    //% block="C %n %e" weight=7
    export function c2getInput(n: radio.eNOT, e: cb2.eINPUTS): boolean {
        if (n == radio.eNOT.t)
            return (n_input_Digital & e) == e
        else
            return (n_input_Digital & e) == 0
    }


    export enum eDist { cm, mm }

    //% group="Ultraschall Sensor" subcategory="Calli:bot"
    //% block="C Ultraschall Entfernung in %e" weight=4
    export function c2UltraschallEntfernung(e: eDist) {
        i2cWriteBuffer(Buffer.fromArray([eRegister.GET_INPUT_US]))
        let mm = i2cReadBuffer(3).getNumber(NumberFormat.UInt16LE, 1) // 16 Bit (mm)
        if (e == eDist.cm)
            return Math.idiv(mm, 10)
        else
            return mm
    }



    //% group="Encoder (Call:bot 2E)" subcategory="Calli:bot"
    //% block="C Encoder Zähler löschen" weight=2
    export function c2ResetEncoder() {
        i2cWriteBuffer(Buffer.fromArray([eRegister.RESET_ENCODER, 3]))
    }

    //% group="Encoder (Call:bot 2E)" subcategory="Calli:bot"
    //% block="C Encoder Werte [l,r]" weight=1
    export function c2EncoderValues(): number[] {
        i2cWriteBuffer(Buffer.fromArray([eRegister.GET_ENCODER_VALUE]))
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


    export enum eRegister {
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


    /* export enum eINPUTS {
        //% block="Spursensor rechts hell"
        spr = 0b00000001,
        //% block="Spursensor links hell"
        spl = 0b00000010,
        //% block="Spursensor beide hell"
        spb = 0b00000011,
        //% block="Stoßstange rechts"
        str = 0b00000100,
        //% block="Stoßstange links"
        stl = 0b00001000,
        //% block="ON-Taster"
        ont = 0b00010000,
        //% block="OFF-Taster"
        off = 0b00100000,
        //reserviert = 0b01000000,
        //% block="Calli:bot2 (0x21)"
        cb2 = 0b10000000
    } */

} // c-callibot.ts
