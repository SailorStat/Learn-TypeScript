interface User {
  name: string,
  id: number
}

const user: User = {
  name: "Sailor",
  id: 0
}

class UserAccount {
  name: string
  id: number

  constructor(name: string, id: number) {
    this.name = name
    this.id = id
  }
}

const newUser: User = new UserAccount("Leonid", 2)

function getAdminUser(): User {
  return
}

function deleteUser(user: User) {
  return
}


//* Дополнительные типы:
// any - любой тип
// unkown - убедитесь, что кто-то использующий этот тип, объявляет, что это за тип
// never - невозможно, чтобы этот тип мог произойти
// void - функция, которвя возвращает undefined


//* Два типа синтаксиса: интерфейсы (предпочтительнее) и типы


//* Составные типы
// Можно создавать сложные типы, комбинируя простые
//* Союзы
// С помощью союзов можно описать возможные значения
type MyBool = true | false
type gender = "male" | "female" | "custom"
type theme  = "light" | "dark"
type digits = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

const func = (obj: string | string[]) => {
  return obj.length
}
// Далее можно сравнивать типы
// typeof d === "string"

//* Дженерики
// Позволяют описывать тип данных, которые можно поместить в массив
type StringArray = Array<string> // массив строк
type NumberArray = Array<number> // массив чисел
type ObjWithNameArray = Array<{name: string}>

interface Backpack<Type> {
  add: (obj: Type) => void
  get: () => Type
}

declare const backpack: Backpack<string>

const obj = backpack.get()
backpack.add("watermelon")


//* Система структурного типа
// если присвоенный объект больше, чем надо, то лишее откидывается, остаётся только нужное
// Если нужного поля нет, то будет ошибка
interface Point {
  x: number,
  y: number
}

function logPoint(p: Point) {
  console.log(`${p.x} ${p.y}`)
}

const point = { x: 12, y: 13}
logPoint(point)
// point не принимает Point тип, но внутри функции объект с этим типом сопоставляется

const point3d = { x: 10, y: 23, z: 15}
logPoint(point3d)
// ошибок нет, x и y содержатся

const color = { hex: "#ffffff"}
// logPoint(color) - ошибка
// ошибка, объект не признан
// Если объект обладает необходимыми свойствами, то TS примет его