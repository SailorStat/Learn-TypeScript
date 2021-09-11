//? Итераторы и генераторы
//* Итерируемые объекты
// Объект считается итерируемым, если содержит Symbol.iterator
// Его содержат некоторые встроенные типы: Array, Map, Set, String, Uint32Array и другие
// Symbol.Iterator отвечает за возврат списка значений для итерации


//* Iterable интерфейс
// Iterable - тип, который объединяет все итерируемые типы
function toArray<X>(xs: Iterable<X>): X[] {
  return [...xs]
}


//* for of перебор
// for of перебирает итерируемый объект, вызывая Symbol.iterator свойства объекта
let someArray = [1, "string", false]
for (let entry of someArray) {
  console.log(entry) // 1, "string", false
}


//* Перебор for of против for in
// for in возвращает список ключей для повторяемого объекта
// for of возвращает список значений числовых свойств повторяемого объекта
let list = [4, 5, 6]
for (let i in list) {
  console.log(i) // 0, 1, 2
}
for (let i of list) {
  console.log(i) // 4, 5, 6
}

// Другое отличние в том, что for in действует на любой объект
// Он служит способом проверки этого объекта
// for of интересуют значения итерируемых объектов
// Встроенные объекты, как Map и Set реализуют Symbol.iterator совойство, позволяющее получить доступ
//  к сохранённым значениям
// let pets = new Set(["cat", "dog", "hamster"])
// pets["species"] = "mammals"

// for (let pet in pets) {
//   console.log(pet) // "species"
// }

// for (let pet of pets) {
//   console.log(pet) // "cat", "dog", "hamster"
// }


//* Генерация кода
//todo  ориентация на ES5 и ES3
// При ориентации на движок, совместимый с ES5 или ES3, итераторы разрешены только для значений Array типа
// Использование for of циклов значений, отличных от массива, является ошибкой, даже если их значения,
//  не являющиеся массивом, реализуют Symbol.iterator свойство

// Компилятор генерирует простой цикл for для for of цикла
let numbersArr = [1, 2, 3]
for (let num of numbersArr) {
  console.log(num)
}