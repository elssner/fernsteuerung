
namespace receiver  // r-qwiic.ts
/*
SparkFun Qwiic Ultrasonic Distance Sensor (HC-SR04)
    https://learn.sparkfun.com/tutorials/qwiic-ultrasonic-distance-sensor-hc-sr04-hookup-guide
    
    https://github.com/sparkfun/Zio-Qwiic-Ultrasonic-Distance-Sensor
    https://github.com/sparkfun/Zio-Qwiic-Ultrasonic-Distance-Sensor/blob/master/Arduino/Zio_Ultrasonic_Distance_Sensor_IIC_Test%20(1)/Zio_Ultrasonic_Distance_Sensor_IIC_Test.ino
    
    
*/ {
    // I²C Adressen Qwiic
    const i2cRelay = 0x19 // SparkFun Qwiic Single Relay (Kran Elektromagnet)
    const i2cqwiicUltrasonic_x00 = 0x00 // SLAVE_BROADCAST_ADDR 0x00  //default address



    // ========== group="SparkFun Qwiic Single Relay 0x19" subcategory="Aktoren"

    const SINGLE_OFF = 0x00
    const SINGLE_ON = 0x01

    //% group="SparkFun Qwiic Single Relay (I²C: 0x19)" subcategory="Qwiic"
    //% block="Q Kran Magnet %pOn"
    //% pOn.shadow="toggleOnOff"
    export function qwiicRelay(pOn: boolean) {
        pins.i2cWriteBuffer(i2cRelay, Buffer.fromArray([pOn ? SINGLE_ON : SINGLE_OFF]))
    }



    // ========== group="Ultrasonic Distance Sensor (I²C: 0x00)" subcategory="Qwiic" 

    const measure_command = 0x01

    let n_UltrasonicConnected = true // Qwiic Modul ist angesteckt
    let n_Ultrasonic_mm = 0


    //% group="Ultrasonic Distance Sensor (I²C: 0x00)" subcategory="Qwiic"
    //% block="Q Ultraschall Sensor einlesen || i2c %i2c" weight=8
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
    //% block="Q Ultraschall Entfernung in %e" weight=3
    export function qUltrasonicDistance(e: eDist) {
        if (e == eDist.cm)
            return Math.idiv(n_Ultrasonic_mm, 10)
        else
            return n_Ultrasonic_mm

    }



} // r-qwiic.ts
