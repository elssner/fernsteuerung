let a: radio.e0Betriebsart = null
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    radio.setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
})
radio.onReceivedData(function (receivedData) {
    a = radio.getBetriebsart(receivedData)
})
