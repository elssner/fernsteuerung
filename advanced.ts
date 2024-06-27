
namespace radio { // advanced.ts


    // ========== group="Kommentar" advanced=true

    //% group="Funktionen" advanced=true
    //% block="// %text" weight=9
    export function comment(text: string): void { }



    // ========== group="Funktionen" advanced=true

    /* 
    
        //% group="Funktionen" advanced=true
        //% block="Funkgruppe || ändern %i und anzeigen" weight=8
        //% i.min=-1 i.max=1
        export function getFunkgruppe(i?: number): number {
            if (i != undefined) {
                if (i < 0 && n_funkgruppe + i > 0xA0) {
                    n_funkgruppe += i
                    radio.setGroup(n_funkgruppe)
                }
                else if (i > 0 && n_funkgruppe + i < 0xBF) {
                    n_funkgruppe += i
                    radio.setGroup(n_funkgruppe)
                }
                //zeige5x5Funkgruppe()
                zeigeBIN(n_funkgruppe, ePlot.hex, 1) // 5x5 x=0-1 y=1-2-3-4 (y=0 ist bei hex immer aus)
            }
            return n_funkgruppe
        }
     */


    //% group="Funktionen" advanced=true
    //% block="Simulator" weight=7
    export function simulator() { return "€".charCodeAt(0) == 8364 }


    //% group="Funktionen" advanced=true
    //% block="%i0 zwischen %i1 und %i2" weight=6
    export function between(i0: number, i1: number, i2: number): boolean {
        return (i0 >= i1 && i0 <= i2)
    }

    //% group="Funktionen" advanced=true
    //% block="Prozent (1 ↓ 128 ↑ 255) %value * %prozent \\%" weight=5
    //% value.min=1 value.max=255 value.defl=128
    //% prozent.min=10 prozent.max=100 prozent.defl=100
    export function motorProzent(value: number, prozent: number) {
        return Math.idiv((value - 128) * prozent, 100) + 128
    }

    //% group="Funktionen" advanced=true
    //% block="mapInt32 %value|from low %fromLow|high %fromHigh|to low %toLow|high %toHigh" weight=4
    //% inlineInputMode=inline
    export function mapInt32(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
        // return ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow
        return Math.idiv(Math.imul(value - fromLow, toHigh - toLow), fromHigh - fromLow) + toLow
    }







    //let n5x5_funkgruppe = 0 // 0..255 als 2 HEX Ziffern in x=0-1 y=1-2-3-4
    let n5x5_x01y0 = 0 // Bit 5-4 Betriebsart in x=0-1 y=0
    let n5x5_x2 = 0 // Bit 5-4-3-2-1 Motor Power in x=2
    let n5x5_x3 = 0 // Motor 1..16..31
    let n5x5_x4 = 0 // Servo 1..16..31
    /* 
        //% group="25 LED Display" advanced=true color=#54C9C9
        //% block="zeige ↓↓... Funkgruppe" weight=9
        export function zeige5x5Funkgruppe() {
            //if (n5x5_funkgruppe != n_funkgruppe) {
            //    n5x5_funkgruppe = n_funkgruppe
            zeigeBIN(n_funkgruppe, ePlot.hex, 1) // 5x5 x=0-1 y=1-2-3-4 (y=0 ist bei hex immer aus)
            //}
        }
     */


