
namespace radio { // joystick.ts

    const i2cqwiicJoystick_x20 = 0x20

    //export const n_Simulator: boolean = ("€".charCodeAt(0) == 8364) // true, wenn der Code im Simulator läuft

    let n_x: number, n_y: number //, n_xMotor: number, n_yServo: number
    let n_ButtonStatus = false
    let n_ButtonOnOff = false

    // ========== group="Joystick"


    export enum eJoystickValue {
        //% block="x 0..128..255"
        x,
        //% block="y 0..128..255"
        y,
        //% block="x Motor (1 ↓ 128 ↑ 255)"
        xmotor,
        //% block="y Motor (1 ↓ 128 ↑ 255)"
        ymotor,
        //% block="y Servo (45° ↖ 90° ↗ 135°)"
        servo90,
        //% block="y Servo (1 ↖ 16 ↗ 31)"
        servo16,
        motor
    }


    //% group="Qwiic Joystick 0x20" subcategory="Sender" color=#BF3F7F
    //% block="Joystick einlesen" weight=9
    export function joystickQwiic() {
        if (pins.i2cWriteBuffer(i2cqwiicJoystick_x20, Buffer.fromArray([3]), true) != 0)
            return false
        else {
            let bu = pins.i2cReadBuffer(i2cqwiicJoystick_x20, 6)
            n_x = bu[0] // X_MSB = 0x03,       // Current Horizontal Position (MSB First)
            n_y = bu[2] // Y_MSB = 0x05,       // Current Vertical Position (MSB First)
            n_ButtonStatus = bu[5] == 1 // STATUS = 0x08, // Button Status: Indicates if button was pressed since last read of button state. Clears after read.
            return true
        }
    }

    //% group="Qwiic Joystick 0x20" subcategory="Sender" color=#BF3F7F
    //% block="Joystick %pJoystickValue || 128 ± %p128 max ± %pmax" weight=8
    //% p128.min=0 p128.max=8 
    //% pmax.min=0 pmax.max=20
    export function joystickValue(pJoystickValue: eJoystickValue, p128 = 0, pmax = 0): number {
        if (!between(p128, 0, 8)) p128 = 0 //  return (i0 >= i1 && i0 <= i2)
        if (!between(pmax, 0, 20)) pmax = 0

        switch (pJoystickValue) {
            case eJoystickValue.x: return n_x
            case eJoystickValue.y: return n_y
            case eJoystickValue.motor: {
                let xMotor = n_x
                if (n_x == 0)
                    xMotor = 1
                else if (between(n_x, 128 - p128, 128 + p128)) // Joystick Ruhestellung (p128=4) 124..132 -> 128
                    xMotor = 128
                //else if (n_x < (0 + pmax)) // Werte < 0 + pmax wie 0 behandeln (max vorwärts)
                //    xMotor = 1
                //else if (n_x > (255 - pmax)) // Werte > 235 wie 255 behandeln (max rückwärts)
                //    xMotor = 255

                return xMotor
            }
            case eJoystickValue.ymotor: {
                let yMotor = n_y
                if (n_y == 0)
                    yMotor = 1
                else if (between(n_y, 128 - p128, 128 + p128)) // Joystick Ruhestellung (p128=4) 124..132 -> 128
                    yMotor = 128

                return yMotor
            }

            case eJoystickValue.servo90: {
                let yServo = 90
                if (between(n_y, 128 - p128, 128 + p128)) // Joystick Ruhestellung (p128=4) 124..132 -> 128
                    yServo = 90 // geradeaus 90°
                else if (n_y < (0 + pmax)) // Werte < 0 + pmax wie 0 behandeln (max links)
                    yServo = 45
                else if (n_y > (255 - pmax)) // Werte > 235 wie 255 behandeln (max rechts)
                    yServo = 135
                else {
                    //yServo = Math.round(Math.map(n_y, 0 + pmax, 255 - pmax, 46, 134))
                    yServo = mapInt32(n_y, 0 + pmax, 255 - pmax, 45, 135)
                }
                return yServo // (45° ↖ 90° ↗ 135°)
            }
            case eJoystickValue.servo16: {
                return Math.idiv(joystickValue(eJoystickValue.servo90, p128, pmax), 3) - 14
            }

            //case eJoystickValue.servo90: return n_yServo // 45°..90°..135°
            //case eJoystickValue.servo16: return Math.round(n_yServo / 3 - 14)// 45°=1 90°=16 135°=31 
            //case eJoystickValue.servo16: return Math.idiv(n_yServo, 3) - 14 // Math.round(n_yServo / 3 - 14)// 45°=1 90°=16 135°=31 
            default: return 0
        }

    }

    //% group="Qwiic Joystick 0x20" subcategory="Sender" color=#BF3F7F
    //% block="Joystick Button war gedrückt || Status löschen %clear" weight=6
    //% clear.shadow="toggleOnOff" clear.defl=1
    export function buttonStatus(clear = true): boolean {
        if (n_ButtonStatus && clear) {
            pins.i2cWriteBuffer(i2cqwiicJoystick_x20, Buffer.fromArray([8, 0])) // (8) Status 'Button war gedrückt' löschen
            n_enableButtonFunkgruppe = false
        }
        return n_ButtonStatus
    }


    //% group="Qwiic Joystick 0x20" subcategory="Sender" color=#BF3F7F
    //% block="Joystick Button An Aus" weight=5
    export function buttonOnOff() {
        if (buttonStatus()) // wenn 'Button war gedrückt'
            n_ButtonOnOff = !n_ButtonOnOff // OnOff umschalten
        return n_ButtonOnOff
    }


} // joystick.ts
