//? Пространства имён и модули
// В этом посте описаны различные способы организации кода с использованием модулей и пространства имён в
// TS. Мы также рассмотрим некоторые дополнительные темы о том, как использовать пространства имён и модули,
// и рассмотрим некоторые распространённые ошибки при их использовании в TS

// Примечание. В очень старых версиях TS они назывались внутренними модулями - это более раннике модульные
// системы JS


//* Использование модулей
// Модули могут содержать как код, так и объявления.

// Модули также зависят от загрузчика модулей (например, CommonJs / RequireJs) или среды выполнения, которая
// поддерживает модули в ES. Модули обеспечивают лучшее повторное использования кода, более сильную изоляцию
// и лучшую поддержку инструментов для объединения

// Также стоит отменить, что для приложений Node.js модули используются по умолчанию, и рекомендуются модули
// вместо пространства имён в современном коде.

// Начиная с ECMAScript 2015, модули являются родной частью языка и должны поддерживаться всеми
// совместными реализациями движка. Таким образом, для новых проектов рекомендуемый механизм организации
// кода - это модули.


//* Использование пространств имён
// Пространства имён - это специфичный для TS способ организации кода.

// Пространства имён просто называются объектами JS в глобальном пространстве имён. Это делает пространства
// имён очень прострой конструкцией. В отличие от модулей, они могут охватывать несколько файлов и могут
// быть объединены с помощью --outFile. Пространства имён могут быть хорошим спомобом структурировать код в
// веб-приложении со всеми зависимостями, включёнными в виде <script> тегов на вашу HTML-страницу

// Как и любое загразнение глобального пространства имён, может быть сложно определить зависимости
// компонентов, особенно в большом приложении


//* Подводные камни пространств имён и модулей
// В этом разделе мы опишем различные распространённые ошибки при использовании пространств имён и модулей,
// а также способы их избежать


//* /// <reference> модуль
// Распространённой ошибкой является попытка использовать /// <reference ... /> синтаксис для ссылки на файл
// модуля вместо использования import оператора. Чтобы понять разницу, мы сначала должны понять, как
// компилятор может найти информацию о типе модуля на основе пробега import (например, ... в
// import x from "...", import x = require("...") и т.д.) путь

// Компилятор будет пытаться найти .ts, .tsx и затем .d.ts с помощью соответсвующего пути. Если конкретный
// файл найти не удалось, компилятор будет искать объявление внешнего модуля. Напомним, что их нужно
// объявить в .d.ts файле

// myModules.d.ts 
// declare module "SomeModule" {
//   export function fn(): string
// }

// myOtherModule.ts
//// <reference path="myModules.d.ts" />
// import * as m from "SomeModule"

// Тег ссылки здесь позволяет нам найти файл объявления, который содержит объявление для внешнего модуля.
// Так используется node.d.ts файл, который используется в нескольких примерах TS


//* Излишнее пространство имён
// Если вы конвертируете программу из пространств имён в модули, может быть легко получить файл, который
// выглядит следующим образом

// shapes.ts
// export namespace Shapes {
//   export class Triangle {}
//   export class Square {}
// }

// Пространство имён верхнего уровная здесь Shapes заворачивают Triangle и Square без всякой причины. Это
// сбивает с толку и раздражает потребителей вашего модуля

// shapeConsumer.ts
// import * as shapes from "./shapes"
// let t = new shapes.Shapes.Triangle()   - плохое название

// Ключевой особенностью модулей в TS является то, что два разных модуля никогда не будут использовать
// имена в одной и той же области. Поскольку потребитель моделя решает, какое имя ему присвоить, нет
// необходимости заранее заключать экспортируемые символы в пространство имён

// Чтобы повторить, почему вы не должны пытаться создать пространство имён для содержимого вашего модуля,
// общая идея пространства имён состоит в том, чтобы обеспечить логическое группирование конструкций и
// предотвратить конфликты имён. Поскольку сам файл модуля уже является логической группой, а его имя
// верхнего уровня определяется кодом, который его импортирует, нет необходимости использовать дополнительный
// уровень модуля для экспортируемых объектов.

// Исправленный пример

// shapes.ts
// export class Triangle {}
// export class Square {}

// shapeConsumer.ts
// import * as shapes from "./shapes"
// let t = new shapes.Triangle()


//* Компромиссы модулей
// Так же, как существует взаимно однозначное соответствие между JS-файлами и модулями. TS имеет
// однозначное соответствие между исходными файлами модулей и их созданными JS-файлами. Одним из
// следствий этого является то, что невозможно объеденить несколько исходных файлов модулей в зависимости
// от целевой системы модулей. Например, вы не можете использовать этот outFile параметр при нацеливании
// на commonjs или amd, но с TS 1.8 и более поздними версиями его можжно использовать outFile при
// нацеливании на amd или system