
namespace receiver { // r-datenpaket.ts

    //% group="Betriebsart" subcategory="Datenpaket"
    //% block="%receivedData 00 Fernsteuerung Motoren" weight=5
    //% receivedData.shadow="radio_receivedBuffer19"
    export function sendM0(receivedData: Buffer) {

        if (radio.isBetriebsart(receivedData, radio.e0Betriebsart.p0)) {
            receiver.v3Motor255(receiver.eMotor01.M0, radio.getByte(receivedData, radio.eBufferPointer.m0, radio.eBufferOffset.b0_Motor))
            receiver.servo_set16(radio.getByte(receivedData, radio.eBufferPointer.m0, radio.eBufferOffset.b1_Servo))
            receiver.v3Motor255(receiver.eMotor01.M1, radio.getByte(receivedData, radio.eBufferPointer.m1, radio.eBufferOffset.b0_Motor))
            receiver.qMotorChipPower(receiver.eMotorChip.ab, radio.getaktiviert(receivedData, radio.e3aktiviert.ma) || radio.getaktiviert(receivedData, radio.e3aktiviert.mb))
            receiver.qMotor255(receiver.eMotor.ma, radio.getByte(receivedData, radio.eBufferPointer.ma, radio.eBufferOffset.b0_Motor))
            receiver.qMotor255(receiver.eMotor.mb, radio.getByte(receivedData, radio.eBufferPointer.mb, radio.eBufferOffset.b0_Motor))
            receiver.qMotorChipPower(receiver.eMotorChip.cd, radio.getaktiviert(receivedData, radio.e3aktiviert.mc))
            receiver.qMotor255(receiver.eMotor.mc, radio.getByte(receivedData, radio.eBufferPointer.mc, radio.eBufferOffset.b0_Motor))
            receiver.qMotor255(receiver.eMotor.md, radio.getByte(receivedData, radio.eBufferPointer.md, radio.eBufferOffset.b0_Motor))

            //receiver.ringTone(radio.getSchalter(receivedData, radio.e0Schalter.b0))
            //receiver.qwiicRelay(radio.getSchalter(receivedData, radio.e0Schalter.b1))
            //receiver.pinGPIO4(radio.getSchalter(receivedData, radio.e0Schalter.b2))
            //receiver.rgbLEDs(receiver.eRGBled.a, 0x0000ff, true)
        }

    }


} // r-datenpaket.ts
