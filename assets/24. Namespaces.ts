//? Namespaces
// Везде, где использовалось и используется слово module можно и нудно использовать namespace


//* Первые шаги
// Начнём с программы, которую мы будем использовать в качестве примера на этой странице. Мы написали
// небольшой набор упрощённых строковых валидаторов, которые вы могли бы написеть для проверки ввода
// пользователя в форме на веб-странице или для проверки формата данных, предоставленных извне


//* Валидаторы в одном файле
interface StringValidator {
  isAcceptable(s: string): boolean
}

let letterRegexp = /^[A-Za-z]+$/
let numberRegexp = /^[0-9]+$/

class LetterOnlyValidator implements StringValidator {
  isAcceptable(s: string) {
    return letterRegexp.test(s)
  }
}

class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s)
  }
}

let strings = ["Hello", "98052", "101"]

let validators: {[s: string]: StringValidator} = {}
validators["ZIP code"] = new ZipCodeValidator()

for (let s of strings) {
  for (let name in validators) {
    let isMatch = validators[name].isAcceptable(s)
    console.log(`${s} ${isMatch ? "maches" : "does not match"} ${name}`)
  }
}


//* Namespace
// По мере добавления дополнительных валидаторов нам понадобится какая-то система организации, чтобы мы
// могли отслеживать наши типы и не беспокоиться о конфликтах имён с другими объектами. Вместо того, чтобы
// создавать много разных имён в глобальном пространстве, давайте воспользуемся namespaces

// В этом примере мы переместим все сущности, связанные с валидатором, в пространство имён с именем
// Validation. Поскольку мы хотим, чтобы интерфейсы и классы здесь были видимы за пределами пространства
// имён, мы ставим перед нами предисловие export. И наоборот, переменные lettersRegexp и numberRegexp
// являются деталями реализации, поэтому они остаются неэкспортируемыми и не будут видны для кода
// за пределами пространства имён. В тестовом коде нам нужно указать имена типов при использовании вне
// namespace, например Validators.LetterOnlyValidator


//* Валидаторы с namespace
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean
  }

  const letterRegexp = /^[A-Za-z]+$/
  const numberRegexp = /^[0-9]+$/
  
  export class LetterOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return letterRegexp.test(s)
    }
  }
  
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s)
    }
  }
}
let strings2 = ["Hello", "98052", "101"]
let validators2: {[s: string]: Validation.StringValidator} = {}
validators2["ZIP code"] = new Validation.LetterOnlyValidator()
validators2["Letters only"] = new Validation.LetterOnlyValidator()

for (let s of strings2) {
  for (let name in validators2) {
    console.log(
      `${s} - ${
        validators2[name].isAcceptable(s) ? "maches" : "does not match"
      } ${name}`
    )
  }
}


//* Разделение по файлам
// По мере роста нашего приложения мы захотим разделить код на несколько файлов, чтобы упростить его
// обслуживание


//* Многофайловые пространства имён
// Здесь разделим наше Validation пространство имён на множество файлов. Несмотря на то, что файлы являются
// отдельными, каждый из них может вносить вклад в одно и то же пространство имён и использоваться, как
// если бы все они были определены в одном месте. Поскольку между фалами существуют зависимости, мы
// добавим ссылочные теги, чтобы сообщить компилятору о взаимосвязях между файлами. В остальном наш тестовый
// код не изменился

// Validation.ts
// namespace Validation {
//   export interface StringValidator {
//     isAcceptable(s: string): boolean
//   }
// }

// LettersOnlyValidator.ts
/// <reference path="Validation.ts" />
// namespace Validation {
//   const letterRegexp = /^[A-Za-z]+$/
//   export class LetterOnlyValidator implements StringValidator {
//     isAcceptable(s: string) {
//       return letterRegexp.test(s)
//     }
//   }
// }

// ZipCodeValidator.ts
/// <reference path="Validation.ts" />
// namespace Validation {
//   export class ZipCodeValidator implements StringValidator {
//     isAcceptable(s: string) {
//       return s.length === 5 && numberRegexp.test(s)
//     }
//   }
//   const numberRegexp = /^[0-9]+$/
// }

