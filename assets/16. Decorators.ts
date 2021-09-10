import "reflect-metadata"
//? Декораторы

// Для включения работы с декораторами надо включить experimentalDecorators
// через консоль: tsc --target ES5 --experimentalDecorators
// через tsconfig.json:
// {
//   "compilerOptions": {
//     "target": "ES5",
//     "experimentalDecorators": true
//   }
// }


//* Декораторы
// Декораторы представляют собой особый вид декларации, который может быть присоединён к объявлению класса,
//  методу, аксессору, свойству или параметру
// Декораторы используют форму @expression, где expression должен оценивать функцию,
//  которая будет вызываться во время выполнения с информацией о декорированном объявлении
// Например, с учётом декоратора @sealed мы сможем написать функцию sealed так:
function sealed(target: any) {
  
}


//* Фабрики декораторов
// Если мы хотим настроить, как декоратор применяется к объявлению, мы можем написать фабрику декоратов
// Фабрика декораторов - это функция, которая возвращает выражение,
// которое будет выбываться декоратором во время выполнения
function color2(value: string) {
  return function (target: any) {
    
  }
}


//* Состав декоратора
// К объявлению можно применить несколько декораторов, например: @f @g x
// Каждый декоратор можно объявить на новой строке
// Функции декораторы вызываются сверху вниз, а результаты приходят снизу вверх
function first() {
  console.log("first(): create")
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): called")
  }
}
function second() {
  console.log("second(): create")
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): called")
  }
}
class ExampleClass {
  @first()
  @second()
  method():void {}
}
// порядок вывода

// first(): create
// second(): create
// second(): called
// first(): called


//* Оценка декоратора
// Существует чётки порядок применения декораторов к различным объявлениям внутри класса
// 1. Для каждого члена экземпляра применяются декораторы параметров,
//    за которыми следуют декораторы методов, средств доступа и свойств
// 2. Декораторы параметров, за которыми следуют декораторы методов, свойств доступа и свойств,
//    применяются к каждому статическому члену
// 3. К конструктору применяются декораторы параметров
// 4. Для класса применяются декораторы класса


//* Декораторы классов
// Декораторы классов объявляются непосредственно перед объявлением класса
// Декоратор класса применяется к конструктору класса и может использоваться для наблюдения, изменения или 
//  замены определения класса
// Декоратор класса нельзя использовать в файле объявления или в любом другом окружающем контексте
//  (например, в declare классе)

// Выражение для декоратора класса будет вызываться, как функция, во время выполнения с конструктором
//  декорированного класса в качестве единственного аргумента

// Если декоратор класса возвращает значение,
//  он заменит объявление класса предоставленной функцией конструктора
//! Если вы решите вернуть новую функцию-конструктор, вы должны позаботиться о сохранении исходного прототипа
//! Логика, которая применяет декораторы во время выполнения, НЕ сделат этого за вас

// Так можно запечатать свойства, чтобы их нельзя было добавлять
function sealed2(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed2
class BugReport {
  type = "report"
  title: string

  constructor(t: string) {
    this.title = t
  }
}
const a12 = new BugReport("12")
a12.title = "123"
// a12.lala = 12      - свойства не существует, добавить нельзя

// Переопределение контруктора для установки новых значений по умолчанию
function repartableClassDecorator<T extends {new (...args: any[]): {}}>(constructor: T) {
  return class extends constructor {
    reportingURL = "http://www..."
  }  
}

@repartableClassDecorator
class BugReport2 {
  type = "report"
  title: string

  constructor(t: string) {
    this.title = t
  }
}

const bug = new BugReport2("Needs dark mode")
console.log(bug.title)
console.log(bug.type)
// bug.reportingURL   - не существует в типе BugReport2


//* Декораторы методов
// Декоратор методов объявляется непосредственно перед объявлением метода
// Декоратор применяется к дескриптору свойства для метода и может использоваться для наблюдения,
//  изменения или замены определения метода.
// Декоратор нельзя использовать в файле объявления, при перегрузке или в любом другом окружающем контексте

// Выражение для декоратора метода будет вызываться, как функция, во время выполнения выполнения
//  со следующими тремя аргументами:
// 1. Либо функция-конструктор класса для статического члена, либо прототип класса для члена-экземпляра
// 2. Имя участника
// 3. Дескриптор свойства для экземпляра
//! Дескриптор свойства будет иметь значение undefined, если целевое значение вашего сценария меньше ES5

// Если дескриптор метода возвращает значение, оно будет использоваться как дескриптор свойства для метода
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value
  }
}

