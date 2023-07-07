/*
 * Copyright 2008 ZXing authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*namespace com.google.zxing.common {*/
import FormatException from '../FormatException'
/*import java.util.HashMap;*/
/*import java.util.Map;*/
export var CharacterSetValueIdentifiers
;(function (CharacterSetValueIdentifiers) {
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['Cp437'] = 0)] = 'Cp437'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_1'] = 1)] = 'ISO8859_1'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_2'] = 2)] = 'ISO8859_2'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_3'] = 3)] = 'ISO8859_3'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_4'] = 4)] = 'ISO8859_4'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_5'] = 5)] = 'ISO8859_5'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_6'] = 6)] = 'ISO8859_6'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_7'] = 7)] = 'ISO8859_7'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_8'] = 8)] = 'ISO8859_8'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_9'] = 9)] = 'ISO8859_9'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_10'] = 10)] = 'ISO8859_10'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_11'] = 11)] = 'ISO8859_11'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_13'] = 12)] = 'ISO8859_13'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_14'] = 13)] = 'ISO8859_14'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_15'] = 14)] = 'ISO8859_15'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ISO8859_16'] = 15)] = 'ISO8859_16'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['SJIS'] = 16)] = 'SJIS'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['Cp1250'] = 17)] = 'Cp1250'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['Cp1251'] = 18)] = 'Cp1251'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['Cp1252'] = 19)] = 'Cp1252'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['Cp1256'] = 20)] = 'Cp1256'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['UnicodeBigUnmarked'] = 21)] = 'UnicodeBigUnmarked'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['UTF8'] = 22)] = 'UTF8'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['ASCII'] = 23)] = 'ASCII'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['Big5'] = 24)] = 'Big5'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['GB18030'] = 25)] = 'GB18030'
  CharacterSetValueIdentifiers[(CharacterSetValueIdentifiers['EUC_KR'] = 26)] = 'EUC_KR'
})(CharacterSetValueIdentifiers || (CharacterSetValueIdentifiers = {}))
/**
 * Encapsulates a Character Set ECI, according to "Extended Channel Interpretations" 5.3.1.1
 * of ISO 18004.
 *
 * @author Sean Owen
 */
