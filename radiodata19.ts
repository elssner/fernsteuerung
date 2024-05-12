
namespace radio
/*
Calliope Bluetooth Erweiterung für 19 Byte Buffer und CaR Fernsteuerung
für CalliBot, MakerKitCar, CaR4
240511 Lutz Elßner
*/ { // radiodata19.ts

    // Buffer offset

    export enum eBufferPointer {
        //% block="M0 1-2-3 Fernsteuerung"
        p0 = 1,
        //% block="M1 4-5-6 Ultraschall"
        p1 = 4,
        //% block="MA 7-8-9 hell hell"
        p2 = 7,
        //% block="MB 10-11-12 hell dunkel"
        p3 = 10,
        //% block="MC 13-14-15 dunkel hell"
        p4 = 13,
        //% block="MD 16-17-18 dunkel dunkel"
        p5 = 16
    }

    export enum eBufferOffset { // 3 Byte (b0-b1-b2) ab n_BufferPointer
        //% block="0 Motor 0..128..255"
        b0_Motor = 0, // 0..128..255
        //% block="1 Servo 0..16..31"
        b1_Servo = 1, // Bit 4-0 (0..31)
        //% block="2 Fahrstrecke 0..255 cm"
        b2_Fahrstrecke = 2, // Encoder in cm max. 255cm
        // b1_3Bit = 3 // Bit 7-6-5
    }



    // ========== Steuer-Byte 0

    export enum eProgramm {
        //% block="00 Fernsteuerung Motoren"
        p0 = 0x00,
        //% block="10 Fernsteuerung Motor M0 bis Sensor"
        p1 = 0x10,
        //% block="20 Programm 5 Strecken"
        p2 = 0x20,
        //% block="30 Programm Sensoren"
        p3 = 0x30
    }

    export enum e0Bit {
        //% block="0 Hupe"
        b0 = 0b00000001,
        //% block="1"
        b1 = 0b00000010,
        //% block="2"
        b2 = 0b00000100,
        //% block="3"
        b3 = 0b00001000,
        //% block="6 Status senden"
        b6 = 0b01000000,
        //% block="7 zurücksetzen"
        b7 = 0b10000000
    }


    // ========== Steuer-Byte 3

    export enum eMotorBit {
        //% block="M0 | Fernsteuerung"
        M0 = 0b000001,
        //% block="M1 | Ultraschall"
        M1 = 0b000010,
        //% block="MA | hell hell"
        MA = 0b000100,
        //% block="MB | hell dunkel"
        MB = 0b001000,
        //% block="MC | dunkel hell"
        MC = 0b010000,
        //% block="MD | dunkel dunkel"
        MD = 0b100000,
        //% block="M0 & M1"
        M01 = 0b000011,
        //% block="MA & MB"
        MAB = 0b001100,
        //% block="MC & MD"
        MCD = 0b110000,
        //% block="alle"
        Malle = 0b111111
    }

    export enum eEntfernung {
        //% block="5 cm"
        u0 = 0x00,
        //% block="10 cm"
        u1 = 0x40,
        //% block="15 cm"
        u2 = 0x80,
        //% block="20 cm"
        u3 = 0xC0
    }



    // ========== group="Datenpaket zum Senden vorbereiten" subcategory="Fernsteuerung"

    //% group="Datenpaket zum Senden vorbereiten" subcategory="Fernsteuerung"
    //% block="Buffer %pBuffer set Byte %pOffset %pByte || %pBufferPointer " weight=7
    //% pBuffer.shadow="radio_sendBuffer19"
    //% inlineInputMode=inline 
    export function setByte(pBuffer: Buffer, pBufferOffset: eBufferOffset, pByte: number, pBufferPointer?: eBufferPointer) {
        if (!pBufferPointer) pBufferPointer = eBufferPointer.p0  // wenn nicht angegeben

        if (pBufferOffset == eBufferOffset.b1_Servo) {
            pBuffer[pBufferPointer + pBufferOffset] &= 0b11100000 // AND Bit 7-6-5 bleiben; 4-3-2-1-0 auf 0 setzen
            pBuffer[pBufferPointer + pBufferOffset] |= (pByte & 0b00011111) // OR Bit 7-6-5 bleiben; 4-3-2-1-0 auf pByte setzen
        } else {
            pBuffer.setUint8(pBufferPointer + pBufferOffset, pByte)
        }

        /* 
                switch (pBufferOffset) {
                    case eBufferOffset.b1_Servo:
                        pBuffer[pBufferPointer + pBufferOffset] &= 0b11100000 // AND Bit 7-6-5 bleiben; 4-3-2-1-0 auf 0 setzen
                        pBuffer[pBufferPointer + pBufferOffset] |= (pByte & 0b00011111) // OR Bit 7-6-5 bleiben; 4-3-2-1-0 auf pByte setzen
                        //pBuffer[pBufferPointer + eBufferOffset.b1_Servo] |= (Math.round(pByte / 3 - 14) & 0b00011111) // OR Bit 7-6-5 bleiben; 4-3-2-1-0 auf Ergebnis setzen
        
                        //n_sendBuffer19.setUint8(pBufferPointer + pBufferOffset, Math.round(pByte / 3 - 14) & 0b00011111)
                        break
                    //case eBufferOffset.b1_3Bit:
                    //    pBuffer[pBufferPointer + eBufferOffset.b1_Servo] &= 0b00011111 // AND Bit 4-3-2-1-0 bleiben; 7-6-5 auf 0 setzen
                    //    pBuffer[pBufferPointer + eBufferOffset.b1_Servo] |= (pByte << 5) // OR Bit 4-3-2-1-0 bleiben
                    //    break
                    default: // b0_Motor und b2_Fahrstrecke 0..255
                        pBuffer.setUint8(pBufferPointer + pBufferOffset, pByte)
                        break
                } */
    }

    //% group="Datenpaket auslesen (receivedData oder sendData)" subcategory="Fernsteuerung"
    //% block="Buffer %pBuffer get Byte %pOffset || %pBufferPointer " weight=7
    export function getByte(pBuffer: Buffer, pBufferOffset: eBufferOffset, pBufferPointer?: eBufferPointer) {
        if (!pBufferPointer) pBufferPointer = eBufferPointer.p0  // wenn nicht angegeben

        if (pBufferOffset == eBufferOffset.b1_Servo) {
            return pBuffer[pBufferPointer + eBufferOffset.b1_Servo] & 0b00011111 // AND Bit 7-6-5 löschen
        } else {
            return pBuffer.getUint8(pBufferPointer + pBufferOffset)
        }
    }



    // ========== Steuer-Byte 0

    //% group="Datenpaket zum Senden vorbereiten" subcategory="Fernsteuerung"
    //% block="Buffer[0] %buffer set Programm %programm" weight=6
    //% buffer.shadow="radio_sendBuffer19"
    export function setProgramm(buffer: Buffer, programm: eProgramm) {
        buffer[0] &= 0b11001111 // AND Bit 7-6-3-2-1-0 bleiben; 5-4 auf 0 setzen
        buffer[0] |= (programm & 0b00110000) // OR Bit 7-6-3-2-1-0 bleiben; 5-4 auf pByte setzen
    }

    //% group="Datenpaket auslesen (receivedData oder sendData)" subcategory="Fernsteuerung"
    //% block="Buffer[0] %buffer get Programm" weight=6
    export function getProgramm(buffer: Buffer): eProgramm {
        return (buffer[0] & 0b00110000)
    }

    //% group="Datenpaket zum Senden vorbereiten" subcategory="Fernsteuerung"
    //% block="Buffer[0] %buffer set Bit %p0Bit %bit" weight=4
    //% buffer.shadow="radio_sendBuffer19"
    //% bit.shadow="toggleOnOff"
    export function set0Bit(buffer: Buffer, p0Bit: e0Bit, bit: boolean) {
        if (bit)
            buffer[0] |= p0Bit // OR Nullen bleiben, nur 1 wird gesetzt
        else
            buffer[0] &= ~p0Bit // AND Einsen bleiben, nur 0 wird gesetzt
    }


    // ========== Steuer-Byte 3


    //% group="Datenpaket zum Senden vorbereiten" subcategory="Fernsteuerung"
    //% block="Buffer[3] %buffer set Motor Power %pMotorBit %pBit" weight=5
    //% buffer.shadow="radio_sendBuffer19"
    //% pBit.shadow="toggleOnOff"
    export function setMotorPower(buffer: Buffer, pMotorBit: eMotorBit, pBit: boolean) {
        if (pBit)
            buffer[eBufferPointer.p0 + eBufferOffset.b2_Fahrstrecke] |= pMotorBit // OR Nullen bleiben, nur 1 wird gesetzt
        else
            buffer[eBufferPointer.p0 + eBufferOffset.b2_Fahrstrecke] &= ~pMotorBit // AND Einsen bleiben, nur 0 wird gesetzt
    }

    //% group="Datenpaket auslesen (receivedData oder sendData)" subcategory="Fernsteuerung"
    //% block="Buffer[3] %buffer get Motor Power %pMotorBit %pBit" weight=5
    export function getMotorPower(buffer: Buffer, pMotorBit: eMotorBit) {
        return (buffer[eBufferPointer.p0 + eBufferOffset.b2_Fahrstrecke] & pMotorBit) != 0
    }


    //% group="Datenpaket zum Senden vorbereiten" subcategory="Fernsteuerung"
    //% block="Buffer[3] %buffer Ultraschall Entfernung %entfernung" weight=4
    //% buffer.shadow="radio_sendBuffer19"
    export function setEntfernung(buffer: Buffer, entfernung: eEntfernung) {
        buffer[eBufferPointer.p0 + eBufferOffset.b2_Fahrstrecke] &= 0b00111111 // AND Bit 5-4-3-2-1-0 bleiben; 7-6 auf 0 setzen
        buffer[eBufferPointer.p0 + eBufferOffset.b2_Fahrstrecke] |= (entfernung & 0b11000000) // OR Bit 5-4-3-2-1-0 bleiben; 7-6 auf pEntfernung setzen
    }

    //% group="Datenpaket auslesen (receivedData oder sendData)" subcategory="Fernsteuerung"
    //% block="Buffer[3] %buffer Ultraschall Entfernung" weight=4
    export function getEntfernung(buffer: Buffer): eEntfernung {
        return (buffer[eBufferPointer.p0 + eBufferOffset.b2_Fahrstrecke] & 0b11000000)
    }



    /* 
        //% group="Datenpaket zum Senden vorbereiten" subcategory="Fernsteuerung"
        //% block="Buffer[0] %pBuffer set Bit %pBufferBit %pBit" weight=1
        //% pBuffer.shadow="radio_sendBuffer19"
        //% pBit.shadow="toggleOnOff"
        export function sendBuffer0_setBit(pBuffer: Buffer, pBufferBit: eBufferBit, pBit: boolean) {
            if (pBit)
                pBuffer[0] |= pBufferBit // OR 0b10000000 Bit auf 1 setzen
            else
                pBuffer[0] &= ~pBufferBit // AND 0b01111111 Bit auf 0 setzen
        }
     */




    //% group="Kommentar" advanced=true
    //% block="// %text"
    export function comment(text: string): void { }




    // ========== group="Buffer" advanced=true

    //% group="Buffer" advanced=true
    //% block="Buffer %buffer getNumber(%format offset %offset)" weight=8
    //% format.defl=NumberFormat.UInt8LE
    //% offset.min=0 offset.max=18
    export function getNumber(buffer: Buffer, format: NumberFormat, offset: number): number { return buffer.getNumber(format, offset) }

    //% group="Buffer" advanced=true
    //% block="Buffer %buffer setNumber(%format offset %offset value %value)" weight=7
    //% format.defl=NumberFormat.UInt8LE
    //% offset.min=0 offset.max=18
    //% inlineInputMode=inline
    export function setNumber(buffer: Buffer, format: NumberFormat, offset: number, value: number) { buffer.setNumber(format, offset, value) }

    //% group="Buffer" advanced=true
    //% block="Buffer %buffer offset %offset getBit 2** %exp" weight=4
    //% offset.min=0 offset.max=18
    //% exp.min=0 exp.max=7
    export function getBit(buffer: Buffer, offset: number, exp: number): boolean {
        return (buffer[offset] & 2 ** Math.trunc(exp)) != 0
    }

    //% group="Buffer" advanced=true
    //% block="Buffer %buffer offset %offset setBit 2** %exp %pBit" weight=3
    //% offset.min=0 offset.max=18
    //% exp.min=0 exp.max=7
    //% inlineInputMode=inline
    export function setBit(buffer: Buffer, offset: number, exp: number, bit: boolean) {
        if (bit)
            buffer[offset] | 2 ** Math.trunc(exp)
        else
            buffer[offset] & ~(2 ** Math.trunc(exp))
    }

    //% group="Buffer" advanced=true
    //% block="%pNumber .toHex()" weight=1
    export function toHex(bytes: number[]): string { return Buffer.fromArray(bytes).toHex() }

}
// radiodata19.ts
