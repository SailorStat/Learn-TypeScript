//? Модули
// Начиная с ES5 в JS появилась концепция модулей, она есть и в TS

// Модули выполняются в своей облвсти видимости. Если модули не экспортированы, то не видны в других файлах

// Модули декларативны: отношения между модулями указаны в терминах импорта и экспорта на уровне файла

// Модули импортируют друг друга с помощью загрузчика модулей. Во время выполнения загрузчик модуля
// отвечает за обнаружение и выполнение всех зависимостей модуля перед его выполнением. Хорошо известными
// загрузчиками модулей являются Node.js для модулей CommonJS и загрузчик RequireJS для модулей AMD
// в веб-приложениях

// В TS любой файл, содержащий верхний уровень import и export, считается модулем
// Без них содержимое доступно в глобальной области


//* Экспорт
//* Экспорт декларации
// Любое объявление (например, переменная, функция, класс, псевдоним типа или интерфейс) можно
// экспортировать, добавив слово  export

// StringValidator.ts
// export interface StringValidator {
//   isAcceptable(s: string): boolean
// }

// ZipCodeValidator.ts
// import {StringValidator} from "./StringValidator"
// export const numberRegexp = /^[0-9]+$/
// export class ZipCodeValidator implements StringValidator {
//   isAcceptable(s: string) {
//     return s.length === 5 && numberRegexp.test(s)
//   }  
// }


//* Выписки по экспорту
// Операторы экспорта удобны, когда экспорт нужно переименовать для потребителей, поэтому приведённый
// выше пример можно записать как:
// class ZipCodeValidator implements StringValidator {
//   isAcceptable(s: string) {
//     return s.length === 5 && numberRegexp.test(s)
//   }
// }
// export {ZipCodeValidator}
// export {ZipCodeValidator as mainValidator}


//* Реэкспорт
// Часто модули расширяют другие модули и частично раскрывают некоторые из их функций
// При повторном экспорте он не импортируется локально и не выводится локальная переменная

// ParseIntBasedZipCodeValidator.ts
// export class ParseIntBasedZipCodeValidator {
//  isAccerpable(s: string) {
//    return s.length === 5 && parseInt(s).toString === s
//  }
// }
// export {ZipCodeValidator as RegExpBasedZipCodeValidator} from "./ZipCodeValidator"

// При желании модуль модет обернуть один или несколько модулей и объеденить все их экспортные данные
// с помощью export * from "module" синтаксиса

// export * from "./StringValidator"
// export * from "./ZipCodeValidator"
// export * from "./ParseIntBasedZipCodeValidator"


//* Импорт
//* Импортировать один эккспорт из модуля
// import {ZipCodeValidator} from "./ZipCodeValidator"
// let myValidator = new ZipCodeValidator()

// Импорт можно переименовывать
// import {ZipCodeValidator as ZCV} from "./ZipCodeValidator"
// let myValidator = new ZCV()


//* Имортировать можно весь модуль и использовать его, как переменную
// import * as validator from "./ZipCodeValidator"
// let myValidator = new validator.ZipCodeValidator()


//* Импорт модулей только для побочных эффектов
// Это не рекомендуется, но некоторые модули устанавливают какое-то глобальное состояние, которое может
// использоваться другими модулями. Эти модули могут не иметь экспорта, или потребитель не заинтересован
// в их экспорте. Чтобы импортировать эти модули, используется:
// import "./my-module.js"


//* Типы импорта
// До TS 3.8 импорт типа с помощью import. В TS 3.8 можно импортировать с помощью import или import type
// import {APIResponseType} from "./api"
// import type {APIResponseType} from "./api"

// import type всегда гаранторованно удаляется из JS, а инструменты транспиляции делают более точные
// предположения о коде с помощью isolatedModules флага компилятора


//* Экспорт по умолчанию
// Каждый модуль может дополнительно экспортировать default . Экспорт по умолчанию может быть только один

// Такой экспорт удобен и исползуется, например так используется jQuery
// JQuery.d.ts
// declare let $: JQuery
// export default $

