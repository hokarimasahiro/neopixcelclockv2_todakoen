function 時計フォント展開 (text: string) {
    fontlist = ""
    for (let index2 = 0; index2 <= text.length - 1; index2++) {
        font_no = 文字変換表.indexOf(text.charAt(index2))
        if (font_no >= 0) {
            fontlist = "" + fontlist + FONT[font_no]
        }
    }
    return fontlist
}
radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 5) {
        文字色切替()
    } else if (receivedNumber == 11) {
        メッセージ切替()
    } else if (receivedNumber == 8) {
        music.setBuiltInSpeakerEnabled(true)
        soundExpression.happy.playUntilDone()
        music.setBuiltInSpeakerEnabled(false)
    } else if (receivedNumber == 12) {
    	
    } else if (receivedNumber == 13) {
    	
    } else if (receivedNumber == 16) {
    	
    }
})
function 固定表示 (fontList: string) {
    for (let index22 = 0; index22 <= fontList.length / 2 - 1; index22++) {
        LINE = bit.hexToNumber(fontList.substr(index22 * 2, 2))
        for (let Y = 0; Y <= 7; Y++) {
            if (index22 % 2 == 0) {
                POS = index22 * 8 + (0 + Y)
            } else {
                POS = index22 * 8 + (7 - Y)
            }
            if (bit.bitTest(LINE, 7 - Y)) {
                strip.setPixelColor(POS, 文字色)
            } else {
                strip.setPixelColor(POS, 背景色)
            }
        }
    }
}
function シフト表示 (fontlist: string, 表示位置: number) {
    strip.shift(-8)
    strip2.shift(-8)
    LINE = bit.hexToNumber(fontlist.substr(表示位置, 2))
    for (let Y2 = 0; Y2 <= 7; Y2++) {
        if (表示位置 % 4 == 0) {
            POS2 = Y2 + 248
            POS = 255 - Y2
        } else {
            POS = Y2 + 248
            POS2 = 255 - Y2
        }
        if (bit.bitTest(LINE, 7 - Y2)) {
            strip.setPixelColor(POS, 文字色)
            strip2.setPixelColor(POS2, 文字色)
        } else {
            strip.setPixelColor(POS, 背景色)
            strip2.setPixelColor(POS2, 背景色)
        }
    }
    if (表示位置 % 4 == 0) {
        strip.show()
    } else {
        strip2.show()
    }
    if (表示位置 >= fontlist.length - 2) {
        return 0
    } else {
        return 表示位置 + 2
    }
}
function メッセージ設定 () {
    if (メッセージ番号 < メッセージリスト.length) {
        メッセージ = メッセージリスト[メッセージ番号]
        if (メッセージ.length > 64) {
            for (let index = 0; index < 行末空白; index++) {
                メッセージ = "" + メッセージ + "00"
            }
            if (メッセージ.length % 4 != 0) {
                メッセージ = "" + メッセージ + "00"
            }
            strip.clear()
            strip2.clear()
            表示位置 = 0
        } else {
            固定表示(メッセージ)
            strip.show()
        }
    }
}
input.onButtonPressed(Button.A, function () {
    文字色切替()
})
function メッセージ切替 () {
    メッセージ番号 += 1
    if (メッセージ番号 > メッセージリスト.length) {
        メッセージ番号 = 0
    }
    メッセージ設定()
}
function 文字色切替 () {
    if (文字色 == neopixel.colors(NeoPixelColors.Red)) {
        文字色 = neopixel.colors(NeoPixelColors.Orange)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Orange)) {
        文字色 = neopixel.colors(NeoPixelColors.Yellow)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Yellow)) {
        文字色 = neopixel.colors(NeoPixelColors.Green)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Green)) {
        文字色 = neopixel.colors(NeoPixelColors.Blue)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Blue)) {
        文字色 = neopixel.colors(NeoPixelColors.Indigo)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Indigo)) {
        文字色 = neopixel.colors(NeoPixelColors.Violet)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Violet)) {
        文字色 = neopixel.colors(NeoPixelColors.Purple)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Purple)) {
        文字色 = neopixel.colors(NeoPixelColors.White)
    } else {
        文字色 = neopixel.colors(NeoPixelColors.Red)
    }
}
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    受信データ = serial.readUntil(serial.delimiters(Delimiters.NewLine)).split(",")
    rtc.setDatetime(rtc.convDateTime(
    parseFloat(受信データ[0]),
    parseFloat(受信データ[1]),
    parseFloat(受信データ[2]),
    parseFloat(受信データ[3]),
    parseFloat(受信データ[4]),
    parseFloat(受信データ[5])
    ))
})
input.onButtonPressed(Button.B, function () {
    メッセージ切替()
})
function 時刻表示 () {
    時刻 = rtc.getDatetime()
    時 = rtc.getData(時刻, clockData.hour)
    分 = rtc.getData(時刻, clockData.minute)
    秒 = rtc.getData(時刻, clockData.second)
    if (時 < 10) {
        時計文字 = " "
    } else {
        時計文字 = ""
    }
    時計文字 = "" + 時計文字 + convertToText(時)
    if (秒 % 2 == 1) {
        時計文字 = "" + 時計文字 + "_"
    } else {
        時計文字 = "" + 時計文字 + ":"
    }
    if (分 < 10) {
        時計文字 = "" + 時計文字 + "0"
    } else {
        時計文字 = "" + 時計文字 + ""
    }
    時計文字 = "" + 時計文字 + convertToText(分)
    固定表示(時計フォント展開(時計文字))
    for (let index3 = 0; index3 <= 29; index3++) {
        POS2 = index3 + Math.trunc(index3 / 10)
        if (POS2 % 2 == 0) {
            POS = POS2 * 8 + 7
        } else {
            POS = POS2 * 8 + 0
        }
        if (秒 < 30) {
            if (秒 > index3) {
                strip.setPixelColor(POS, neopixel.rgb(0, 127, 0))
            } else {
                strip.setPixelColor(POS, neopixel.colors(NeoPixelColors.Black))
            }
        } else {
            if (秒 - 30 > index3) {
                strip.setPixelColor(POS, neopixel.colors(NeoPixelColors.Black))
            } else {
                strip.setPixelColor(POS, neopixel.rgb(0, 127, 0))
            }
        }
    }
    strip.show()
}
let 輝度 = 0
let 時計文字 = ""
let 秒 = 0
let 分 = 0
let 時 = 0
let 受信データ: string[] = []
let 表示位置 = 0
let メッセージ = ""
let POS2 = 0
let POS = 0
let LINE = 0
let font_no = 0
let fontlist = ""
let 背景色 = 0
let 文字色 = 0
let メッセージ番号 = 0
let メッセージリスト: string[] = []
let 行末空白 = 0
let strip2: neopixel.Strip = null
let strip: neopixel.Strip = null
let FONT: string[] = []
let 文字変換表 = ""
let 時刻 = 0
rtc.setDevice(rtcType.ds3231)
時刻 = rtc.getDatetime()
文字変換表 = "0123456789:_ "
FONT = [
"7C828282827C00",
"000042FE020000",
"468A9292926200",
"44829292926C00",
"1C244484FE0400",
"E2A2A2A2A29C00",
"1C325292920C00",
"80808E90A0C000",
"6C929292926C00",
"60929294987000",
"006C6C00",
"00000000",
"00000000000000"
]
strip = neopixel.create(DigitalPin.P1, 256, NeoPixelMode.RGB)
strip.clear()
strip.show()
strip2 = neopixel.create(DigitalPin.P1, 256, NeoPixelMode.RGB)
strip2.clear()
strip2.show()
行末空白 = 8
let CoderDojo_TodaKoen = "384482828244001C2222221C001C222212FE001C2A2A2A18003E1020201000FE8282824438001C2222221C00040202BC001C2222221C0082BCA8A8A8B88000FE9292FE9292FE001222C61AC2241200FEA6FAEEFAA6FE00"
let Todakoen_18 = "42FE02006C929292926C00FE82BAAABA82FE00384482828244001C2222221C001C222212FE001C2A2A2A18003E1020201000FE8282824438001C2222221C00040202BC001C2222221C0082BCA8A8A8B88000FE9292FE9292FE001222C61AC2241200FEA6FAEEFAA6FE00"
メッセージリスト = [CoderDojo_TodaKoen, Todakoen_18]
メッセージ番号 = 2
文字色 = neopixel.colors(NeoPixelColors.Purple)
背景色 = neopixel.colors(NeoPixelColors.Black)
let 最大輝度 = 255
let 最小輝度 = 2
メッセージ設定()
radio.setGroup(1)
serial.redirectToUSB()
basic.forever(function () {
    時刻 = rtc.getDatetime()
    輝度 = Math.trunc(input.lightLevel() / 50) * 10 + 最小輝度
    strip.setBrightness(輝度)
    strip2.setBrightness(輝度)
    if (メッセージ番号 >= メッセージリスト.length) {
        時刻表示()
    } else {
        if (メッセージ.length > 64) {
            表示位置 = シフト表示(メッセージ, 表示位置)
        }
    }
    basic.pause(100)
})
control.inBackground(function () {
    while (true) {
        watchfont.plotBarGraph(input.lightLevel())
        basic.pause(100)
    }
})
