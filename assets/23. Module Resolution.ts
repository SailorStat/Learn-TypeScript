//? Декларация модуля
// Декларация модуля - это процесс, который компилятор использует для определения того, к чему относится
// импорт. Рассмотрим такой оператор импорта, как import {a} from "moduleA". Чтобы проверить любое
// использование а, компилятор должен точно знать, что он представляет, и должен будет проверить его
// определение moduleA

// На этом этапе компилятор спросит: "Какая форма moduleA?" Хотя это звучит просто, но moduleA может быть
// определено в одном из ваших собственных файлов .ts/.tsx файлах или .d.ts файле от которого зависит ваш
// код

// Сначала компилятор попытается найти файл, представляющий импортированный модуль. Для этого компилятор
// следует одной из двух разных стратегий Classic или Node. Эти стратегии сообщают компилятору, где искать
// moduleA

// Если это не сработало, и если имя модуля не является относительным, то копмилятор попытается найти
// объявление внешнего модуля. Далее мы рассмотрим неродственный импорт

// Наконец, если компилятор не может декларировать модуль, он регистрирует ошибку. Ошибка будет примерно такой
// error TS2307: Cannot find module "moduleA"


//* Относительный и не относительный импорт модулей
// Импорт модулей разрешается по-разному в зависимости от того, является ли ссылка на модуль относительной
// или не относительной

// Относительный импорт запускается один раз, начинаясь с ./ ,  /  или ../
// import Entry from "./components/Entry"

// Другие импорты считаются неродственными
// import * as $ from "jquery"

// Относительный импорт берётся относительно импортируемого файла и не может браться из внешнего модуля
// Относительный импорт используется для собственных модулей, которые гарантированно сохраняют своё
// расположение во время выполнения

// Неотносительный импорт берётся относительно baseUrl или посредством сопоставления путей, о чём мы
// расскажем ниже. Они также могут разрешать объявления внешнего модуля. Используются при импорте
// любых внешних зависимостей


//* Стратегии декларации модулей
// Есть две возможные стратегии декларации модулей: Узловая и Классическая
// Для указная декларации модуля используется флаг  --moduleResolution
// По умолчанию, если не указан модуль, то используется Node, иначе Классический (в том числе, когда 
// значение установлено amd, system, umd, es2015, esnext и т.д.)

// Node декларация модуля используется чаще всего в TS и рекомендуется для большинства проектов. Если
// возникли проблемы с декларацией импорта и экспорта в TS, следует установить флаг в значение node и
// посмотреть: решена ли проблемв


//* Классический
// Раньше это было по умолчанию. Сейчас используется для обратной совместимости

// Относительный импорт будет декларирован относительно импортируемого файла. Таким образом
// import {b} from "./moduleB" в файле /root/src/folder/A.ts запустит поиск по
// /root/src/folder/moduleB.ts
// /root/src/folder/moduleB.d.ts

// Однако для неотносительного импорта модулей компилятор просматривает дерево каталогов, начиная
// с каталога, содержащего импортируемый файл, пытаясь найти соответствующий фейл определения

// Например
// Неотносительный импорт, moduleB например import {b} from "./moduleB" в файле /root/src/folder/A.ts
// приведёт к
// /root/src/folder/moduleB.ts
// /root/src/folder/moduleB.d.ts
// /root/src/moduleB.ts
// /root/src/moduleB.d.ts
// /root/moduleB.ts
// /root/moduleB.d.ts
// /moduleB.ts
// /moduleB.d.ts


//* Node
// Эта стратегия декларации пытаятся имитировать механизм Node.js во время выполнения

//todo  Как Node.js разрешает модули
// Чтобы понять, какие шаги будет выполнять компилятор TS, вожно пролить свет на модули Node.js
// Триадиционно импорт в Node.js выполняется путём вызова функции с именем require. Поведение Node.js будет
// отличаться в зависимости от того, задан для require путь относительный или неотносительный

