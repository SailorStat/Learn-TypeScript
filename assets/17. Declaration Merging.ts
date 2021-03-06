//? Слияние деклараций
//* Вступление
// Некоторые уникальные концепции TS описывают форму объектов JS на уровне типа
// Одним из примеров, который особенно уникален для TS, является концепцция слияния деклараций
// Понимание этой концепции даст вам преимущество при работе с существующим JS
// Это также открывает путь к более продвинутым концепциям абстракции


//* Базовые концепты
// В TS объявление создает сущности по крайней мере в одной из трёх групп: пространство имён, тип или значение
// Объявления, создающие пространство имен, создают пространство имён, которое содержит именя,
//  доступ к которым осуществляется с использованием записи, разделённой точками
// Объявления о создании типов делают именно это: они создают тип, который виден с объявленной формой
//  и привязан к заданному имени
// Объявления, создающий значения, создают значения, которые видны в выходном JS

// Понимание того, что создаётся с каждым объявлением,
//  поможет вам понять, что объединяется, когда выполнеятеся объединение выполнений


//* Объединение интерфейсов
// Самый простой и самый распространнный тип слияния деклараций - слияние интерфейсов
// На самом базовом уровне слияние механически объединяет элементы обоих объявлений в единый интерфейс
//  с темже именем
interface Pack {
  height: number
  width: number
}

interface Pack {
  scale: number
}
// Тоже самое, что
interface Pack {
  height: number
  width: number
  scale: number
}

// Нефункциональные члены интерфейсов должны быть уникальными
// Если они не уникальны, они должны быть одного типа
// Компилятор выдаст ошибку, если оба интерфейса объявят нефункциональный член с темже именем, но разных типов

// Для функциональных членов каждый функциональный член с тем же именем рассматривается, как описывающий
//  перегрузку одной и той же функции
// При этом слиянии более поздняя версия будет иметь приоритет
{
  type Animal = any
  type Sheep = any
  type Dog = any
  type Cat = any

  interface Cloner {
    clone(animal: Animal): Animal
  }
  interface Cloner {
    clone(animal: Sheep): Sheep
  }
  interface Cloner {
    clone(animal: Dog): Dog
    clone(animal: Cat): Cat
  }
  // то же самое, что и 
  interface Cloner {
    clone(animal: Dog): Dog
    clone(animal: Cat): Cat
    clone(animal: Sheep): Sheep
    clone(animal: Animal): Animal
  }
}
// Нужно обратить внимание, что элементы каждой группы сохраняют тот же порядок
//  но сами группы объединяются с более поздними наборами перегрузки, упорядоченными первыми

// Единственным исключением являются специализированный подписи
// Если в сигнатуре есть параметр, тип которого является типом одного строкового литерала, то он будет 
// перемещён в верхнюю часть своего объединённого списка перегрузки
interface Document {
  createElement(tagName: any): Element
}
interface Document {
  createElement(tagName: "div"): HTMLDivElement
  createElement(tagName: "span"): HTMLSpanElement
}
interface Document {
  createElement(tagName: string): HTMLElement
  createElement(tagName: "canvas"): HTMLCanvasElement
}
// тоже, что и
interface Document {
  createElement(tagName: "canvas"): HTMLCanvasElement
  createElement(tagName: "div"): HTMLDivElement
  createElement(tagName: "span"): HTMLSpanElement
  createElement(tagName: string): HTMLElement
  createElement(tagName: any): Element
}


//* Объединение пространств имён
// Подобно интерфейсам, одноимённые пространства имён объединяют свои члены
// Поскольку пространства имён создают как пространство имён, так и значение, нам нужно понять,
//  как они объединяются

// Чтобы объединить пространства имён, определения типов из экспортированных интерфейсов,
//  объявленных в каждом пространстве имён, сами объединяются, образуя единое пространство имён с
//  объединёнными определениями интерфейсов внутри

// Чтобы объединить значение пространства имён, на каждой странице объявления, если пространство имён уже
//  существует с данным именем оно дополнительно расширяется, беря существующее пространство имён
//  и добавляя экспортированные элементы второго пространства к первому
namespace Gag {
  export class Zebra {}
}
namespace Gag {
  export interface Legged {
    numberOfLegs: number
  }
  export class Dog {}
}
// Тоже самое, что
// namespace Gag {
//   export interface Legged {
//     numberOfLegs: number
//   }
//   export class Zebra {}
//   export class Dog {}
// }