// App.ts
// import $ from "jquery"
// $("button.continue").html("Next Step...")

// Объявления классов и функций могут быть созданы непосредственно, как экспорт по умолчанию
// Названия классов для экспорта по умолчанию являются необязательными
// ZipCodeValidator.ts
// export default class ZipCodeValidator {
//   static numberRegexp = /^[0-9]+$/
//   isAcceptable(s: string) {
//     return s.length === 5 && ZipCodeValidator.numberRegexp.test(s);
//   }
// }

// Test.ts
// import validator from "./ZipCodeValidator"
// let myValidator = new validator()

// или

// StaticZipCodeValidator.ts
// const numberRegexp = /^[0-9]+$/
// export default function (s: string) {
//   return s.length === 5 && numberRegexp.test(s);
// }

// Test.ts
// import validate from "./StaticZipCodeValidator"
// let strings = ["Hello", "98052", "101"]
// strings.forEach((s) => {
//   console.log(`${s} ${validate(s) ? "matches" : "does not match"}`)
// })

// default экспорт может быть просто значениями

// OneTwoThree.ts
// export default "123"

// Log.ts
// import num from "./OneTwoThree"
// console.log(num)    - "123"


//* Экспортировать всё, как х
// В TS 3.8 можно экспортировать export * as ns как сокращение для повторного экспорта другого модуля с именем
// export * as utilities from "./utilities"

// Это берёт все зависимости от модуля и делает его экспортированным полем. Импортируется так
// import {utilities} from "./index"


//* export =  а также  import = require()
// И CommonJS, и AMD обычно имеют концепцию exports объекта,
// который содержит все экспортные данные из модуля

// Они также поддерживают замену exports объекта собственным индивидуальным объектом.
// Экспорт по умолчанию предназначен для замены этого поведения, но они несовместимы
// TS поддерживает  export =  моделирование традиционного рабочего процесса CommonJS и AMD

// export = синтаксис определяет один объект, который экспортируется из модуля. Это может быть класс,
// интерфейс, пространство имён, функция или перечисление

// При экспорте модуля с использованием для импорта модуля необходимо использовать export = специальный
// для TS:  import module = require("module")
// const numberRegexp = /^[0-9]+$/
// class ZipCodeValidator {
//   isAcceptable(s: string) {
//     return s.length === 5 && numberRegexp.test(s);
//   }
// }
// export = ZipCodeValidator

// Test.ts
// import zip = require("./ZipCodeValidator")
// let strings = ["Hello", "98052", "101"]
// let validator = new zip()
// strings.forEach((s) => {
//   console.log(
//     `"${s}" - ${validator.isAcceptable(s) ? "matches" : "does not match"}`
//   )
// })


//* Генерация кода для модулей
// В зависимости от цели модуля, указанной во время компиляции, компилятор сгенерирует соответствующий код
// для систем загрузки модуей. Более подробная информация о define, require и register звонках в 
// сгенерированном коде для каждого модуля находится в документации

// Пример перевода кода загрузки во время импорта модуля
// SimpleModule.ts
// import m = require("mod")
// export let t = m.something + 1

// AMD / RequireJS SimpleModule.js
// define(["require", "exports", "./mod"], function (require, exports, mod_1) {
//   exports.t  = mod_1.something + 1  
// })

// CommonJS / Узел SimpleModule.js
// var mod_1 = require("./mod")
// exports.t = mod_1.something + 1

// UMD SimpleModule.js
// (function (factory) {
//   if (typeof module === "object" && typeof module.exports === "object") {
//     var v = factory(require, exports)
//     if (v !== undefined) module.exports = v
//   } else if (typeof define === "function" && define.amd) {
//     define(["require", "exports", "./mod"], factory)
//   }
// })(function (require, exports) {
//   var mod_1 = require("./mod")
//   exports.t = mod_1.something + 1
// })

