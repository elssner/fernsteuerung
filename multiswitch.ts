
namespace radio { // multiswitch.ts

    const i2cgroveMultiswitch_x03 = 0x03
    const i2c_CMD_GET_DEV_EVENT = 0x01	// gets device event status

    export enum eStatus {
        //% block="[5] Fahren und Lenken"
        fahren = 5,
        //% block="[1] Seilrolle und Drehkranz"
        drehen = 1,
        //% block="[3] Zahnstange und Drehkranz"
        zahnstange = 3,
        //% block="[2] Magnet aus"
        links = 2,
        //% block="[4] Magnet an"
        rechts = 4,
        //% block="[0] Fehler"
        fehler = 0
    }

    //let n_rgb = basic.rgb(7, 7, 7)
    let n_Status_changed = true
    let n_Status = eStatus.fehler
    let n_Magnet = false

    //% group="Grove Multiswitch 0x03" subcategory="Sender" color=#003F7F
    //% block="Schalter einlesen" weight=8
    export function readSwitch(): boolean {
        if (pins.i2cWriteBuffer(i2cgroveMultiswitch_x03, Buffer.fromArray([i2c_CMD_GET_DEV_EVENT])) != 0) {
            n_Status_changed = (n_Status != eStatus.fehler)
            n_Status = eStatus.fehler
            return false // i2c Fehler
        } else {
            n_Status_changed = false // wird nur bei Änderung true

            let bu = pins.i2cReadBuffer(i2cgroveMultiswitch_x03, 10)
            // Byte 0-3: 32 Bit UInt32LE; Byte 4:Schalter 1 ... Byte 9:Schalter 6
            // Byte 4-9: 00000001:Schalter OFF; 00000001:Schalter ON; Bit 1-7 löschen & 0x01
            for (let iSwitch = 1; iSwitch <= 5; iSwitch += 1) { // Richtung N = 1, W = 2, S = 3, O = 4, M = 5
                if (bu[3 + iSwitch] == 0) { // ON=00000000 OFF=00000001

                    switch (iSwitch) {
                        case eStatus.links: { // 2
                            n_Status_changed = n_Magnet
                            n_Magnet = false
                            break // beendet switch, nicht for
                        }
                        case eStatus.rechts: { // 4
                            n_Status_changed = !n_Magnet
                            n_Magnet = true
                            break // beendet switch, nicht for
                        }
                        default: { // 1 3 5
                            n_Status_changed = (n_Status != iSwitch)
                            n_Status = iSwitch // n_Status nur bei 1..5 ändern (Schalter gedrückt); nicht ändern bei 0 (losgelassen)
                            break // beendet switch, nicht for
                        }
                    }
                    break // beendet for wenn der erste von 5 Schaltern gedrückt
                } // else { } // for geht weiter zum nächsten Schalter
            }
            return true
        }
    }


    //% group="Grove Multiswitch 0x03" subcategory="Sender" color=#003F7F
    //% block="Schalter Änderung" weight=6
    export function chSwitch(): boolean {
        //if (n_Magnet)
        //    n_rgb = basic.rgb(7, 0, 0)
        //else
        //    n_rgb = basic.rgb(0, 7, 0)
        return n_Status_changed
    }

    //% group="Grove Multiswitch 0x03" subcategory="Sender" color=#003F7F
    //% block="Schalter %pStatus" weight=5
    export function isSwitch(pStatus: eStatus): boolean { return pStatus == n_Status }

    //% group="Grove Multiswitch 0x03" subcategory="Sender" color=#003F7F
    //% block="Schalter 0 1 3 5" weight=4
    export function getSwitch(): eStatus { return n_Status }

    //% group="Grove Multiswitch 0x03" subcategory="Sender" color=#003F7F
    //% block="Magnet" weight=3
    export function getMagnet() { return n_Magnet }

    // group="Grove Multiswitch 0x03" subcategory="Sender" color=#003F7F
    // block="RGB" weight=3
    //export function getRGB() { return n_rgb }

} // multiswitch.ts