// Относительные пути довольно просты. В качестве примера возьмём файл /root/src/moduleA.ts, в котором лежит
// импорт var x = require("./moduleB"). Как Node работает с этим импортом
// 1. Спросить /root/src/moduleB.ts о его существовании
// 2. Спросить папку /root/src/moduleB содержит ли она файл с именем package.json, определяющим "main"
//    модуль. В нашем примере, если Node.js обнаружит файл, /root/src/moduleB/package.json содержащий
//    {"main": "lib/mainModule.js"}, то Node.js юужеь ссылаться на /root/src/moduleB/lib/mainModule.js
// 3. Спросите папку, /root/src/moduleB содержит ли она файл с именем index.js. Этот файл неявно
//    считается "основным" модулем папки.

// Однако декларация для неотносительного имени модуля выполняется иначе. Node будет имскать модули в
// специальных папках внутри node_modules. Эта папка может находиться на томже уровне, что и текущий файл
// или выше в цепочке каталогов. Node будет проходить по цепочке каталогов, просматривая каждый, пока
// не найдёт модуль, который пытается запустить

// Node ищет moduleB по таким адресам:
// /root/src/node_modules/moduleB.js
// /root/src/node_modules/moduleB/package.json (если в нём указано main свойство)
// /root/src/node_modules/moduleB/index.js

// /root/node_modules/moduleB.js
// /root/node_modules/moduleB/package.json (если в нём указано main свойство)
// /root/node_modules/moduleB/index.js

// /node_modules/moduleB.js
// /node_modules/moduleB/package.json (если в нём указано main свойство)
// /node_modules/moduleB/index.js

//todo  Как TS декларирует модули
// TS будет имитировать сратегию Node.js, чтобы найти файлы определений для модулей во время компиляции.
// Для этого TS просматривает файловые ресурсы с расширениями .ts, .d.ts и .tsx . Также будет просматривать
// package.json с именем type для поиска свойства main. Оно и используется для нахождения модуля

// Таким образом, для import {b} from "./moduleB" в /root/src/moduleA.ts приведёт к поиску по
// /root/src/moduleB.ts
// /root/src/moduleB.tsx
// /root/src/moduleB.d.ts
// /root/src/moduleB/packaage.json (если в нём указано совойство types)
// /root/src/moduleB/index.ts
// /root/src/moduleB/index.tsx
// /root/src/moduleB/index.d.ts

// Для неотносительного поиска он будет следующим
// /root/src/node_modules/moduleB.ts
// /root/src/node_modules/moduleB.tsx
// /root/src/node_modules/moduleB.d.ts
// /root/src/node_modules/moduleB/package.json (если в нём указано совойство types)
// /root/src/node_modules/@types/moduleB.d.ts
// /root/src/node_modules/moduleB/index.ts
// /root/src/node_modules/moduleB/index.tsx
// /root/src/node_modules/moduleB/index.d.ts

// /root/node_modules/moduleB.ts
// /root/node_modules/moduleB.tsx
// /root/node_modules/moduleB.d.ts
// /root/node_modules/moduleB/package.json (если в нём указано совойство types)
// /root/node_modules/@types/moduleB.d.ts
// /root/node_modules/moduleB/index.ts
// /root/node_modules/moduleB/index.tsx
// /root/node_modules/moduleB/index.d.ts

// /node_modules/moduleB.ts
// /node_modules/moduleB.tsx
// /node_modules/moduleB.d.ts
// /node_modules/moduleB/package.json (если в нём указано совойство types)
// /node_modules/@types/moduleB.d.ts
// /node_modules/moduleB/index.ts
// /node_modules/moduleB/index.tsx
// /node_modules/moduleB/index.d.ts


//* Флаги декларации дополнительных модулей
// Исходный макет проекта иногда не совпадает с макетом вывода. Одычно набор шагов сборки приводит
// к генерации окончательного результата. К ним относятся компиляция .ts файлов в .js и копирование
// зависимостей из разных исходных местоположений в одно выходное местоположение. Конечный результат
// состоит в том, что модули во время выполнения могут иметь другие имена, чем исходные файлы, содержащие
// их определения. Или пути модулей в окончательном выводе могут не совпадать с соответствующими путями к
// исходным файлам во время компиляции.

