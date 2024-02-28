# nodejs-mysql-sessions
Создание и использование сессий с хранилищем в MySQL.
```
Автоматически создает таблицу sessions в заданной базе данных MySQL.
Автоматически создает/обновляет сессии для каждого подключения.
Автоматически сохраняет зашифрованное название сессии в куки.
Автоматически удаляет просроченные сессии исходя из допустимого срока бездействия.
Использует агента (данные браузера) и опцонально IP-адрес для распознания подмены.
Формирует функционал для сохранения в сессии, извлечения и удаления из сессии данных пользователя.
Метод "start" помещает функционал и пользовательские данные в req.sessions

req.sessions.row 	- копия строки сессии
req.sessions.parse	- объект с пользовательскими данными
req.sessions.set	- функция установки пользовательских данных
req.sessions.delete	- функция удаления пользовательских данных
req.sessions.pop	- функция извлечения и удаления одиночных пользовательских данных (флэш-данных)

Использует 
- модуль "encode-decode-cookies" для простого шифрования кукисов и взаимодействия с ними.
- модуль "model-for-mysql" для взаимодействия с БД MySQL
```

## Подключение
```JS
//Модуль кукисов
var cookies = require('encode-decode-cookies')({
	password 	: 'password',	//Пароль шифрования кукисов ('' - без шифрования)
});
//Модуль сессий
var sessions = require('mysql-sessions')({
	//Конфигурация базы данных 
	db	: {
		host 		: 'localhost',
		user 		: 'user',	
		password 	: 'password',
		database 	: 'database',	
	},
	//Конфигурация сессий
	label	: 'SN',		//Название метки в кукисах
	timeout : 15*60,	//Время жизни сессии при бездействии, секунд
	checkIP	: false,	//Проверять изменение IP					
});

//Формируем задачу
var app = function(req, res) {
	
	//Подключаем и запускаем модуль кукисов
	cookies.start(req, res);
	console.log(req.cookies);
	
	//Подключаем и запускаем модуль сессий
	sessions.start(req, res, function () {
		console.log(req.sessions);
		...
	});	
};
//Создаем и запускаем сервер для задачи
var server = require('http').createServer(app);
server.listen(2020);
```

## Использование

### Установка данных (до установки заголовков res.writeHead)
```JS
var data = {
	name1 : value1,
	name2 : value2,
	...
};
req.sessions.set(data, function(success){});
```
### Удаление данных (до установки заголовков res.writeHead)
```JS
req.sessions.delete( name, function(success){} );
```
или
```JS
req.sessions.delete( [name1, name2], function(success){} );
```
### Извлечение и удаление удиночных данных (флэш-данных)  (до установки заголовков res.writeHead)
```JS
req.sessions.pop( name, function(success, value){} );
```
### Получение копии строки сессии
```JS
var my_session_row = req.sessions.row;
```
### Получение всех пользовательских данных
```JS
var my_session_data = req.sessions.parse;
```
### Получение отдельных пользовательских данных
```JS
var user_id = req.sessions.parse['user_id'];
```

## Тестирование
```
Пример серверного кода для проверки работоспособности расположен в директории "_demo"
Для запуска установите конфигурацию
- модуля cookies (пароль шифрования)
- модуля sessions (параметры соединения с БД, метку куки, время допустимого бездействия и флаг проверки IP алреса).
```
### Запуск тестового сервера (из папки "mysql-sessions")
```
npm run demo
```
### Результат
```
http://localhost:2020
```
