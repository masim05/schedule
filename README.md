### Цель приложения ###
Понимать, что делал субъект в произвольный момент времени.

### Интерфейс ###
1. Пользователь хочет посмотреть недавние активности.
  1. пользователь заходит на страницу приложения - видит список 5 последних
 активностей
2. Пользователь хочет начать активность.
  1. пользователь заходит на страницу приложения и видит форму, содержащую поля:
    * время, предзаполненное значением текущего времени
    * чекбокс начало/конец
    * селект сон/кормление/активное бодрствование
    * кнопку "записать"
  2. пользователь заполняет форму произвольных образом и нажимает кнопку "записать" -
 данные сохранются на севере
  3. остальные пользователи видят внесенные изменения без перезагрузки страницы
 приложения

### TODO ###
- добавить возможность редактирования
- реализовать пагинацию активностей
- добавить для кормления предопределенные комментарии: правая, левая
- реализовать аналитику:
  1. время сна в сутки
  2. время активного бодрствования в сутки
  3. количество кормлений
  4. примерный режим сна за последние дни
