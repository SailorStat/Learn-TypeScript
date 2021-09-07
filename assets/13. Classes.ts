//? Классы
//* Члены класса
class Point {}

// Поля
// Объявление поля создаёт общедоступное записываемое поле класса
class Point2 {
  x: number
  y: number
}
const pt2 = new Point2()
pt2.x = 2
pt2.y = 5
// Если тип не указан, то принимается тип  any
// Поля могут иметь инициализаторы - значения по умолчанию
class Point3 {
  x: number = 0 
  y: number = 0
}
// --strictPropertyInitialization  определяет нужно ли инициализировать значение в конструкторе
class GoodGreeter {
  name: string

  constructor() {
    this.name = "hello"
  }
}
// Поле необходимо инициализировать в самом конструкторе
// TS не анализирует методы, которые вы вызываете из конструктора, для обнаружения инициализацией,
// поскольку производный класс может переопределить эти методы и не выполнить инициализацию членов

// Если вы собираетесь определённо инициализировать поле через другие, через конструктор стредств,
// вы можете использовать определённый оператор присваивания утверждения,  !  :
class OKGreeter {
  name!: string
}

// полям с преффиксом  readonly  можно присваивать поля только внутри конструктора
class Greeter {
  readonly name: string

  constructor(otherName?: string){
    if (otherName !== undefined) this.name = otherName
  }

  err() {
//  this.name = "bad attempt"      - ошибка
  }
}
const g = new Greeter()
// g.name = "another bad attempt"  - ошибка


//* Конструкторы
// очень похожи на функции: можно добавлять параметры с аннотациями, перегрузки
class Point4 {
  x: number
  y: number

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
}
class Point5 {
  constructor(x: number, y: string)
  constructor(s: string)
  constructor(xs: any, y?: any) {
    
  }
}
// Отличия:
// - конструктор не имеет параметр типа
// - не имеет обозначения возвращаемого значения

// Конструктор  super()
// Про него можно забыть, но TS о нём напомнит
class Base {
  t = 2
}
class Derived extends Base {
  constructor() {
    super()
    console.log(this.t)
  }
}


//* Методы
// Свойство в классе называется методом. Они могут использовать теже аннотации,
// что и функции, и конструкторы
class Point6 {
  x = 10
  y = 42

  scale(n: number): void {
    this.y *= n
    this.x *= n
  }
}
// Не нужно забывать про использование this внутри методов для переменных класса


//* Геттеры и сеттеры
class C {
  _lenght = 0
  get lenght() {
    return this._lenght
  }
  set lenght(value: number) {
    this._lenght = value
  }
}
// Дополнительные правила TS для аксессоров
// Если есть get и нет set, то свойство считается readonly
// Если тип параметра установки не указан, он выводится из возвращаемого значения срества получения
// Геттеры и сеттеры должны иметь одинаковую видимость членов


//* Индексные подписи
// Работают точно также
class MyClass {
  [s: string]: boolean | ((s: string) => boolean)

  check(s: string) {
    return this[s] as boolean
  }
}


//* Наследование классов
// Имплементирование
// Имплементирование классов проверяет класс на соответствие интерфейсу
interface Ping {
  ping():void
}

class Pinger implements Ping {
  ping() {
    console.log("ping")
  }
}

// class Ponger implements Ping {    - неправильно реализует интерфейс
//   pong() {
//     console.log("pong")
//   }
// }

// Может быть реализовано сразу несколько интерфейсов
interface Pong {
  pong():void
}

class PingPonger implements Ping, Pong {
  ping() {
    console.log("ping")
  }
  pong() {
    console.log("ping")
  }
}

//! implements не меняет типы данных в классе
// Это работа extends

//! implements не гарантирует в классе наличие необязательного свойства


// Наследование
// Класс, созданный с  extends  , наследует все свойства родителя, а также может определять новые
class Animal {
  move() {
    console.log("i like to move it, move it")
  }
}
class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i <= times; i++) console.log("Woof!!")
  }
}
const dog = new Dog()
dog.woof(3)
dog.move()

// Переопределение методов
// Методы наследника могут переопределять методы родителя
// При этом вызвать метод родителя можно вызвать только внутри переопределяющего метода
// с использованием конструкции  super.название_метода  .
class Base2 {
  greet(): void {
    console.log("Hello, World!")
  }
}
class Derived2 extends Base2 {
  greet(name?: string): void {
    if (name === undefined) {
      super.greet()
    } else {
      console.log(`Hello, ${name.toUpperCase()}!`)
    }
  }
}
const d = new Derived2()
d.greet()
// Наследный метод должен удовлетворять требования родителя


//* Видимость участников
// Можно использовать TS для управления отображением определённых методов или свойств
// для кода вне класса

// public  методы доступны снаружи класса
class Greeter2 {
  public greet() {
    console.log("hi")
  }
}
const g2 = new Greeter2()
g2.greet()
// он доступен по умолчанию, его не нужно писать

