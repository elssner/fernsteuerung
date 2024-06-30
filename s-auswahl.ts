
namespace sender { // s-auswahl.ts

    export let n_ServoWinkelButtonAB = 0 // 1..16..31 mit A- B+ ändern

    export enum eModell { // zuletzt gewähltes Modell wird im offset 1 dauerhaft gespeiechert
        //% block="Calli:Bot"
        cb2e, // Standardwert CalliBot
        //% block="Maker Kit Car"
        mkcg, // Maker Kit Car ohne und mit Gabelstapler
        //% block="Maker Kit Car Kran"
        mkck, // Maker Kit Car mit Kran
        //% block="CaR 4"
        car4  // CaR 4
    } // so viele Images müssen im Array sein - Bilder am Ende dieser Datei


    // Funktion: wird je nach Modell mit Tasten geändert, steht nicht im Flash

    export enum eFunktion {
        //% block="gestartet"
        ng, // nicht gestartet
        //% block="Fahren und Lenken"
        m0_s0,      // Joystick steuert M0 und Servo (Fahren und Lenken)
        //% block="Gabelstapler"
        m0_m1_s0,   // M0 und M1, Servo über Tasten A- B+ (Gabelstapler)
        //% block="Seilrolle und Drehkranz"
        ma_mb,      // MA und MB (Seilrolle und Drehkranz)
        //% block="Zahnstange und Drehkranz"
        mc_mb       // MC und MB (Zahnstange und Drehkranz)
    }
    export let n_Funktion = eFunktion.ng // aktuell ausgewählte Funktion



    // aufgerufen von sender.beimStart
    /* export function startAuswahlModell() {
        // radio.storageBufferSet(storagei32)
        // let iModell = a_StorageBuffer[eStorageBuffer.modell]
        if (!radio.between(getModell(), 0, a_ModellImages.length - 1))
            // wenn ungültig, Standardwert setzen
            radio.a_StorageBuffer[radio.eStorageBuffer.modell] = radio.eModell.cb2e

        a_ModellImages[getModell()].showImage(0) // Bild vom Modell anzeigen
        basic.pause(1500)
        // return radio.getFunkgruppe() // radio.a_StorageBuffer[radio.eStorageBuffer.funkgruppe]
    } */


    //% group="Auswahl Modell und Funktion" subcategory="Auswahl"
    //% block="Knopf A geklickt" weight=7
    export function buttonA() {
        if (n_Funktion == eFunktion.ng) {
            // wenn nicht gestartet, kann Modell geändert werden
            if (radio.getModell() > 0)
                radio.setModell(radio.getModell() - 1)
            //radio.a_StorageBuffer[radio.eStorageBuffer.modell]--
            a_ModellImages[radio.getModell()].showImage(0)
            radio.n5x5_clearScreen = true
        }
        else if (isModell(eModell.mkck)) { // Modell Kran
            a_Schalter[eSchalter.Magnet] = !a_Schalter[eSchalter.Magnet]
        }
        else if (n_Funktion == eFunktion.m0_s0) { // Joystick steuert M0 und Servo (Fahren und Lenken)

        }
        else if (n_Funktion == eFunktion.m0_m1_s0 && n_ServoWinkelButtonAB > 1) { // M0 und M1, Servo über Tasten A- B+ (Gabelstapler)
            n_ServoWinkelButtonAB--
        }
        //else if (n_Funktion == eFunktion.ma_mb) { // MA und MB (Seilrolle und Drehkranz)
        //}
        //else if (n_Funktion == eFunktion.mc_mb) { // MC und MB (Zahnstange und Drehkranz)
        //}
    }


