//? Дженерики
//* Функция идентификации
// Если при создании функции в качестве значения присвоить any,
// то мы потеряем контекст использования
// Вместо этого нам хорошо подойдут дженерики
function identity<Type>(params:Type):Type {
  return params
}

// Чтобы передать тип мы можем при вызове явно указать тип переменной
const payload = identity<string>("example")
// Используется для кастомных типов или сложных цепочек, чтобы не потерять связь

// Чаще всего используется вызов без объявления типа
// Такие функции принмиают тип, автоматически сгенерированный TS
let request = identity("example")


//* Работа с переменными универсального типа
// Работа с переменными универсального типа похожа на работу с any
// мы должны учитывать, что не все типы имеют общие свойсва и методы

// Если под универсальным типом подразумевается универсальный массив,
// то аргументу нужно указать универсальный массив
function identity2<Type>(params: Array<Type>): Array<Type> {
  console.log(params.length)
  return params
}


//* Общие типы
// Можем задать новую функцию с учётом текущей
let myIdentity: <Type>(arg: Type) => Type = identity

// Можем переименовать тип
let myIdentity2: <Input>(arg: Input) => Input = identity

// Можем записать универсальный тип, как сигнатуру вызова типа литерала объекта
let myIdentity3: {<Type>(arg: Type): Type} = identity

// Это нас приводит к написанию первого универсального интерфейса
interface GenericIdentityFn {
  <Type>(arg: Type): Type
}
let myIdentity4: GenericIdentityFn = identity

// Мы можем переместить тип в параметр интерфейса
// после чего сможем видеть, к каким типам относимся, как к родовым
// Этот параметр становится видимым для всех членов интерфейса
interface GenericIdentityFn2<Type> {
  (arg: Type): Type
}
let myIdentity5: GenericIdentityFn2<string> = identity
// Понмиание, когда надо тип держать внутри интерфейса, а когда выносить вперёд -
// это хороший навык для управления универсальностью


//* Общие классы
// Универсальный класс имеет общую форму с универсльным интерфейсом
class GenericNumber<NumType> {
  zeroValue: NumType
  add: (x: NumType, y: NumType) => NumType
}
let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function (x, y) {
  return x + y
}
// При этом мы могли использовать и строку, и другие значения
// Мы можем убедиться. что в этой конструкции все значения имеют один тип


//* Общие ограничения
// Чтобы ограничить функцию принятием только элементов только со свойством length
// нам надо создать соответствующий интерфейс
// и воспользоваться ключевым словом  extends
interface OnlyWithLength {
  length: number
}
function loggingIndentity<Type extends OnlyWithLength>(params: Type): Type {
  console.log(params.length)
  return params
}
// Теперь функция работает только с данными, имеющими length
loggingIndentity({length: 3, value: 5})
loggingIndentity("params with length")
loggingIndentity(["params", "with", "length"])


//* Использование параметров типа в общих ограничениях
// Мы можем объявить параметр типа, который ограничен другим параметром
function getParam<Obj, Key extends keyof Obj>(obj: Obj, key: Key) {
  return obj[key]
}
let pol = { a: 1, b: 2, c: 3, d: 4 };
getParam(pol, "a")
// getParam(pol, "m") - ошибка


//* Использование типов классов в дженериках
// При создании функций в TypeScript с использованием универсальных шаблонов
// необходимо ссылаться на типы классов с помощью их функций-конструкторов
function create<Type>(c: { new (): Type }): Type {
  return new c()
}
// В более сложном примере свойство prototype используется 
// для вывода и ограничения отношений между функцией-конструктором
// и стороной экземпляра типов классов
class BeeKeeper {
  hasMask: boolean = true
}
 
class ZooKeeper {
  nametag: string = "Mikle"
}
 
class Animals {
  numLegs: number = 4
}
 
class Bee extends Animals {
  keeper: BeeKeeper = new BeeKeeper()
}
 
class Lion extends Animals {
  keeper: ZooKeeper = new ZooKeeper()
}
 
function createInstance<A extends Animals>(c: new () => A): A {
  return new c()
}
 
createInstance(Lion).keeper.nametag
createInstance(Bee).keeper.hasMask