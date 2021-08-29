//? Индексированные типы доступа
// Для создания типа мы можем воспользоваться индексом другого типа
type T_ParentType = { name: string, age: number, hasWork: boolean}
type T_ChildrenType = T_ParentType["name"]

// Тип индексации сам по себе тип и взаимодействует с операторами
type T_C1 = T_ParentType["age" | "name"]
type T_C2 = T_ParentType[keyof T_ParentType]

type HasWorkOrName = "hasWork" | "name"
type T_C3 = T_ParentType[HasWorkOrName]

// Также можно использовать number для получения элементов массива
const myArray = [
  {name: "Alice", age: 15},
  {name: "Bob", age: 23},
  {name: "Eve", age: 38}
]

type Person = typeof myArray[number]
type Age = typeof myArray[number]["age"]
type Age2 = Person["age"]

// При индексировании можно использовать только типы. Использовать значение нельзя
const key = "age"
// type Ages = Person[key]      - ошибка

// Но можно использовать псевдонимы типа
type key = "age"
type Ages = Person[key]