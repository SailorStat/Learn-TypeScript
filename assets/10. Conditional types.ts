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