// Система SimpleModule.js
// System.register(["./mod"], function (exports_1) [
//   var mod_1
//   var t
//   return {
//     setter: [
//       function (mod_1_1) {
//         mod_1 = mod_1_1
//       },
//     ],
//     execute: function () {
//       exports_1("t", (t = mod_1.something + 1))
//     }
//   }
// ])

// Сотственные модули ECMAScript 2015 SimpleModule.js
// import {something} from "./mod"
// export var t = something + 1


//* Простой пример
// Ниже объединяются реализации Validator, использованные в предыдущих примерах, чтобы экспортировать
// только один именованный экспорт из каждого модуля

// Для компиляции используется целевой модуль в командной строке
// Для Node.js используется  --module commonjs
// Для Require.js используется  --module amd
// tsc --module commonjs Test.ts

// При компиляции каждый модуль станет отдельным .js файлом. Как и в случае со ссылочними тегами, компилятор
// будет выполнять import инструкции для компиляции зависимых файлов

// Validation.ts
// export interface StringValidator {
//   isAcceptable(s: string): boolean
// }

// LettersOnlyValidator.ts
// import {StringValidator} from "./Validation"
// const lettersRegexp = /^[A-Za-z]+$/
// export class LettersOnlyValidator implements StringValidator {
//   isAcceptable(s: string) {
//     return lettersRegexp.test(s)
//   }
// }

// ZipCodeValidator.ts
// import {StringValidator} from "./Validation"
// const numberRegexp = /^[0-9]+$/
// export class ZipCodeValidator implements StringValidator {
//   isAcceptable(s: string) {
//     return s.length === 5 && numberRegexp.test(s)
//   }
// }

// Test.ts
// import {StringValidator} from "./Validation"
// import {ZipCodeValidator} from "./ZipCodeValidation"
// import {LettersOnlyValidator} from "./LettersOnlyValidation"
// let string = ["Hello", "98052", "101"]
// let validators: {[s: string]: StringValidator} = {}
// validators["ZIP code"] = new ZipCodeValidator()
// validators["Letters only"] = new LettersOnlyValidator()
// strings.forEach((s) => {
//   console.log(
//     `${s} - ${
//       validators[name].isAcceptable(s) ? "matches" : "does not match"
//     }`
//   )
// })


//* Загрузки дополнительных модулей и другие сценарии расширенной загрузки
// В некоторых случаях может потребоваться загрузить модуль только при определённых условиях
// Для этого есть способ в TS

// Компилятор определяет, используется ли каждый модуль в выпущенном JS. Если идентификатор используется
// только как часть аннотации типа и никогда как выражение, то require для этого модуля не создаёт
// никакого вызова. Это исключение неиспользуемых ссылок является хорошей оптимизацией произволительности,
// а также позволяет дополнительно загружать эти модули

// Основная идея шаблона состоит в том, что  import id = require("...") оператор даёт нам доступ к типа,
// предоставляемым модулем. Загрузчик модуля вызывается (через require) динамически, как показано в if
// блках ниже. Это усиливает оптимизацию исключения ссылок, как что модуль загужается только
// при необходимости. Чтобы этот шаблон работал, важно, чтобы символ, определённый с помощью, использовался
// import только в позициях типа (то есть никогда в позиции, которая будет передана JS)

// Для обеспечения безопасности типов мы можем использовать ключевое слово typeof. Оно при использовании
// в положении типа, производят тип значения, в данном случае типа модуля

// Динамическая загрузка модуля в Node.js
// declare function require(moduleName: string): any
// import {ZipCodeValidator as Zip} from "./ZipCodevalidator"
// if (needZipValidation) {
//   let ZipCodeValidator: typeof Zip = require("./ZipCodeValidator")
//   let validator = new ZipCodeValidator()
//   if (validator.isAcceptable("...")) {
//     /* ... */
//   }
// }