// Компилятор TS имеет набор дополнительных флагов для информирования компилятора о преобразованиях,
// которые, как ожидается, произойдут с источниками для генерации окончательного вывода

// Важно отметить, что компилятор не будет выполнять ни одно из этих преобразований, он просто использует
// эту информацию, чтобы направлять процесс декларации импорта модуля в его файл определения.


//* Базовый URl
// Использование baseUrl - обычная практика в приложениях, использующих загрузчики модулей AMD, где модули
// развёртываются в одной папке во время выполнения. Источники этих модулей могут находиться
// в разных каталогах, но сценарий сборки объединяет их вместе

// Параметр baseUrl сообщает компилятору, где искать модули. Предполагается, что весь импорт модулей с
// неотносительными именами относится к baseUrl

// Значение baseUrl определяется как
// - значение аргумента командной строки baseUrl (если путь относительный, он вычисляется на основе
//   текущего каталога)
// - значение свойства baseUrl в tsconfig.json (для относительных путей вычисляется на основе
//   месторасположения tsconfig.json)

// На относительный импорт модулей не влияет установка baseUrl, поскольку они всегда разрешаются
// относительно файлов импорта


//* Отображение пути
// Иногда модули не находятся непосредственно под baseUrl. Например импорт в модуль jquery будет
// трансилироваться во время выполнения в "node_modules/jquery.slim.min.js". Загрузчики используют
// конфигурацию отображения для отображения имён модулей к файлам во время выполнения

// Компилятор TS поддерживает объявление таких сопоставлений с помощью  paths  свойства в tsconfig.json
// файлах. Вот пример того, как указать paths свойство для jquery
// {
//   "compilerOptions": {
//     "baseUrl": ".",
//     "paths": {
//       "jquery": ["node_modules/jquery/dist/jquery"]
//     }
//   }
// }

// Стоит обратить внимание, что  paths  декларирован относительно  baseUrl . При установке baseUrl
// на другое значение ".", то есть каталог tsconfig.json, сопоставления должны быть изменены.
// При установке "baseUrl": "./src", jquery должен быть сопоставлен "../node_modules/jquery/dist/jquery"

// Использование paths также позволяет выполнять более сложные сопоставления, включая несколько резервных
// местарасположений. Рассмотрим конфигурацию проекта, в которой только некоторые модули доступны в одном
// месте, а остальные - в другом. На этапе сборки все они будут собраны в одном месте.

// Макет выглятит так:
// projectRoot
// ├── folder1
// │   ├── file1.ts (imports 'folder1/file2' and 'folder2/file3')
// │   └── file2.ts
// ├── generated
// │   ├── folder1
// │   └── folder2
// │       └── file3.ts
// └── tsconfig.json

// Соответствующий tsconfig.json выглядит так:
// {
//   "compilerOptions": {
//     "baseurl": ".",
//     "paths": {
//       "*": ["*", "generated/*"]
//     }
//   }
// }

// Это сообщает компилятору для любого импорта модуля, который соответствует шаблону "*" (то есть всем
// значениям), искать в двух местах:
// 1. "*": означает то же имя без изменений, поэтому map <moduleName> => <baseUrl>/<moduleName>
// 2. "generated/*" означает имя модуля с добавленным префиксом сгенерировано,
//    поэтому map <moduleName> => <baseUrl>/generated/<moduleName>

// Следуя этой логике, компилятор попытается декларировать два импорта как таковых:

// import "folder1 / file2"
// 1. Шаблон "*" совпадает, и подстановочный знак захватывает всё имя модуля
// 2. Попробуйте первую замену в списке "*" -> folder1/file2
// 3. Результат подстановки - не относительное имя - объедените с baseUrl -> projectRoot/folder1/file2.ts
// 4. Файл существует. Выполнено

