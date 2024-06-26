
namespace receiver { // r-advanced.ts


    // ========== group="Status zurück senden"
    let n_StatusString = ""

    //% group="Status zurück senden" advanced=true
    //% block="Status += any %pStatus" weight=6
    export function addStatus(pStatus: any) {
        n_StatusString += " " + convertToText(pStatus)
    }

    //% group="Status zurück senden" advanced=true
    //% block="Status += hex %pStatus" weight=5
    export function addStatusHEX(pStatus: number) {
        n_StatusString += " " + Buffer.fromArray([pStatus]).toHex()
    }

    //% group="Status zurück senden" advanced=true
    //% block="Status Änderung" weight=4
    export function chStatus(): boolean { return n_StatusString.length > 0 }

    //% group="Status zurück senden" advanced=true
    //% block="Status Text || löschen %clear" weight=3
    //% clear.shadow="toggleYesNo"
    //% clear.defl=1
    export function getStatus(clear = true) {
        let s = n_StatusString
        if (clear)
            n_StatusString = ""
        return "1" + s
    }


} // r-advanced.ts
