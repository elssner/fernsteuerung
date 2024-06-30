
namespace radio { // storage.ts


    // Storage: im Flash steht die Funkgruppe und das Modell, und wird beim Einschalten wieder hergestellt

    export let a_StorageBuffer = Buffer.create(4) // lokaler Speicher 4 Byte NumberFormat.UInt32LE
    export enum eStorageBuffer { funkgruppe, modell /* , c, d */ } // Index im Buffer
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


    export function getFunkgruppe() {
        return a_StorageBuffer[eStorageBuffer.funkgruppe]
    }

    /* export function getModell(): eModell {
        // gibt den Enum Wert zurück
        return a_StorageBuffer[eStorageBuffer.modell]
    } */

    //% group="Auswahl Modell und Funktion" subcategory="Auswahl"
    //% block="%pModell" weight=4
   /*  export function isModell(pModell: eModell) {
        return a_StorageBuffer[eStorageBuffer.modell] == pModell
    } */


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


} // storage.ts