// Эта модель слияния пространства имён - полезная отправнвя точка, но нам также необходимо понять,
//  что происходит неэкспортированными членами
// Неэкспортированные члены видны только в исходнике, а для других источников являются неизвестными
namespace Gala {
  let planet = true
  export function galaHasPlanet() {
    return planet
  }
}
namespace Gala {
  export function sunHasPlanet() {
    // return planet    - ошибка, необнаруден параметр
    return galaHasPlanet()     //    - видит, потому что экспортировано
  }
}


//* Слияние пространств имён с классами, функциями и перечислениями
// Пространства имён достаточно гибкие, чтобы их можно было объеденить с объявлениями других типов
// Для этого объявление пространства имён должно следовать за объявлением, с которым оно будет сливаться
// Результирующее объявление имеет свойства обоих типов объявлений
// TS использует эту возможность для моделирования некоторых шаблонов в JS,
//  а также в других языках программирования


//* Слияние пространств имён с классами
// Это даёт пользователю способ описания внутренних классов
class Album {
  label: Album.AlbumLabel
  constructor() {
    this.label = Album.AlbumLabel
  }
}
namespace Album {
  export class AlbumLabel {}
}
// Правила видимости для объединённых членов такие же, как описано в разделе "Объединение пространств имён"
//  поэтому мы должны экспортировать AlbumLabel класс для объединённого класса, чтобы его увидеть
// Конечным результатом является класс, управляемый внутри другого класса
// Можно использовать пространство имён для добавления дополнительных статическиз членов в существующйи класс

// В дополнение к шаблону внутренних класснов вы также можете быть знакомы с проктикой  JS по созданию
//  функции и последующему расширению функции путём добавления свойств в функцию
// TS использует объединение деклараций для создания подобных определений безопасным для типов способом
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix
}
namespace buildLabel {
  export let suffix = ""
  export let prefix = "Hello, "
}
console.log(buildLabel("Jon"))

// Точно так же пространства имён можно использовать для перечисления статическими членами
enum Color {
  red = 1,
  green = 2,
  blue = 4
}
namespace Color {
  export function mixColor(colorName: string) {
    switch (colorName) {
      case "yellow":
        return Color.red + Color.green

      case "white":
        return Color.red + Color.green + Color.blue

      case "magenta":
        return Color.red + Color.blue

      case "cyan":
        return Color.green + Color.blue
    
      default:
        break;
    }
  }
}


//* Запрещённые слияния
// Не все слияния разрешены в TS
// Классы не могут сливаться с классми или переменными
// Для получения информации об имитации слияния классов можно ознакомиться с Миксинами в TS


//* Модуль увеличения
// Хотя модули в JS не поддерживают слияние, можно исправить существующие объекты импортировав
// и затем обновив их
// export class Observable<T> {}
// import { Observable } from "./observable";
// Observable.prototype.map = function (f) {
// }

// Это отлично работает и в TypeScript, но компилятор не знает об этом Observable.prototype.map
// Вы можете использовать расширение модуля, чтобы сообщить об этом компилятору
// export class Observable<T> {
// }
// import { Observable } from "./observable"
// declare module "./observable" {
//   interface Observable<T> {
//     map<U>(f: (x: T) => U): Observable<U>
//   }
// }
// Observable.prototype.map = function (f) {
// }
// import { Observable } from "./observable"
// import "./map"
// let o: Observable<number>
// o.map((x) => x.toFixed())

// Имя модуля разрешается так же, как спецификаторы модуля в import/ export
// Затем объявления в дополнении объединяются, как если бы они были объявлены в том же файле, что и оригинал

// Однако следует помнить о двух ограничениях:
// 1. Нельзя объявлять новые объявления верхнего уровня в дополнении,
//  нудно просто исправляйть существующие объявления
// 2. Экспорт по умолчанию также не может быть расширен, только именованный экспорт


//* Глобальный рост
// Также можно добавить объявления в глобальную область видимости изнутри модуля:
// export class Observable<T> {
// }
// declare global {
//   interface Array<T> {
//     toObservable(): Observable<T>
//   }
// }
// Array.prototype.toObservable = function () {
// }
// Глобальные дополнения имеют то же поведение и ограничения, что и дополнения модулей