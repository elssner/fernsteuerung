
namespace radio { // led5x5.ts

    // zeigt Funkgruppe oder i²C Adresse im 5x5 Display binär an

    //% group="25 LED" subcategory="Bluetooth"
    //% block="BCD Zahl %int anzeigen ←x %x" weight=6
    //% x.min=0 x.max=4 x.defl=4
    export function plotBCD(int: number, x: number) {
        int = Math.imul(int, 1) // 32 bit signed integer
        while (int > 0 && between(x, 0, 4)) {
            plot25LED(int % 10, x)
            int = Math.idiv(int, 10) // 32 bit signed integer
            x--
        }
    }

    //% group="25 LED" subcategory="Bluetooth"
    //% block="HEX Zahl %int anzeigen ←x %x" weight=6
    //% x.min=0 x.max=4 x.defl=4
    export function plotHEX(int: number, x: number) {
        int = Math.imul(int, 1) // 32 bit signed integer
        while (int > 0 && between(x, 0, 4)) {
            plot25LED(int % 16, x)
            int = int >> 4 // bitweise Division durch 16
            x--
        }
    }

    //% group="25 LED" subcategory="Bluetooth"
    //% block="BIN 0..31 %int anzeigen x %x" weight=2
    //% x.min=0 x.max=4 x.defl=4
    export function plot25LED(int: number, x: number) {
        int = Math.imul(int, 1) // 32 bit signed integer
        if (between(x, 0, 4)) {
            for (let y = 4; y >= 0; y--) {
                if ((int % 2) == 1) { led.plot(x, y) } else { led.unplot(x, y) }
                int = int >> 1 // bitweise Division durch 2
            }
        }
    }


} // led5x5.ts
