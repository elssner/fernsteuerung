
namespace receiver { // r-pins.ts


    function selectMotorRichtung() { // true: vorwärts > 128
        switch (n_Modell) {
            case eModell.v3: return dualEncoderM0Richtung()
            case eModell.car4: return qEncoderMotorRichtung(eMotor.ma)
            //case eModell.calli2bot:
            default: return false
        }
    }
    function selectMotorStop() {
        switch (n_Modell) {
            case eModell.v3: dualEncoderM0Stop()
            case eModell.car4: qEncoderMotorStop(eMotor.ma)
            //case eModell.calli2bot:
        }
    }



    // ========== group="Encoder" subcategory="Pins"
    export enum eEncoderEinheit { cm, Impulse }

    let n_EncoderCounter: number = 0 // Impuls Zähler
    let n_EncoderFaktor = 63.3 * (26 / 14) / (8 * Math.PI) // 63.3 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm
    //let n_EncoderStrecke_cm: number = 0 // löst Event aus bei Zähler in cm
    let n_EncoderStrecke_impulse: number = 0
    export let n_EncoderAutoStop = false // true während der Fahrt, false bei Stop nach Ende der Strecke




    // aufgerufen von receiver.beimStart
    export function startEncoder(modell: eModell) {
        /*  switch (modell) {
 
             case eModell.v3: {   // Maker Kit Car Roboter Räder 6.5 cm
                 pins.setPull(a_PinEncoder[modell], PinPullMode.PullUp) // Encoder PIN Eingang PullUp
                 n_EncoderFaktor = 63.9 * (26 / 14) / (6.5 * Math.PI)
                 break
             }
             case eModell.car4: { // Offroader Räder 8 cm
                 pins.setPull(a_PinEncoder[modell], PinPullMode.PullUp) // Encoder PIN Eingang PullUp
                 n_EncoderFaktor = 63.9 * (26 / 14) / (8 * Math.PI) // 63.9 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm
                 break
             }
             case eModell.calli2bot: {
                 break
             }
         } */

        if (modell == eModell.v3) {
            n_EncoderFaktor = 63.9 * (26 / 14) / (6.5 * Math.PI)

        } else if (modell == eModell.car4) {
            n_EncoderFaktor = 63.9 * (26 / 14) / (8 * Math.PI) // 63.9 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm
        }
        else if (modell == eModell.calli2bot) {

        }


        if (modell == eModell.v3 || modell == eModell.car4) {
            pins.setPull(a_PinEncoder[modell], PinPullMode.PullUp) // Encoder PIN Eingang PullUp


            // ========== Event Handler
            pins.onPulsed(a_PinEncoder[modell], PulseValue.Low, function () {
                // Encoder 63.3 Impulse pro U/Motorwelle
                if (selectMotorRichtung()) // true: vorwärts > 128
                    n_EncoderCounter += 1 // vorwärts
                else
                    n_EncoderCounter -= 1 // rückwärts

                if (n_EncoderStrecke_impulse > 0 && Math.abs(n_EncoderCounter) >= n_EncoderStrecke_impulse) {
                    n_EncoderStrecke_impulse = 0 // Ereignis nur einmalig auslösen, wieder aktivieren mit encoder_start

                    //n_EncoderStopEvent = true
                    if (n_EncoderAutoStop) {
                        selectMotorStop() //   motorA255(c_MotorStop)
                        n_EncoderAutoStop = false
                    }

                    if (onEncoderStopHandler)
                        onEncoderStopHandler(n_EncoderCounter / n_EncoderFaktor)
                }
            })
            // ========== Event Handler
        }
    }


    /* 
        // Event Handler
        pins.onPulsed(a_PinEncoder[n_Modell], PulseValue.Low, function () {
            // Encoder 63.3 Impulse pro U/Motorwelle
            if (selectMotorRichtung()) // true: vorwärts > 128
                n_EncoderCounter += 1 // vorwärts
            else
                n_EncoderCounter -= 1 // rückwärts
    
            if (n_EncoderStrecke_impulse > 0 && Math.abs(n_EncoderCounter) >= n_EncoderStrecke_impulse) {
                n_EncoderStrecke_impulse = 0 // Ereignis nur einmalig auslösen, wieder aktivieren mit encoder_start
    
                //n_EncoderStopEvent = true
                if (n_EncoderAutoStop) {
                    selectMotorStop() //   motorA255(c_MotorStop)
                    n_EncoderAutoStop = false
                }
    
                if (onEncoderStopHandler)
                    onEncoderStopHandler(n_EncoderCounter / n_EncoderFaktor)
            }
        })
     */

    let onEncoderStopHandler: (cm: number) => void

    //% group="Encoder" subcategory="Pins"
    //% block="wenn Ziel erreicht"
    //% draggableParameters=reporter
    export function onEncoderStop(cb: (cm: number) => void) {
        onEncoderStopHandler = cb
    }

    //% group="Encoder" subcategory="Pins"
    //% block="Encoder starten (Stop Ereignis bei %streckecm cm) || AutoStop %autostop" weight=9
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



    //% group="Encoder" subcategory="Pins"
    //% block="Fahrstrecke %pVergleich %cm cm" weight=7
    export function encoder_vergleich(pVergleich: eVergleich, cm: number) {
        switch (pVergleich) {
            case eVergleich.gt: return encoder_get(eEncoderEinheit.cm) >= cm
            case eVergleich.lt: return encoder_get(eEncoderEinheit.cm) <= cm
            default: return false
        }
    }

    //% group="Encoder" subcategory="Pins"
    //% block="warte bis Strecke %pVergleich %cm cm || Pause %ms ms" weight=6
    //% cm.defl=15 ms.defl=20
    export function encoder_warten(pVergleich: eVergleich, cm: number, ms?: number) {
        while (encoder_vergleich(pVergleich, cm)) {
            basic.pause(ms)
        }
    }


    //% group="warten" subcategory="Pins"
    //% block="warte bis %bedingung || Pause %ms ms" weight=2
    //% ms.defl=20
    /* export function wartebis(bedingung: boolean, ms?: number) {
        while (!bedingung) {
            basic.pause(ms)
        }
    } */



    //% group="Encoder" subcategory="Pins"
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