// import "folder2/file3"
// 1. Шаблон "*" совпадает, и подстановочный знак захватывает всё имя модуля
// 2. Попробуйте первую замену в списке "*" -> folder2/file3
// 3. Результат подстановки - не относительное имя - объедените с baseUrl -> projectRoot/folder2/file3.ts
// 4. Файл не существует, переходите ко второй замене
// 5. Вторая подстановка "generated/*" -> generated/folder2/file3
// 6. Результат подстановки - не относительное имя - объедените с baseUrl ->
//    projectRoot/generated/folder2/file3.ts
// 7. Файл существует. Выполнено.


//* Виртуальные каталоги с rootDirs
// Иногда исходники проекта из нескольких каталогов во время компиляции объединяются для создания единого
// выходного каталога. Это можно рассматривать, как набор исходных каталогов, создающих виртуальный каталог

// Используя rootDirs, можно сообщить компилятору о корнях, составляющих этот виртуальный которалог, и, 
// таким образом, компилятор может разрешить относительный импорт модулей в этих виртуальных каталогах,
// как если бы они были объединены в один каталог

// Например, рассмотрим эту структуру проекта:
// src
// └── views
//     └── view1.ts (imports './template1')
//     └── view2.ts

// generated
// └── templates
//         └── views
//             └── template1.ts (imports './view2')

// Файлы в src/views - это код пользователя для некоторых элементов управления пользовательского интерфейса
// Фйлы в generated/templates - это код привязки шаблона пользовательского интерфейса,
// автоматически сгенерированный генератором шаблоноа, как часть сборки. Шаг сборки будет копировать файлы
// в /src/views и /generated/templates/views в тот же каталог, в выходном сигналею Во время выполнения
// представление может ожидать, что его шаблон будет сущетсвовать рядом с ним, и поэтому должно
// импортировать его, используя относительное имя как "./template"

// Чтобы указать это отношение к компилятору, надо использовать "rootDirs". Он укажет список корней,
// содержимое которых, как ожидается, будет объединенно во время выполнения. Итак, следуя нашему примеру,
// tsconfig.json файл должен выглядеть так:
// {
//   "complierOptions": {
//     "rootDirs": ["src/views", "generated/templates/views"]
//   }
// }

// Каждый раз, когда компилятор видит относительный импорт модуля в подпапке одного из файлов rootDirs,
// он будет пытаться найти этот импорт в каждой из записей rootDirs

// Гибкость rootDirs не ограничивается указанием списка физических исходных каталогов, которые
// логически объединены. Предоставляемый массив может включать любое количество произвольных имён каталогов,
// независимо от того, существуют они или нет. Это позволяет компилятору захватывать сложные функции
// связывания и выполнения, такие как условное включение и специальные плагины загрузчика проекта,
// безопасным для тип способом

// Рассмотрим сценарий интернационализации в котором инструмент сборки автоматически генерирует пакеты для
// конкретной локали, интерполируя специальный токен пути, например #{locale}, как часть относительного
// пути к модулю, например ./#{locale}/messages. В этой гипотетической перебирает инструмент
// поддерживается локали, отображение отведённого пути в ./zh/messages, ./de/messages и так далее

// Предположим, что каждый из этих модулей экспортирует массив строк. Например, ./zh/messages
// может содержать:
// export default ["您好吗", "很高兴认识你"]

// Используя rootDir эту возможность, мы можем сообщить копилятору об этом сопоставлении и тем самым
// позволить ему безопасно разрешиться ./#{locale}/messages, дажк если каталог никогда не будет
// существовать. Например, со следующим tsconfig.json
// {
//   "complierOptions": {
//     "rootDirs": ["src/zh", "src/de", "src/#{locale}"]
//   }
// }

// Компилятор теперь import messages from "./#{locale}/messages" будет использовать import from
// "./zh/messages" для инструментальных целей, позволяя разработку независимым от языкового стандарта
// способом без ущерба для поддержки времени разработки


//* Разрешения модуля трассировки
// Как обсуждалось ранее, компилятор может посещать файлы за пределами текущей папки при разрешении модуля
// Это может быть сложно при диагностике, почему модуль не разрешён или разрешён с неправильным определением
// Включение трассировки разрешения модуля компилятора с помощью  --traceResolution даёт представление о том,
// что произошло в процессе разрешения модуля

