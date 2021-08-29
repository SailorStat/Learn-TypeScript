//? Оператор keyof
// Принимает тип объекта и создаёт строку или числовое буквальное объединение ключей
type Point = {x: number, y: number}
type P = keyof Point

// Если у ключа есть подпись типа, то keyof вернёт этот тип
type Arrayish = { [n: number]: unknown}
type A = keyof Arrayish

type Mapish = { [n: string]: unknown}
type M = keyof Mapish