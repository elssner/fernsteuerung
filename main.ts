input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    radio.setByte(radio.radio_sendBuffer19(), radio.eBufferOffset.b0_Motor, 0)
    radio.sendBuffer0_setBit(radio.radio_sendBuffer19(), radio.eBufferBit.x80_MotorPower, false)
    radio.setProgramm(radio.radio_sendBuffer19(), radio.eProgramm.p0)
    radio.setMotorPower(radio.radio_sendBuffer19(), radio.eMotorBit.M0, false)
})
