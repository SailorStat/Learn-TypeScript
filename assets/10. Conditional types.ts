//? Условные типы
// Условные типы помогают описать отношения между значениями на входе и выходе
interface Animal {
  live(): void
}
interface Dog extends Animal {
  woof(): void
}
type Example1 = Dog extends Animal ? number : string
type Example2 = RegExp extends Animal ? number : string

// Это очень похоже на JS, но в TS этот механизм совершенствуется и используется с дженериками
interface IdLabel {
  id: number
}
interface NameLabel {
  name: string
}

function createLabel(id: number): IdLabel
function createLabel(name: string): NameLabel
function createLabel(IdOrName: number | string): IdLabel | NameLabel
function createLabel(IdOrName: number | string): IdLabel | NameLabel {
  throw "uniplemented"
}
// Вместо экспоненциального роста с увеличением количества переменных
// мы можем воспользоваться записью:
type IdOrName<T extends number | string> = T extends number ? IdLabel : NameLabel
// Затем можем упростить нашу функцию, и не использовать перегрузки
function createLabel2<T extends number | string>(idOrName: T): IdOrName<T> {
  throw "uniplemented"
}
let a = createLabel("typescript")
let b = createLabel(4.2)
let c = createLabel(Math.random() ? "hello" : 42)


//* Ограничения условного типа
// Иногда нам хочется указать внутреннее свойство
// type MessageOf1<T> = T["message"]         - ошибка
// Чтобы не было ошибки, мы должны указать, что точно будем иметь у Т свойство message
type MessageOf2<T extends {message: unknown}> = T["message"]
// Но нам может быть, что для нас message может быть недоступно, тогда оно должно быть  never
type MessageOf3<T> = T extends { message: unknown } ? T["message"] : never
interface Email {
  message: string;
}
interface Dog {
  bark(): void;
}
type EmailMessageContents = MessageOf3<Email>
type DogMessageContents = MessageOf3<Dog>


//* Вывод внутри условных типов
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type

type GetReturnType<Type> = Type extends (...args: never[]) => infer Return ? Return : never
type Num = GetReturnType<() => number>
type Str = GetReturnType<() => string>
type Bls = GetReturnType<(a: boolean, b: boolean) => boolean[]>

// При выводе из типа с несколькими сигнатурами вызовов выводы делаются из последней сигнатуры
// Невозможно выполнить разрешение перегрузки на основе списка типов аргументов
declare function stringOrNum(x: string): number
declare function stringOrNum(x: number): string
declare function stringOrNum(x: number | string): number | string

type T1 = ReturnType<typeof stringOrNum>


//* Распределительные условные типы
// Когда условные типы воздействуют на универсальный тип,
// они становятся распределительными при задании типа объединения
type ToArray<Type> = Type extends any ? Type[] : never
// Если мы подключим тип объединения  ToArray  ,
// то условный тип будет применяться каждому члену этого объединения
type StrArrOrNumArr = ToArray<string | number>

// Обычно желаемым поведением является распределёность
// Чтобы избежать такого поведения, вы можете заключть каждую сторону  extends  
// кобчевого слова в квадратные скобки
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never
type StrArrOrNumArr2 = ToArrayNonDist<string | number>