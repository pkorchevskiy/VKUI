С версии `2.11.0` VKUI поддерживает темы. Пока что доступны две цветовые схемы: `bright_light` и `space_gray`.
В левом верхем углу есть переключатель, который позволяет посмотреть, как выглядят компоненты в разных
схемах.

### Как это работает?
Поддержка тем реализована с помощью стандарта
[css-custom-properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*). Все цвета, используемые в
компонентах, заданы в CSS переменных и их значения меняются в зависимости от выбранной темы. Чтобы сохранить обратную
совместимость, по-умолчанию используется стандартная цветовая схема (`bright_light`).
Для задания темы используется специальный атрибут на `body`, который называется `scheme`. В CSS переменные меняют
свои значения, в зависимости от значения этого атрибута. Пример для наглядности:

```css static
:root {
  --background_page: #ebedf0;
}

body[scheme="space_gray"] {
  --background_page: #0a0a0a;
}

.Panel__in {
  background: var(--background_page);
}

```

### Как с этим работать?
Пользователь выбирает тему в настройках клиента (iOS, Android). Клиент, в свою очередь, с помощью
`@vkontakte/vk-bridge` пробрасывает VKUI-приложениям специальное событие: `VKWebAppUpdateConfig`.
В `e.detail.data` этого события находится свойство `scheme`, которое мы должны навесить на `body`.

В скором будущем библиотека инкапсулирует эту логику внутри себя и вам не придется думать об установке схемы,
соответствующей клиентской.
