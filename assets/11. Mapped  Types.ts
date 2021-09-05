//? Сопоставленные типы
// Когда мы не хотим повторяться, иногда нужно, чтобы тип был основан на другом типе

// Сопоставленные типы основаны на синтаксисе индексных сигнатур,
// которые используются для объявления типов свойств, которые не были объявлены заранее
type Horse = "black" | "russet" | "white" | "any"
type OnlyBoolsAndHorses = {
  [key: string] : boolean | Horse
}

const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: "black"
}

// Сопоставленный тип - это общий тип, который использует объединение  PropertyKey 
// (часто создаётся с помощью keyof) для перебора ключей, для создания типа:
type OptionFlags<Type> = {
  [Property in keyof Type]: boolean
}

// В этом примере OptionFlags он берёт все свойства из типа Type
// и изменяет их значения на логические
type FeatureFlags = {
  darkMode: () => void
  newUserProfile: () => void
}
type FeatureOptions = OptionFlags<FeatureFlags>


//* Модификаторы отображения
// Есть два дополнительных модификатора, которые могут применяться во время сопоставления:
//   readonly  и   ?   , которые влияют на изменчивость и обязательность
// Эти модификаторы добавляются и удаляются с помощью префикса  +  или  -  .
// Если преффикс не добавляется, то подразумевается
type CreateMutabletype<Type> = {
  -readonly [Property in keyof Type]: Type[Property]
}
type LockedAccount = {
  readonly id: string
  readonly name: string
}
type UnlockedAccount = CreateMutabletype<LockedAccount>
// Убрали readonly

type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property]
}
type MaybeUser = {
  id?: string
  name?: string
  age?: number
}
type ConcreteUser = Concrete<MaybeUser>


//* Переназначение клавиш через as
// В TS 4.1 можно переназначить типы через as
// type MappedTypeWithNewProperties<Type> = {
//   [Properties in keyof Type as NewKeyType]: Type[Properties]
// }

// Вы можете использовать такие функции, как типы литералов шаблона
// для создания новых имён свойств на основе предыдущих
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
}
interface Person {
  name: string
  age: string
  location: string
}
type LazyPerson = Getters<Person>

// Также ключи можно фильтровать
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
}
interface Circle {
  radius: number
  kind: "circle"
}
type Kindless = RemoveKindField<Circle>


//* Дальнейшие исследования
// Сопоставленные типы хорошо работают с другими функциями в этом разделе манипулирования типами,
// Сопоставленный тип, использующий условный тип, который возвращает значения в зависимости
// от наличия у объекта свойства  pii
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true} ? true : false
}
type DBFields = {
  id: { form: "sell"}
  name: {
    type: string
    pii: true
  }
}
type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>