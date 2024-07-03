
namespace receiver { // r-callibot.ts

    /*
            private readonly qSimulator: boolean = ("€".charCodeAt(0) == 8364)
            private readonly i2cADDR: eADDR
            private readonly i2cCheck: boolean // i2c-Check
            private i2cError: number = 0 // Fehlercode vom letzten WriteBuffer (0 ist kein Fehler)
            private readonly qLogEnabled: boolean
            private qLog: string[] // Array muss bei Verwendung initialisiert werden
            private qLEDs = [0, 0, 0, 0, 0, 0, 0, 0, 0] // LED Wert in Register 0x03 merken zum blinken
    
            private qStopandGoMotoran: boolean = false // für seite4StopandGo()
            private qFernsteuerungPower: boolean = false // für Fernsteuerung
            private qFernsteuerungStop: boolean = false   // für Fernsteuerung
            // interner Speicher für Sensoren
            private input_Digital: number
            private input_Ultraschallsensor: number
            private input_Spursensoren: number[]
    
    */
    let qLogEnabled: boolean
    let qLog: string[] // Array muss bei Verwendung initialisiert werden
    let qLEDs = [0, 0, 0, 0, 0, 0, 0, 0, 0] // LED Wert in Register 0x03 merken zum blinken
    let qFernsteuerungPower: boolean = false // für Fernsteuerung



    // ========== group="Motor (-100% .. 0 .. +100%)"

    //% group="Motor (-100% .. 0 .. +100%)" subcategory="Calli:bot" color=#007F00
    //% block="Motoren links mit %pwm1 \\% rechts mit %pwm2 \\%" weight=8
    //% pwm1.shadow="speedPicker" pwm1.defl=0
    //% pwm2.shadow="speedPicker" pwm2.defl=0
    export function setMotoren2(pwm1: number, pwm2: number) {
        if (qLogEnabled) qLog = [pwm1 + " " + pwm2, ""] // init Array 2 Elemente
        let pRichtung1 = (pwm1 < 0 ? eDirection.r : eDirection.v)
        let pRichtung2 = (pwm2 < 0 ? eDirection.r : eDirection.v)
        pwm1 = Math.trunc(Math.abs(pwm1) * 255 / 100)
        pwm2 = Math.trunc(Math.abs(pwm2) * 255 / 100)

        if (qLogEnabled) qLog[1] = pwm1 + " " + pwm2

        setMotoren(pwm1, pRichtung1, pwm2, pRichtung2)

        //if (this.between(pwm1, 0, 255) && this.between(pwm2, 0, 255))
        //    this.i2cWriteBuffer(Buffer.fromArray([eRegister.SET_MOTOR, eMotor.beide, pRichtung1, pwm1, pRichtung2, pwm2]))
        //else
        //    this.i2cWriteBuffer(Buffer.fromArray([eRegister.SET_MOTOR, eMotor.beide, 0, 0, 0, 0]))
    }

    //% group="Motor (-100% .. 0 .. +100%)" subcategory="Calli:bot" color=#007F00
    //% block="Motor %pMotor mit %pwm \\%" weight=7
    //% pwm.shadow="speedPicker" pwm.defl=0
    export function setMotor(pMotor: eMotor, pwm: number) {
        let pRichtung = (pwm < 0 ? eDirection.r : eDirection.v)
        pwm = Math.trunc(Math.abs(pwm) * 255 / 100)

        if (!radio.between(pwm, 0, 255)) { // falscher Parameter -> beide Stop
            pMotor = eMotor.beide
            pwm = 0
        }

        if (pMotor == eMotor.beide)
            i2cWriteBuffer(Buffer.fromArray([eRegister.SET_MOTOR, pMotor, pRichtung, pwm, pRichtung, pwm]))
        else
            i2cWriteBuffer(Buffer.fromArray([eRegister.SET_MOTOR, pMotor, pRichtung, pwm]))
    }

    // ==========  subcategory="Fernsteuerung"

    // ========== group="Motor (0 .. 255)" subcategory="Fernsteuerung"

