
namespace receiver { // r-pins.ts

    // ========== group="Encoder" subcategory="Sensoren"
    export enum eEncoderEinheit { cm, Impulse }

    let n_EncoderCounter: number = 0 // Impuls Zähler
    let n_EncoderFaktor = 63.3 * (26 / 14) / (8 * Math.PI) // 63.3 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm
    //let n_EncoderStrecke_cm: number = 0 // löst Event aus bei Zähler in cm
    let n_EncoderStrecke_impulse: number = 0
    export let n_EncoderAutoStop = false // true während der Fahrt, false bei Stop nach Ende der Strecke
/* 
    // Event Handler
    pins.onPulsed(a_PinEncoder[n_Modell], PulseValue.Low, function () {
        // Encoder 63.3 Impulse pro U/Motorwelle
        if (motorA_get() >= c_MotorStop)
            n_EncoderCounter += 1 // vorwärts
        else
            n_EncoderCounter -= 1 // rückwärts

        if (n_EncoderStrecke_impulse > 0 && Math.abs(n_EncoderCounter) >= n_EncoderStrecke_impulse) {
            n_EncoderStrecke_impulse = 0 // Ereignis nur einmalig auslösen, wieder aktivieren mit encoder_start

            //n_EncoderStopEvent = true
            if (n_EncoderAutoStop) {
                motorA255(c_MotorStop)
                n_EncoderAutoStop = false
            }

            if (onEncoderStopHandler)
                onEncoderStopHandler(n_EncoderCounter / n_EncoderFaktor)
        }
    })
 */
    let onEncoderStopHandler: (v: number) => void

    //% block="wenn Ziel erreicht" subcategory="Sensoren"
    //% draggableParameters=reporter
    export function onEncoderStop(cb: (v: number) => void) {
        onEncoderStopHandler = cb
    }

    //% group="Encoder" subcategory="Sensoren"
    //% block="Encoder Start, Stop Ereignis bei %streckecm cm || AutoStop %autostop" weight=9
    //% streckecm.min=1 streckecm.max=255 streckecm.defl=20
    //% autostop.shadow="toggleYesNo" autostop.defl=1
    export function encoder_start(streckecm: number, autostop = true) {
        n_EncoderCounter = 0 // Impuls Zähler zurück setzen

        if (streckecm > 0) {
            n_EncoderStrecke_impulse = Math.round(streckecm * n_EncoderFaktor)
            n_EncoderAutoStop = autostop
            
           radio.n_lastconnectedTime = input.runningTime() // Connection-Timeout Zähler zurück setzen
        } else {
            n_EncoderStrecke_impulse = 0
        }
    }



    //% group="Encoder" subcategory="Sensoren"
    //% block="Fahrstrecke %pVergleich %cm cm" weight=7
    export function encoder_vergleich(pVergleich: eVergleich, cm: number) {
        switch (pVergleich) {
            case eVergleich.gt: return encoder_get(eEncoderEinheit.cm) >= cm
            case eVergleich.lt: return encoder_get(eEncoderEinheit.cm) <= cm
            default: return false
        }
    }

    //% group="Encoder" subcategory="Sensoren"
    //% block="warte bis Strecke %pVergleich %cm cm || Pause %ms ms" weight=6
    //% cm.defl=15 ms.defl=20
    export function encoder_warten(pVergleich: eVergleich, cm: number, ms?: number) {
        while (encoder_vergleich(pVergleich, cm)) {
            basic.pause(ms)
        }
    }


    //% group="warten" subcategory="Sensoren"
    //% block="warte bis %bedingung || Pause %ms ms" weight=2
    //% ms.defl=20
    /* export function wartebis(bedingung: boolean, ms?: number) {
        while (!bedingung) {
            basic.pause(ms)
        }
    } */



    //% group="Encoder" subcategory="Sensoren"
    //% block="Encoder %pEncoderEinheit" weight=4
    export function encoder_get(pEncoderEinheit: eEncoderEinheit) {
        if (pEncoderEinheit == eEncoderEinheit.cm)
            // 63.3 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm
            // Test: 946 Impulse = 200 cm
            return Math.round(n_EncoderCounter / n_EncoderFaktor)
        else
            return n_EncoderCounter
    }



} // r-pins.ts
