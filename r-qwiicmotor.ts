
namespace receiver { // r-qwiicmotor.ts


    // I²C Adressen Qwiic
    const i2cRelay = 0x19 // SparkFun Qwiic Single Relay (Kran Elektromagnet)
    let a_i2cMotor = [0x5D, 0x5E] // SparkFun Qwiic Motor Driver // Index eMotorChip

    // const c_MotorStop = 128

    let a_MotorChipConnected = [false, false] // Index eMotorChip
    let a_MotorChipReady = [false, false] // Index eMotorChip
    let a_MotorChipPower = [false, false] // Index eMotorChip
    export let a_MotorSpeed = [c_MotorStop, c_MotorStop, c_MotorStop, c_MotorStop] // Index eMotor


    // I²C Register Motor Chip
    const ID = 0x01 // Reports hard-coded ID byte of 0xA9
    const MA_DRIVE = 0x20 // 0x00..0xFF Default 0x80
    const MB_DRIVE = 0x21
    const DRIVER_ENABLE = 0x70 //  0x01: Enable, 0x00: Disable this driver
    const FSAFE_CTRL = 0x1F // Use to configure what happens when failsafe occurs.
    const FSAFE_TIME = 0x76 // This register sets the watchdog timeout time, from 10 ms to 2.55 seconds.
    const STATUS_1 = 0x77 // This register uses bits to show status. Currently, only b0 is used.
    const CONTROL_1 = 0x78 // 0x01: Reset the processor now.


    //  let n_MotorReady = false
    //  let n_MotorON = false       // aktueller Wert im Chip
    //  let n_MotorA = c_MotorStop  // aktueller Wert im Chip

    export enum eMotor {
        //% block="A"
        ma,
        //% block="B"
        mb,
        //% block="C"
        mc,
        //% block="D"
        md,
    }

    export enum eMotorChip {
        //% block="A B"
        ab,
        //% block="C D"
        cd
    }

    enum eRGBColorMotor {
        off = Colors.Off,
        notconnected_red = Colors.Red,
        notready_orange = Colors.Orange, // i2cWriteBuffer!=0 Fehler
        poweroff_violet = Colors.Violet,
        poweron_blue = Colors.Blue
    }
    function rgbLEDMotor(pMotorChip: eMotorChip, color: eRGBColorMotor) {
        rgbLEDs(pMotorChip == eMotorChip.cd ? eRGBled.c : eRGBled.b, color, false)
    }

    // für Encoder r-pins-encoder.ts
    /* export function qEncoderMotorRichtung(pMotor: eMotor) {
        return a_MotorSpeed[pMotor] > c_MotorStop // true: vorwärts
    }
    export function qEncoderMotorStop(pMotor: eMotor) {
        qMotor255(pMotor, c_MotorStop)
    } */


    export function qMotorReset() { // aufgerufen beim Start

        a_MotorChipReady = [false, false]

        control.waitMicros(2000000) // 2 s lange Wartezeit nach Power on

        a_MotorChipConnected[eMotorChip.ab] = qMotorChipReset(eMotorChip.ab)

        control.waitMicros(200)

        a_MotorChipConnected[eMotorChip.cd] = qMotorChipReset(eMotorChip.cd)

        // return a && c
    }


    function qMotorChipReset(pMotorChip: eMotorChip) {
        // Test Start, LED rot
        rgbLEDMotor(pMotorChip, eRGBColorMotor.notconnected_red)
        //rgbLEDon(a_RGBLed[pMotorChip], Colors.Red, true)

        if (i2cWriteBuffer(pMotorChip, [ID], true)) { // write Register Nummer ID

            if (i2cReadBuffer(pMotorChip, 1)[0] == 0xA9) { // Reports hard-coded ID byte of 0xA9

                if (i2cWriteBuffer(pMotorChip, [CONTROL_1, 1])) { // Reset the processor now.
                    // true 
                    rgbLEDMotor(pMotorChip, eRGBColorMotor.notready_orange)
                    //rgbLEDon(a_RGBLed[pMotorChip], Colors.Orange, true)
                    return true
                } else {
                    // bei false bleibt LED rot
                    return false
                }
            } else {
                // bei false bleibt LED rot
                return false
            }
        } else {
            // false I²C Modul nicht vorhanden, LED aus
            rgbLEDMotor(pMotorChip, eRGBColorMotor.off)
            //rgbLEDon(a_RGBLed[pMotorChip], Colors.Off, false)
            return false
        }
    }

