//% color=#005F7F icon="\uf188" block="Calli:bot 2" weight=93
namespace cb2 { // c-callibot.ts



    // ========== I²C ==========
    //export enum eADDR {
    //    CB2_x22 = 0x22 //, WR_MOTOR_x20 = 0x20, WR_LED_x21 = 0x21, RD_SENSOR_x21
    //}
    const i2cCallibot2_x22 = 0x22
    const i2cCallibot_x21 = 0x21

    let n_Callibot2_x22Connected = true // I²C Device ist angesteckt
    // let n_c2MotorPower = true
    //  let qFernsteuerungStop: boolean = false

    export let n_EncoderFaktor = 31.25 // Impulse = 31.25 * Fahrstrecke in cm


    // ========== group="Reset"

    //% group="Reset"
    //% block="Reset Motoren, LEDs" weight=4
    export function writeReset() {
        i2cWriteBuffer(Buffer.fromArray([eRegister.RESET_OUTPUTS]))
        // n_c2MotorPower = false
    }



    //% group="Motor"
    //% block="Motor (1 ↓ 128 ↑ 255) %x1_128_255 Servo (1 ↖ 16 ↗ 31) %y1_16_31 || (10\\%..90\\%) %prozent" weight=2
    //% x1_128_255.min=1 x1_128_255.max=255 x1_128_255.defl=128 
    //% y1_16_31.min=1 y1_16_31.max=31 y1_16_31.defl=16
    //% prozent.min=10 prozent.max=90 prozent.defl=50
    export function writeMotor128Servo16(x1_128_255: number, y1_16_31: number, prozent = 50) {

        let setMotorBuffer = Buffer.create(6)
        setMotorBuffer[0] = eRegister.SET_MOTOR   // 2
        setMotorBuffer[1] = 3 // ec2Motor.beide     // 3

        if ((x1_128_255 & 0x80) == 0x80) {  // 128..255 vorwärts
            setMotorBuffer[2] = 0
            setMotorBuffer[3] = x1_128_255 << 1 // linkes Bit weg=0..127 * 2 // 128=00, 129=02, 130=04, 254=FC, 255=FE
            setMotorBuffer[4] = 0
            setMotorBuffer[5] = setMotorBuffer[3]
        } else {                            // 0..127 rückwärts
            setMotorBuffer[2] = 1
            setMotorBuffer[3] = ~(x1_128_255 << 1) // * 2 und bitweise NOT // 0=FF, 1=FD, 126=03, 127=01,
            setMotorBuffer[4] = 1
            setMotorBuffer[5] = setMotorBuffer[3]
     }

        // fahren (beide Motoren gleich)
     /*    if (radio.between(x1_128_255, 129, 255)) { // vorwärts
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
        } */

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

    //% group="Motor"
    //% block="Motoren (1 ↓ 128 ↑ 255) M1 %m1_1_128_255 M2 %m2_1_128_255" weight=1
    //% m1_1_128_255.min=0 m1_1_128_255.max=255 m1_1_128_255.defl=0
    //% m2_1_128_255.min=0 m2_1_128_255.max=255 m2_1_128_255.defl=0
    export function writeMotoren128(m1_1_128_255: number, m2_1_128_255: number) {
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
        if (m1 && (m1_1_128_255 & 0x80) == 0x80) { //     if (m1 && radio.between(m1_1_128_255, 128, 255)) { // M1 vorwärts
            setMotorBuffer[offset++] = 0
            setMotorBuffer[offset++] = m1_1_128_255 << 1// radio.mapInt32(m1_1_128_255, 128, 255, 0, 255)
        } else if (m1) { // 1..127 M1 rückwärts
            setMotorBuffer[offset++] = 1
            setMotorBuffer[offset++] = ~(m1_1_128_255 << 1) // radio.mapInt32(m1_1_128_255, 1, 128, 255, 0)
        }

        // M2 wenn !m1 offset 2:Richtung, 3:PWM sonst offset 4:Richtung, 5:PWM
        if (m2 && (m2_1_128_255 & 0x80) == 0x80) { //    if (m2 && radio.between(m2_1_128_255, 128, 255)) { // M2 vorwärts
            setMotorBuffer[offset++] = 0
            setMotorBuffer[offset++] = m2_1_128_255 << 1// radio.mapInt32(m2_1_128_255, 128, 255, 0, 255)
        } else if (m2) { // 1..127 M2 rückwärts
            setMotorBuffer[offset++] = 1
            setMotorBuffer[offset++] = ~(m2_1_128_255 << 1) // radio.mapInt32(m2_1_128_255, 1, 128, 255, 0)
        }

        if (setMotorBuffer)
            i2cWriteBuffer(setMotorBuffer)

    }




    // ========== group="Sensoren" subcategory="Sensoren"



    // interner Speicher für Sensoren
    let n_Inputs: number



    //% group="INPUT digital" subcategory="Sensoren"
    //% block="Digitaleingänge einlesen || 0x21 %i2" weight=8
    export function readInputs(x21 = false) {
        if (x21)
            n_Inputs = pins.i2cReadBuffer(i2cCallibot_x21, 1).getUint8(0)
        else {
            i2cWriteBuffer(Buffer.fromArray([eRegister.GET_INPUTS]))
            n_Inputs = i2cReadBuffer(1).getUint8(0)
        }
    }

    //% group="INPUT digital" subcategory="Sensoren"
    //% block="%n %e" weight=7
    export function getInputs(n: radio.eNOT, e: cb2.eINPUTS): boolean {
        if (n == radio.eNOT.t)
            return (n_Inputs & e) == e
        else
            return (n_Inputs & e) == 0
    }


    export enum eDist { cm, mm }

    //% group="Ultraschall Sensor" subcategory="Sensoren"
    //% block="Ultraschall Entfernung in %e" weight=4
    export function readUltraschallEntfernung(e: eDist) {
        i2cWriteBuffer(Buffer.fromArray([eRegister.GET_INPUT_US]))
        let mm = i2cReadBuffer(3).getNumber(NumberFormat.UInt16LE, 1) // 16 Bit (mm)
        if (e == eDist.cm)
            return Math.idiv(mm, 10)
        else
            return mm
    }



    //% group="Encoder (Call:bot 2E)" subcategory="Sensoren"
    //% block="Encoder Zähler löschen" weight=2
    export function writeEncoderReset() {
        i2cWriteBuffer(Buffer.fromArray([eRegister.RESET_ENCODER, 3]))
    }

    //% group="Encoder (Call:bot 2E)" subcategory="Sensoren"
    //% block="Encoder Werte [l,r]" weight=1
    export function readEncoderValues(): number[] {
        i2cWriteBuffer(Buffer.fromArray([eRegister.GET_ENCODER_VALUE]))
        return i2cReadBuffer(9).slice(1, 8).toArray(NumberFormat.Int32LE)
    }

    export function getEncoderMittelwert() {
        let encoderValues = readEncoderValues()
        return Math.idiv(Math.abs(encoderValues[0]) + Math.abs(encoderValues[1]), 2)
    }





    // ========== I²C nur diese Datei Callibot

    export function i2cWriteBuffer(bu: Buffer) { // repeat funktioniert nicht bei Callibot
        if (n_Callibot2_x22Connected) {
            n_Callibot2_x22Connected = pins.i2cWriteBuffer(i2cCallibot2_x22, bu) == 0

            if (!n_Callibot2_x22Connected)
                basic.showNumber(i2cCallibot2_x22)
        }
        return n_Callibot2_x22Connected
    }

    export function i2cReadBuffer(size: number): Buffer { // repeat funktioniert nicht bei Callibot
        if (n_Callibot2_x22Connected)
            return pins.i2cReadBuffer(i2cCallibot2_x22, size)
        else
            return Buffer.create(size)
    }



    export enum eINPUTS {
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
    }

} // c-callibot.ts
