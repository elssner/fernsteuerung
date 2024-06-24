
namespace receiver { // r-aktoren-v3.ts
/*
24.11.2023 14:07 Juri
https://forum.calliope.cc/t/makecode-betaversion-6-0-24/2725/16?u=asp.net

Ja, die Abhängigkeit zu den Versionspaketen in die Erweiterung zu schreiben kommt vermutlich den User-Einstellungen in die Queere. 
Das also nur bei Projekten, die importiert werden sollen und nicht bei Erweiterungen, die in bestehende Projekte geladen werden machen.

Wenn du über „importieren → github → neues Projekt" gehst, sollte in der pxt.json aber auch keine Boardversion drin stehen 
(ob das anders wird, wenn das Default laden des v1 Boards behoben wird weiß ich allerdings nicht). 
Ansonsten beim committen eben darauf achten, dass die nicht mit reinkommt.

Du kannst aber Dateien nur abhängig von anderen Erweiterungen laden:

    "fileDependencies": {
        "custom-a.ts": "v2", // Lädt nur, wenn der mini 2 ausgewählt ist
        "custom-b.ts": "v1 || v2", // Lädt beim mini 1 und 2
         "custom-b.ts": "!v3" // Lädt nicht beim mini 3
    },
Bei pxt-jacdac wird das u.a. gemacht, um nach der Editor-Variante zu unterscheiden:
https://github.com/microsoft/pxt-jacdac/blob/78e2c68b85363e580cc4c757fdce89a032e990f9/pxt.json#L73
*/


    receiver.onSetLedColors(function (a, b, c) {
        basic.setLedColors(a, b, c)
    })

    /* receiver.onDualMotorPower(function (motor, duty_percent) {
        motors.dualMotorPower(motor, duty_percent)
    }) */

/* 
    let n_rgbled = [0, 0, 0]

    //% group="Licht" subcategory="Aktoren"
    //% block="RGB LEDs3 %led %color %on" weight=6
    //% color.shadow="colorNumberPicker"
    //% on.shadow="toggleOnOff"
    export function rgbLEDon3(led: eRGBled, color: number, on: boolean) {
        rgbLEDs(led, (on ? color : 0), false)
    }

    
    //% group="Licht" subcategory="Aktoren"
    //% block="RGB LEDs3 %led %color blinken %blinken" weight=5
    //% color.shadow="colorNumberPicker"
    //% blinken.shadow="toggleYesNo"
    export function rgbLEDs3(led: eRGBled, color: number, blinken: boolean) {
        if (blinken && n_rgbled[led] != 0)
            n_rgbled[led] = 0
        else
            n_rgbled[led] = color

        basic.setLedColors(n_rgbled[0], n_rgbled[1], n_rgbled[2])
    }
 */
}