
namespace receiver { // r-fahrstrecke.ts

    //% group="Programmieren" subcategory="Fahrstrecke"
    //% block="fahre Motor (1 ↓ 128 ↑ 255) %motor Servo (1 ↖ 16 ↗ 31) %servo Strecke (cm) %strecke" weight=3
    //% motor.min=0 motor.max=255 motor.defl=128
    //% servo.min=1 servo.max=31 servo.defl=16
    //% strecke.min=0 strecke.max=255 strecke.defl=20
    export function fahreSchritt(motor: number, servo: number, strecke: number) {
        if (motor != c_MotorStop && strecke > 0) {

            if (n_Hardware == eHardware.v3 || n_Hardware == eHardware.car4) {

                encoder_start(strecke, true)
                servo_set16(servo) //   servo_set(pServo)
                selectEncoderMotor255(motor) //   motorA255(pMotor)

                while (n_EncoderAutoStop) {
                    basic.pause(200) // Pause kann größer sein, weil Stop schon im Event erfolgt ist
                }

            } else if (n_Hardware == eHardware.calli2bot) {

                c2Motor255(c_MotorStop)
                c2ResetEncoder()

                c2Motor255(motor)

                while (encoderMittelwert(c2EncoderValues()) < strecke * n_c2EncoderFaktor) {
                    // Pause eventuell bei hoher Geschwindigkeit motor verringern
                    // oder langsamer fahren wenn Rest strecke kleiner wird
                    basic.pause(200)
                }

                c2Motor255(c_MotorStop)

            }

        }
    }

    function encoderMittelwert(encoderValues: number[]) {
        return Math.idiv(encoderValues[0] + encoderValues[1], 2)
    }

} // r-fahrstrecke.ts