class Greeter4 {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting
  }
}
// Декоратор здесь является фабрикой декоратора
// Когда он вызывается, то изменяет enumerable свойство дескриптора


//* Декораторы аксесcоров
// Декоратор аксессора объявляется только перед декларацией аксессора
// Декоратор стредства доступа применяется к дескриптору свойства для средства доступа
//  и может использоваться для наблюдения, изменения или замены определений средства доступа
// Декоратор средств доступа не может использоваться в файле объявления
//  или в любом другом окружающем контексте (например, в declare классе)

// TS запрещает декорирование как метода доступа, так get и setметода доступа для одного члена
// Вместо этого все декораторы для члена должны применяться к первому аксессору,
//  указанному в порядке документа
// Это происходит потому, что декораторы применяются к дескриптору собственности, которая сочитает в себе
//  как get, так и set аксессор, а не каждое объявление отдельно

// Выражение для декоратора средства доступа будет вызываться как функция во время выполнения
//  со следующими тремя аргументами:
// 1. Либо функция-конструктор класса для статического члена, либо прототип класса для члена-экземпляра
// 2. Имя участника
// 3. Дескриптор свойства для участника
// Дескриптор свойства будет иметь значение undefined, если целевое значение вашего сценария меньше ES5

// Если декоратор свойства возвращает значение оно будет использоваться как дескриптор свойства для участника
function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value
  }
}

class Point7 {
  private _x: number
  private _y: number
  constructor(x: number, y: number) {
    this._x = x
    this._y = y
  }
 @configurable(false)
 get x() {
   return this._x
 }

 @configurable(false)
 get y() {
   return this._y
 }
}


//* Декораторы свойств
// Декоратор свойств объявляется только перед декларацией свойства
// Декоратор свойств не может использоваться в файле объявления
//  или в любом другом окружающем контексте (например, в declare классе)

// Выражение для декоратора свойства будет вызываться как функция во время выполнения
//  со следующими двумя аргументами:
// 1. Либо функция-конструктор класса для статического члена, либо прототип класса для члена-экземпляра
// 2. Имя участника

// Дескриптор свойства не предоставляется в качестве аргумента для декоратора свойств из-за того,
//  как декораторы свойств инициализируются в TS. Это связано с тем, что нет механизма для описания
//  свойства экземпляра при определении членов прототипа, а также нет способа наблюдать или изменять
//  инициализатор для свойства.
// Возвращаемое значение также игнорируется.
// Таким образом декоратор свойств может использоваться только для налюдения за тем,
//  что свойство с определённым именем было объявлено для класса
const formatMetadataKey = Symbol("format")
function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString)
}
function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey)
}
class Greeter {
  @format("Hello, %s")
  greeting: string

  constructor(message: string) {
    this.greeting = message
  }

  greet() {
    let formatString = getFormat(this, "greeting")
    return formatString.replace("%s", this.greeting)
  }
}
// @format("Hello, %s") декоратор здесь является создателем декоратора
// Когда декоратор вызывается, он добавляет запись метаданных для свойства, используя Reflect.metadata
//  из "reflect-metadata" библиотеки
// Когда getFormat вызывается, он считывает значение метаданных для формата