    //% group="Auswahl Modell und Funktion" subcategory="Auswahl"
    //% block="Knopf B geklickt" weight=6
    export function buttonB() {
        if (n_Funktion == eFunktion.ng) {
            // wenn nicht gestartet, kann Modell geändert werden
            if (radio.getModell() < a_ModellImages.length - 1)
                radio.setModell(radio.getModell() + 1)
            //radio.a_StorageBuffer[radio.eStorageBuffer.modell]++
            a_ModellImages[radio.getModell()].showImage(0)
            radio.n5x5_clearScreen = true
        }
        //else if (n_Funktion == eFunktion.m0_s0) { // Joystick steuert M0 und Servo (Fahren und Lenken)
        //}
        else if (n_Funktion == eFunktion.m0_m1_s0 && n_ServoWinkelButtonAB < 31) { // M0 und M1, Servo über Tasten A- B+ (Gabelstapler)
            n_ServoWinkelButtonAB++
        }
        //else if (n_Funktion == eFunktion.ma_mb) { // MA und MB (Seilrolle und Drehkranz)
        //}
        //else if (n_Funktion == eFunktion.mc_mb) { // MC und MB (Zahnstange und Drehkranz)
        //}
        else {
            a_Schalter[eSchalter.Licht] = !a_Schalter[eSchalter.Licht] // mit B Licht, wenn oben nichts anderes steht
        }
    }



    //% group="Auswahl Modell und Funktion" subcategory="Auswahl"
    //% block="Knopf A+B geklickt" weight=5
    export function buttonAB() {
        // wenn einmal A+B geklickt, wird n_Funktion nie wieder ng (nicht gestartet)
        if (n_Funktion == eFunktion.ng) // beim ersten Mal (nach Reset)
            n_Funktion = eFunktion.m0_s0 // Standardwert immer Fahren und Lenken

        // Maker Kit Car ohne und mit Gabelstapler
        else if (isModell(eModell.mkcg) && n_Funktion == eFunktion.m0_s0)
            n_Funktion = eFunktion.m0_m1_s0

        // Maker Kit Car mit Kran
        else if (isModell(eModell.mkck) && n_Funktion == eFunktion.m0_s0)
            n_Funktion = eFunktion.ma_mb // Funktion weiter schalten
        else if (isModell(eModell.mkck) && n_Funktion == eFunktion.ma_mb)
            n_Funktion = eFunktion.mc_mb // Funktion weiter schalten

        else {
            n_Funktion = eFunktion.m0_s0 // Standardwert immer Fahren und Lenken
            n_ServoWinkelButtonAB = 16
        }
    }


    /*  export function getModell(): radio.eModell {
         // gibt den Enum Wert zurück
         return radio.a_StorageBuffer[radio.eStorageBuffer.modell]
     } */

    //% group="Modell" subcategory="Auswahl"
    //% block="%pModell" weight=4
    export function isModell(pModell: eModell) {
        // return radio.isModell(pModell)
        return radio.getModell() == pModell
    }


    //% group="Funktion" subcategory="Auswahl"
    //% block="%pFunktion" weight=3
    export function isFunktion(pFunktion: eFunktion) {
        if (pFunktion == eFunktion.ng)
            return n_Funktion != eFunktion.ng // wenn nicht nicht gestartet
        else
            return pFunktion == n_Funktion
    }



    export enum eSchalter { Magnet, Licht }
    export let a_Schalter = [false, false]

    //% group="Schalter" subcategory="Auswahl"
    //% block="%pSchalter" weight=2
    export function getSchalter(pSchalter: eSchalter): boolean {
        return a_Schalter[pSchalter]
    }



    // ========== Bilder für Auswahl Modell


    export let a_ModellImages = [
        images.createImage(`
    . # . # .
    . . . . .
    . . . . .
    # # # # #
    . # . # .
    `),
        images.createImage(`
    . . # . .
    . . # . .
    . . # # #
    . . # . .
    # # # . .
    `),
        images.createImage(`
    . # # # #
    . # . . #
    . # . . .
    . # . . .
    # # # # .
    `),
        images.createImage(`
    . . . . .
    . # # # .
    # . . . #
    # # # # #
    . # . # .
    `)/* ,
        images.createImage(`
    . . . . .
    . # . # .
    # . . . #
    . # . # .
    . . . . .
    `), */
    ]

} // s-auswahl.ts
