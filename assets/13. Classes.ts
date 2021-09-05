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