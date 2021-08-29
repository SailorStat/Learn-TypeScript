//? Сужение
// Когда в одну переменную к нам приходит несколько типов, мы должны выполнить сужение
// Чтобы эти типы не пересекались, и не давали неожиданный результат
function padLeft(padding: number | string, input: string): string {
  if (typeof padding === "number") {
    return new Array(padding + 1).join(" ") + input
  }
  return padding + input
}
// TS видит, что код разделён по типам и не выдаёт ошибки


//* Охранники
// "string", "number", "bigint", "boolean", "symbol", "undefined", "object", "function"
// так как typeof null === "object", есть места, где надо быть внимательным

// если что-то нужно привести к булевому значению, можно воспользоваться Boolean или !!
// Преимущество у !!, так как TS предствляет его тип, как "true", а Boolean, как "boolean"
// Это популярно для защиты от null или undefined

// проверка типа argument && typeof argument === "object" спасает от неожиданных ситуаций


//* Сужение равества
// Если берётся равенство двух параметров, то можно прописывать общие функции для этих параметров
// Для этого используются ==, ===, != и !==
function names(fatherName: string | number, motherName: string | object) {
  if (fatherName === motherName) {
    return fatherName.toUpperCase()
  } else {
    return `${fatherName} or ${motherName}`
  }
}


//* in - оператор сужения
// Оператор in сократит используемые аргументы до тех,
// которые содержат параметр равный строке перед ним
type Human = {swim?, fly?}
type Fish = {swim}
type Bird = {fly}

function whatYouCan(person: Human | Bird | Fish) {
  if ("swim" in person) {
    person
  } else person
}
// если параметр необязательный, то тип может появиться с обеих сторон


//* instanceof сужение
// Проверяет, содержится ли в цепочке prototype текущий родитель
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString())
  } else {
    console.log(x.toUpperCase())
  }
}


//* Сужение задания
// Когда пременная создаётся, TS выбирает возможные типы, и на основании этого определяет тип переменной
let x = Math.random() < .5 ? 10 : "Мало"
console.log(x) // - string | number


//* Предикат типа
// Мы можем обозначить, что результат функции относится к типу
function isFish(pet: Bird | Fish): pet is Fish {
  return (pet as Fish).swim !== undefined
}

let pet: Bird | Fish
if (isFish(pet)) {
  pet.swim()
} else {
  pet.fly()
}
// При этом TS понмимает, что в разных местах продразумевается именно Fish или Bird


//* Дискриминационные союзы
// Иногда нужен один тип, который подразумевает разные свойства под разные ситуации
// В таких случаях следует разделить на два интерфейса и объеденить в один тип
// В таком случае TS будет понимать, что конкретное свойство относится к определённому интерфейсу
interface ISquare {
  kind: "square"
  side: number
}

interface ICircle {
  kind: "circle"
  radius: number
}

type Shape = ISquare | ICircle

function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2
  }
  return shape.side ** 2
}


//* Never тип
// Когда в результате сужения не осталось типов, переменная получит тип never
function example(arg: number | string) {
  if (typeof arg === "number") return arg ** 2
  if (typeof arg === "string") return arg.toLowerCase()
  return arg // - тип never
}
// Его нельзя присвоить, если у переменной уже есть тип
// Этим можно пользоваться, как дополнительной проверкой, чтобы убедиться, что все типы обработаны