// protected  методы видны только кодклассам, которые его наследовали
class Greeter3 {
  protected getName() {
    return "hi"
  }
  public greet() {
    console.log(`Hello, ${this.getName()}`)
  }
}

class SpecailGreeter extends Greeter3 {
  howdy(){
    console.log(`Howdy, ${this.getName()}`)
  }
}
const sg = new SpecailGreeter()
sg.howdy()
sg.greet()
// sg.getName()   - ошибка, приватное свойство

// Модификаторы приватных свойств
// Наследники могут модифицировать приватное свойство и сделать его приватным
class Base3 {
  protected m: number = 10
}
class Derived3 extends Base3 {
  m = 12
}
const d3 = new Derived3()
console.log(d3.m)   //  - свойство стало публичным, но его тип number остался
// Важно проверять методы и свойства у родителя,
// чтобы случайно не сделать внутреннее свойство публичным

// Кросс-иерархический доступ к protected
class Base4 {
  protected x: number = 1
}

class Derived4 extends Base4 {
  protected x: number = 42
}

class Derived44 extends Base4 {
  f1(other: Derived44) {
    other.x = 24
  }
  f2(other: Base4) {
    // other.x = 12    - защищено и не доступно через родителя, только в текущем классе
  }
}

// private  доступны только методам и свойствам внтури текущего класса
class Base5 {
  private x: number = 11
  sayX() {
    console.log(this.x)
  }
}
class Derived5 extends Base5 {
  showX() {
    // console.log(this.x)     - ошибка, свойство недоступно
  }
}
// так как свойство не видно для потомков, то и изменить его видимость нельзя
//! данное ограничение работает только внутри TS. При исполнении JS свойства и методы будут видны


//* Статические члены
// У классов могут быть  static  участники. Эти члены не связаны с конкретным экземпляром класса
// Доступ к ним можно получить через сам объект конструктора класса
class MyClass2 {
  static x = 0
  static sayX() {
    console.log(this.x)
  }
}
// Они также могут использовать public, private, protected

//* Специальные статические имена
// Так как классы - это потомок функций, то в них нельзя использовать в static зарезервированные имена
// такие как: length, call и т.д.


//* static  блоки в классах
// Имеют собственную область видимости, при этом имеют доступ к методам и свойствам класса
// При этом безопасны и работают без утечки
class Foo {
  static #count = 0
  get count() {
    return Foo.#count
  }
  static {
    try {
      const lastInstances = []//loadLastInstances()
      Foo.#count += lastInstances.length
    } catch {}
  }
}


//* Общие классы
// Как и интерфейсы, классы могут быть общими
// При вызове через  new  в скобках принимаются параметры в конструктор
class Box<Type> {
  contents: Type
  constructor(value: Type) {
    this.contents = value
  }
}
const b = new Box(42)
// Классы могут использовать общие ограничения и значения, как и интерфейсы


//* Параметры типа в статических членах
// Статические элементы не могут ссылаться на параметры типов класса
class Box2<Type> {
  // static defaultValue: Type     - ошибка
}
// Типы всегда стираются полностью, во время выполнения есть только один слот свойств
// Это значит, что настройки слота тоже бы изменились
// В  static  членах общего класса никогда не могут относиться к параметрам типа класса


//* this  во время выполнения в классах
// TS не меняет поведение this из JS


//* Стрелочные функции
// Если у вас есть функция, которая будет часто вызываться и терять свой контекст,
// имеет смысл воспользоываться стрелочной функцией
class MyClass3 {
  name = "MyClass"
  getName = () => {
    return this.name
  }
}
const myClassObj = new MyClass3()
const obj = {
  name: 12,
  getName: myClassObj.getName
}
console.log(obj.getName()) //  - string
// this не меняется
// тратится больше памяти
// нельзя использовать  super.getName  в производном классе, потому что в цепочке прототипов нет записи
//  нет базового метода для извлечения класса


//* this в функции
// При определении метода или функции начальный параметр с именем this имеет особое значение в TS
// Эти параметры стираются во время компиляции
function fn<SomeType>(this: SomeType, x: number) {
}
// TS проверяет, что вызов функции с this параметром выполняется в правильном контексте
// Вместо использования стрелочной функции мы можем добавить  this  параметр к определению методов,
// чтобы статически обеспечить правильность вызова метода
class MyClass4 {
  name = "MyName"
  getName(this: MyClass4) {
    return this.name
  }
}
const c = new MyClass4()
c.getName()
// const g = c.getName
// g()                        - ошибка


//* this типы
// В классах специальный тип, называемый динамически, this ссылается на тип текущего класса
class Box3 {
  contents: string = ""
  set(value: string) {
    this.contents = value
    return this
  }
}
// Здесь TS предположил, что возвращаемый тип set должен быть this, а не Box

