//? Модули
//* Экспорт и импорт типов
export type Cat = {
  breed: string
  age: number
}
export interface Dog {
  breed: string
  age: number
}
export type Animals = Cat | Dog

import type {Cat2, Dog2} from "./14. Modules copy"
import type {Animals2} from "./14. Modules copy"


// Экспорт модулей происходит через ключевое слово  exports
let module
module.exports = {
  pi: 3.14,
  phi: 1.61
}
// const math = require("maths")