// Test.ts
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />
// let strings = ["Hello", "98052", "101"]
// let validators: {[s: string]: Validation.StringValidator} = {}
// validators["ZIP code"] = new Validation.LetterOnlyValidator()
// validators["Letters only"] = new Validation.LetterOnlyValidator()
// for (let s of strings) {
//   for (let name in validators) {
//     console.log(
//       `${s} - ${
//         validators[name].isAcceptable(s) ? "maches" : "does not match"
//       } ${name}`
//     )
//   }
// }

// Когда задействовано несколько файлов, нам нужно убедиться, что весь скомпилированный код загружен. Это
// можно сделать двумя способами

// Во-первых, мы можем использовать объединённый вывод с помощью --outFile флага для компиляции всех
// входныз файлов в один входной файл JS
// tsc --outFile sample.js Test.js

// Компилятор автоматически упорядочит выходной файл на основе ссылочных тегов, присутствующих файлов. Вы
// также можете указать каждый файл индивидуально
// tsc --outFile samplie.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.js

// В качестве альтернативы можно использовать компиляциюдля каждого файла (по умолчанию), чтобы создать
// один файл JS для каждого фходного файла. Если создаётся несколько файлов JS, нам мужно будет использовать
// <script> теги на нашей веб-странице для загрузки каждого отправленного файла в соответствующем порядке

// MyTestPage.html (отрывок)
// <script src="Validation.js" type="text/javascript" />
// <script src="LettersOnlyValidator.js" type="text/javascript" />
// <script src="ZipCodeValidator.js" type="text/javascript" />
// <script src="Test.js" type="text/javascript" />


//* Псевдонимы
// Другой способ упростить работу с пространствами имён - import q = x.y.z создать более короткие имена для
// часто используемых объектов. Не путать с  import x = require("name") синтаксисом, используемым для
// загрузки модулей, этот синтаксис просто создаёт псевдоним для указанного символа. Вы можете
// использовать эти виды импорта (обычно называемые псевдониммами) для любого типа идентификатора,
// включая объекты, созданные из импорта модуля.
namespace Shapes {
  export namespace Polygons {
    export class Triangle{}
    export class Square{}
  }
}
import polygons = Shapes.Polygons
let sq = new polygons.Square()

// Обратите внимание, что мы не используем require ключевое слово, а напрямую назначаем из полного имени
// импортируемого символа. Это похоже на using var, но также работает с типом и значениями пространства имён
// испортированного символа. Важно отметить, что для значений import это отдельная ссылка от исходного
// символа, поэтому изменения псевдонима var не будут отражены в исходной переменной.


//* Работа с другими библиотеками JavaScript
// Чтобы описать форму библиотек, написанных не на TS, нам жужно объявить API, который предоставляет
// библиотека. Поскольку большинство библиотек JS предоставляют только несколько объектов верхнего уровня,
// пространство имён - хороший способ их предствления.

// Мы называем объявления, которые не определяют реализцию, окружающим. Обычно они определяются в .d.ts
// файлах. Если знакомы с С/С++, их можно рассмотривать, как .h файлы. Давайте посмотрим
// на несколько примеров


//* Окрузающее пространство имён
// Популярная библиотека D3 определяет свои функции в глобальном объекте с именем d3. Поскольку библиотека
// загружается черех <script> тег (вместо загрузчика модуля), её объявление использует пространства имён
// для определения её формы. Чтобы компилятор TS увидел эту фигуру, мы используем объявление внешнего
// пространства имён. Например

// D3.d.ts (упрощённая выдержка)
declare namespace D3 {
  export interface Selectors {
    select: {
      (selector: string): Selection
      (element: EventTarget): Selection
    }
  }
  export interface Event {
    x: number
    y: number
  }
  export interface Base extends Selectors {
    event: Event
  }
}
declare var d3: D3.Base