export default class CharacterSetECI {
  valueIdentifier
  name
  static VALUE_IDENTIFIER_TO_ECI = new Map()
  static VALUES_TO_ECI = new Map()
  static NAME_TO_ECI = new Map()
  // Enum name is a Java encoding valid for java.lang and java.io
  // TYPESCRIPTPORT: changed the main label for ISO as the TextEncoder did not recognized them in the form from java
  // (eg ISO8859_1 must be ISO88591 or ISO8859-1 or ISO-8859-1)
  // later on: well, except 16 wich does not work with ISO885916 so used ISO-8859-1 form for default
  static Cp437 = new CharacterSetECI(CharacterSetValueIdentifiers.Cp437, Int32Array.from([0, 2]), 'Cp437')
  static ISO8859_1 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_1,
    Int32Array.from([1, 3]),
    'ISO-8859-1',
    'ISO88591',
    'ISO8859_1',
  )
  static ISO8859_2 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_2,
    4,
    'ISO-8859-2',
    'ISO88592',
    'ISO8859_2',
  )
  static ISO8859_3 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_3,
    5,
    'ISO-8859-3',
    'ISO88593',
    'ISO8859_3',
  )
  static ISO8859_4 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_4,
    6,
    'ISO-8859-4',
    'ISO88594',
    'ISO8859_4',
  )
  static ISO8859_5 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_5,
    7,
    'ISO-8859-5',
    'ISO88595',
    'ISO8859_5',
  )
  static ISO8859_6 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_6,
    8,
    'ISO-8859-6',
    'ISO88596',
    'ISO8859_6',
  )
  static ISO8859_7 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_7,
    9,
    'ISO-8859-7',
    'ISO88597',
    'ISO8859_7',
  )
  static ISO8859_8 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_8,
    10,
    'ISO-8859-8',
    'ISO88598',
    'ISO8859_8',
  )
  static ISO8859_9 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_9,
    11,
    'ISO-8859-9',
    'ISO88599',
    'ISO8859_9',
  )
  static ISO8859_10 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_10,
    12,
    'ISO-8859-10',
    'ISO885910',
    'ISO8859_10',
  )
  static ISO8859_11 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_11,
    13,
    'ISO-8859-11',
    'ISO885911',
    'ISO8859_11',
  )
  static ISO8859_13 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_13,
    15,
    'ISO-8859-13',
    'ISO885913',
    'ISO8859_13',
  )
  static ISO8859_14 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_14,
    16,
    'ISO-8859-14',
    'ISO885914',
    'ISO8859_14',
  )
  static ISO8859_15 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_15,
    17,
    'ISO-8859-15',
    'ISO885915',
    'ISO8859_15',
  )
  static ISO8859_16 = new CharacterSetECI(
    CharacterSetValueIdentifiers.ISO8859_16,
    18,
    'ISO-8859-16',
    'ISO885916',
    'ISO8859_16',
  )
  static SJIS = new CharacterSetECI(CharacterSetValueIdentifiers.SJIS, 20, 'SJIS', 'Shift_JIS')
  static Cp1250 = new CharacterSetECI(CharacterSetValueIdentifiers.Cp1250, 21, 'Cp1250', 'windows-1250')
  static Cp1251 = new CharacterSetECI(CharacterSetValueIdentifiers.Cp1251, 22, 'Cp1251', 'windows-1251')
  static Cp1252 = new CharacterSetECI(CharacterSetValueIdentifiers.Cp1252, 23, 'Cp1252', 'windows-1252')
  static Cp1256 = new CharacterSetECI(CharacterSetValueIdentifiers.Cp1256, 24, 'Cp1256', 'windows-1256')
  static UnicodeBigUnmarked = new CharacterSetECI(
    CharacterSetValueIdentifiers.UnicodeBigUnmarked,
    25,
    'UnicodeBigUnmarked',
    'UTF-16BE',
    'UnicodeBig',
  )
  static UTF8 = new CharacterSetECI(CharacterSetValueIdentifiers.UTF8, 26, 'UTF8', 'UTF-8')
  static ASCII = new CharacterSetECI(
    CharacterSetValueIdentifiers.ASCII,
    Int32Array.from([27, 170]),
    'ASCII',
    'US-ASCII',
  )
  static Big5 = new CharacterSetECI(CharacterSetValueIdentifiers.Big5, 28, 'Big5')
  static GB18030 = new CharacterSetECI(CharacterSetValueIdentifiers.GB18030, 29, 'GB18030', 'GB2312', 'EUC_CN', 'GBK')
  static EUC_KR = new CharacterSetECI(CharacterSetValueIdentifiers.EUC_KR, 30, 'EUC_KR', 'EUC-KR')
  values
  otherEncodingNames
  constructor(valueIdentifier, valuesParam, name, ...otherEncodingNames) {
    this.valueIdentifier = valueIdentifier
    this.name = name
    if (typeof valuesParam === 'number') {
      this.values = Int32Array.from([valuesParam])
    } else {
      this.values = valuesParam
    }
    this.otherEncodingNames = otherEncodingNames
    CharacterSetECI.VALUE_IDENTIFIER_TO_ECI.set(valueIdentifier, this)
    CharacterSetECI.NAME_TO_ECI.set(name, this)
    const values = this.values
    for (let i = 0, length = values.length; i !== length; i++) {
      const v = values[i]
      CharacterSetECI.VALUES_TO_ECI.set(v, this)
    }
    for (const otherName of otherEncodingNames) {
      CharacterSetECI.NAME_TO_ECI.set(otherName, this)
    }
  }
  // CharacterSetECI(value: number /*int*/) {
  //   this(new Int32Array {value})
  // }
  // CharacterSetECI(value: number /*int*/, String... otherEncodingNames) {
  //   this.values = new Int32Array {value}
  //   this.otherEncodingNames = otherEncodingNames
  // }
  // CharacterSetECI(values: Int32Array, String... otherEncodingNames) {
  //   this.values = values
  //   this.otherEncodingNames = otherEncodingNames
  // }
  getValueIdentifier() {
    return this.valueIdentifier
  }
  getName() {
    return this.name
  }
  getValue() {
    return this.values[0]
  }
  /**
   * @param value character set ECI value
   * @return {@code CharacterSetECI} representing ECI of given value, or null if it is legal but
   *   unsupported
   * @throws FormatException if ECI value is invalid
   */
  static getCharacterSetECIByValue(value /*int*/) {
    if (value < 0 || value >= 900) {
      throw new FormatException('incorect value')
    }
    const characterSet = CharacterSetECI.VALUES_TO_ECI.get(value)
    if (undefined === characterSet) {
      throw new FormatException('incorect value')
    }
    return characterSet
  }
  /**
   * @param name character set ECI encoding name
   * @return CharacterSetECI representing ECI for character encoding, or null if it is legal
   *   but unsupported
   */
  static getCharacterSetECIByName(name) {
    const characterSet = CharacterSetECI.NAME_TO_ECI.get(name)
    if (undefined === characterSet) {
      throw new FormatException('incorect value')
    }
    return characterSet
  }
  equals(o) {
    if (!(o instanceof CharacterSetECI)) {
      return false
    }
    const other = o
    return this.getName() === other.getName()
  }
}
