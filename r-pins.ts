
namespace receiver { // r-pins.ts

    // PINs
    //  const c_pinRelay = DigitalPin.C9 
    //  const c_pinC12 = DigitalPin.C12 



    // ========== group="Relais" subcategory="Pins"
    // Relais auf der Leiterplatte schaltet 9V Akku für eigene Stromversorgung an VM+

    //% group="Digital Pins" subcategory="Pins"
    //% block="Stromversorgung 9V %pON" weight=8
    //% pON.shadow="toggleOnOff"
    export function pinRelay(pON: boolean) {
        pins.digitalWritePin(a_PinRelay[n_Modell], pON ? 1 : 0)
    }

    // GPIO für Grove (5V) Licht oder Buzzer

    //% group="Digital Pins" subcategory="Pins"
    //% block="Licht %pON" weight=7
    //% pON.shadow="toggleOnOff"
    export function pinGPIO4(pON: boolean) {
        pins.digitalWritePin(a_PinGPIO4[n_Modell], pON ? 0 : 1)
    }

    export enum eDigitalPins {
        P0 = DigitalPin.P0,
        P1 = DigitalPin.P1,
        P2 = DigitalPin.P2,
        P3 = DigitalPin.P3,
        //% block="C16 Grove RX"
        C16 = DigitalPin.C16,
        //% block="C17 Grove TX"
        C17 = DigitalPin.C17
    }

    //% group="Digital Pins" subcategory="Pins"
    //% block="Digital Pin %pin %pON" weight=6
    //% pON.shadow="toggleOnOff"
    export function digitalWritePin(pin: eDigitalPins, pON: boolean) {
        pins.digitalWritePin(<number>pin, pON ? 0 : 1)
    }

    // ========== group="Klingelton P0" subcategory="Pins"

    let n_ringTone = false

    //% group="Klingelton P0" subcategory="Pins"
    //% block="Ton P0 %pON || Frequenz %frequency Hz"
    //% pON.shadow="toggleOnOff"
    //% frequency.defl=262
    export function ringTone(pON: boolean, frequency = 262) {
        if (n_ringTone !== pON) { // XOR
            n_ringTone = pON
            if (n_ringTone)
                music.ringTone(frequency)
            else
                music.stopAllSounds()
            // pins.digitalWritePin(pinBuzzer, n_buzzer ? 1 : 0)
        }
    }

}