// Теперь создадим подкласс Box
class ClearableBox extends Box3 {
  clear() {
    this.contents = ""
  }
}
const a3 = new ClearableBox()
const b3 = a3.set("hello")

// Также можно использовать this в аннотации типа параметра
class Box4 {
  content: string = ""
  sameAs(other: this) {
    return other.content === this.content
  }
}
// Это отличается от записи other: Box - если у вас есть производный класс, его sameAs будет принимать
// только другие экземпляры того же производного класса
class DerivedBox4 extends Box4 {
  otherContent: string = "?";
}
const base = new Box4()
const derived = new DerivedBox4()
// derived.sameAs(base)  - нельзя один тип this помещать в другой тип this


//* this охранники базового типа
// Можно использовать  this is Type  в позиции возврата для методов в классах и интерфейсах
// При смешивании с сужением типа тип целевого объекта будет сужен до указанного Type
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep
  }
  isDirectory(): this is Directory {
    return this instanceof Directory
  }
  isNetworked(): this is Networked & this {
    return this.networked
  }
  constructor(public path: string, private networked: boolean) {}
}

class FileRep extends FileSystemObject {
  constructor(path: string, public content: string) {
    super(path, false)
  }
}

class Directory extends FileSystemObject {
  children: FileSystemObject[]
}

class Networked {
  host: string
}

const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo")

if (fso.isFile()) {
  fso.content
} else if (fso.isDirectory()) {
  fso.children
} else if (fso.isNetworked()) {
  fso.host
}

// Распространённый вариант использования защиты типа на основе this - позволить ленивую проверку поля
// Например, в этом случае удаляется  undefined  из значения, содержащегося внутри поля, когда hasValue
// не было
class Box5<T> {
  value?: T

  hasValue(): this is {value: T} {
    return this.value !== undefined
  }
}

const box5 = new Box5()
box5.value = "42"
box5.value

if (box5.hasValue()) {
  box5.value
}


//* Свойства параметра
// TS предлагает специальный синтаксис для превращения параметра конструктора
// в свойство класса с тем же именем и значением
// Это так называемые свойствами параметров и создаются префиксы аргумента конструктора
// с одним из модификаторов видимости  public, private, protected или readonly
// Результирующее поле получает эти модификаторы
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {}
}
const a = new Params(1, 2, 3)
console.log(a.x)
// console.log(a.y)
// console.log(a.z)     - ошибка, закрытые свойства


//* Выражения класса
// Выражения класса похожи на объявление, только у них может не быть имени,
// а будет ссылка, к которой они привязаны
const someClass = class<Type> {
  content: Type
  constructor(value: Type) {
    this.content = value
  }
}
const m = new someClass(11)
console.log(m.content)


//* abstract классы и участники
// Классы, методы и поля в TS могут быть абстрактными

// Абстрактный метод или абстрактное поле является тем, которое не имеет условия при осуществлении
// Эти члены должны сущетвовать внутри абстрактного класса, экземпляры которого нельзя создать напрямую

// Роль абстрактных классов - служить базовым классом для подклассов,
// которые реализуют все абстрактрые члены
// Когда класс не имеет абстрактных челонов, он называется конкретным
abstract class Base6 {
  abstract getName(): string
  printName() {
    console.log("Hello, " + this.getName().toUpperCase())
  }
}
// const b = new Base6()    - ошибка: нельзя создать экземпляр абстрактного класса

// Чтобы реализовать абстрактный класс, нужно создать наследника и у него реализовать абстрактные члены
class Derived6 extends Base6 {
  getName() {
    return "world"
  }
}
const derived6 = new Derived6()
derived6.printName()


//* Абстракция Construct подписи
// Иногда мы ходим создать функцию, которая примет экземпляр абстрактного класса
// Но указывать тип переменной в виде абстрактного класса нельзя
// Чтобы работало, надо не указать в тип абстрактный класс, а веруть его из new
function exanpleParamAbstruct(params: new () => Base6) {
  const instance = new params()
  instance.printName()
}
// функцию также нельзя будет вызвать на абстрактном классе, но можно на его наследниках
exanpleParamAbstruct(Derived6)
// exanpleParamAbstruct(Base6)        - ошибка


//* Отношения между классами
// В большинстве случаев классы сравниваются структурно, как и другие типы
class Coords {
  x = 0
  y = 0
}

class Coords2 {
  x = 1
  y = 1
}
const coord: Coords = new Coords2()
// Ошибки нет, классы структурно похожи

// Точно также работают подтипы между классами, даже если нет явного наследования
class Person {
  name: string
  age: number
}
class Employee {
  name: string
  age: number
  salary: number
}
const person: Person = new Employee() //    - ошибки нет, Employee расширяет Person

// Пустые классы принимают всё, что угодно
//! Так делать не нужно
class Empty {}
function emptyFn(params: Empty) {}
emptyFn({})
emptyFn(11)
emptyFn(Empty)