
namespace receiver { // r-callibot.ts




    // ========== group="Encoder 2*32 Bit [l,r]" advanced=true

    //% group="Encoder 2*32 Bit [l,r]" subcategory="Calli:bot" color=#007F00
    //% block="Encoder %Calli2bot Zähler löschen %encoder"
    //% encoder.defl=calli2bot.eMotor.beide
    export function resetEncoder(encoder: eMotor) {
        /* let bitMask = 0;
        switch (encoder) {
            case C2eMotor.links:
                bitMask = 1;
                break;
            case C2eMotor.rechts:
                bitMask = 2;
                break;
            case C2eMotor.beide:
                bitMask = 3;
                break;
        }

        let buffer = pins.createBuffer(2)
        buffer[0] = eRegister.RESET_ENCODER // 5
        buffer[1] = bitMask; */
        i2cWriteBuffer(Buffer.fromArray([eRegister.RESET_ENCODER, encoder]))
    }

    //% group="Encoder 2*32 Bit [l,r]" subcategory="Calli:bot" color=#007F00
    //% block="Encoder %Calli2bot Werte lesen"
    export function encoderValue(): number[] {
        i2cWriteBuffer(Buffer.fromArray([eRegister.GET_ENCODER_VALUE]))
        return i2cReadBuffer(9).slice(1, 8).toArray(NumberFormat.Int32LE)

        /* 
                    let result: number;
                    let index: number;
        
                    let wbuffer = pins.createBuffer(1);
                    wbuffer[0] = 0x91;
                    pins.i2cWriteBuffer(0x22, wbuffer);
                    let buffer = pins.i2cReadBuffer(0x22, 9);
                    if (encoder == C2eSensor.links) {
                        index = 1;
                    }
                    else {
                        index = 5;
                    }
                    result = buffer[index + 3];
                    result = result * 256 + buffer[index + 2];
                    result = result * 256 + buffer[index + 1];
                    result = result * 256 + buffer[index];
                    result = -(~result + 1);
                    return result; */
    }


    function i2cWriteBuffer(buf: Buffer) { // repeat funktioniert nicht
        pins.i2cWriteBuffer(eADDR.CB2_x22, buf)
        /* 
                if (this.i2cError == 0) { // vorher kein Fehler
                    this.i2cError = pins.i2cWriteBuffer(this.i2cADDR, buf)
                    // NaN im Simulator
                    if (this.i2cCheck && this.i2cError != 0)  // vorher kein Fehler, wenn (n_i2cCheck=true): beim 1. Fehler anzeigen
                        basic.showString(Buffer.fromArray([this.i2cADDR]).toHex()) // zeige fehlerhafte i2c-Adresse als HEX
                } else if (!this.i2cCheck)  // vorher Fehler, aber ignorieren (n_i2cCheck=false): i2c weiter versuchen
                    this.i2cError = pins.i2cWriteBuffer(this.i2cADDR, buf)
         */
    }

    function i2cReadBuffer(size: number): Buffer { // repeat funktioniert nicht
        return pins.i2cReadBuffer(eADDR.CB2_x22, size)
        /* 
                if (!this.i2cCheck || this.i2cError == 0)
                    return pins.i2cReadBuffer(this.i2cADDR, size)
                else
                    return Buffer.create(size)
         */
    }

    export enum eADDR {
        CB2_x22 = 0x22 //, WR_MOTOR_x20 = 0x20, WR_LED_x21 = 0x21, RD_SENSOR_x21
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
