//? Type утилиты
//* Partial<Type>
// Создаёт тип, свойства которого Type установлены, как optional
// Эта утилита вернёт тип, представляющий все подмножества данного типа
interface Todo {
  title: string
  description: string,
  completed?: boolean
}

function updateTodo(todo: Todo, fieldToUpdate: Partial<Todo>) {
  return {...todo, ...fieldToUpdate}
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter"
}
const todo2 = updateTodo(todo1, {description: "throw out trash"})


//* Required<Type>
// Создаёт тип, состоящий из всех свойств Type равных required
// Противоположный Partial
interface Props {
  a?: number,
  b?: number
}
const obj: Props = {a: 5}
// const obj2: Required<Props> = {a: 2}    - ошибка: b является необязательным для Props,
                                        //   значит здесь обязательно


//* Readonly<Type>
// Создаёт тип, все значения которого доступны только для чтения
const readonlyTodo: Readonly<Todo> = {
  title: "run",
  description: "run 5 km in park"
}
// readonlyTodo.description = "run 10 km in park"      - ошибка: поле нельзя перезаписать

// Эта утилита полезна для представления выражений присваивания,
// которые не работают во время выполнения (т.е. при попытке переназначить свойства замороженного объекта)
function freeze<Type>(obj: Type): Readonly<Type> {
  return obj
}


//* Record<Keys, Type>
// Создаёт объект, ключи которого Keys и свойства Type
// Эту утилиту можно использовать для сопоставления свойств одного испа с другим типом
interface CatInfo {
  age: number,
  breed: string
}

type CatName = "Rijyc" | "Pysca" | "Mitrofan"

const cats: Record<CatName, CatInfo> = {
  Rijyc: {age: 2, breed: "Persian"},
  Pysca: {age: 3, breed: "Maine Coon"},
  Mitrofan: {age: 6, breed: "British Shorthair"}
}
cats.Mitrofan


//* Pick<Type, Keys>
// Создаёт тип, выбирая набор свойств Keys из Type
type TodoPick = Pick<Todo, "title" | "completed">
const todoPick: TodoPick = {
  title: "wash",
  completed: true
}


//* Omit<Type, Keys>
// Создаёт новый тип на основе Type, удаляя поля Key
const todoOmit: Omit<Todo, "title" | "completed"> = {
  description: "nothing"
}


//* Exclude<Type, Key>
// Создаёт тип, исключая все типы Key
type DemoExclude = Todo | CatInfo | CatName
type TodoExclude = Exclude<DemoExclude, Todo>


//* Extract<Type, Union>
// Создаёт тип с общими типами Type и Union
type DemoExtract = Extract<"age" | "name" | "birth day", "name" | "birth day">


//* NonNullable<Type>
// Создаёт тип, исключая  null и undefined  из  Type
type WithoutNullAndUndefined = NonNullable< null | undefined | number | Todo>


//* Parameters<Type>
// Создаёт кортежный тип из типов, используемых в параметрах функции типа Type
declare function f1(arg: {a: number, b: string}): void

type T0 = Parameters<() => string>
type T1 = Parameters<(s: string) => void>
type T2 = Parameters<<T>(arg: T) => T>
type T3 = Parameters<typeof f1>
type T4 = Parameters<any>
type T5 = Parameters<never>
// type T6 = Parameters<string>
// type T7 = Parameters<Function>     - ошибка, не удовлетворяют ограничению


//* ConstructorParameters<Type>
// Создаёт тип кортежа или массива из типов типа функции конструктора
// Он создаёт кортеж со всеми типами параметров
type Ty0 = ConstructorParameters<ErrorConstructor>
type Ty1 = ConstructorParameters<FunctionConstructor>
type Ty2 = ConstructorParameters<RegExpConstructor>
type Ty3 = ConstructorParameters<any>
// type Ty4 = ConstructorParameters<Function>    - не представляет соответствия для сигнатуры


//* ReturnType<Type>
// Создаёт тип, состоящий из возвращаемого типа функции Type
declare function f2(): {a: number, b: string}

type Typ0 = ReturnType<() => string>
type Typ1 = ReturnType<(s: string) => void>
type Typ2 = ReturnType<<T>() => T>
type Typ3 = ReturnType<<T extends U, U extends number[]>() => T>
type Typ4 = ReturnType<typeof f2>
type Typ5 = ReturnType<any>
type Typ6 = ReturnType<never>
// type Typ7 = ReturnType<string>
// type Typ8 = ReturnType<Function>     - не удовлетворяетограничению наличия возвращаемого значения


//* InstanceType<Type>
// Создаёт тип, состоящий из типа экземпляра функции-конструктора в Type
class C {
  x = 0
  y = 0
}

type C0 = InstanceType<typeof C>
type C1 = InstanceType<any>
type C2 = InstanceType<never>
// type C3 = InstanceType<string>
// type C4 = InstanceType<Function>     - ошибка: не отвечают требованию к предоставляемым значениям


//* ThisParameterType<Type>
// Извлекает тип параметра this для типа функции или unknown, если тип функции не имеет this параметра
function toHex(this: number) {
  return this.toString(16)  
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n)
}


//* OmitThisParameter<Type>
// Удаляет  this-параметр из Type
// Если Type явно не указан this-параметр, результат будет простым Type
// В противном случае создаётся новый тип функции без this параметров Type
// Универсальные шаблоны удаляются, и только последняя сигнатура перегрузки передаётся в новый тип функции
function toHex2(this: Number) {
  return this.toString(16)
}

const fiveToHex: OmitThisParameter<typeof toHex2> = toHex2.bind(5)
console.log(fiveToHex())


//* ThisType<Type>
// Эта утилина не возвращает преобразованный тип
// Вместо этого он служит маркером для контекстного this-типа
// Работает только с флагом  --noImplicitThis
type ObjectDescriptor<D, M> = {
  data?: D
  methods?: M & ThisType<D & M>
}

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {}  
  let methods: object = desc.methods || {}
  return {...data, ...methods} as D & M
}

let obj2 = makeObject({
  data: {x: 0, y: 0},
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx
      this.y += dy
    }
  }
})

obj2.x = 10
obj2.y = 20
obj2.moveBy(5, 5)
// В приведённом выше примере methods объект в аргументе makeObject имеет контекстный тип,
// который включает ThisType<D & M> и, следовательно, тип this в методах внутри
// methods объекта равен { x: number, y: number } & { moveBy(dx: number, dy: number): number }

// Нужно обратить внимание, что methods свойства одновременно являются целью вывода и 
// источником для this типа в методах

// Интерфейс ThisType<T> маркера - это просто пустой интерфейс, объявленный в lib.d.ts
// Помимо распознавания в контекстном типе литерала объекта, интерфейс действует как любой пустой интерфейс


//* Внутренние типы манипуляции строками
// Uppercase<StringType>
// Lowercase<StringType>
// Capitalize<StringType>
// Uncapitalize<StringType>
// Чтобы помочь с манипуляциями со строками вокруг строковых литералов шаблона,
//  TS включает набор типов, которые можно использовать для манипуляций со строками в системе типов
// Их можно найти в документации по типам шаблонных литералов