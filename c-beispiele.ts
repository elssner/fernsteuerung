
namespace cb2 { // c-beispiele.ts



    // ========== subcategory=Beispiele

    // blockId=cb2_speedPicker block="%speed" blockHidden=true
    // speed.shadow="speedPicker"
    //export function cb2_speedPicker(speed: number) { // defl ist 50%
    //    return radio.speedPicker(speed)
    //}

    // blockId=cb2_protractorPicker block="%angle" blockHidden=true
    // angle.shadow="protractorPicker" angle.defl=90
    //export function cb2_protractorPicker(angle: number) { // defl ist 0°
    //    return radio.protractorPicker(angle)
    //}




    function setMotoren0Prozent(pwm1: number, pwm2: number) { // (-100% .. 0 .. +100%)
        writeMotoren128(radio.speedPicker(pwm1), radio.speedPicker(pwm2))
    }

    // ========== group="2 fahren und drehen" subcategory=Beispiele ⅒s • 

    //% group="2 fahren und drehen" subcategory=Beispiele
    //% block="Motoren fahren %sf s • drehen %sd s • nach %rl" weight=8
    // sf.min=0 sf.max=10 sf.defl=5
    // sd.min=0 sd.max=10 sd.defl=2.5
    //% sf.shadow=cb2_ePause
    //% sd.shadow=cb2_ePause
    export function seite2Motor(sf: number, sd: number, rl: eRL) {
        setMotoren0Prozent(100, 100)

        pauseSekunden(sf)
        if (rl == eRL.links)
            setMotoren0Prozent(-50, 50)
        else
            setMotoren0Prozent(50, -50)
        pauseSekunden(sd)
        setMotoren0Prozent(0, 0)
    }

    let n_StopandGoMotoran: boolean = false // für seite4StopandGo()


    //% group="4 Lautstärke, Stop and Go" subcategory=Beispiele
    //% block="Stop and Go Motoren l %pwm1 \\% r %pwm2 \\% Lautstärke > %soundLevel || Pause %sekunden" weight=1
    //% pwm1.shadow="speedPicker" pwm1.defl=80
    //% pwm2.shadow="speedPicker" pwm2.defl=-80
    //% soundLevel.min=0 soundLevel.max=255 soundLevel.defl=30
    //% sekunden.shadow=cb2_ePause
    //% inlineInputMode=inline
    export function seite4StopandGoL(pwm1: number, pwm2: number, soundLevel: number, sekunden: number = 1) {
        let laut = input.soundLevel()

        // if (this.initLog(2)) {

        //  this.qLog[0] = format4r(soundLevel) + format4r(laut)

        // }

        if (laut > soundLevel) {
            n_StopandGoMotoran = !(n_StopandGoMotoran)

            // nur bei Änderung an i2c senden
            if (n_StopandGoMotoran)
                setMotoren0Prozent(pwm1, pwm2)
            else
                setMotoren0Prozent(0, 0)

            //if (this.initLog(2))
            //    this.qLog[1] = (this.qStopandGoMotoran ? "  Go" : "Stop") + format4r(laut)

            pauseSekunden(sekunden) // Sekunden nur nach Ereignis
        }



    }


    // ========== 

    //% group="9 Linienfolger" subcategory=Beispiele
    //% block="Linienfolger fahren %pwm1 \\% • drehen %pwm2 \\% • stop %stop cm" weight=2
    //% pwm1.shadow="speedPicker" pwm1.defl=100
    //% pwm2.shadow="speedPicker" pwm2.defl=50
    //% stop.min=0 stop.max=50 stop.defl=10
    export function seite9Linienfolger(pwm1: number, pwm2: number, stop: number) {
        //this.i2cReadINPUT_US()
        if (readUltraschallAbstand() < stop) { //  if (this.bitINPUT_US(eVergleich.lt, stop)) {
            setMotoren0Prozent(0, 0)
            return false
        } else {
            // this.i2cReadINPUTS()
            // readInputs()
            if (readSpursensor(eDH.dunkel, eDH.dunkel, eI2C.x21)) { //     if (this.bitINPUTS(calli2bot.eINPUTS.sp0)) {
                setMotoren0Prozent(pwm1, pwm1) // dunkel,dunkel
                writeLed(eLed.redb, false) // beide rote LED aus
            } else if (readSpursensor(eDH.dunkel, eDH.hell)) { // if (this.bitINPUTS(calli2bot.eINPUTS.sp1r)) {
                setMotoren0Prozent(0, pwm2)
                // writeLed(eLed.redl, false)
                writeLed(eLed.redr, true)
            } else {
                setMotoren0Prozent(pwm2, 0)
                //  writeLed(eLed.redl, false)
                writeLed(eLed.redr, false)
            }
            return true
        }
    }



    //% group="Pause" subcategory=Beispiele
    //% block="Pause %sekunden" weight=1
    //% sekunden.shadow=cb2_ePause
    export function pauseSekunden(sekunden: number) {
        basic.pause(sekunden * 1000)
        // control.waitMicros(sekunden * 1000000)
    }

    export enum ePause {
        //% block="1 Sekunde"
        s1 = 10,
        //% block="0,5 Sekunden"
        s05 = 5,
        //% block="2 Sekunden"
        s2 = 20,
        //% block="5 Sekunden"
        s5 = 50,
        //% block="10 Sekunden"
        s10 = 100,
        //% block="15 Sekunden"
        s15 = 150,
        //% block="20 Sekunden"
        s20 = 200,
        //% block="30 Sekunden"
        s30 = 300,
        //% block="45 Sekunden"
        s45 = 450,
        //% block="60 Sekunden"
        s60 = 600
    }

    //% blockId=cb2_ePause 
    //% block="%pause" blockHidden=true
    export function cb2_ePause(pause: ePause): number { return pause / 10 }


    export enum eRL { rechts = 0, links = 1 } // Index im Array


} // c-beispiele.ts