//* Декораторы параметров
// Декоратор парметров вызывается непоспредственно перед декларацией параметра
// Декоратор параметров применяется к функции для объявления конструктора классов или метода
// Декоратор параметров не может использоваться в файле объявления
//  или в любом другом окружающем контексте (например, в declare классе)

// Выражение для декоратора параметров будет вызываться как функция во время выполнения
//  со следующими тремя аргументами:
// 1. Либо функция-конструктор класса для статического члена, либо прототип класса для члена-экземпляра
// 2. Имя участника
// 3. Порядковый индекс параметра в списке параметров функции
// Декоратор парметра может следить только за тем, что параметр был объявлен в методе

// Возвращаемое значение параметра декоратора игнорируется
{
  const requiredMetadataKey = Symbol("required")
  function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || []
    existingRequiredParameters.push(parameterIndex)
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey)
  }

  function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
    let method = descriptor.value!
    
    descriptor.value = function () {
      let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName) || []
      if (requiredParameters) {
        for (let parameterIndex of requiredParameters) {
          if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
            throw new Error("Missing required argument.")
          }
        }
      }
      return method.apply(this, arguments)
    }
  }

  class BugReport3 {
    type = "report"
    title: string;
  
    constructor(t: string) {
      this.title = t;
    }
  
    @validate
    print(@required verbose: boolean) {
      if (verbose) {
        return `type: ${this.type}\ntitle: ${this.title}`
      } else {
      return this.title; 
      }
    }
  }
}
// @required декоратор добавляет метаданные запись, помечает параметр, как требуется
// Затем @validate декоратор превращает сущетсвующий greet метод в функцию,
//  которая проверяет аргументы перед вызовом исходного метода


//* Метаданные
// В некоторых примерах используется  reflect-metadata библиотека, которая добавляет полифил
//   для экспериментального API метаданных
// Эта библиотека ещё не является частью стандарста ECMAScript, однако как только декораторы
//  будут оффициально приняты как часть стандарта, эти расширения будут предложены для принятия

// Установить библиотеку:   npm i reflect-metadata --save

// Для использования экспериментальной поддержки её надо включить
//  Командная строка:  tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata
//  tsconfig.json:  
//      {
//         "compilerOptions": {
//           "target": "ES5",
//           "experimentalDecorators": true,
//           "emitDecoratorMetadata": true
//         }
//      }
// Если этот параметр включён, пока библиотека импортирована, дополнительная информация о типе времени
//  разработки будет отображаться во время выполнения
class Point {
  constructor(public x: number, public y: number) {}
}

class Line2 {
  private _start: Point
  private _end: Point

  @validate
  set start(value: Point) {
    this._start = value
  }
  get start() {
    return this._start
  }

  @validate
  set end(value: Point) {
    this._end = value
  }
  get end() {
    return this._end
  }
}

function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
  let set = descriptor.set!
  
  descriptor.set = function (value: T) {
    let type = Reflect.getMetadata("design:type", target, propertyKey)
  
    if (!(value instanceof type)) {
      throw new TypeError(`Invalid type, got ${typeof value} not ${type.name}.`)
    }
  
    set.call(this, value)
  }
}

const line2 = new Line2()
line2.start = new Point(0, 0)

// Компилятор TypeScript будет вводить информацию о типе во время разработки
//  с помощью @Reflect.metadata декоратора
// Вы можете считать его эквивалентом следующего TypeScript:
{class Line {
  private _start: Point;
  private _end: Point;
  @validate
  @Reflect.metadata("design:type", Point)
  set start(value: Point) {
    this._start = value;
  }
  get start() {
    return this._start;
  }
  @validate
  @Reflect.metadata("design:type", Point)
  set end(value: Point) {
    this._end = value;
  }
  get end() {
    return this._end;
  }
}}
// Метаданные декоратора - это экспериментальная функция,
//  которая может внести критические изменения в будущих выпусках