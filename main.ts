let a = false
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    radio.setBetriebsart(radio.radio_sendBuffer19(), radio.e0Betriebsart.p0)
    radio.setSchalter(radio.radio_sendBuffer19(), radio.e0Schalter.b0, false)
})
radio.onReceivedData(function (receivedData) {
    a = radio.getSchalter(receivedData, radio.e0Schalter.b0)
    if (radio.getBetriebsart(receivedData) == radio.radio_betriebsart(radio.e0Betriebsart.p0)) {
    	
    }
})