    //% group="25 LED Display" advanced=true color=#54C9C9
    //% block="zeige ↑↑↕.. aktive Motoren %buffer" weight=8
    //% buffer.shadow="radio_sendBuffer19"
    export function zeige5x5Buffer(buffer: Buffer) {
        // 2 Bit oben links Betriebsart, die sind bei Funkgruppe frei
        if (n5x5_x01y0 != (buffer[0] & 0x30)) {
            n5x5_x01y0 = (buffer[0] & 0x30) // Betriebsart 00 01 10 11 (x=0-1 y=0)
            if ((n5x5_x01y0 & 0x20) == 0x20) { led.plot(0, 0) } else { led.unplot(0, 0) }
            if ((n5x5_x01y0 & 0x10) == 0x10) { led.plot(1, 0) } else { led.unplot(1, 0) }
        }

        // Mitte x=2 aktivierte Motoren aus Buffer anzeigen
        if (n5x5_x2 != buffer[3]) {
            n5x5_x2 = buffer[3]
            let x = 2 // 5x5 x=2 Motor Power außer m0
            if ((n5x5_x2 & e3aktiviert.m1) == e3aktiviert.m1) { led.plot(x, 0) } else { led.unplot(x, 0) }
            if ((n5x5_x2 & e3aktiviert.ma) == e3aktiviert.ma) { led.plot(x, 1) } else { led.unplot(x, 1) }
            if ((n5x5_x2 & e3aktiviert.mb) == e3aktiviert.mb) { led.plot(x, 2) } else { led.unplot(x, 2) }
            if ((n5x5_x2 & e3aktiviert.mc) == e3aktiviert.mc) { led.plot(x, 3) } else { led.unplot(x, 3) }
            if ((n5x5_x2 & e3aktiviert.md) == e3aktiviert.md) { led.plot(x, 4) } else { led.unplot(x, 4) }
        }
    }


    //% group="25 LED Display" advanced=true color=#54C9C9
    //% block="zeige ...↕↕ Joystick %buffer" weight=7
    //% buffer.shadow="radio_sendBuffer19"
    export function zeige5x5Joystick(buffer: Buffer) {
        if (isBetriebsart(buffer, e0Betriebsart.p0)) {
            // Betriebsart: 00 Fernsteuerung Motoren

            if (getaktiviert(buffer, e3aktiviert.m0)) {
                // fahren und lenken mit Servo
                zeigeBINMotor(buffer[eBufferPointer.m0], 3)
                zeigeBINServo(buffer[eBufferPointer.m0 + eBufferOffset.b1_Servo] & 0x1F, 4)

            } else {
                // die ersten 2 aktivierten Motoren ohne Servo
                let bin: number[] = []
                if (bin.length < 2 && getaktiviert(buffer, e3aktiviert.m1))
                    bin.push(buffer[eBufferPointer.m1]) // Motor M1

                if (bin.length < 2 && getaktiviert(buffer, e3aktiviert.ma))
                    bin.push(buffer[eBufferPointer.ma]) // Motor MA

                if (bin.length < 2 && getaktiviert(buffer, e3aktiviert.mb))
                    bin.push(buffer[eBufferPointer.mb]) // Motor MB

                if (bin.length < 2 && getaktiviert(buffer, e3aktiviert.mc))
                    bin.push(buffer[eBufferPointer.mc]) // Motor MC

                if (bin.length < 2 && getaktiviert(buffer, e3aktiviert.md))
                    bin.push(buffer[eBufferPointer.md]) // Motor MD

                if (bin.length >= 1)
                    zeigeBINMotor(bin[0], 3) // in 5x5 LED Matrix x=3
                if (bin.length >= 2)
                    zeigeBINMotor(bin[1], 4) // in 5x5 LED Matrix x=4
            }
        } else {
            // andere Betriebsarten als '00 Fernsteuerung Motoren'
            zeigeBINMotor(buffer[1], 3)
            zeigeBINServo(buffer[2] & 0x1F, 4)
        }
        /* 
                if (n5x5_x3 != buffer[1]) { // zeigt Motor0 aus Buffer[1] 1..16..31 (x=3)
                    n5x5_x3 = buffer[1]
                    if (n5x5_x3 == 0)
                        zeigeBIN(0, ePlot.bin, 3)
                    else
                        zeigeBIN(mapInt32(n5x5_x3, 1, 255, 1, 31), ePlot.bin, 3)
                }
        
                if (n5x5_x4 != buffer[2]) { // zeigt Servo0 aus Buffer[2] 1..16..31 (x=4)
                    n5x5_x4 = buffer[2]
                    zeigeBIN(n5x5_x4 & 0x1F, ePlot.bin, 4)
                }
         */
    }

    function zeigeBINMotor(x3: number, xLed: number) {
        if (n5x5_x3 != x3) { // zeigt Motor0 aus Buffer[1] 1..16..31 (x=3)
            n5x5_x3 = x3
            if (x3 == 0)
                zeigeBIN(0, ePlot.bin, xLed)
            else
                zeigeBIN(mapInt32(x3, 1, 255, 1, 31), ePlot.bin, xLed) // 8 Bit auf 5 Bit verteilen
        }
    }

