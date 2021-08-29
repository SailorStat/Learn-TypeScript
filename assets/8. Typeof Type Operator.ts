//? Typeof оператор типа
// typeof возвращает тип переменной в виде ссылки на его типы
let a: number | boolean
let b: typeof a = 12

type Predicate = (x: unknown) => boolean
type K = ReturnType<Predicate> // работает для типов

function f() {
  return { x: 10, y: 3 }
}
type F = ReturnType<typeof f> // работает для значений


//* Ограничения
// typeof можно использовать только для переменных или их свойство