// Допустим, у нас есть пример приложения, использующего этот typescript модуль, app.ts имеет импорт вроде
// import * as ts from "typescript"
// │   tsconfig.json
// ├───node_modules
// │   └───typescript
// │       └───lib
// │               typescript.d.ts
// └───src
//         app.ts

// Вызов компилятора с --traceResolution
// tsc --traceResolution

// Приводит к выводу например:
// ======== Resolving module 'typescript' from 'src/app.ts'. ========
// Module resolution kind is not specified, using 'NodeJs'.
// Loading module 'typescript' from 'node_modules' folder.
// File 'src/node_modules/typescript.ts' does not exist.
// File 'src/node_modules/typescript.tsx' does not exist.
// File 'src/node_modules/typescript.d.ts' does not exist.
// File 'src/node_modules/typescript/package.json' does not exist.
// File 'node_modules/typescript.ts' does not exist.
// File 'node_modules/typescript.tsx' does not exist.
// File 'node_modules/typescript.d.ts' does not exist.
// Found 'package.json' at 'node_modules/typescript/package.json'.
// 'package.json' has 'types' field './lib/typescript.d.ts' that references 'node_modules/typescript/lib/typescript.d.ts'.
// File 'node_modules/typescript/lib/typescript.d.ts' exist - use it as a module resolution result.
// ======== Module name 'typescript' was successfully resolved to 'node_modules/typescript/lib/typescript.d.ts'. ========

//todo На что стоит обратить внимание
// - Название и место ввоза
// ======== Разрешение модуля 'typescript' из 'src/app.ts'. ========

// - Стратегия, которой следует компилятор
// Тип разрешения модуля не указан, используется NodeJS

// - Загрузка типво из пакетов npm
// package.json' имеет 'types' поле './lib/typescript.d.ts' что сслыается на 'node_modules/typescript/lib/typescript.d.ts'.

// - Конечный результат
// ======== Имя модуля'typescript' было успешно преобразовано в 'node_modules/typescript/lib/typescript.d.ts'. ========


//* С использованием --noResolve
// Обычно компилятор пытается разрешить все импортированные модули до начала процесса компиляции.
// Каждый раз, когда он успешно разрешает import в файл, файл добпвляется к набору файлов, которые
// компилятор будет обрабатывать позже

// Параметры --noResolve компилятора инструктируют компилятор не добавлять в компиляцию файлы, которые не
// былои переданы в командной строке. Он по-прежнему будет пытаться преобразовать модуль в файлы, но если
// файл не указан, он не будет включён

// app.ts
// import * as A from "moduleA"   - ok, "moduleA" путь найден в командной строке
// import * as B from "moduleB"   - ошибка TS2307: не найден модуль "moduleB"
//    tsc app.ts moduleA.ts --noResolve

// Компиляция app.ts с использованием --noResolve должна привести к
// - Правильно обнаружив, moduleA как было передано в командной строке
// - Ошибка из-за того, что moduleB была не найдена


//* Общие вопросы
//* Почему модуль в списке исключений по-прежнему выбирается компилятором?
// tsconfig.json превращает папку в проект. Без указания каких-либо "exclude" и "files" или все файлы
// в папке, содержащей tsconfig.json и все её подкаталоги, включаются в вашу компиляцию. Если вы хотите
// исключить использование некоторых файлов "exclude", если предпочитаете указать все файлы вместо того,
// чтобы позоволить компилятору искать их, используйте "files"

// Это было tsconfig.json автоматическое включение. Это не встраивает разрешение модуля, как
// обсуждалось выше. Если компилятор определил файл, как цель импорта модуля, он будет включён в компиляцию
// независимо от того, был ли он исключён на предыдущих шагах

// Итак, чтобы искобчить файл из компиляции, вам необходимо исключить его и все файлы, для которых есть
// дирректива import или /// <reference path="..." />