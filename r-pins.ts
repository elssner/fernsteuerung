
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
        pins.digitalWritePin(a_PinGPIO4[n_Modell], pON ? 1 : 0)
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



    // ========== group="Klingelton (Calliope v3: P0)" subcategory="Pins"

    let n_ringTone = false

    //% group="Klingelton (Calliope v3: P0)" subcategory="Pins"
    //% block="spiele Note %pON || Frequenz %frequency Hz"
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




    // ========== group="Ultraschall (Calliope v1: C8)" subcategory="Pins"


    // adapted to Calliope mini V2 Core by M.Klein 17.09.2020
    /**
     * Create a new driver of Grove - Ultrasonic Sensor to measure distances in cm
     * @param pin signal pin of ultrasonic ranger module
     */
    //% group="Ultraschall (Calliope v1: C8)" subcategory="Pins"
    //% block="Ultraschall Entfernung in cm" weight=8
    export function groveUltraschall_cm(): number {
        pins.digitalWritePin(c_PinUltraschall, 0);
        control.waitMicros(2);
        pins.digitalWritePin(c_PinUltraschall, 1);
        control.waitMicros(20);
        pins.digitalWritePin(c_PinUltraschall, 0);

        return Math.round(pins.pulseIn(c_PinUltraschall, PulseValue.High, 50000) * 0.0263793)
    }


    // ==========


    export function entfernung_modell() {
        switch (n_Modell) {
            case eModell.v3: {
                if (qUltrasonicRead()) // i2c einlesen
                    return qUltrasonicDistance(eDist.cm)
                else
                    return 0
            }
            case eModell.car4: {
                return groveUltraschall_cm()
            }
            case eModell.calli2bot: {
                return 0
            }
            default:
                return 0
        }
    }

    export enum eVergleich {
        //% block=">="
        gt,
        //% block="<="
        lt
    }

    //% group="Ultraschall (Calliope v1: C8)" subcategory="Pins"
    //% block="Entfernung %pVergleich %cm cm" weight=6
    //% cm.min=1 cm.max=50 cm.defl=15
    export function entfernung_vergleich(pVergleich: eVergleich, p3Entfernung: radio.e3Entfernung) {
        let cm = 0
        switch (p3Entfernung) {
            case
                radio.e3Entfernung.u0: cm = 5
                break
            case
                radio.e3Entfernung.u1: cm = 10
                break
        }

        radio.e3Entfernung.u1
        switch (pVergleich) {
            case eVergleich.gt: return entfernung_modell() >= cm
            case eVergleich.lt: return entfernung_modell() <= cm
            default: return false
        }
    }

}