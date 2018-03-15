# Hullabaloo.js

Простой плагин оповещений, который использует стили сдандартных Bootstrap алертов.
Для его создания использовался плагин [bootstrap-growl](https://github.com/ifightcrime/bootstrap-growl).

## Зависимости

1. Latest version of jQuery.
2. [Twitter Bootstrap](http://twitter.github.com/bootstrap/index.html). (current rev tested with 3.3.7)

## Использование

Подключите файл все зависимости и `hullabaloo.js` на свою страницу и инициализируйте и вызывайте.

```javascript
$.hulla = new hullabaloo();
$.hulla.send("Добро пожаловать!", "success");
```

## Дополнительные функции

Можно настроить вызов ваших функций в разный момент жизни алерта

```javascript
// Ф-ия выполнится как только алерт выведется на экран, но до того как он исчезнет
$.hulla.options.fnEnd = function() {
    alert("Алерт вывелся и скоро исчезнет")
}

// Ф-ия выполнится еще до появления алерта на экран
$.hulla.options.fnStart = function() {
    alert("Алерт скоро появится");
}

// Ф-ия выполнится как только алерт исчезнет с экрана
$.hulla.options.fnEndHide = function() {
    alert("Алерт закрылся");
}
```