    function zeigeBINServo(x4: number, xLed: number) {
        if (n5x5_x4 != x4) { // zeigt Servo0 aus Buffer[2] 1..16..31 (x=4)
            n5x5_x4 = x4
            zeigeBIN(x4, ePlot.bin, xLed)
            //zeigeBIN(x4 & 0x1F, ePlot.bin, 4)
        }
    }
    // ==========

    // zeigt Funkgruppe oder i²C Adresse im 5x5 Display binär an

    export enum ePlot {
        //% block="BIN 0..31"
        bin,
        //% block="HEX Zahl"
        hex,
        //% block="BCD Zahl"
        bcd
    }

    //% group="25 LED Display" advanced=true color=#54C9C9
    //% block="zeige ↕↕↕↕↕ %int %format ←x %x" weight=2
    //% x.min=0 x.max=4 x.defl=4
    export function zeigeBIN(int: number, format: ePlot, xLed: number) {
        int = Math.imul(int, 1) // 32 bit signed integer
        xLed = Math.imul(xLed, 1) // entfernt mögliche Kommastellen

        if (format == ePlot.bin && between(xLed, 0, 4)) {
            for (let y = 4; y >= 0; y--) {
                if ((int % 2) == 1) { led.plot(xLed, y) } else { led.unplot(xLed, y) }
                int = int >> 1 // bitweise Division durch 2
            }
        } else {
            while (int > 0 && between(xLed, 0, 4)) {
                if (format == ePlot.bcd) {
                    zeigeBIN(int % 10, ePlot.bin, xLed) // Ziffer 0..9
                    int = Math.idiv(int, 10) // 32 bit signed integer
                } else if (format == ePlot.hex) {
                    zeigeBIN(int % 16, ePlot.bin, xLed) // Ziffer 0..15
                    int = int >> 4 // bitweise Division durch 16
                }
                xLed--
            }
        }
    }



    let n_showString = ""

    //% group="25 LED Display" advanced=true color=#54C9C9
    //% block="zeige Text wenn geändert %text" weight=1
    export function zeigeText(text: any) {
        let tx = convertToText(text)
        if (tx != n_showString) {
            n_showString = tx
            basic.showString(tx)
        }
    }



    // ========== group="Buffer" advanced=true

    //% group="Buffer" advanced=true
    //% block="Buffer %buffer getNumber(%format offset %offset)" weight=8
    //% format.defl=NumberFormat.UInt8LE
    //% offset.min=0 offset.max=18
    export function getNumber(buffer: Buffer, format: NumberFormat, offset: number): number { return buffer.getNumber(format, offset) }

    //% group="Buffer" advanced=true
    //% block="Buffer %buffer setNumber(%format offset %offset value %value)" weight=7
    //% format.defl=NumberFormat.UInt8LE
    //% offset.min=0 offset.max=18
    //% inlineInputMode=inline
    export function setNumber(buffer: Buffer, format: NumberFormat, offset: number, value: number) { buffer.setNumber(format, offset, value) }

    //% group="Buffer" advanced=true
    //% block="Buffer %buffer offset %offset getBit 2** %exp" weight=4
    //% offset.min=0 offset.max=18
    //% exp.min=0 exp.max=7
    export function getBit(buffer: Buffer, offset: number, exp: number): boolean {
        return (buffer[offset] & 2 ** Math.trunc(exp)) != 0
    }

    //% group="Buffer" advanced=true
    //% block="Buffer %buffer offset %offset setBit 2** %exp %pBit" weight=3
    //% offset.min=0 offset.max=18
    //% exp.min=0 exp.max=7
    //% inlineInputMode=inline
    export function setBit(buffer: Buffer, offset: number, exp: number, bit: boolean) {
        if (bit)
            buffer[offset] | 2 ** Math.trunc(exp)
        else
            buffer[offset] & ~(2 ** Math.trunc(exp))
    }

    //% group="Buffer" advanced=true
    //% block="%pNumber .toHex()" weight=1
    export function toHex(bytes: number[]): string { return Buffer.fromArray(bytes).toHex() }


} // advanced.ts
