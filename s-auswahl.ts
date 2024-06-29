
namespace sender { // s-auswahl.ts


    let n_StorageBuffer = Buffer.create(4)

    enum eStorageBuffer { a, b, c, d } // Index im Buffer

// ========== group="Storage (Flash)" color=#FFBB00

    //% group="Storage (Flash)"
    //% block="Flash einlesen %i32" weight=9
    //% i32.shadow=storage_get_number
    export function storageBufferSet(i32: number) {
        n_StorageBuffer.setNumber(NumberFormat.UInt32LE, 0, i32)
    }


    //% group="Storage (Flash)"
    //% block="Flash speichern" weight=8
    export function storageBufferGet() {
        return n_StorageBuffer.getNumber(NumberFormat.UInt32LE, 0)
    }



} // s-auswahl.ts