// Пример: загрузка динамического модуля require.js
// declare function require(
//   moduleNames: string[],
//   onLoad: (...args: any[]) => void
// ): void
// import * as Zip from "./ZipCodeValidator"
// if (needZipValidation) {
//   require(["./ZipCodeValidator"], (ZipCodeValidator: typeof Zip) => {
//     let validator = new ZipCodeValidator.ZipCodeValidator()
//     if (validator.isAcceptable("...")) {
//       /* ... */
//     }
//   })
// }

// Пример: загрузка динамического модуля в System.js
// declare const System: any
// import {ZipCodeValidator as Zip} from "./ZipCodeValidator"
// if (needZipValidation) {
//   System.import("./ZipCodeValidator").then((ZipCodeValidator: typeof Zip) => {
//     var x = new ZipCodeValidator()
//     if (x.isAcceptable("...")) {
//       /* ... */
//     }
//   })
// }


//* Работа с другими библиотеками JS
// Чтобы описать форму библиотек, написанных не на TS, нам нужно объявить API, который предоставляет
// библиотека

// Мы называем объявления, которые не определяют реализацию, "окружающим". Обычно они определяются
// в .d.ts файлах. Если вы знакомы с C/C++, вы можете рассматривать их, как .h файлы.


//* Внешрие модули
// В Node.js большинство задач выполняется путём загрузки одного или нескольких модулей. Мы могли бы
// каждый модуль в отдельном .d.ts файле с объявлением экспорта верхнего уровня, но удобнее записать их
// как один .d.ts файл большого размера. Для этого мы используем module ключевое слово и цитируемое
// имя модуля, которые будут доступня для последнего импорта

// node.d.ts (упрощённая выдержка)
// declare module "url" {
//   export interface Url {
//     protocol?: string
//     hostname?: string
//     pathname?: string
//   }

//   export function parse(
//     urlStr: string,
//     parseQueryString?,
//     slashesDenoteHost?
//   ): Url
// }
// declare module "path" {
//   export function normalize(p: string): string
//   export function join(...paths: any[]): string
//   export var sep: string
// }

// Теперь мы можем /// <reference> node.d.ts загружать модули с помощью import url = require("url") или
// import * as URL from "url"

// /// <reference path="node.d.ts"/>
// import * as URL from "url"
// let myUrl = URL.parse("http://www.typescriptlang.org")


//* Сокращенные эмбиентные модули
// Если вы не хотите тратить время на выписывание объявлений перед испольованием нового модуля, вы можете
// использовать сокращённое объявление, чтобы быстро начать работу

// декларации.d.ts
// declare module "hot-new-module"

// Все операции импорта из сокращённого модуля будут иметь any тип
// import x, {y} from "hot-new-module"
// x(y)


//* Объявление модуля с подстановочными знаками
// Некоторые загрузчики модулей, такие как SystemJS и AMD, позволяют импортировать содержимое, отличное от
// JS. Обычно они используют префикс или суффикс для обозначения специальной семантики загрузки
// Для таких случаем используется объявление модуля с подстановочными знаками
declare module "*!text" {
  const content: string
  export default content
}
declare module "json!*" {
  const value: string
  export default value
}

// Теперь можно испортировать то, что соответствует "*!text" или "json!*"
// import fileContent from "./xyz.txt!text"
// import data from "json!http://example.com/data.json"
// console.log(fileContent, data)


//* Модули UMD
// Некоторые библиотеки предназначены для использования во многих загрузчиках модулей
// или без загрузки модуля (глобальные переменные). Они известны, как модули UMD. Доступ к этим библиотекам
// можно получить либо с помощью импорта, либо с помощью глобальной пременной

// math-lib.d.ts
// export function isPrime(x: number): boolean
// export as namespace mathLib

// Затем библиотеку можно использовать, как импорт в модулях:
// import {isPrime} from "math-lib"
// isPrime(2)
// mathLib.isPrime(2)     - ошибка, нельзя импользовать глобальные пременные за пределами модуля

// Его можно использовать, как глобальную переменную, но только внутри скрипта без импорта и экспорта
// mathLib.isPrime(2)


