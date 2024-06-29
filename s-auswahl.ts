
namespace sender { // s-auswahl.ts

    let a_StorageBuffer = Buffer.create(4)

    export enum eStorageBuffer { funkgruppe, modell, c, d } // Index im Buffer

    export enum eModelle {
        cb2e,
        mkcg,
        mkck,
        car4
    } // so viele Images müssen im Array sein - Bilder am Ende dieser Datei



   // export function getFunkgruppe() { return a_StorageBuffer[eStorageBuffer.funkgruppe] }

    export function getModell() { return a_StorageBuffer[eStorageBuffer.modell] }



    //% group="Auswahl Modell" subcategory="Auswahl"
    //% block="Start Auswahl Modell Flash einlesen %storagei32"
    export function startAuswahl(storagei32: number) {
        storageBufferSet(storagei32)
        // let iModell = a_StorageBuffer[eStorageBuffer.modell]
        if (!radio.between(getModell(), 0, a_ModellImages.length - 1))
            // wenn ungülti, Standardwert setzen
            a_StorageBuffer[eStorageBuffer.modell] = eModelle.cb2e

        a_ModellImages[getModell()].showImage(0) // Bild vom Modell anzeigen
        basic.pause(1500)
        return a_StorageBuffer[eStorageBuffer.funkgruppe]
    }


    //% group="Auswahl Modell" subcategory="Auswahl"
    //% block="Knopf A halten"
    export function buttonA() {
        if (a_StorageBuffer[eStorageBuffer.modell] > 0) {
            a_StorageBuffer[eStorageBuffer.modell]--
        }

        a_ModellImages[getModell()].showImage(0)


    }


    //% group="Auswahl Modell" subcategory="Auswahl"
    //% block="Knopf B halten "
    export function buttonB() {
        if (a_StorageBuffer[eStorageBuffer.modell] < a_ModellImages.length - 1) {
            a_StorageBuffer[eStorageBuffer.modell]++
        }

        a_ModellImages[getModell()].showImage(0)


    }



    //% group="Auswahl Modell" subcategory="Auswahl"
    //% block="zeige Bild %index" weight=8
    export function showImage(index: eModelle) {
        a_ModellImages[index].showImage(0)
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
