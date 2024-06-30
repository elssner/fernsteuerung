
namespace sender { // s-auswahl.ts

    export let n_ServoWinkel = 0 // 1..16..31 mit A- B+ ändern
    //export let n_Magnet = false


    // Storage: im Flash steht die Funkgruppe und das Modell, und wird beim Einschalten wieder hergestellt

    let a_StorageBuffer = Buffer.create(4) // lokaler Speicher 4 Byte NumberFormat.UInt32LE
    enum eStorageBuffer { funkgruppe, modell /* , c, d */ } // Index im Buffer
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
    export function startAuswahl(storagei32: number) {
        storageBufferSet(storagei32)
        // let iModell = a_StorageBuffer[eStorageBuffer.modell]
        if (!radio.between(getModell(), 0, a_ModellImages.length - 1))
            // wenn ungülti, Standardwert setzen
            a_StorageBuffer[eStorageBuffer.modell] = eModell.cb2e

        a_ModellImages[getModell()].showImage(0) // Bild vom Modell anzeigen
        basic.pause(1500)
        return a_StorageBuffer[eStorageBuffer.funkgruppe]
    }


    //% group="Auswahl Modell und Funktion" subcategory="Auswahl"
    //% block="Knopf A geklickt" weight=7
    export function buttonA() {
        if (n_Funktion == eFunktion.ng) {
            // wenn nicht gestartet, kann Modell geändert werden
            if (a_StorageBuffer[eStorageBuffer.modell] > 0)
                a_StorageBuffer[eStorageBuffer.modell]--
            a_ModellImages[getModell()].showImage(0)
        }
        else if (n_Funktion == eFunktion.m0_s0) { // Joystick steuert M0 und Servo (Fahren und Lenken)

        }
        else if (n_Funktion == eFunktion.m0_m1_s0 && n_ServoWinkel > 1) { // M0 und M1, Servo über Tasten A- B+ (Gabelstapler)
            n_ServoWinkel--
        }
        else if (n_Funktion == eFunktion.ma_mb) { // MA und MB (Seilrolle und Drehkranz)

        }
        else if (n_Funktion == eFunktion.mc_mb) { // MC und MB (Zahnstange und Drehkranz)

        }
    }


    //% group="Auswahl Modell und Funktion" subcategory="Auswahl"
    //% block="Knopf B geklickt" weight=6
    export function buttonB() {
        if (n_Funktion == eFunktion.ng) {
            // wenn nicht gestartet, kann Modell geändert werden
            if (a_StorageBuffer[eStorageBuffer.modell] < a_ModellImages.length - 1)
                a_StorageBuffer[eStorageBuffer.modell]++
            a_ModellImages[getModell()].showImage(0)
        }
        else if (n_Funktion == eFunktion.m0_s0) { // Joystick steuert M0 und Servo (Fahren und Lenken)

        }
        else if (n_Funktion == eFunktion.m0_m1_s0 && n_ServoWinkel < 31) { // M0 und M1, Servo über Tasten A- B+ (Gabelstapler)
            n_ServoWinkel++
        }
        else if (n_Funktion == eFunktion.ma_mb) { // MA und MB (Seilrolle und Drehkranz)

        }
        else if (n_Funktion == eFunktion.mc_mb) {

        }
    }



    //% group="Auswahl Modell und Funktion" subcategory="Auswahl"
    //% block="Knopf A+B geklickt" weight=5
    export function buttonAB() {
        // wenn einmal A+B geklickt, wird n_Funktion nie wieder ng (nicht gestartet)
        if (n_Funktion == eFunktion.ng) // beim ersten Mal (nach Reset)
            n_Funktion = eFunktion.m0_s0 // Standardwert immer Fahren und Lenken

        // Maker Kit Car ohne und mit Gabelstapler
        else if (getModell() == eModell.mkcg && n_Funktion == eFunktion.m0_s0)
            n_Funktion = eFunktion.m0_m1_s0

        // Maker Kit Car mit Kran
        else if (getModell() == eModell.mkck && n_Funktion == eFunktion.m0_s0)
            n_Funktion = eFunktion.ma_mb
        else if (getModell() == eModell.mkck && n_Funktion == eFunktion.ma_mb)
            n_Funktion = eFunktion.mc_mb

        else {
            n_Funktion = eFunktion.m0_s0 // Standardwert immer Fahren und Lenken
            n_ServoWinkel = 16
        }
    }


    export function getModell(): eModell {
        // gibt den Enum Wert zurück
        return a_StorageBuffer[eStorageBuffer.modell]
    }

    //% group="Auswahl Modell und Funktion" subcategory="Auswahl"
    //% block="%pModell" weight=4
    export function isModell(pModell: eModell) {
        return a_StorageBuffer[eStorageBuffer.modell] == pModell
    }


    //% group="Auswahl Modell und Funktion" subcategory="Auswahl"
    //% block="%pFunktion" weight=3
    export function isFunktion(pFunktion: eFunktion) {
        if (pFunktion == eFunktion.ng)
            return n_Funktion != eFunktion.ng // wenn nicht nicht gestartet
        else
            return pFunktion == n_Funktion
    }

    //% group="Auswahl Modell und Funktion" subcategory="Auswahl" deprecated=true
    //% block="Magnet" weight=2
    export function getMagnet() {
        return false// n_Magnet 
    }

    export enum eSchalter { Magnet, Licht }
    export let a_Schalter = [false, false]

    //% group="Auswahl Modell und Funktion" subcategory="Auswahl"
    //% block="%pSchalter" weight=2
    export function getSchalter(pSchalter: eSchalter): boolean {
        return a_Schalter[pSchalter]
    }


    // ========== group="Storage (Flash)" color=#FFBB00

    //% group="Storage (Flash)" subcategory="Auswahl"
    //% block="Flash einlesen %i32" weight=9
    export function storageBufferSet(i32: number) {
        // i32.shadow=storage_get_number
        a_StorageBuffer.setNumber(NumberFormat.UInt32LE, 0, i32)
    }

    //% group="Storage (Flash)" subcategory="Auswahl"
    //% block="Flash speichern" weight=8
    export function storageBufferGet() {
        return a_StorageBuffer.getNumber(NumberFormat.UInt32LE, 0)
    }



    // ========== Bilder für Auswahl Modell


    let a_ModellImages = [
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
