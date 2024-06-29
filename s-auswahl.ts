
namespace sender { // s-auswahl.ts



    //% group="Auswahl Modell" subcategory="Auswahl"
    //% block="zeige Bild %index" weight=8
    export function showImage(index: eImages) {
        a_Images[index].showImage(0)
    }


    // ========== group="Storage (Flash)" color=#FFBB00

    let n_StorageBuffer = Buffer.create(4)

    enum eStorageBuffer { a, b, c, d } // Index im Buffer

    //% group="Storage (Flash)" subcategory="Auswahl"
    //% block="Flash einlesen %i32" weight=9
    export function storageBufferSet(i32: number) {
        // i32.shadow=storage_get_number
        n_StorageBuffer.setNumber(NumberFormat.UInt32LE, 0, i32)
    }

    //% group="Storage (Flash)" subcategory="Auswahl"
    //% block="Flash speichern" weight=8
    export function storageBufferGet() {
        return n_StorageBuffer.getNumber(NumberFormat.UInt32LE, 0)
    }



    // ========== Bilder für Auswahl Modell

  export  enum eImages {
        cb2e,
        mkcg,
        mkck,
        car4,
    }

    let a_Images = [
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
    `),
        images.createImage(`
    . . . . .
    . # . # .
    # . . . #
    . # . # .
    . . . . .
    `),
    ]

} // s-auswahl.ts
