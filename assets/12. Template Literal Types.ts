//? Типы литералов шаблона
// Типы литералов шаблонов основаны на строковых литералах и могут расширяться во многие строки
// с помощью объединений

// Они имеют тотже синтаксис, что и строки шаблонных литералов в JS,
// но используются в позициях типа
// При использовании с конкретными типами литералов шаблонный литерал
// создаёт новый строковый литерал путём объединения содержимого
type World = "world"
type Greeting = `Hello ${World}`

// Когда объединение происходит в интерполированной позиции,
// тип представляет с собой набор всех возможных строковых литералов,
// которые могут быть представлены каждым членом объединения
type EmailLocaleIDs = "welcome_email" | "email_heading"
type FooterLocaleIDs = "footer_title" | "footer_sendoff"

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`

// Для каждой интерполированной позиции в шаблонном литерале объединения перемножаются
type Lang = "en" | "ru" | "ja"
type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`

// Обычно мы рекомендуем использовать опережающую генерацию для больших объединений струн,
// но это полезно в небольших случаях


//* Строковые союзы в типах
// Возможности строковых литералов
// проявляются при определении новой строки на основе существуюей строки внутри типа

// Например, растпространённым шаблоном в JS является расширение объекта на основе полей,
// которые у него в настоящее время есть
// Мы предоставим определение типа для функции, которая добавляет поддержку  on  функции,
// которая позволяет узнать, когда событие изменилось
// const person = makeWatchedObject({
//   firstName: "Subaru",
//   name: "Natsuke",
//   age: 26
// })
// person.on("firstNameChanged", newValue => {
//   console.log(`firstname was changed to ${newValue}!`)
// })

// Обратите внимание, что  on  прослушивание события   firstNameChanged  , а не только firstName
// литералов шаблона, обеспечивает способ обработки такого рода строковых манипуляций
// внутри системы типов
type PropEventSource<Type> = {
  on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void
}
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>

// С его помощью мы можем создать что-то, что будет ошибаться, если задано неправильное свойство
const person = makeWatchedObject({
  firstName: "Subaru",
  name: "Natsuke",
  age: 26
})

person.on("firstNameChanged", () => {})
// person.on("firstName", () => {})   - ошибка


//* Вывод с помощью шаблонных литералов
// Обратите внимание, как в последних примерах не использовался повторно тип исходного значения
// Обратный тип использовал расширение any
// Типы литералов шаблона могут выводиться из позиций замещения

// Мы можем сделать наш последний пример общим, чтобы делать выводы из частей  eventName  строки
// для определения связанного свойства
type PropEventSource2<Type> = {
  on<Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ): void
}
declare function makeWatchedObject2<Type>(obj: Type): Type & PropEventSource2<Type>
const person2 = makeWatchedObject2({
  firstName: "Subaru",
  name: "Natsuke",
  age: 26
})
person2.on("firstNameChanged", newName => {
  console.log(`new name is ${newName.toUpperCase()}`)
})
person2.on("ageChanged", newAge => {
  if (newAge < 0) {
    console.warn("warning! negative age")
  } 
})
// Здесь мы сделали  on  общим методом

// Когда пользователь вызвает  "firstNameChanged"  TS пытается определить правильный тип для  key
// Для этого он посоставляется с  Key-содержимым  , предшествующим  Changed  строке,
// и выводит её  firstName
// Как только TS это выяснит,  on-метод   может получить тип  firstName  исходного объекта,
// каковой  string  в данном случае
// Точно также он находит, что  ageChanged  будет соответствовать  number

// Логический вывод можно комбинировать и получать разные выводы


//* Внутренние типы манипуляции строками
// Чтобы помочь с манипуляциями со строками, TS включает набор типов,
// которые можно использовать при манипуляции строками
// Эти типы встроены в компилятор для повышения производительности и не могут быть найдены
// в  .d.ts  файлах, включённых в TS

// Uppercase<StringType> - преобразует каждый символ в верхний регистр
type Greeting2 = "hello, World"
type UppercaseGreeting2 = Uppercase<Greeting2>

// Lowercase<StringType> - преобразует каждый символ в нижный регистр
type LowercaseGreeting2 = Lowercase<Greeting2>

// Capitalize<StringType> - в каждой строке преобразует первый символ в верхний регистр
type CapitalizeGreeting2 = Capitalize<Greeting2>

// Uncapitalize<StringType> - в каждой строке преобразует первый символ в нижний регистр
type UncapitalizeGreeting2 = Uncapitalize<CapitalizeGreeting2>