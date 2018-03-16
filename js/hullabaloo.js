/**
 * hullabaloo v 0.1
 *
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['buoy'], factory(root));
  } else if (typeof exports === 'object') {
    module.exports = factory(require('buoy'));
  } else {
    root.hullabaloo = factory(root, root.buoy);
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, function(root) {
  var init = function(root) {

    var hullabaloo = function() {
      // Объект создаваемый сейчас.
      // генерируется в this.generate() а заполняется в this.send()
      this.hullabaloo = {};

      // Массив с объектами активных алертов
      this.hullabaloos = [];

      this.success = false;

      this.options = {
        ele: "body",
        offset: {
          from: "top",
          amount: 20
        },
        align: "right",
        width: 250,
        delay: 4000,
        allow_dismiss: true,
        stackup_spacing: 10,
        text: "Произошла неизвестная ошибка. Попробуйте перезагрузить страницу и повторить операцию.",
        icon: "times-circle",
        status: "danger",
        fnStart: false, // Ф-ия будет выполняться при старте
        fnEnd: false, // Ф-ия будет выполняться по завершинию
        fnEndHide: false, // Ф-ия будет выполняться после закрытия сообщения

      };
    };

    // Выводим сообщение
    hullabaloo.prototype.send = function(text, status) {
      // Запустим функцию при старте
      if (typeof this.options.fnStart == "function")
        this.options.fnStart();

      // Ссылка на объект
      var self = this;
      // Флаг для обозначение что найденна группа одинаковых алертов
      var flag = 1;
      // Счетчик для переборки всех алертов. Поиск одинаковых
      var i = +this.hullabaloos.length - 1;
      // Главный алерта если уже есть такие же алерты
      var parent;

      // Если нет тектса сообщения, возьмем дефолтный
      this.hullabaloo.text = text || this.options.text;
      // Дефол для статуса сообщеиня
      this.hullabaloo.status = status || this.options.status;

      // Сгенерируем сообщение
      var hullabaloo = this.generate();

      // Проверим нет ли уже таких же сообщений
      if (this.hullabaloos.length) {
        // Переберем веь массив
        while (i >= 0 && flag) {
          // Если у нас присутствуют одинаковые сообщения (сгруппируем их)
          if (this.hullabaloos[i].text == hullabaloo.text && this.hullabaloos[i].status == hullabaloo.status) {
            // Запомним главный алерт
            parent = this.hullabaloos[i];
            // Флаг выхода из цикла
            flag = 0;
            // Переместим наш алерт на место гланого со смещением
            hullabaloo.elem.css("top", parseInt(parent.elem.css("top")) + 4);
            hullabaloo.elem.css("right", parseInt(parent.elem.css("right")) + 4);
          }
          i--;
        }
      }

      // Запомним позицию алерта, понадобиться для перемещения алертов вверх
      hullabaloo.posTop = parseInt(hullabaloo.elem.css("top"));

      // Проверяем, группа алертов у нас или только один
      if (typeof parent == 'object') {
        // Если алерт в группе то добавим его в группу и обнулим счетчик группы
        clearTimeout(parent.timer);
        // Зададим новый счетчик для группы
        parent.timer = setTimeout(function() {
          self.closed(parent);
        }, 5000);
        // присвоим наш алерт в группу к родителю
        parent.hullabalooGroup.push(hullabaloo);
        // Если алер один
      } else {
        // Активируем таймер
        hullabaloo.timer = setTimeout(function() {
          self.closed(hullabaloo);
        }, 5000);
        // Добавим алерт в общий массив алертов
        this.hullabaloos.push(hullabaloo);
      }

      // Покажем алерт пользователю
      hullabaloo.elem.fadeIn();

      // Запустим функцию по завершения
      if (typeof this.options.fnEnd == "function")
        this.options.fnEnd();
    }

    // Закрывает алерт
    hullabaloo.prototype.closed = function(hullabaloo) {
      var self = this;
      var idx, i, move, next;

      // проверяем есть ли массив с алертами
      if (this.hullabaloos !== null) {
        // Найдем в массиве закрываемый алерт
        idx = $.inArray(hullabaloo, this.hullabaloos);

        // Если это група алертов, то закроим все
        if (hullabaloo.hullabalooGroup !== "undefined" && hullabaloo.hullabalooGroup.length) {
          for (i = 0; i < hullabaloo.hullabalooGroup.length; i++) {
            // закрыть алерт
            $(hullabaloo.hullabalooGroup[i].elem).alert("close");
          }
        }

        // Закрываем наш алерт
        $(this.hullabaloos[idx].elem).alert("close");

        if (idx !== -1) {
          // Если в массиве есть другие алерты, поднимем их на место закрытого
          if (this.hullabaloos.length > 1) {
            next = idx + 1;
            // Отнимаем верхнюю гранизу закрытого алерта от верхней границы следующего алерта
            // и расчитываем на сколько двигать все алерты
            move = this.hullabaloos[next].posTop - this.hullabaloos[idx].posTop;

            // двигаем все алерты, которые идут за закрытым
            for (i = idx; i < this.hullabaloos.length; i++) {
              this.animate(self.hullabaloos[i], parseInt(self.hullabaloos[i].posTop) - move);
              self.hullabaloos[i].posTop = parseInt(self.hullabaloos[i].posTop) - move
            }
          }

          // Удалим закрытый алерт из массива с алертами
          this.hullabaloos.splice(idx, 1);

          // Запустим функцию после закрытия сообщения
          if (typeof this.options.fnEndHide == "function")
            this.options.fnEndHide();
        }
      }
    }

    // Обрабатывает ответ Json
    hullabaloo.prototype.answer = function(data, option) {
      try {
        this.hullabaloo.answer = JSON.parse(data);
      } catch (e) {
        alert("Ошибка");
        console.log(data);
      }

      // Текст
      this.hullabaloo.text = this.hullabaloo.answer.text || "";
      // Тип
      this.hullabaloo.status = this.hullabaloo.answer.status || "success";

      if (typeof this.hullabaloo.answer != "object") {
        alert("Ошибка");
        console.log(data);
        return 0;
      }

      // Если есть дополнительные параметры
      /*
       * success - функция выполняется при успешном ответе от сервера
       * error - функция выполняется если от сервера пришел ответ с ошибкой
       * end - функция выполняется при любом ответе от сервера
       */
      if (typeof option == "object") {
        if (typeof option.success == "function" && this.hullabaloo.status == "success")
          option.success();
        if (typeof option.error == "function" && this.hullabaloo.status == "danger")
          option.error();
        if (typeof option.end == "function")
          option.end();
      }

      // Если нет текста и статус SUCCESS то не выводим сообщение
      // а просто запустим функцию окончания скрипта
      if (!(this.hullabaloo.status == "success" && this.hullabaloo.text == "")) {
        this.send();
      } else {
        // Запустим функцию после закрытия сообщения
        if (typeof this.options.fnEnd == "function")
          this.options.fnEnd();
      }
    }

    // Анимация для подъема алертов вверх
    hullabaloo.prototype.animate = function(hullabaloo, move) {
      var timer,
        top, // Верх алерта, который тащим
        i, // Счетчик для перебора группы алертов
        group = 0; // Обозначение, группа алертов или одиночный

      // Верх алерта, который тащим
      top = parseInt(hullabaloo.elem.css("top"));
      // Если это группа алертов
      group = hullabaloo.hullabalooGroup.length;

      // Запустим таймер
      timer = setInterval(frame, 2);
      // Ф-ия для таймера
      function frame() {
        if (top == move) {
          clearInterval(timer);
        } else {
          top--;
          hullabaloo.elem.css("top", top);

          // Если это группа алертов
          if (group) {
            for (i = 0; i < group; i++) {
              hullabaloo.hullabalooGroup[i].elem.css("top", top + 5);
            }
          }
        }
      }
    }

    // Генерация алерта на странице
    hullabaloo.prototype.generate = function() {
      var alertsObj = {
        icon: "", // Иконка
        status: "", // Статус
        text: "", // Тект
        answer: "", // Ответ от сервера
        elem: {}, // HTML код самого алерта

        // Группировка одинаковых алертов
        hullabalooGroup: []
      };
      var option, // Настройки алерта
        offsetAmount, // Отступы алерта
        css; // CSS свойства алерта

      // Объеденяет два объекта: option и  options
      option = $.extend({}, this.options, option);
      alertsObj.elem = $("<div>");
      alertsObj.elem.attr("class", "bootstrap-growl alert animation-slideRight");

      // Статус
      alertsObj.status = this.hullabaloo.status || option.status;
      alertsObj.elem.addClass("alert-" + this.hullabaloo.status);
      // Текст
      alertsObj.text = this.hullabaloo.text || this.options.text;
      // Answer
      alertsObj.answer = this.hullabaloo.answer || "";

      // Кнопка закрытия сообщения
      if (option.allow_dismiss) {
        alertsObj.elem.addClass("alert-dismissible");
        alertsObj.elem.append("<button  class=\"close\" data-dismiss=\"alert\" type=\"button\"><span aria-hidden=\"true\">&#215;</span><span class=\"sr-only\">Close</span></button>");
      }

      // Icon
      if (alertsObj.status == "success")
        alertsObj.icon = "check";
      else if (alertsObj.status == "info-circle")
        alertsObj.icon = "info";
      else if (this.hullabaloo.status == "danger")
        alertsObj.icon = "times-circle";
      else if (this.hullabaloo.status == "warning")
        alertsObj.icon = "exclamation-triangle";
      else
        alertsObj.icon = option.icon;

      // Добавим текст в сообщение
      alertsObj.elem.append('<i class="fa fa-' + this.hullabaloo.icon + '"></i> ' + this.hullabaloo.text);

      // Если указана позиция окна
      if (option.top_offset) {
        option.offset = {
          from: "top",
          amount: option.top_offset
        };
      }

      // Присвоим отступ от верха
      offsetAmount = option.offset.amount;
      // Если есть другие алерты то прибавим к отступу их высоту
      $(".bootstrap-growl").each(function() {
        return offsetAmount = Math.max(offsetAmount, parseInt($(this).css(option.offset.from)) + $(this).outerHeight() + option.stackup_spacing);
      });

      // Добавим CSS стили
      css = {
        "position": (option.ele === "body" ? "fixed" : "absolute"),
        "margin": 0,
        "z-index": "9999",
        "display": "none"
      };
      css[option.offset.from] = offsetAmount + "px";
      alertsObj.elem.css(css);

      if (option.width !== "auto") {
        alertsObj.elem.css("width", option.width + "px");
      }
      $(option.ele).append(alertsObj.elem);
      switch (option.align) {
        case "center":
          alertsObj.elem.css({
            "left": "50%",
            "margin-left": "-" + (alertsObj.elem.outerWidth() / 2) + "px"
          });
          break;
        case "left":
          alertsObj.elem.css("left", "20px");
          break;
        default:
          alertsObj.elem.css("right", "20px");
      }

      return alertsObj;
    };


    return hullabaloo;
  };
  return init(root);
});
