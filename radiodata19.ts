
namespace radio
/*
Calliope Bluetooth Erweiterung für 19 Byte Buffer und CaR Fernsteuerung
für CalliBot, MakerKitCar, CaR4
240511 Lutz Elßner
*/ { // radiodata19.ts



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
    // let n_BufferPointer: eBufferPointer = eBufferPointer.p0 // n=0..5 (n*3)+1 = 1, 4, 7, 10, 13, 16

    export enum eBufferOffset { // 3 Byte (b0-b1-b2) ab n_BufferPointer
        //% block="0 Motor 0..128..255"
        b0_Motor = 0, // 0..128..255
        //% block="1 Servo 0..16..31"
        b1_Servo = 1, // Bit 4-0 (0..31)
        //% block="2 Fahrstrecke 0..255 cm"
        b2_Fahrstrecke = 2, // Encoder in cm max. 255cm
        // b1_3Bit = 3 // Bit 7-6-5
    }

    export enum eBufferBit {
        //% block="Motor Power"
        x80_MotorPower = 0x80,
        //% block="Hupe"
        x40_Hupe = 0x40,
        //% block="connected & fahren Joystick"
        //fahrenJostick = 0x00,
        //% block="fahren Strecke"
        fahrenStrecke = 0x01
    }



    // ========== group="Datenpaket vorbereiten" subcategory="Buffer" color=#E3008C

    //% group="Datenpaket vorbereiten" subcategory="Buffer" color=#E3008C
    //% block="Buffer %pBuffer set Byte %pOffset %pByte || %pBufferPointer " weight=7
    //% pBuffer.shadow="radio_sendBuffer19"
    //% inlineInputMode=inline 
    export function setUint8(pBuffer: Buffer, pBufferOffset: eBufferOffset, pByte: number, pBufferPointer?: eBufferPointer) {
        if (!pBufferPointer) pBufferPointer = eBufferPointer.p0  // wenn nicht angegeben internen Wert nehmen
        switch (pBufferOffset) {
            case eBufferOffset.b1_Servo:
                pBuffer[pBufferPointer + eBufferOffset.b1_Servo] &= 0b11100000 // AND Bit 7-6-5 bleiben; 4-3-2-1-0 auf 0 setzen
                pBuffer[pBufferPointer + eBufferOffset.b1_Servo] |= (pByte & 0b00011111) // OR Bit 7-6-5 bleiben; 4-3-2-1-0 auf pByte setzen
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
        }
    }

    //% group="Datenpaket vorbereiten" subcategory="Buffer" color=#E3008C
    //% block="Steuer-Byte 0 %pBuffer %pBufferBit %pBit" weight=1
    //% pBuffer.shadow="radio_sendBuffer19"
    //% pBit.shadow="toggleOnOff"
    export function sendBuffer0_setBit(pBuffer: Buffer, pBufferBit: eBufferBit, pBit: boolean) {
        if (pBit)
            pBuffer[0] |= pBufferBit // OR 0b10000000 Bit auf 1 setzen
        else
            pBuffer[0] &= ~pBufferBit // AND 0b01111111 Bit auf 0 setzen
    }





    //% group="Kommentar" advanced=true
    //% block="// %text"
    export function comment(text: string): void { }

}
// radiodata19.ts
