//? Больше о функциях
//* Выражение типа функции
function FN_greeter(fn: (a: string) => void): void {
  fn("I will be back")
}

function FN_logger(str: string):void {
  console.log(str)
}

FN_greeter(FN_logger)
// fn: (a: string) => void обозначает принятие в переменную функции
// с одним параметром типа string, которая ничего не возвращает

// также можно использовать псевдоним для упрощения
type T_GreetFunction = (a: string) => void
function FN_greeter2(fn: T_GreetFunction): void {
  fn("I will be back")
}


//* Позывные подписи
// В js функции могут иметь не только принимаемые свойства, но и свойства, принимаемые в функции
type T_DescribableFunction = {
  description: string
  (someArg: number): boolean
}
function doSomething(fn: T_DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
// В данном случае описание отличается, вместо => используется :


//* Создание подписей
// В JS можно создавать новые объекты через new. В таких случаях обычно создаётся новый объект.
// Для таких объектов можно добавлять подпись конструкции
type T_SomeConstructor = {
  new (s: string): Object
}
function FN_fn(ctor: T_SomeConstructor) {
  return new ctor("hello")
}

// Некоторые конструкции работают без new
interface I_CallOrConstruct {
  new (s: string): Date
  (n?: number): number
}


//* Общие функции
// Иногда бывает ситуация, когда функция возвращает какой-то определённый элемент
function FN_getFirstElement(arr: any[]) {
  return arr[0]
}
// Всё вроде хорошо, кроме того, что у нас возвращается любой тип данных
// Это не очень хорошо, но можно легко исправить с помощью дженериков
function FN_getFirstElement2<Type>(arr: Type[]): Type {
  return arr[0]
}
// Теперь возвращается не any тип, а тот, что был у элемента массива изначально
// При этом нам не надо прописывать тип, он будет настраиваться автоматически,
// в зависимости от типа данных переданного массива
FN_getFirstElement([1, 2, 3, 5]) // тип any
FN_getFirstElement2([1, 2, 3, 5]) // тип number
FN_getFirstElement2(["1", "2", "3", "5"]) // тип string

// Самописный map
function FN_map<Input, Output>(arr: Input[], fn: (arg: Input) => Output): Output[] {
  return arr.map(fn)
}
const parsed = FN_map(["1", "2", "4"], (n) => parseInt(n))

// Ограничения
// Если мы хотим получить какой-то параметр из любого типа правильно переданных данных
// Мы должны явно указать на присутствие такого метода у принимаемых значений
const FN_longest = <Type extends {length: number}>(a: Type, b: Type) => {
  if (a.length > b.length) {
    return a
  } else {
    return b
  }
}

FN_longest("sadf", "e")
FN_longest([1, 23, 54], [12, 4, 4235, 3245, 3254])


//* Работа с ограниченными значениями
function FN_minimumLength<Type extends {length: number}>(obj: Type, minimum: number):Type {
  if (obj.length >= minimum) {
    return obj
  } else {
    // return { length: minimum }
  }
}
// Не работает, потому что мы должны вернуть объект того же типа,
// а не просто объект с похожим содержанием


//* Указание аргументов типа
// TS обычно может вывести аргументы типа, но не всегда
function FN_combine<T>(arr1: T[], arr2: T[]) {
  return arr1.concat(arr2)
}
// Это вызовет ошибку, если типы массивов будут отличаться
// FN_combine([1, 2, 4], ["go", "chess"])
// Чтобы работало, надо специально указать нужные типы
FN_combine<number | string>([1, 2, 4], ["go", "chess"])


//* Рекомендации по написанию хороших функций
// Сдвинуть параметры типа вниз
function FN_firstElement1<Type>(arr: Type[]) {
  return arr[0]
}
function FN_firstElement2<Type extends any[]>(arr: Type) {
  return arr[0]
}
// Сдвигание типа вниз подразумевает, что на выходе мы получаем значение типа Type
// Во втором случае нашим типом получается any

// Использовать меньше параметров типа
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}
function filter2<Type, Func extends (arg: Type) => boolean>(arr: Type[],func: Func): Type[] {
  return arr.filter(func);
}

// Параметры типа должны появляться дважды
function FN_greet<Str extends string>(name: Str) {
  console.log("Hello, " + name)
}
// если параметр появляется только 1 раз, надо подумать "Нужен ли он"


//* Дополнительные параметры
// Если у нас необязательная переменная, мы можем указать её с помощью "?"
function f(s?: number){}
// также можно указать параметр по умолчанию
function fn(s: number = 10){}


//* Необязательные параметры в обратных вызовах
// При передаче колбека лучше не вписывать необязательный параметр, если он не используется


