
namespace radio { // led5x5.ts



    //% group="25 LED" subcategory="Bluetooth"
    //% block="BCD Zahl %int anzeigen ←x %x" weight=6
    //% x.min=0 x.max=4 x.defl=4
    export function plotBCD(int: number, x: number) {
        let bi: number = Math.trunc(int)
        while (bi > 0 && between(x, 0, 4)) {
            plot25LED(bi % 10, x)
            bi = Math.idiv(bi, 10)
            x--
        }
    }


    //% group="25 LED" subcategory="Bluetooth"
    //% block="HEX Zahl %int anzeigen ←x %x" weight=6
    //% x.min=0 x.max=4 x.defl=4
    export function plotHEX(int: number, x: number) {
        let bi: number = Math.trunc(int)
        while (bi > 0 && between(x, 0, 4)) {
            plot25LED(bi % 16, x)
            bi = bi >> 4
            x--
        }
    }


    //% group="25 LED" subcategory="Bluetooth"
    //% block="BIN Ziffer %int anzeigen x %x" weight=2
    //% x.min=0 x.max=4 x.defl=4
    export function plot25LED(int: number, x: number) {
        if (between(x, 0, 4)) {
            let bi: number = Math.trunc(int)
            for (let y = 4; y >= 0; y--) {
                if ((bi % 2) == 1) { led.plot(x, y) } else { led.unplot(x, y) }
                bi = bi >> 1
            }
        }
    }



} // led5x5.ts
