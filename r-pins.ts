
namespace receiver { // r-pins.ts

    // PINs
    const c_pinRelay = DigitalPin.C9 // Relais auf der Leiterplatte schaltet 9V Akku für eigene Stromversorgung an VM+
    const c_pinC12 = DigitalPin.C12 // GPIO für Grove (5V) Licht oder Buzzer



    // ========== group="Relais" subcategory="Pins"

    //% group="Relais C9" subcategory="Pins"
    //% block="Stromversorgung 9V %pON"
    //% pON.shadow="toggleOnOff"
    export function pinRelay(pON: boolean) {
        pins.digitalWritePin(c_pinRelay, pON ? 1 : 0)
    }

    //% group="Pin C12" subcategory="Pins"
    //% block="digitaler Pin C12 %pON"
    //% pON.shadow="toggleOnOff"
    export function pinGPIO(pON: boolean) {
        pins.digitalWritePin(c_pinC12, pON ? 1 : 0)
    }



    // ========== group="Klingelton P0" subcategory="Pins"

    let n_ringTone = false

    //% group="Klingelton P0" subcategory="Pins"
    //% block="Ton P0 %pON"
    //% pON.shadow="toggleOnOff"
    export function ringTone(pON: boolean) {
        if (n_ringTone !== pON) { // XOR
            n_ringTone = pON
            if (n_ringTone)
                music.ringTone(262)
            else
                music.stopAllSounds()
            // pins.digitalWritePin(pinBuzzer, n_buzzer ? 1 : 0)
        }
    }

}