# nodejs-encode-decode-cookies
Простой модуль для взаимодействия с кукисами.
```
Позволяет добавлять, удалять и получать требуемые кукисы.
Позволяет устанвить простое шифрование кукисов.
Метод "start" помещает функционал, название и значение кукисов в req.cookies

req.cookies.headers - строка со списком кукисов до расшифровки
req.cookies.parse	- объект с названиями и значениями кукисов
req.cookies.set		- функция установки кукиса
req.cookies.delete	- функция удаления кукиса
```

## Подключение
```JS
var cookies = require('encode-decode-cookies')({
	password : 'password' 	//Пароль шифрования кукисов ('' - без шифрования)
});

//Формируем задачу
var app = function(req, res) {
	
	cookies.start(req, res);

	console.log(req.cookies);

	...
	
};
//Создаем и запускаем сервер для задачи
var server = require('http').createServer(app);
server.listen(2020);
```

## Использование

### Установка кукиса (до установки заголовков res.writeHead)
```JS
req.cookies.set( name, value, time, path || '/');
```

### Удаление кукиса (до установки заголовков res.writeHead)
```JS
req.cookies.delete( name );
```

### Получение всех кукисов до расшифровки

var my_cookies_encode = req.cookies.headers

### Получение всех кукисов после расшифровки
```JS
var my_cookies_decode = req.cookies.parse;
```

### Получение отдельного кукиса
```JS
var user_id = req.cookies.parse['user_id'];
```

## Тестирование
```
Пример серверного кода для проверки работоспособности расположен в директории "_demo"
```
### Запуск тестового сервера (из папки "encode-decode-cookies")
```
npm run demo
```
### Результат
```
http://localhost:2020
```