//* Руководство по структурированию модулей
//* Экспорт как можно ближе к верхнему уровню
// Потребители модуля должны иметь как можно меньше проблем при использовании экспортируемых вещей
// Добавление слишком большого уровня вложенности может быть обременительным, по-этому надо
// хорошо подумать о том, как хочу структурировать вещи

// Экспорт пространства имём из модуля - это пример добавления слишком болььшого количества уровней
// вложенности. Хотя пространства имён имеют своё применение, они добавляют дополнительный уровень
// косвенности при использовании модулей. Это модет быстро стать проблемой для пользователей и обычно
// в этом нет необходимости

// Статические методы в экспортируемом классе имеют аналогичную проблему - сам класс
// добавляет уровень вложенности. Если это не увеличивает выразительность или намерение
// явно полезным способом, нужно рассмотреть возможность простого экспорта вспомогательной функции


//* Если экспортируется только один класс или функция, то применяется export default
// Также, как экспорт на верхнем уровне снижает трение с потребителем вашего модуля, также и введение
// экспорта по умолчанию. Если основная цель модуля - разместить один конкретный экспорт, следует
// рассмотреть возможность его экспорта в качестве экспорта по умолчанию. Это упрощает как импорт, так и его
// фектическое использование

// MyClass.ts
// export default class SomeType {
//   constructor(){}
// }

// MyFunc.ts
// export default function getThing() {
//   return "thing"
// }

// Consumer.ts
// import t from "./MyClass"
// import f from "./MyFunc"
// let x = new t()
// console.log(f())

// Это оптимально для потребителей. Они могут называть ваш тип как угодно, и им не нужно чрезмерно
// расставлять точки, чтобы найти ваши объекты


//* Если экспортируется несколько объектов, их надо поместить все на верхний уровень
// MyThings.ts
// export class SomeType {
// }
// export function someFunc() {  
// }

// и наоборот при импорте


//* Явный список импортированных имён
// Consumer.ts
// import {SomeType, someFunc} from "./MyThings"
// let x = new SomeType()
// let y = someFunc()


//* Использование шаблона импорта пространства имён, если импортируется много вещей
// MyLargeModule.ts
// export class Dog {}
// export class Cat {}
// export class Tree {}
// export class Flower {}

// Consumer.ts
// import * as myLargeModule from "./MyLargeModule"
// let x = new myLargeModule.Dog()


//* Реэкспорт для продления
// Часто нужно расширить функциональность модуля. Распространённым шаблоном JS является расширение
// исходного объекта расширениями, аналогично тому, как работают расширения JQuery. Как мы упоминали ранее,
// модули не объединяются, как объекты глобального пространства имён. Рекомендуемое решение - не изменять
// исходный объект, а скорее экспортирвать новый объект, обеспечивающий новые функции

// Рассмотрим простую реализацию калькулятора, определённую в модуле Calculator.ts. Модуль также экспортирует
// вспомогательную функцию для проверки работоспособности калькулятора, передавая список вхожных строк
// и записывая результат в конце

// Calculator.ts
// export class Calculator {
//   private current = 0
//   private memory = 0
//   private operator: string
//   protected processDigit(digit: string, currentValue: number) {
//     if (digit >= "0" && digit <= "9") {
//       return currentValue * 1- + (digit.charCodeAt(0) - "0".charCodeAt(0))
//     }
//   }
//   protected processOperator(operator: string) {
//     if (["+", "-", "*", "/"].indexOf(operator) >= 0) {
//       return operator
//     }
//   }
//   protected evaluateOperator(
//     operator: string,
//     left: number,
//     right: number
//   ): number {
//     switch (this.operator) {
//       case "+":
//         return left + right
//       case "-":
//         return left - right
//       case "*":
//         return left * right
//       default : // "/"
//         return left / right
//     }
//   }
//   private evaluate() {
//     if (this.operator) {
//       this.memory = this.evaluateOperator(this.operator, this.memory, this.current)
//     } else {
//       this.memory = this.current
//     }
//     this.current = 0
//   }
//   public handleChar(char: string) {
//     if (char === "=") {
//       this.evaluate()
//       return
//     } else {
//       let value = this.processOperator(char)
//       if (value !== undefined) {
//         this.evaluate()
//         this.operator = value
//         return
//       }
//     }
//     throw new Error(`Unsupported input: ${char}`)
//   }
//   public getResult(){
//     return this.memory
//   }
// }
// export function test(c: Calculator, input: string) {
//   for (let i = 0; i < input.length; i++) {
//     c.handleChar(input[i])
//   }
//   console.log(`result of ${input} is ${c.getResult()}`)
// }

