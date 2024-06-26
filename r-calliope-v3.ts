
namespace receiver { // r-calliope-v3.ts
    /*
Diese Datei wird nur bei Calliope mini v3 geladen. In pxt.json steht:
    "fileDependencies": {
        "r-aktoren-v3.ts": "v3"
    }

Der Code behandelt Ereignisse und übergibt die Parameter an Funktionen, die es nur bei v3 gibt.
Bei !v3 ignoriert der Compiler nicht existierende Funktionen und zeigt keinen Fehler an.

Ein Ereignis definieren:
        let onSetLedColorsHandler: (color1: number, color2: number, color3: number, brightness: number) => void

        export function onSetLedColors(cb: (a: number, b: number, c: number, brightness: number) => void) {
            onSetLedColorsHandler = cb
        }

So kann getestet werden, ob das Ereignis einen Handler hat:
        if (onSetLedColorsHandler)
            onSetLedColorsHandler(n_rgbled[0], n_rgbled[1], n_rgbled[2], helligkeit) // Ereignis Block auslösen, nur wenn benutzt
        else
            basic.setLedColor(n_rgbled[0])




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


    receiver.onSetLedColors(function (a, b, c, brightness) {
        basic.setLedColors(a, b, c, brightness) // gibt es nur bei v3, sonst any
    })

    receiver.onDualMotorPower(function (motor: Motor, duty_percent) {
        motors.dualMotorPower(motor, duty_percent)
    })

} // r-calliope-v3.ts