    //% group="Motor (0 .. 255)" subcategory="Fernsteuerung" subcategory="Calli:bot" color=#007F00
    //% block="Motoren links %pPWM1 (0-255) %pRichtung1 rechts %pPWM2 %pRichtung2" weight=2
    //% pwm1.min=0 pwm1.max=255 pwm1.defl=128 pwm2.min=0 pwm2.max=255 pwm2.defl=128
    //% inlineInputMode=inline
    export function setMotoren(pwm1: number, pRichtung1: eDirection, pwm2: number, pRichtung2: eDirection) {
        if (radio.between(pwm1, 0, 255) && radio.between(pwm2, 0, 255))
            i2cWriteBuffer(Buffer.fromArray([eRegister.SET_MOTOR, eMotor.beide, pRichtung1, pwm1, pRichtung2, pwm2]))
        else // falscher Parameter -> beide Stop
            i2cWriteBuffer(Buffer.fromArray([eRegister.SET_MOTOR, eMotor.beide, 0, 0, 0, 0]))
    }




    // ========== group="LED"



    //% group="LED" subcategory="Calli:bot" color=#007F00
    //% block="RGB LED %color || ↖ %lv ↙ %lh ↘ %rh ↗ %rv blinken %blink" weight=7
    //% color.shadow="callibot_colorPicker"
    //% lv.shadow="toggleYesNo" lh.shadow="toggleYesNo" rh.shadow="toggleYesNo" rv.shadow="toggleYesNo"
    //% blink.shadow="toggleYesNo"
    //% inlineInputMode=inline expandableArgumentMode="toggle"
    export function setRgbLed3(color: number, lv = true, lh = true, rh = true, rv = true, blink = false) {
        //basic.showString(lv.toString())
        let buffer = Buffer.create(5)
        buffer[0] = eRegister.SET_LED
        buffer.setNumber(NumberFormat.UInt32BE, 1, color) // [1]=0 [2]=r [3]=g [4]=b
        buffer[2] = buffer[2] >>> 4 // durch 16, gültige rgb Werte für callibot: 0-15
        buffer[3] = buffer[3] >>> 4
        buffer[4] = buffer[4] >>> 4

        if (lv) setRgbLed31(eRgbLed.LV, buffer, blink)
        if (lh) setRgbLed31(eRgbLed.LH, buffer, blink)
        if (rh) setRgbLed31(eRgbLed.RH, buffer, blink)
        if (rv) setRgbLed31(eRgbLed.RV, buffer, blink)
    }

    // blinken
    function setRgbLed31(pRgbLed: eRgbLed, buffer: Buffer, blink: boolean) {
        if (blink && qLEDs[pRgbLed] == buffer.getNumber(NumberFormat.UInt32BE, 1))
            buffer.setNumber(NumberFormat.UInt32BE, 1, 0) // alle Farben aus
        qLEDs[pRgbLed] = buffer.getNumber(NumberFormat.UInt32BE, 1)
        buffer[1] = pRgbLed // Led-Index 1,2,3,4 für RGB
        i2cWriteBuffer(buffer)
        basic.pause(10) // ms
    }


    //% group="LED" subcategory="Calli:bot" color=#007F00
    //% block="LED %led %onoff || blinken %blink Helligkeit %pwm" weight=2
    //% onoff.shadow="toggleOnOff"
    //% blink.shadow="toggleYesNo"
    //% pwm.min=1 pwm.max=16 pwm.defl=16
    //% inlineInputMode=inline 
    export function setLed1(pLed: eLed, on: boolean, blink = false, pwm?: number) {
        if (!on)
            pwm = 0 // LED aus schalten
        else if (!radio.between(pwm, 0, 16))
            pwm = 16 // bei ungültigen Werten max. Helligkeit

        if (pLed == eLed.redb) {
            setLed1(eLed.redl, on, blink, pwm) // 2 mal rekursiv aufrufen für beide rote LED
            setLed1(eLed.redr, on, blink, pwm)
        }
        else {
            if (blink && qLEDs.get(pLed) == pwm)
                pwm = 0
            i2cWriteBuffer(Buffer.fromArray([eRegister.SET_LED, pLed, pwm]))
            qLEDs.set(pLed, pwm)
        }
    }




    // ========== group="Reset"

    //% group="Reset" subcategory="Calli:bot" color=#007F00
    //% block="alles aus Motor, LEDs, Servo"
    export function i2cRESET_OUTPUTS() {
        i2cWriteBuffer(Buffer.fromArray([eRegister.RESET_OUTPUTS]))
        qFernsteuerungPower = false
    }








    // ========== group="Encoder 2*32 Bit [l,r]" advanced=true

    //% group="Encoder 2*32 Bit [l,r]" subcategory="Calli:bot" color=#007F00
    //% block="Encoder Zähler löschen %encoder"
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
    //% block="Encoder Werte lesen"
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


} // r-callibot.ts
