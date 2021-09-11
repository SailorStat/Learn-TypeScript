//? Перечисления
// Одна из немногих функций TS, которые не являются расширением JS на уровне типов

// Перечисления позволяют разработчику определить набор именованных констант
// Создание перечислений может упростить документирование намерений или создать набор отдельных случаев
// TS предоставляет как числовые, так и строковые перечисления


//* Числовые перечисления
// Сначала начнём с числовых перечислений
// Перечисления можно определить с помощью ключевого слова  enum
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}
// Так как Up имеет значение 1, то остальные имеют 2, 3 и 4 соответственно

// При желании можно отказаться от инициализаторов
enum Direction2 {
  Up,
  Down,
  Left,
  Right
}
// Первое значение будет иметь 0, второе 1 и т.д.

// Получить доступ к значениям просто: получите доступ к любому члену, как к свойству из самого перечисления
// и объявите типы, используя имя перечисления
enum UserResponse {
  No = 0,
  Yes = 1
}

function respond(recipient: string, message: UserResponse) {}

respond("Princess Caroline", UserResponse.Yes)

// Числовые перечисления могут быть смешаны с вычисляемыми и постоянными членами
// Перечисления без инициализаторов должны идти первыми или после числовых перечислений,
//  инициализированных числовыми константами или другими постоянными членами перечисления


//* Перечисления строк
// Перечисления строк представляют аналогичную концепцию, но имеют различия во время выполнения
// В строковом перечислении каждый член должен быть выражен константой строковым литералом
//  или другим строковым членом перечисления
enum StringDirection {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}
// Строки не имеют поведения автоматического увеличения, зато они хорошо  сериализуются
// Если выполнили отладку и должны прочитать значение времени выполнения числового перечисления,
//  значение часто бывает непрозрачным - оно передает никакого полезного значения само по себе
//  (хотя обратное сопоставление часто может помочь), строковые перечисления позволяют вам, чтобы дать
//  осмысленное и читаемое значение при запуске вашего кода, независимо от имени самого члена перечисления


//* Гетерогенные перечисления
// Технически печисления можно смешивать со строковыми и числовыми членами, но непонятно, зачем это нужно
enum BooleanLikeHeteroheneousEnum {
  No = 0,
  Yes = "YES"
}
// Если использовать поведение разумно, то лучше так не делать


//* Вычисляемые и постоянные члены
// Каждый член перечисления имеет связанное с ним значение,
//  которое может быть либо постоянным, либо вычисленным

// Член перечисления считается постоянным, если:
//  - это первый член в перечислении, и у него нет инициализатора, то ему присваивается значение 0
enum E {
  A
}
E.A

//  - у него нет инициализатора, а предыдущий член перечисления был числовой константой
//  В этом случае значение текущего это значение прошлого плюс 1
enum Two {
  A,
  B
}
Two.B

//  - член перечисления инициализируется постоянным выражением перечисления
//  Выражение константного перечисления - это подмножество выражений TS,
//  которые могут быть полностью вычислены во время компиляции.
//  Выражение является постоянным выражением перечисления, если оно:
//    1. Буквальное выражение перечисления
//    2. Ссылка на ранее определённый постоянный член перечисления
//       (который может происходить от другого перечисления)
//    3. Константное выражение перечисления в скобках
//    4. Одна из +, -, ~ унарных операторов применяется к постоянныму выражению перечисления
//    5. +, -, *, /, %, <<, >>, >>>, &, |, ^ бинарные операторы с постоянными перечислений выражений,
//       как операнды
//  Это ошибка времени компиляции для константных выражений перечисления,
//    которые долны оцениваться до NaN и Infinity

// Во всех остальных случаях член считается вычисленным
enum FileAccess {
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  G = "42".length
}


//* Перечисления Union и другие типы членов перечисления
// Существует специальное подмножество постоянных членов перечисления, которые не вычисляются:
//  литеральные члены перечисления
// Литреальный член перечисления - это постоянный член перечисления без инициализированного значения
//  или со значениями, которые инициализированы как:
//  - любая строка сиволов
//  - любой числовой литерал
//  - унарный минус, применяемый к любому числовому литералу

// Когда все члены в перечислении имеют буквальные значения перечисления, в игру вступает особая семантика

// Во-первых, члены перечисления также становятся типами. Например, мы можем сказать, что определённые
//  члены могут иметь только значение члена перечисления
enum ShapeKind {
  Circle2,
  Square
}

