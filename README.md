## Запуск
Для запуска откройте в браузере файл index.html

## Сборка
Возможно, для сборки нужно:
* Установить [npm](https://www.npmjs.com/get-npm)
* В консоли в папке с проектом выполнить `npm install`
* Выполнить `npm run build`
* Если повезло, то в папке `dist` обновится файл `build.js`

## Структура

- `src` - файлы с исходным кодом
  - `components` - vue компоненты интерфейса
  - `domain` - файлы с логикой приложения
  - `app.vue` - корневой компонент vue-приложения
  - `index.ts` - корневой файл скриптов
  - `*.d.ts` - какие-то файлы. Без них не работает
- `package.json`, `package-lock.json` - конфиги для npm
- `index.html` - самая понятная часть проекта
- `tsconfig.json` - конфиги для компилятора TypeScript
- `webpack.confih.js` - конфиги для webpack