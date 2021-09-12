//? Миксины
// Наряду с традиционными объектно-ориентированными иерархиями, ещё одним популярным способом создания
// классов из повторно используемых элементов является их построение путём объединения более простых
// частичных классов. Идея миксином приобрела некоторую популярность и в сообществе JS

//* Как работает миксин
// Шаблон основан на использовании универсальных шаблонов с наследованием классов для расширения базового
// класса. Лучшая поддержка миксинов TS осуществляется через шаблон выражения класса

// Для начала понадобится класс, поверх которого будут применяться миксины
class Sprite {
  name = ""
  x = 0
  y = 0
  constructor(name: string) {
    this.name = name
  }
}
// Затем понадобится тип и фабричная функция, которая возвращает выражение класса, расширяющее базовый класс
// type Constructor = new (...arg: any[]) => {}
// function Scale<TBase extends Constructor>(Base: TBase) {
//   return class Scaling extends Base {
//     _scale = 1
//     setScale(scale: number) {
//       this._scale = scale
//     }
//     get scale(): number {
//       return this._scale
//     }
//   }  
// }
// После того, как это настроено, можно создать класс, который представляет базовый класс с применёнными
// миксинами
// const EightBitSprite = Scale(Sprite)
// const flappySprite = new EightBitSprite("Bird")
// flappySprite.setScale(0.8);
// console.log(flappySprite.scale)


//* Ограниченные миксины
// В приведённой выше форме миксины не имеют базовых знаний о классе,
// что может затруднить создание желаемого дизайна
// Чтобы смоделировать это, мы модифицируем тип конструктора, чтобы он принимал универсальный аргумент
type Constructor = new (...args: any[]) => {}
type GConstructor<T = {}> = new (...args: any[]) => T

// Это позволяет создавать классы, которые работают только с ограниченными базовыми классами
type Positionable = GConstructor<{setPos: (x: number, y: number) => void}>
type Spritable = GConstructor<Sprite>
type Loggable = GConstructor<{print: () => void}>

// Затем можно создавать миксины, которые работают только тогда, когда есть конкретная база,
// на которой можно строить
// function Jumpable<TBase extends Positionable>(Base: TBase) {
//   return class Jumpable extends Base {
//     jump() {
//       this.setPos(0, 20)
//     }
//   }  
// }


//* Альтернативный образец
// Предыдущие версии этого документа рекомендовали способ, при котором создавали иерархию среды выполнения
// и иерархии типов отдельно, а затем объединяли их в конце
class Jumpable {
  jump() {}
}
class Duckable {
  duck() {}
}
class Sprite2 {
  x = 0
  y = 0
}

interface Sprite2 extends Jumpable, Duckable {}

// applyMixins(Sprite2, [Jumpable, Duckable])

let player = new Sprite2()
player.jump()
console.log(player.x, player.y)

// function applyMixins(derivedCtor: any, constructors: any[]) {
//   constructors.forEach((baseCtor) => {
//     Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
//       Object.defineProperty(
//         derivedCtor.prototype,
//         name,
//         Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
//           Object.create(null)
//       )
//     })
//   })
// }

// Этот шаблон меньше полагается на компилятор и больше на вашу кодовую базу, чтобы гарантировать правильную
// синхронизацию как среды выполнения, так и системы типов


//* Ограничения
// Шаблон миксина изначально поддерживался компилятором TS посредством анализа потока кода
// Есть несколько случаев, когда вы можете столкнуться с краями встроенной поддержки

//todo Декораторы и миксины
// Нельзя использовать декораторы для предоставления миксинов через анализ потока кода
const Pausable = (target: typeof Player) => {
  return class Pausable extends target {
    shouldFreeza = false
  }
}

@Pausable
class Player {
  x = 0
  y = 0
}

const player2 = new Player()
// player.shouldFreeze   - нет такого свойства

type FreezablePlayer = Player & {shouldFreeze: boolean}
const playerTwo = (new Player() as unknown) as FreezablePlayer
playerTwo.shouldFreeze

//todo Миксины статических свойств
// Скорее ошибка, чем ограничение. Шаблон выражения класса создаёт синглтоны, поэтому они не могут быть
// отражены в системе типов для поддержки различных типов переменных

// Это можно обойти, используя функции для возврата ваших классов, которые различаются в зависимости
// от общего
function base2<T>() {
  class Base2 {
    static prop: T
  }
  return Base2
}
function derived2<T>() {
  class Derived2 extends base2<T>() {
    static anotherProp: T
  }
  return Derived2
}
class Spec extends derived2<string>() {}
Spec.prop
Spec.anotherProp