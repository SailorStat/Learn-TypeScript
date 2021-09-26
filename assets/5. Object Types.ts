//? Типы объектов
// Основной спосоа группировки и передачи данных - объекты
// Они могут быть анонимными
function example(params: {name: string, age: number}) {}
// созданы через интерфейс
interface I_Person {
  name: string
  age: number
}
// или псевдоним типа
type T_Person = {
  name: string
  age: number
}


//* Модификаторы свойств
// Каждое свойство может указывать обязательно ли оно и может ли что-то записывать

//* Дополнительные свойства
// если свойство не обязательное, то его можно пометить ?
interface I_People {
  name: string
  school?: string
  university?: string
}
// Мы можем считывать из этих свойств,
// настройка  strictNullChecks  предупредит, что свойство может быть undefined
// Для таких значений удобно задавать значение по дефолту
function lolPeople({name, school = "no school", university = "no university"}: I_People) {
  console.log(`${name} ${school} and ${university} learn`)
}
//! деструктурированному свойству нельзя присвоить тип, только всей конструкции деструктуризации

//* readonly
// Можно присвоить значению и его нельзя будет изменить
interface Deck {
  readonly cards: number
}
const deck36: Deck = { cards: 36 }
// deck36.cards = 54   - ошибка

// Это не означает, что внутреннее состояние нельзя переписать
interface Holidays {
  readonly days: string[]
}
const holidays: Holidays = { days: ["21 may", "13 april"] }
// holidays.days = ["21 may", "13 april", "11 november"]   - так нельзя
holidays.days[2] = "11 november"    // - а так изменили внутреннее состояние

// При создании нового объекта  readonly  берётся из источника
// а проверка валидности от псевдонима
{
  interface Person {
    name: string
    age: number
  }
  interface ReadonlyPerson {
    readonly name: string
    readonly age: number
  }
  let writablePerson: Person = {
    name: "Person McPersonface",
    age: 42,
  }
  let readonlyPerson: ReadonlyPerson = writablePerson // - readonly не сохраняется

  console.log(readonlyPerson.age) // '42'
  writablePerson.age++
  console.log(readonlyPerson.age) // '43'
}


//* Индексные подписи
// Иногда мы заранее не знаем, как будут называться значения, но знаем, что они будут содержать
// тогда мы можем назначить индексные подписи
{
  interface StringArray {
    [index: number]: string
  } // - под числовым значением будет находиться строка
  const newArr: StringArray = ["1", "2"]
}

// Индексировать можно только числом или строкой
// Если индексировать и числом, и строкой, то надо учитывать,
// что индексы 100 и "100" JS воспринимает, как одно и тоже 

// Если в индексации объвляется тип индекса строка,
// то остальные строковые свойства должны иметь такой же тип, чтобы не было нарушений
interface NumberDictionary {
  [index: string]: number
  length: number
  // name: string   - ошибка, так как строковые параметры не подразумевают значения строки, только числа
}
interface NumberOrStringDictionary {
  [index: string]: number | string
  length: number
  name: string    // - [index: string]: number | string   допускает значения в виде строк
}


//* Расширение типов
// Если новый интерфейс повторяет старый, мы можем его наследовать и добавить свойсва
interface Heart {
  heart: boolean
}

interface Cat extends Heart {
  tail: boolean
}

// Также можно наследовать сразу от нескольких типов
interface Raw {
  raw: boolean
  rawCount?: number
}

interface Eye {
  eye: boolean
  eyeCount?: number
}

interface Dog extends Raw, Eye {
  breed: string
  nickname: string
}


//* Типы перечечений
// Создать новый тип можно не добавляя новых свойств с помощью  &
{type Animal = Heart & Raw & Eye}


//* Интерфейсы против пересечений
// Мы можем использовать и то, и другое, но лучше остановиться на чём-то одном
// чтобы не осложнять жизнь разной обработкой ошибок в каждом из случаев


//* Генирируемые типы объектов
// Если мы не знаем, какой тип будет содержать объект
// но хотим, чтобы этот тип не изменялся, нам нужны дженерики
interface Box<Type> {
  content: Type
}
// В дальнейшем нужно обязательно указать тип при объявлении
let box: Box<string>
// При этом Type - универсальная единица, которая может быть даже тип Animal например


//* Array тип
// На самом деле number[] - это тоже самое, что и Array<number>
// На него работают все теже самые правила


//* ReadonlyArray тип
// Особый тип, который описывает неизменяемые массивы
const readOnlyArray: ReadonlyArray<string> = ["Россия", "Украина", "Беларусия"]
// readOnlyArray.unshift()    - ошибка
// В отличии от Array у ReadonlyArray нет конструктора
{
  let x: readonly string[] = []
  let y: string[] = []
  x = y
  // y = x   - ошибка

}
//* Tип кортежа
// Это массив, который точно знает количество элементов, порядок и тип
type rainbow = [string, string, string, string, string, string, string]

// Кортеж может иметь необязательные свойства
// Эти свойства помечаются  ?  и всегда стоят после обязательных элементов массива
// От из наличия зависит длина length
type car = [string, number, number?]

// Массив может иметь rest элементы
type stringBooleanArrNumber = [string, ...boolean[], number]
// после rest элемента не может быть необязательный элемент


//* Readonly кортеж
// Позволяет создавать неизменяемые кортежи
type readonlyCar = readonly [string, number, number?]
// Созданные через const читаются также
const constStringBooleanArrNumber = ["string", true, true, 11] as const
// Изменяемый тип кортежа нельзя зафиксировать readonly