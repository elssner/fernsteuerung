
namespace receiver  // r-qwiic.ts
/*
SparkFun Qwiic Ultrasonic Distance Sensor (HC-SR04)
    https://learn.sparkfun.com/tutorials/qwiic-ultrasonic-distance-sensor-hc-sr04-hookup-guide
    
    https://github.com/sparkfun/Zio-Qwiic-Ultrasonic-Distance-Sensor
    https://github.com/sparkfun/Zio-Qwiic-Ultrasonic-Distance-Sensor/blob/master/Arduino/Zio_Ultrasonic_Distance_Sensor_IIC_Test%20(1)/Zio_Ultrasonic_Distance_Sensor_IIC_Test.ino
    
    
*/ {

    // ========== group="Ultrasonic Distance Sensor (I²C: 0x00)" subcategory="Qwiic" 

    // ========== I²C ==========
    const i2cqwiicUltrasonic_x00 = 0x00 // SLAVE_BROADCAST_ADDR 0x00  //default address
    //  let i2cqwiicUltrasonic = 0x00       // SLAVE_ADDR 0xA0-0xAF

    const measure_command = 0x01

    let n_UltrasonicConnected = true // Qwiic Modul ist angesteckt
    let n_Ultrasonic_mm = 0


    // group="Ultrasonic Distance Sensor (I²C: 0x00)" subcategory="Qwiic" deprecated=true
    // block="Ultrasonic I²C Adresse %newI2C" weight=9
    // newI2C.min=160 newI2C.max=175
    /* export function qUltrasonicI2C(newI2C: number) {
        if (newI2C >= 0xA0 && newI2C <= 0xAF) {
            i2cqwiicUltrasonic = newI2C
        }
    } */

    //% group="Ultrasonic Distance Sensor (I²C: 0x00)" subcategory="Qwiic"
    //% block="Ultraschall Sensor einlesen || i2c %i2c" weight=8
    //% i2c.defl=0
    export function qUltrasonicRead(i2c = 0) { // SLAVE_BROADCAST_ADDR 0x00  //default address
        if (n_UltrasonicConnected) {
            n_UltrasonicConnected = pins.i2cWriteBuffer(i2c, Buffer.fromArray([measure_command]), true) == 0

            if (!n_UltrasonicConnected)
                basic.showNumber(i2c)

            if (n_UltrasonicConnected) {
                n_Ultrasonic_mm = pins.i2cReadBuffer(i2c, 2).getNumber(NumberFormat.UInt16BE, 0)
            }
        }
        return n_UltrasonicConnected
    }

    export enum eDist { cm, mm }

    //% group="Ultrasonic Distance Sensor (I²C: 0x00)" subcategory="Qwiic"
    //% block="Ultraschall Entfernung in %e" weight=3
    export function qUltrasonicDistance(e: eDist) {
        if (e == eDist.cm)
            return Math.idiv(n_Ultrasonic_mm, 10)
        else
            return n_Ultrasonic_mm

    }



} // r-qwiic.ts
