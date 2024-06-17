
namespace radio { // led5x5.ts


    let n_showString = ""

    //% group="25 LED" advanced=true color=#54C9C9
    //% block="5x5 zeige Status" weight=7
    export function zeigeStatus5x5() {
        if (joystickButtonOn() || getSwitch135())
            n_enableButtonFunkgruppe = false
        if (n_enableButtonFunkgruppe || getSwitch() == eStatus.nicht_angeschlossen)
            zeigeBIN(n_funkgruppe, ePlot.hex, 1)
        else
            zeigeText(getSwitch())
    }


    //% group="25 LED" advanced=true color=#54C9C9
    //% block="5x5 zeige Text wenn geändert %text" weight=5
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

    /* 
        //% group="25 LED" advanced=true
        //% block="BCD Zahl %int anzeigen ←x %x" weight=6
        //% x.min=0 x.max=4 x.defl=4
        export function plotBCD(int: number, x: number) {
            int = Math.imul(int, 1) // 32 bit signed integer
            while (int > 0 && between(x, 0, 4)) {
                plotBIN(int % 10, x)
                int = Math.idiv(int, 10) // 32 bit signed integer
                x--
            }
        }
    
        //% group="25 LED" advanced=true
        //% block="HEX Zahl %int anzeigen ←x %x" weight=6
        //% x.min=0 x.max=4 x.defl=4
        export function plotHEX(int: number, x: number) {
            int = Math.imul(int, 1) // 32 bit signed integer
            while (int > 0 && between(x, 0, 4)) {
                plotBIN(int % 16, x)
                int = int >> 4 // bitweise Division durch 16
                x--
            }
        }
    
        //% group="25 LED" advanced=true
        //% block="BIN 0..31 %int anzeigen x %x" weight=2
        //% x.min=0 x.max=4 x.defl=4
        export function plotBIN(int: number, x: number) {
            int = Math.imul(int, 1) // 32 bit signed integer
            if (between(x, 0, 4)) {
                for (let y = 4; y >= 0; y--) {
                    if ((int % 2) == 1) { led.plot(x, y) } else { led.unplot(x, y) }
                    int = int >> 1 // bitweise Division durch 2
                }
            }
        }
     */




} // led5x5.ts
