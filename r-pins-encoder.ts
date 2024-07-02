
namespace receiver { // r-pins.ts

    let n_EncoderCounter: number = 0 // Impuls Zähler
    let n_EncoderFaktor = 63.3 * (26 / 14) / (8 * Math.PI) // 63.3 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm
    let n_EncoderStrecke_impulse: number = 0
    export let n_EncoderAutoStop = false // true während der Fahrt, false bei Stop nach Ende der Strecke

    // aufgerufen im pins.onPulsed Ereignis, um die Zähl-Richtung +/- der Impule zu bestimmen
    function selectEncoderMotorRichtung() { // true: vorwärts > 128
        switch (n_Modell) {
            case eModell.v3: return n_Motor0Speed >= c_MotorStop // dualEncoderM0Richtung()
            case eModell.car4: return a_MotorSpeed[eMotor.ma] >= c_MotorStop // qEncoderMotorRichtung(eMotor.ma)
            //case eModell.calli2bot:
            default: return false
        }
    }



    // aufgerufen von receiver.beimStart
    export function startEncoder(modell: eModell, radDmm: number) {
        n_EncoderFaktor = 63.9 * (26 / 14) / (radDmm / 10 * Math.PI)

        /* if (modell == eModell.v3) {
            n_EncoderFaktor = 63.9 * (26 / 14) / (6.5 * Math.PI)
        } else if (modell == eModell.car4) {
            n_EncoderFaktor = 63.9 * (26 / 14) / (8 * Math.PI) // 63.9 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm
        }
        else if (modell == eModell.calli2bot) {

        }
 */

        if (modell == eModell.v3 || modell == eModell.car4) {

            // ========== Event Handler registrieren
            pins.onPulsed(a_PinEncoder[modell], PulseValue.Low, function () {
                // soll Prellen verhindern
                if (pins.pulseDuration() > 2000) { // 2 ms = 500 Hz, gemessen 174 Hz max. Drehzahl, 2 Flanken ~ 400 Hz

                    // Encoder 63.3 Impulse pro U/Motorwelle
                    if (selectEncoderMotorRichtung()) // true: vorwärts > 128
                        n_EncoderCounter += 1 // vorwärts
                    else
                        n_EncoderCounter -= 1 // rückwärts

                    if (n_EncoderStrecke_impulse > 0 && Math.abs(n_EncoderCounter) >= n_EncoderStrecke_impulse) {
                        n_EncoderStrecke_impulse = 0 // Ereignis nur einmalig auslösen, wieder aktivieren mit encoder_start

                        //n_EncoderStopEvent = true
                        if (n_EncoderAutoStop) {
                            selectEncoderMotor255(c_MotorStop) //   motorA255(c_MotorStop)
                            n_EncoderAutoStop = false
                        }

                        if (onEncoderStopHandler)
                            onEncoderStopHandler(n_EncoderCounter / n_EncoderFaktor)
                    }
                }
            })
            // ========== Event Handler

            pins.setPull(a_PinEncoder[modell], PinPullMode.PullUp) // Encoder PIN Eingang PullUp

        }
    }



    //% group="Encoder" subcategory="Encodermotor"
    //% block="Encodermotor starten (1 ↓ 128 ↑ 255) %speed" weight=9
    //% speed.min=0 speed.max=255 speed.defl=128
    export function selectEncoderMotor255(speed: number) {
        switch (n_Modell) {
            case eModell.v3: { // Fahrmotor an Calliope v3 Pins
                motor255(eMotor01.M0, speed)
                break
            }
            case eModell.car4: { // Fahrmotor am Qwiic Modul
                qMotor255(eMotor.ma, speed)
                break
            }
            case eModell.calli2bot: { // Fahrmotor Calli:Bot I²C

                break
            }
        }
    }



    // ========== group="Encoder" subcategory="Encodermotor"


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

    //% group="Encoder" subcategory="Encodermotor"
    //% block="Encoder starten (Stop Ereignis bei %streckecm cm) || AutoStop %autostop" weight=8
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



    // ========== group="mehr" subcategory="Encodermotor"

    //% group="... mehr" subcategory="Encodermotor"
    //% block="Fahrstrecke %pVergleich %cm cm" weight=7
    export function encoder_vergleich(pVergleich: eVergleich, cm: number) {
        switch (pVergleich) {
            case eVergleich.gt: return encoder_get(eEncoderEinheit.cm) >= cm
            case eVergleich.lt: return encoder_get(eEncoderEinheit.cm) <= cm
            default: return false
        }
    }

    //% group="... mehr" subcategory="Encodermotor"
    //% block="warte bis Strecke %pVergleich %cm cm || Pause %ms ms" weight=6
    //% cm.defl=15 ms.defl=20
    export function encoder_warten(pVergleich: eVergleich, cm: number, ms?: number) {
        while (encoder_vergleich(pVergleich, cm)) {
            basic.pause(ms)
        }
    }



    export enum eEncoderEinheit { cm, Impulse }

    //% group="... mehr" subcategory="Encodermotor"
    //% block="Encoder %pEncoderEinheit" weight=4
    export function encoder_get(pEncoderEinheit: eEncoderEinheit) {
        if (pEncoderEinheit == eEncoderEinheit.cm)
            return Math.round(n_EncoderCounter / n_EncoderFaktor)
        else
            return n_EncoderCounter
    }


    // ========== EVENT HANDLER === sichtbarer Event-Block

    let onEncoderStopHandler: (cm: number) => void

    //% group="Event Handler" subcategory="Encodermotor"
    //% block="wenn Ziel erreicht"
    //% draggableParameters=reporter
    export function onEncoderStop(cb: (cm: number) => void) {
        onEncoderStopHandler = cb
    }


} // r-pins.ts
