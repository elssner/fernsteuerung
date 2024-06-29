
namespace receiver { // r-pins.ts

    // PINs
    //  const c_pinRelay = DigitalPin.C9 
    //  const c_pinC12 = DigitalPin.C12 



    // ========== group="Relais" subcategory="Pins"
    // Relais auf der Leiterplatte schaltet 9V Akku für eigene Stromversorgung an VM+

    //% group="Relais" subcategory="Pins"
    //% block="Stromversorgung 9V %pON"
    //% pON.shadow="toggleOnOff"
    export function pinRelay(pON: boolean) {
        pins.digitalWritePin(a_PinRelay[n_Modell], pON ? 1 : 0)
    }

    // GPIO für Grove (5V) Licht oder Buzzer

    //% group="Pin GPIO" subcategory="Pins"
    //% block="Hupe %pON"
    //% pON.shadow="toggleOnOff"
    export function pinGPIO4(pON: boolean) {
        pins.digitalWritePin(a_PinGPIO4[n_Modell], pON ? 1 : 0)
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