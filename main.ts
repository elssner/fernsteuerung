radio.onReceivedData(function (receivedBuffer) {
	
})
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    radio.sendBuffer19(null)
})
radio.onReceivedBuffer(function (receivedBuffer) {
	
})
radio.setGroup(1)