//* Функциональные перегрузки
// Если нам надо написать функцию, которая работает с разным количеством переменных,
// мы можем воспользоваться сигнатурами перегрузки
function makeDate(timestamp: number): Date
function makeDate(m: number, d: number, y: number): Date
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d)
  } else {
    return new Date(mOrTimestamp)
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
// const d3 = makeDate(1, 3); - ошибка, не соответствует сигнатурам


//* Подписи перегрузки и подписи реализации
// Подпись реализации не видна снаружи
// Чтобы воспользоваться реализацией, над ней надо указать две и более перегрузки
// Реализация должна быть совместима с перегрузками
function a(s: string)
function a(b: boolean)
function a(n: number)
function a(arg: string | boolean | number) {
  return arg
}
a(1)
a("as")
a(true)


//* Написание хороших перегрузок
// Реализация может принять в себя значение равно только одной перегрузке,
// но не может принять значение которое может быть равно одной и другой
function len(s: string): number
function len(arr: any[]): number
function len(x: any) {
  return x.length
}
len("")
len([0])
// len(Math.random() > 0.5 ? "hello" : [0]) - так нельзя
// При равном количестве аргументов мы можем заменить на обыную функцию
function len2(x: string | any[]) {
  return x.length
}
len2("")
len2([0])
len2(Math.random() > 0.5 ? "hello" : [0]) 
// Предпочитайте параметры с типами вместо перегрузок


//* Объявление this в функции
// TS определит, что this должно быть в функции, с помощью анализа потока кода, например:
const user = {
  id: 123,
  admin: false,
  becomeAdmin: function () {
    this.admin = true
  }
}

// TS понимает, что под this мы имеем ввиду user, но часто нам нужно больше контроля над this
//-------- not working --------//
// interface DB {
//   filterUsers(filter: (this: User) => boolean): User[]
// }
// const db = getDB();
// const admins = db.filterUsers(function (this: User) {
//   return this.admin;
// });
// interface DB {
//   filterUsers(filter: (this: User) => boolean): User[];
// }
 
// const db = getDB();
// const admins = db.filterUsers(() => this.admin);
//-------- /not working --------//


//* Другие типы, о которых нужно знать
// void - когда функция ничего не возвращает
function void1():void {
  return
}
function void2():void {}

// object - относится к любому значению, не являющемуся примитивом
// Он отличается от {} и Object
// Всегда используется вместо Object
// Object применяется только в контексте использования прототипа, но не типа данных

// unknow - представляет собой любое значение, как и any, только с ним ничего нельзя делать
function anyCheck(a: any) {
  a +=1
}
function unknowCheck(a: unknown) {
  // a +=1    - ошибка
}
// Используется, чтобы обозначить фозвращаемое значение неизвестного типа
function jsonParser(s: string): unknown {
  return JSON.parse(s)
}

// never - обозначает тип функций, которые ничего не возвращают
function err(s: string): never {
  throw new Error(s)
}
// или недостижимые значения
function returner(a: string) {
  if (typeof a === "string") {
    return a // - string
  } else {
    return a // - never
  }
}

// Function - глобальный тип для функций call, apply и других
function callbacker(f: Function) {
  f(1, 2, 3)
}
const ard = callbacker(console.log)
// тип () => void обычно более безопасен


//* Остальные параметры и аргументы
//* Остальные параметры
// Если надо принять неограниченное количество параметров, то понадобится ...
function prinimator(params: number, ...m: number[]) {
  return m.map(num => num * params)
}
// Принято использовать не any, а any[], Array<T> или T[]

//* Остальные аргументы
// Чтобы предоставить неограниченное количество аргументов, можно также воспользоваться ...
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]
arr1.push(...arr2)
// иногда поведение может вызвать ошибку, так как для TS массивы не являются константой
// явное указание на неизменяемость может решить проблему
const args = [8, 5] as const
const angle = Math.atan2(...args)
// иногда использование rest может потребовать включения downlevelIteration настройки

//* Присваиваемость функций
// Стрелочные функции могут принимать void
// при этом в них может быть прописано возвращаемое значение
// но оно будет проигнорировано
type voidFunc = () => void
const f1: voidFunc = () => { return true }
const f2: voidFunc = () => true
const f3: voidFunc = function () { return true }
// при присваивании вызова функции тип void передастся
const v1 = f1()
const v2 = f2()
const v3 = f3()

// Когда у литерального определения функции есть voidтип возврата,
// эта функция не должна ничего возвращать.
function fn2(): void {
  // @ts-expect-error
  return true;
}

const fn3 = function (): void {
  // @ts-expect-error
  return true;
};