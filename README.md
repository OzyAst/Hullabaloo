# Hullabaloo.js

Простой плагин оповещений, который использует стили стандартных Bootstrap алертов.
Для его создания использовался плагин [bootstrap-growl](https://github.com/ifightcrime/bootstrap-growl).

## Зависимости

1. Latest version of jQuery.
2. [Twitter Bootstrap](http://twitter.github.com/bootstrap/index.html). (current rev tested with 4.0.0) (Необязательно)

## Использование

Подключите стили bootstrap или файл стилей `hullabaloo.css` и `hullabaloo.js` на свою страницу, Создайте главный объект hullabaloo и вызывайте.

```javascript
// init
$.hulla = new hullabaloo();
// Задаем положение алерта и отступ от верха
$.hulla.options.offset = {
    from: "top",
    amount: 30
};
// Задаем расстояние между алертами
$.hulla.options.stackup_spacing = 15;

// Вызываем алерт
$.hulla.send("Добро пожаловать!", "success");

// Принудительная отмена группировки
$.hulla.send("Добро пожаловать!", "success", 0);
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

## Опции

Изменение опций по умолчанию

```javascript
$.hulla.options.<опция> = <значение>;
```

Список доступных опций:


| Option         | Default  | Description                           |
| -------------- | -------- | ------------------------------------- |
| offset.from    | _top_    | Положение алерта по вертикали (top, bottom) |    
| offset.amount  | _20_     | Отступ алерта от границы экрана       |    
| align          | _right_  | Положение алерта по горизонтале (left, right, center) |
| stackup_spacing| _10_     | Отступ между алертами                 |
| width          | _250_    | Ширина алерта                         |
| delay          | _4000_   | Задержка отображения                  |
| allow_dismiss  | _true_   | Кнопка закрытия алерта                |
| text           |          | Текст по умолчанию                    |
| icon.success   |          | Иконка по умолчанию                   |
| icon.info      |          | Иконка по умолчанию                   |
| icon.warning   |          | Иконка по умолчанию                   |
| icon.danger    |          | Иконка по умолчанию                   |
| icon.light     |          | Иконка по умолчанию                   |
| icon.dark      |          | Иконка по умолчанию                   |
| status         | _danger_ | Статус по умолчанию                   |
| alertClass     | _empty_  | Дополнительные класс для блока алерта |