interface Circle2 {
  kind: ShapeKind.Circle2
  radius: number
}
 
interface Square {
  kind: ShapeKind.Square
  sideLength: number
}

let ci: Circle2 = {
  // kind: ShapeKind.Square,     - ошибка, тип должен быть ShapeKind.Circle2
  radius: 100,
  kind: ShapeKind.Circle2
}

// Другое изменение состоит в том, что сами типы перечисления становятся объединением
//  каждого члена перечисления
// С помощью перечислений union система типов может использовать тот факт, что она знает точный набор
//  значений, которые существуют в самом перечислении. Из-за этого TS может обнаруживать ошибки,
//  при которых мы могли неправильно сравнивать значения
enum En {
  Foo,
  Bar
}

function f(x: En) {
// if (x !== En.Foo || x !== En.Bar) {}   - если значение типа En, то оно будет и так или En.Foo, или En.Bar
}


//* Перечисление во время выполнения
// Перечисления - реальные объекты, существующие во время выполнения
enum ExEnum {
  X,
  Y,
  Z
}
// Может быть передан функции
function f(obj: {X: number}) {
  return obj.X  
}
f(ExEnum)


//* Перечисление во время компиляции
// Несмотря на то, что перечисления - рельные объекты, существующие во время выполнения, keyof работает
//  иначе, чем вы могли бы ожидать для типичных объектов
// Вместо этого используйте keyof typeof для получения Type, который возвращает все ключи Enum в виде строк
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG
}
type LogLevelString = keyof typeof LogLevel
function printImportant(key: LogLevelString, message: string) {
  const num = LogLevel[key]
  if (num <= LogLevel.WARN) {
    console.log("Log level key is:", key)
    console.log("Log level value is:", num)
    console.log("Log level message is:", message)
  }
}
printImportant("ERROR", "This is a message")


//* Обратные отображения
// Помимо объекта с именами свойств для членов, члены числовых перечислений также получают обратное
//  сопоставление значений перечисления с именами перечислений
enum AEnum {
  A
}

let aInEnum = AEnum.A
let nameOfA = AEnum[aInEnum] // A

// TS компилирует это до следующего JS
// var AEnum
// (function (AEnum) {
//   AEnum[AEnum["A"] = 0] = "A"
// })(AEnum || (AEnum = {}))
// let aInEnum = AEnum.A
// let nameOfA = AEnum[aInEnum] // A

// В этом сгенерированном коде перечисление компилируется в объект, который хранит как прямое (name -> value),
//  так и обратное (value -> name) сопоставления
// Ссылки на другие члены перечисления всегда генерируются как обращения к свойствам и никогда не встраиваются

// Члены строкового перечисления вообще не генерируют обратное отображение


//* const перечисление
// В большинстве случаев перечисления - вполне допустимое решение. Однако иногда требования более жёсткие
// Чтобы избежать затрат на дополнительный сгенерированный код и дополнительное косвенное обращение
//  при доступе к значениям перечисления, можно использовать  const  перечисления
// Перечисление констант определяется с помощью  const  модификатора в наших перечислениях
const enum NumEnum {
  A = 1,
  B = A * 2
}
// Константные перечисления могут использовать только постоянные значения
//  и полностью удаляются во время компиляции
// Члены константного перечисления встроены на страницах использования
const enum FourDirection {
  Up,
  Down,
  Left,
  Right
}

let fourDirections = [
  FourDirection.Up,
  FourDirection.Down,
  FourDirection.Left,
  FourDirection.Right
]
// В коде выглядит как     let fourDirections = [0, 1, 2, 3]


//* Окружающие перечисления
// Окружающие перечисления используются для описания формы уже существующих типов перечислений
declare enum AmbientEnum {
  A = 1,
  B,
  C = 2
}
// Одно из важнейших разичий внутренних и окружающих перечислений в том, что в обычных перечислениях
//  члены, не имеющие инициализатора, будут считаться постоянными, если их предыдущий член перечисления
//  считается постоянным
// Напротив, внешний (и неконтекстный) член перечисления, у которого нет инициализатора,
//  всегда считается вычисленным


//* Объекты против перечислений
// В современном TS вам может не понадобиться перечисление, когда  as const  может быть достаточно
const enum EDirection {
  Up,
  Down,
  Left,
  Right
}

const ODirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3
} as const
ODirection.Up
EDirection.Up