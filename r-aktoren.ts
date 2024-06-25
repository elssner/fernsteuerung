// Gib deinen Code hier ein

namespace receiver { // r-aktoren.ts

    // PINs
    const c_pinRelay = DigitalPin.C9 // Relais auf der Leiterplatte schaltet 9V Akku für eigene Stromversorgung an VM+
    const c_pinC12 = DigitalPin.C12 // GPIO für Grove (5V) Licht oder Buzzer

    // I2C Adressen
    const i2cRelay = 0x19  // I²C Adresse Single Relay (Kran Elektromagnet)




    export enum eRGBled { a, b, c } // Index im Array
    let n_rgbled = [0, 0, 0] // speichert 3 LEDs, wenn nur eine geändert wird
    let n_rgbledtimer = input.runningTime() // ms seit Start, zwischen zwei Aufrufen ist eine Pause erforderlich



    // ========== group="RGB LEDs (v3)" subcategory="Aktoren"

    // deklariert die Variable mit dem Delegat-Typ '(color1: number, color2: number, color3: number, brightness: number) => void'
    // ein Delegat ist die Signatur einer function mit den selben Parametern
    // es wird kein Wert zurück gegeben (void)
    // die Variable ist noch undefined, also keiner konkreten Funktion zugeordnet
    let onSetLedColorsHandler: (color1: number, color2: number, color3: number, brightness: number) => void


    // sichtbarer Event-Block; deprecated=true
    // wird bei v3 automatisch im Code r-aktoren-v3.ts aufgerufen und deshalb nicht als Block angezeigt

    //% group="RGB LEDs (v3)" subcategory="Aktoren" deprecated=true
    //% block="SetLedColors" weight=9
    //% draggableParameters=reporter
    export function onSetLedColors(cb: (a: number, b: number, c: number, brightness: number) => void) {
        // das ist der sichtbare Ereignis Block 'SetLedColors (a, b, c, brightness)'
        // hier wird nur der Delegat-Variable eine konkrete callback function zugewiesen
        // dieser Block speichert in der Variable, dass er beim Ereignis zurückgerufen werden soll
        onSetLedColorsHandler = cb
        // aufgerufen wird in der function 'rgbLEDs' die der Variable 'onSetLedColorsHandler' zugewiesene function
        // das sind die Blöcke, die später im Ereignis Block 'SetLedColors (a, b, c, brightness)' enthalten sind
    }



    //% group="RGB LEDs (v3)" subcategory="Aktoren"
    //% block="RGB LEDs %led %color %on || Helligkeit %helligkeit \\%" weight=6
    //% color.shadow="colorNumberPicker"
    //% on.shadow="toggleOnOff"
    //% helligkeit.min=5 helligkeit.max=100 helligkeit.defl=20
    //% inlineInputMode=inline 
    export function rgbLEDon(led: eRGBled, color: number, on: boolean, helligkeit = 20) {
        rgbLEDs(led, (on ? color : 0), false, helligkeit)
    }

    //% group="RGB LEDs (v3)" subcategory="Aktoren"
    //% block="RGB LEDs %led %color blinken %blinken || Helligkeit %helligkeit \\%" weight=5
    //% color.shadow="colorNumberPicker"
    //% blinken.shadow="toggleYesNo"
    //% helligkeit.min=5 helligkeit.max=100 helligkeit.defl=20
    //% inlineInputMode=inline 
    export function rgbLEDs(led: eRGBled, color: number, blinken: boolean, helligkeit = 20) {
        if (blinken && n_rgbled[led] != 0)
            n_rgbled[led] = 0
        else
            n_rgbled[led] = color

        while (input.runningTime() < (n_rgbledtimer + 1)) { // mindestens 1 ms seit letztem basic.setLedColors warten
            control.waitMicros(100)
        }
        n_rgbledtimer = input.runningTime()  // ms seit Start

        //basic.setLedColors(n_rgbled[0], n_rgbled[1], n_rgbled[2])

        // die Variable 'onSetLedColorsHandler' ist normalerweise undefined, dann passiert nichts
        // die Variable erhält einen Wert, wenn der Ereignis Block 'onSetLedColors' einmal im Code vorkommt
        // der Wert der Variable 'onSetLedColorsHandler' ist die function, die bei true zurück gerufen wird
        // die function ruft mit den 4 Parametern die Blöcke auf, die im Ereignis-Block stehen
        if (onSetLedColorsHandler)
            onSetLedColorsHandler(n_rgbled[0], n_rgbled[1], n_rgbled[2], helligkeit) // v3 Ereignis Block auslösen, nur wenn benutzt
        else
            basic.setLedColor(n_rgbled[0]) // v1 v2
    }





    /* 
        let onDualMotorPowerHandler: (motor: number, duty_percent: number) => void
        
        export function onDualMotorPower(cb: (motor: number, duty_percent: number) => void) {
            onDualMotorPowerHandler = cb
        }
     */


    // ========== group="Relais" subcategory="Aktoren"


    //% group="Relais C9" subcategory="Aktoren"
    //% block="Stromversorgung 9V %pON"
    //% pON.shadow="toggleOnOff"
    export function pinRelay(pON: boolean) {
        pins.digitalWritePin(c_pinRelay, pON ? 1 : 0)
    }


    //% group="Pin C12" subcategory="Aktoren"
    //% block="digitaler Pin %pON"
    //% pON.shadow="toggleOnOff"
    export function pinGPIO(pON: boolean) {
        pins.digitalWritePin(c_pinC12, pON ? 1 : 0)
    }









    // ========== group="Klingelton P0" subcategory="Aktoren"

    let n_ringTone = false

    //% group="Klingelton P0" subcategory="Aktoren"
    //% block="Ton %pON"
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

    //% group="Hupe" subcategory="Aktoren" deprecated=true
    //% block="Hupe %pON"
    //% pON.shadow="toggleOnOff"
    export function hupe(pON: boolean) {
        if (n_ringTone !== pON) {
            n_ringTone = pON
            if (n_ringTone)
                music.ringTone(262)
            else
                music.stopAllSounds()
            // pins.digitalWritePin(pinBuzzer, n_buzzer ? 1 : 0)
        }
    }



    // ========== group="SparkFun Qwiic Single Relay 0x19" subcategory="Aktoren"

    const SINGLE_OFF = 0x00
    const SINGLE_ON = 0x01

    //% group="SparkFun Qwiic Single Relay 0x19" subcategory="Aktoren"
    //% block="Kran Magnet %pOn"
    //% pOn.shadow="toggleOnOff"
    export function qwiicRelay(pOn: boolean) {
        pins.i2cWriteBuffer(i2cRelay, Buffer.fromArray([pOn ? SINGLE_ON : SINGLE_OFF]))
    }

    //% group="SparkFun Qwiic Single Relay 0x19" subcategory="Aktoren" deprecated=true
    //% block="Kran Magnet %pOn"
    //% pOn.shadow="toggleOnOff"
    export function turnRelay(pOn: boolean) {
        pins.i2cWriteBuffer(i2cRelay, Buffer.fromArray([pOn ? SINGLE_ON : SINGLE_OFF]))
    }

} // r-aktoren.ts
