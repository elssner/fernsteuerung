
namespace radio { // led5x5.ts


    let n_showString = ""

    //let n5x5_funkgruppe = 0 // 0..255 als 2 HEX Ziffern in x=0-1 y=1-2-3-4
    let n5x5_x01y0 = 0 // Bit 5-4 Betriebsart in x=0-1 y=0
    let n5x5_x2 = 0 // Bit 5-4-3-2-1 Motor Power in x=2
    let n5x5_x3 = 0 // Motor 1..16..31
    let n5x5_x4 = 0 // Servo 1..16..31

    //% group="25 LED" advanced=true color=#54C9C9
    //% block="5x5 Funkgruppe" weight=8
    export function zeige5x5Funkgruppe() {
        //if (n5x5_funkgruppe != n_funkgruppe) {
        //    n5x5_funkgruppe = n_funkgruppe
        zeigeBIN(n_funkgruppe, ePlot.hex, 1) // 5x5 x=0-1 y=1-2-3-4 (y=0 ist bei hex immer aus)
        //}
    }


    //% group="25 LED" advanced=true color=#54C9C9
    //% block="5x5 aktive Motoren %buffer [0][3]" weight=7
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

    //% group="25 LED" advanced=true color=#54C9C9 deprecated=true
    //% block="5x5 zeige Motor Power %buffer [0][3] || x3 %x3 x4 %x4" weight=7
    //% buffer.shadow="radio_sendBuffer19"
    export function zeige5x5Status(buffer: Buffer, x3?: number, x4?: number) {
        if (n5x5_x01y0 != (buffer[0] & 0x30)) {
            //    n5x5_funkgruppe = n_funkgruppe
            //    zeigeBIN(n_funkgruppe, ePlot.hex, 1) // 5x5 x=0-1 y=1-2-3-4 (y=0 ist bei hex immer aus)

            n5x5_x01y0 = (buffer[0] & 0x30) // Betriebsart 00 01 10 11 (x=0-1 y=0)
            if ((n5x5_x01y0 & 0x20) == 0x20) { led.plot(0, 0) } else { led.unplot(0, 0) }
            if ((n5x5_x01y0 & 0x10) == 0x10) { led.plot(1, 0) } else { led.unplot(1, 0) }
        }

        if (n5x5_x2 != buffer[3]) {
            n5x5_x2 = buffer[3]
            let x = 2 // 5x5 x=2 Motor Power außer m0
            if ((n5x5_x2 & e3aktiviert.m1) == e3aktiviert.m1) { led.plot(x, 0) } else { led.unplot(x, 0) }
            if ((n5x5_x2 & e3aktiviert.ma) == e3aktiviert.ma) { led.plot(x, 1) } else { led.unplot(x, 1) }
            if ((n5x5_x2 & e3aktiviert.mb) == e3aktiviert.mb) { led.plot(x, 2) } else { led.unplot(x, 2) }
            if ((n5x5_x2 & e3aktiviert.mc) == e3aktiviert.mc) { led.plot(x, 3) } else { led.unplot(x, 3) }
            if ((n5x5_x2 & e3aktiviert.md) == e3aktiviert.md) { led.plot(x, 4) } else { led.unplot(x, 4) }

            /*   let x2 = ((n5x5_Buffer3 & e3aktiviert.m1) == e3aktiviert.m1 ? 16 : 0)
                  + ((n5x5_Buffer3 & e3aktiviert.ma) == e3aktiviert.ma ? 8 : 0)
                  + ((n5x5_Buffer3 & e3aktiviert.mb) == e3aktiviert.mb ? 4 : 0)
                  + ((n5x5_Buffer3 & e3aktiviert.mc) == e3aktiviert.mc ? 2 : 0)
                  + ((n5x5_Buffer3 & e3aktiviert.md) == e3aktiviert.md ? 1 : 0)
              zeigeBIN(x2, ePlot.bin, 2) // 5x5 x=2 
              */
        }

        if (!x3 && n5x5_x3 != buffer[1]) { // zeigt Motor0 aus Buffer[1] 1..16..31 (x=3)
            n5x5_x3 = buffer[1]
            if (n5x5_x3 == 0)
                zeigeBIN(0, ePlot.bin, 3)
            else
                zeigeBIN(mapInt32(n5x5_x3, 1, 255, 1, 31), ePlot.bin, 3)
        } else if (x3 && n5x5_x3 != x3) {
            zeigeBIN(x3, ePlot.bin, 3)
        }

        if (!x4 && n5x5_x4 != buffer[2]) { // zeigt Servo0 aus Buffer[2] 1..16..31 (x=4)
            n5x5_x4 = buffer[2]
            zeigeBIN(n5x5_x4 & 0x1F, ePlot.bin, 4)
        } else if (x4 && n5x5_x4 != x4) {
            zeigeBIN(x4, ePlot.bin, 4)
        }
    }

    //% group="25 LED" advanced=true color=#54C9C9
    //% block="5x5 Joystick %buffer [1][2]" weight=5
    //% buffer.shadow="radio_sendBuffer19"
    export function zeige5x5Joystick(buffer: Buffer) {
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
    }

    // group="25 LED" subcategory="Sender" color=#54C9C9
    // block="5x5 zeige Funkgruppe und 1\\|3\\|5" weight=7
    // n.defl=0
    /* export function zeigeStatus5x5() {
        if (joystickButtonOn() || getSwitch135())
            n_enableButtonFunkgruppe = false
        if (n_enableButtonFunkgruppe || getSwitch() == eStatus.nicht_angeschlossen)
            zeigeBIN(n_funkgruppe, ePlot.hex, 1)
        else
            zeigeText(getSwitch())
    } */


    //% group="25 LED" advanced=true color=#54C9C9
    //% block="5x5 zeige Text wenn geändert %text" weight=2
    export function zeigeText(text: any) {
        let tx = convertToText(text)
        if (tx != n_showString) {
            n_showString = tx
            basic.showString(tx)
        }
    }

    // zeigt Funkgruppe oder i²C Adresse im 5x5 Display binär an

    export enum ePlot {
        //% block="BIN 0..31"
        bin,
        //% block="HEX Zahl"
        hex,
        //% block="BCD Zahl"
        bcd
    }

    //% group="25 LED" advanced=true color=#54C9C9
    //% block="5x5 zeige binär %int %format ←x %x" weight=1
    //% x.min=0 x.max=4 x.defl=4
    export function zeigeBIN(int: number, format: ePlot, x: number) {
        int = Math.imul(int, 1) // 32 bit signed integer
        x = Math.imul(x, 1) // entfernt mögliche Kommastellen

        if (format == ePlot.bin && between(x, 0, 4)) {
            for (let y = 4; y >= 0; y--) {
                if ((int % 2) == 1) { led.plot(x, y) } else { led.unplot(x, y) }
                int = int >> 1 // bitweise Division durch 2
            }
        } else {
            while (int > 0 && between(x, 0, 4)) {
                if (format == ePlot.bcd) {
                    zeigeBIN(int % 10, ePlot.bin, x) // Ziffer 0..9
                    int = Math.idiv(int, 10) // 32 bit signed integer
                } else if (format == ePlot.hex) {
                    zeigeBIN(int % 16, ePlot.bin, x) // Ziffer 0..15
                    int = int >> 4 // bitweise Division durch 16
                }
                x--
            }
        }
    }


} // led5x5.ts
