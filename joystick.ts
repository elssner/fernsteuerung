
namespace radio { // joystick.ts

    const i2cqwiicJoystick_x20 = 0x20

    //export const n_Simulator: boolean = ("€".charCodeAt(0) == 8364) // true, wenn der Code im Simulator läuft

    export let n_x: number, n_y: number //, n_xMotor: number, n_yServo: number

    // ========== group="Joystick"


    export enum eJoystickValue {
        //% block="x 0..128..255"
        x,
        //% block="y 0..128..255"
        y,
        //% block="x Motor (1 ↓ 128 ↑ 255)"
        motor,
        //% block="y Motor (1 ↓ 128 ↑ 255)"
        ymotor,
        //% block="y Servo (45° ↖ 90° ↗ 135°)"
        servo90,
        //% block="y Servo (1 ↖ 16 ↗ 31)"
        servo16
    }


    //% group="Qwiic Joystick" subcategory="Joystick" color=#007F00
    //% block="Joystick einlesen" weight=9
    export function joystickQwiic() {
        if (pins.i2cWriteBuffer(i2cqwiicJoystick_x20, Buffer.fromArray([3]), true) != 0)
            return false
        else {
            let bu = pins.i2cReadBuffer(i2cqwiicJoystick_x20, 3)
            n_x = bu.getUint8(0)
            n_y = bu.getUint8(2)
            // Motor
            /*   if (between(n_x, 124, 132))
                  n_xMotor = 128
              else if (n_x == 0)
                  n_xMotor = 1
              else
                  n_xMotor = n_x
              // Servo
              if (between(n_y, 122, 134)) // geradeaus 90°
                  n_yServo = 90
              else if (n_y < 20) // Werte < 20 wie 0 behandeln (max links)
                  n_yServo = 45
              else if (n_y > 235) // Werte > 235 wie 255 behandeln (max rechts)
                  n_yServo = 135
              else
                  n_yServo = Math.round(Math.map(n_y, 20, 235, 46, 134))
   */
            /* 
                        if (radio.between(n_y, 122, 134)) n_yServo = 90 // Ruhestellung soll 128 ist auf 128 = 90° anpassen
                        else if (n_y < 20) n_yServo = 135 // Werte < 20 wie 0 behandeln (max links)
                        else if (n_y > 235) n_yServo = 45 // Werte > 235 wie 255 behandeln (max rechts)
                        else n_yServo = Math.map(n_y, 20, 235, 134, 46) // Werte von 32 bis 991 auf 46° bis 134° verteilen
                        n_yServo = Math.round(n_yServo)
                        //n_yservo = Math.round(n_yservo / 3 - 14) // 0=31 90=16 135=1
            */
            return true
        }
    }

    //% group="Qwiic Joystick" subcategory="Joystick" color=#007F00
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


    //% group="Funktionen" subcategory="Joystick" color=#007F00
    //% block="mapInt32 %value|from low %fromLow|high %fromHigh|to low %toLow|high %toHigh" weight=4
    //% inlineInputMode=inline
    export function mapInt32(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
        // return ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow
        return Math.idiv(Math.imul(value - fromLow, toHigh - toLow), fromHigh - fromLow) + toLow
    }

    //% group="Funktionen" subcategory="Joystick" color=#007F00
    //% block="motorProzent1 %value max %prozent"
    //% value.min=1 value.max=255 value.defl=128
    //% prozent.min=10 prozent.max=127 prozent.defl=127
    export function motorProzent1(value: number, prozent: number) {
        return mapInt32(value, 1, 255, 128 - prozent, 128 + prozent)
    }

    //% group="Funktionen" subcategory="Joystick" color=#007F00
    //% block="(1 ↓ 128 ↑ 255) %value * %prozent \\%"
    //% value.min=1 value.max=255 value.defl=128
    //% prozent.min=10 prozent.max=100 prozent.defl=100
    export function motorProzent(value: number, prozent: number) {

        return Math.idiv((value - 128) * prozent , 100) + 128

        //return mapInt32(value, 1, 255, 128 - prozent, 128 + prozent)
    }


} // joystick.ts
