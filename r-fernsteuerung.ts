
namespace receiver { // r-fernsteuerung.ts

    //% group="Betriebsart" subcategory="Fernsteuerung"
    //% block="%receivedData 00 Fernsteuerung Motoren" weight=5
    //% receivedData.shadow="radio_receivedBuffer19"
    export function sendM0(receivedData: Buffer) {

        if (radio.isBetriebsart(receivedData, radio.e0Betriebsart.p0)) {
            receiver.dualMotor128(receiver.eDualMotor.M0, radio.getByte(receivedData, radio.eBufferPointer.m0, radio.eBufferOffset.b0_Motor))
            receiver.pinServo16(radio.getByte(receivedData, radio.eBufferPointer.m0, radio.eBufferOffset.b1_Servo))
            receiver.dualMotor128(receiver.eDualMotor.M1, radio.getByte(receivedData, radio.eBufferPointer.m1, radio.eBufferOffset.b0_Motor))
            receiver.qwiicMotorChipPower(receiver.eQwiicMotorChip.ab, radio.getaktiviert(receivedData, radio.e3aktiviert.ma) || radio.getaktiviert(receivedData, radio.e3aktiviert.mb))
            receiver.qwiicMotor128(receiver.eQwiicMotor.ma, radio.getByte(receivedData, radio.eBufferPointer.ma, radio.eBufferOffset.b0_Motor))
            receiver.qwiicMotor128(receiver.eQwiicMotor.mb, radio.getByte(receivedData, radio.eBufferPointer.mb, radio.eBufferOffset.b0_Motor))
            receiver.qwiicMotorChipPower(receiver.eQwiicMotorChip.cd, radio.getaktiviert(receivedData, radio.e3aktiviert.mc))
            receiver.qwiicMotor128(receiver.eQwiicMotor.mc, radio.getByte(receivedData, radio.eBufferPointer.mc, radio.eBufferOffset.b0_Motor))
            receiver.qwiicMotor128(receiver.eQwiicMotor.md, radio.getByte(receivedData, radio.eBufferPointer.md, radio.eBufferOffset.b0_Motor))

            //receiver.ringTone(radio.getSchalter(receivedData, radio.e0Schalter.b0))
            //receiver.qwiicRelay(radio.getSchalter(receivedData, radio.e0Schalter.b1))
            //receiver.pinGPIO4(radio.getSchalter(receivedData, radio.e0Schalter.b2))
            //receiver.rgbLEDs(receiver.eRGBled.a, 0x0000ff, true)
        }

    }


} // r-fernsteuerung.ts