    function qMotorChipReady(pMotorChip: eMotorChip) { // fragt den I²C Status ab wenn false

        if (a_MotorChipReady[pMotorChip])
            // wenn Ready nichts weiter testen
            return true
        else if (a_MotorChipConnected[pMotorChip]) {
            // nur wenn Modul Connected Status Ready testen
            if (i2cWriteBuffer(pMotorChip, [STATUS_1])) {

                if ((i2cReadBuffer(pMotorChip, 1)[0] & 0x01) == 1) {
                    a_MotorChipReady[pMotorChip] = true
                    rgbLEDMotor(pMotorChip, eRGBColorMotor.poweroff_violet)
                    //rgbLEDon(a_RGBLed[pMotorChip], Colors.Violet, true)
                } else {
                    // bei false bleibt LED Orange
                }
            } else {
                // bei false bleibt LED Orange
            }

            return a_MotorChipReady[pMotorChip]
        } else {
            // I²C Modul nicht angeschlossen
            return false
        }
        /*
        bool ready( void );
        This function checks to see if the SCMD is done booting and is ready to receive commands. Use this
        after .begin(), and don't progress to your main program until this returns true.
        SCMD_STATUS_1: Read back basic program status
            B0: 1 = Enumeration Complete
            B1: 1 = Device busy
            B2: 1 = Remote read in progress
            B3: 1 = Remote write in progress
            B4: Read state of enable pin U2.5"
        */
    }

    //% group="Motor A B C D (I²C: 0x5D, 0x5E)" subcategory="Qwiic"
    //% block="Motor %pMotorChip Power %pON" weight=3
    //% pON.shadow="toggleOnOff"
    export function qMotorChipPower(pMotorChip: eMotorChip, pON: boolean) {
        if (qMotorChipReady(pMotorChip) && pON !== a_MotorChipPower[pMotorChip]) {
            a_MotorChipPower[pMotorChip] = pON
            if (i2cWriteBuffer(pMotorChip, [DRIVER_ENABLE, a_MotorChipPower[pMotorChip] ? 0x01 : 0x00])) {
                // true Motor ON blau, OFF Violet
                rgbLEDMotor(pMotorChip, a_MotorChipPower[pMotorChip] ? eRGBColorMotor.poweron_blue : eRGBColorMotor.poweroff_violet)
                // rgbLEDon(a_RGBLed[pMotorChip], a_MotorChipPower[pMotorChip] ? Colors.Blue : Colors.Violet, true)
            } else {
                // false
                rgbLEDMotor(pMotorChip, eRGBColorMotor.notready_orange)
                // rgbLEDon(a_RGBLed[pMotorChip], Colors.Purple, true) // Fehler
            }
        }
    }



    //% group="Motor A B C D (I²C: 0x5D, 0x5E)" subcategory="Qwiic"
    //% block="Motor %pMotor (1 ↓ 128 ↑ 255) %speed (128 ist STOP)" weight=2
    //% speed.min=0 speed.max=255 speed.defl=128
    export function qMotor255(pMotor: eMotor, speed: number) {
        let e = false
        // addStatusHEX(speed)
        if (radio.between(speed, 1, 255)) {
            if (speed != a_MotorSpeed[pMotor]) { // sendet nur, wenn der Wert sich ändert
                a_MotorSpeed[pMotor] = speed

                let chip: eMotorChip = (pMotor == eMotor.mc || pMotor == eMotor.md) ? eMotorChip.cd : eMotorChip.ab

                //qMotorWriteRegister(pMotor, n_MotorSpeed[pMotor])

                if (qMotorChipReady(chip) && a_MotorChipPower[chip]) {

                    if (pMotor == eMotor.ma || pMotor == eMotor.mc)
                        e = i2cWriteBuffer(chip, [MA_DRIVE, speed])
                    else if (pMotor == eMotor.mb || pMotor == eMotor.md)
                        e = i2cWriteBuffer(chip, [MB_DRIVE, speed])

                    if (!e)
                        rgbLEDMotor(chip, eRGBColorMotor.notready_orange)
                    //  rgbLEDon(a_RGBLed[chip(pMotor)], Colors.White, true)
                }
            }
        }
        else
            qMotor255(pMotor, c_MotorStop)
    }




    // ========== qwiicMotor: pins.i2cWriteBuffer pins.i2cReadBuffer



    function i2cWriteBuffer(pMotorChip: eMotorChip, bytes: number[], repeat = false) {
        return pins.i2cWriteBuffer(a_i2cMotor[pMotorChip], Buffer.fromArray(bytes), repeat) == 0
    }

    function i2cReadBuffer(pMotorChip: eMotorChip, size: number): Buffer {
        return pins.i2cReadBuffer(a_i2cMotor[pMotorChip], size)
    }



    // ========== group="SparkFun Qwiic Single Relay 0x19" subcategory="Aktoren"

    const SINGLE_OFF = 0x00
    const SINGLE_ON = 0x01

    //% group="SparkFun Qwiic Single Relay (I²C: 0x19)" subcategory="Qwiic"
    //% block="Kran Magnet %pOn"
    //% pOn.shadow="toggleOnOff"
    export function qwiicRelay(pOn: boolean) {
        pins.i2cWriteBuffer(i2cRelay, Buffer.fromArray([pOn ? SINGLE_ON : SINGLE_OFF]))
    }



} // r-qwiicmotor.ts
