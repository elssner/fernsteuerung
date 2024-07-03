
namespace receiver { // r-callibot.ts


    // ========== I²C ==========
    //export enum eADDR {
    //    CB2_x22 = 0x22 //, WR_MOTOR_x20 = 0x20, WR_LED_x21 = 0x21, RD_SENSOR_x21
    //}
    const i2cCallibot2_x22 = 0x22

    let n_CallibotConnected = true // I²C Device ist angesteckt

    // ========== group="Motor (Call:bot 2E)" subcategory="Calli:bot"

    //% group="Motor (Call:bot 2E)" subcategory="Calli:bot"
    //% block="Motor c2 (1 ↓ 128 ↑ 255) %speed (128 ist STOP)" weight=9
    //% speed.min=0 speed.max=255 speed.defl=128
    export function c2Motor255(speed: number) {
        let pwm: number, richtung: number

        if (radio.between(speed, 129, 255)) { // vorwärts
            pwm = radio.mapInt32(speed, 128, 255, 0, 255)
            richtung = 0
            basic.setLedColor(Colors.Red)
        }
        else if (radio.between(speed, 1, 127)) { // rückwärts
            pwm = radio.mapInt32(speed, 1, 128, 255, 0)
            richtung = 1
            basic.setLedColor(Colors.Green)
        } else {
            pwm = 0
            richtung = 0
            basic.setLedColor(Colors.White)
        }
        return pwm

    }



    //% group="Motor (Call:bot 2E)" subcategory="Calli:bot"
    //% block="Motoren links %pPWM1 (1 ↓ 128 ↑ 255) %pRichtung1 rechts %pPWM2 %pRichtung2" weight=2
    //% pwm1.min=0 pwm1.max=255 pwm1.defl=128 pwm2.min=0 pwm2.max=255 pwm2.defl=128
    //% inlineInputMode=inline
    export function setMotoren(pwm1: number, pRichtung1: eDirection, pwm2: number, pRichtung2: eDirection) {
        if (radio.between(pwm1, 0, 255) && radio.between(pwm2, 0, 255))
            i2cWriteBuffer(Buffer.fromArray([eRegister.SET_MOTOR, eMotor.beide, pRichtung1, pwm1, pRichtung2, pwm2]))
        else // falscher Parameter -> beide Stop
            i2cWriteBuffer(Buffer.fromArray([eRegister.SET_MOTOR, eMotor.beide, 0, 0, 0, 0]))
    }

    // ========== group="Reset"

    //% group="Reset" subcategory="Calli:bot"
    //% block="c2 alles aus Motor, LEDs, Servo"
    export function c2RESET_OUTPUTS() {
        i2cWriteBuffer(Buffer.fromArray([eRegister.RESET_OUTPUTS]))
        // this.qFernsteuerungPower = false
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


    export enum eMotor {
        //% block="links"
        m1 = 0b01,
        //% block="rechts"
        m2 = 0b10,
        //% block="beide"
        beide = 0b11
    }

    export enum eRL { rechts = 0, links = 1 } // Index im Array

    export enum eDirection {
        //% block="vorwärts"
        v = 0,
        //% block="rückwärts"
        r = 1
    }

} // r-callibot.ts
