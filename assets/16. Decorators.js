//? Декораторы
// Для включения работы с декораторами надо включить experimentalDecorators
// через консоль: tsc --target ES5 --experimentalDecorators
// через tsconfig.json:
// {
//   "compilerOptions": {
//     "target": "ES5",
//     "experimentalDecorators": true
//   }
// }
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//* Декораторы
// Декораторы представляют собой особый вид декларации, который может быть присоединён к объявлению класса,
//  методу, аксессору, свойству или параметру
// Декораторы используют форму @expression, где expression должен оценивать функцию,
//  которая будет вызываться во время выполнения с информацией о декорированном объявлении
// Например, с учётом декоратора @sealed мы сможем написать функцию sealed так:
function sealed(target) {
}
//* Фабрики декораторов
// Если мы хотим настроить, как декоратор применяется к объявлению, мы можем написать фабрику декоратов
// Фабрика декораторов - это функция, которая возвращает выражение,
// которое будет выбываться декоратором во время выполнения
function color(value) {
    return function (target) {
    };
}
//* Состав декоратора
// К объявлению можно применить несколько декораторов, например: @f @g x
// Каждый декоратор можно объявить на новой строке
// Функции декораторы вызываются сверху вниз, а результаты приходят снизу вверх
function first() {
    console.log("first(): create");
    return function (target, propertyKey, descriptor) {
        console.log("first(): called");
    };
}
function second() {
    console.log("second(): create");
    return function (target, propertyKey, descriptor) {
        console.log("second(): called");
    };
}
var ExampleClass = /** @class */ (function () {
    function ExampleClass() {
    }
    ExampleClass.prototype.method = function () { };
    __decorate([
        first(),
        second()
    ], ExampleClass.prototype, "method");
    return ExampleClass;
}());
