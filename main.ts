input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    radio.setByte(radio.radio_sendBuffer19(), radio.eBufferOffset.b0_Motor, 0)
    radio.sendBuffer0_setBit(radio.radio_sendBuffer19(), radio.eBufferBit.x80_MotorPower, false)
    radio.setProgramm(radio.radio_sendBuffer19(), radio.eProgramm.p0)
    radio.setMotorPower(radio.radio_sendBuffer19(), radio.eMotorBit.M0, false)
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    radio.fill_sendBuffer19()
    radio.setProgramm(radio.radio_sendBuffer19(), radio.eProgramm.p3)
    radio.setMotorPower(radio.radio_sendBuffer19(), radio.eMotorBit.MAB, true)
    basic.showString(radio.toHex([radio.getProgramm(radio.radio_sendBuffer19())]))
    if (radio.getMotorPower(radio.radio_sendBuffer19(), radio.eMotorBit.MC)) {
        basic.setLedColor(0x00ff00)
    } else {
        basic.setLedColor(0xff0000)
    }
})