// Вот простой тест калькулятора с использованием вставленной test функции

// TestCalculator.ts
// import {Calculator, test} from "./Calculator"
// let c = new Calculator()
// test(c, "1+2*33/11")   - ответ 9

// Теперь, чтобы расширить это, чтобы добавить поддержку ввода с числами в основаниях, отличных от 10,
// давайте создадим ProgrammerCalclator.ts

// ProgrammerCalculator.ts
// import {Calculator} from "./Calculator"
// class ProgrammerCalculator extends Calculator {
//   static digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
//   constructor(public base: number) {
//     super()
//     const maxBase = ProgrammerCalculator.digits.length
//     if (base <= 0 || base > maxBase) {
//       throw new Error (`base has to be within 0 to ${maxBase} inclusive.`)
//     }
//   }
//   protected processDigit(digit: string, currentValue: number) {
//     if (ProgrammerCalculator.digits.indexOf(digit) >= 0) {
//       return currentValue * this.base + ProgrammerCalculator.digits.indexOf(digit)
//     }
//   }
// }
// export {ProgrammerCalculator as Calculator}
// export {test} from "./Calculator"

// Новый модуль ProgrammerCalculator экспортирует форму API, аналогичную форме исходного Calculator модуля,
// но не увеличивает какие-либо объекты в исходном модуле

// TestProgrammerCalculator.ts
// import {Calculator, test} from "./ProgrammerCalculator"
// let c = new Calculator(2)
// test(c, "001+010=")  - ответ 3


//* Не используйте пространства имён в модулях
// При первом переходе к организации, основанной на модулях, общая тенденция заключается в том, чтобы
// обернуть экспорт в дополнительный слой пространства имён. Модули имеют свою собственную область
// видимости, и снаружи модуля видны только экспортированные объявления. Имея это ввиду, пространство
// имён даёт очень небольшую ценность при работе с модулями

// На уровне организации пространства имён удобны для группировки логически связанных объектов и типов в
// глобальной области. Например, в C# можно найти все типы коллекций в System.collections. Организуя наши
// типы в иерахические пространства имён, мы обеспечиваем хорошее обнаружение для пользователей этих типов
// С другой стороны модули обязательно уже присутствуют в файловой системе. Мы должны разрешить их по пути
// и имени файла, потому есть логическая схема организации, которую следует использовать. У нас может быть
// папка /collections/generic/ со списком в ней

// Пространства имён важны, чтобы избежать конфликтов имён в глобальной области. Например у нас может
// быть два типа с одним именем, но в другом пространсве имён. Однако, это не проблема с модулями. В модуле
// нет веских причин иметь два объекта с одинаковым именем. Со стороны потребления потребитель любого
// данного модуля может выбрать имя, которое он будет использовать для ссылки на модуль, поэтому случайные
// конфликты имён невозможны


//* Красные флаги
// Всё нижеперечисленное - это красные флажки для структурирования модуля. Дважды убедитесь,
// что вы не пытаетесь создать пространство имён для внешних модулей, если что-то из этого применимо
// к вашим файлам:
// - Файл, единственным объявлением которого является export namespace Foo{...} (удалить Foo и переместить
//   всё на уровень выше)
// - Несколько файлов, которые имеют одно и тоже export namespace Foo{...} на верхнем уровне (не думайте,
//   что они собираются объедениться в один Foo)