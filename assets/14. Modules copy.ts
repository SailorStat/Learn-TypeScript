//? Модули
//* Экспорт и импорт типов
export type Cat2 = {
  breed: string
  age: number
}
export interface Dog2 {
  breed: string
  age: number
}
export type Animals2 = Cat2 | Dog2

let module2
module2.exports = {
  pi: 3.14,
  phi: 1.61
}
