
namespace receiver { // r-fahrstrecke.ts

    //% group="Programmieren" subcategory="Fahrstrecke"
    //% block="fahre Motor (1 ↓ 128 ↑ 255) %motor Servo (1 ↖ 16 ↗ 31) %servo Strecke (cm) %strecke" weight=3
    //% motor.min=0 motor.max=255 motor.defl=128
    //% servo.min=1 servo.max=31 servo.defl=16
    //% strecke.min=0 strecke.max=255 strecke.defl=20
    export function fahreSchritt(motor: number, servo: number, strecke: number) {
        if (motor != c_MotorStop && strecke > 0) {
            encoder_start(strecke, true)
            servo_set16(servo) //   servo_set(pServo)
            selectEncoderMotor255(motor) //   motorA255(pMotor)

            while (n_EncoderAutoStop) {
                basic.pause(200) // Pause kann größer sein, weil Stop schon im Event erfolgt ist
            }
        }
    }


} // r-fahrstrecke.ts
