# nodejs-model-for-mysql
Базовый класс модели запросов в БД MySQL для nodejs.
```
Предназначен для создания и отправки запросов в БД MySQL.
Использует модули "mysql" и "active-record-for-mysql".
```
## БАЗОВЫЕ МЕТОДЫ
```
bind	- отправка готового запроса в БД MySQL, контроль ошибок;
create	- создание и отправка запроса создания таблицы
drop 	- создание и отправка запроса удаления таблицы
insert	- создание и отправка запроса добавления строки в таблицу
delete	- создание и отправка запроса удаления строк из таблицы
update	- создание и отправка запроса обновления строк в таблице
select	- создание и отправка запроса получения строк из таблицы
```
## МЕТОДЫ, ПРОИЗВОДНЫЕ ОТ БАЗОВЫХ 
```
get		- формирует/извлекает строку для формы добавления/обновления
set		- добавляет/обновляет строку из формы добавления/обновления
get_row_for_id 		- по ID возвращает строку из базы данных
delete_row_for_id 	- по ID удаляет строку из базы данных
get_page_rows		- возвращает заданную страницу строк
get_count_rows		- возвращает общее число строк
```
## Пример подключения и использования в папке "_demo"
```
В директории проекта расположена папка с моделями "models".
В этой папке создан файл "myModel.js" c классом базовой модели.

Примечание. Число базовых моделей соответствует числу используемых в проекте баз данных. 

В той же папке созданы файлы "mdl_users" и "mdl_cities" - классы моделей таблиц "users" и "cities".
Классы моделей наследуют свойства и методы базовой модели.
```
### Базовая модель. Файл "myModel.js"
```JS
var Model = function () {
	require('model-for-mysql').call(this, {
		host 		: 'localhost',	//Адрес БД
		user 		: 'user123',	//Пользователь
		password 	: '123',	//Пароль
		database 	: 'test',	//Название БД	
	});
	var self = this;
};
module.exports = Model;	
```
### Модель таблицы "users". Файл "mdl_users.js"
```JS
var Model = function () {
	require('./myModel').call(this);
	
	var self = this;
	
	this.table	= 'users';		//Название таблицы
	this.idkey	= 'user_id';		//Ключевое поле
	this.table_nick	= 'ПОЛЬЗОВАТЕЛИ';	//Ник таблицы
	this.fields	=			//Структура полей таблицы
	[
		{
			field	: 'user_id', 
			label	: 'ID ПОЛЬЗОВАТЕЛЯ', 
			type	: 'int(11) NOT NULL',
			auto 	: 1,
		},
		{
			field	: 'user_name', 
			label	: 'ИМЯ ПОЛЬЗОВАТЕЛЯ', 
			type	: 'varchar(100) NOT NULL',
		},
		{
			field	: 'user_family', 
			label	: 'ФАМИЛМЯ ПОЛЬЗОВАТЕЛЯ', 
			type	: 'varchar(100) NOT NULL',
		},
		{
			field	: 'user_city_id', 
			label	: 'ID ГОРОДА ПОЛЬЗОВАТЕЛЯ', 
			type	: 'int(11) NOT NULL',
		},
		{
			field	: 'user_age', 
			label	: 'ВОЗРАСТ ПОЛЬЗОВАТЕЛЯ', 
			type	: 'int(11) NOT NULL',
		},
		{
			field	: 'user_image', 
			label	: 'ИЗОБРАЖЕНИЕ ПОЛЬЗОВАТЕЛЯ', 
			type	: 'longblob',
		},
	];
};
module.exports = Model;
```
### Модель таблицы "cities". Файл "mdl_cities.js"
```JS
var Model = function () {
	require('./myModel').call(this);
	
	var self = this;
	
	this.table		= 'cities';	//Название таблицы
	this.idkey		= 'city_id';	//Ключевое поле
	this.table_nick		= 'ГОРОДА';	//Ник таблицы
	this.fields		= 		//Структура полей таблицы	
	[
		{
			field	: 'city_id', 
			label	: 'ID ГОРОДА', 
			type	: 'int(11) NOT NULL',
			auto 	: 1,
		},
		{
			field	: 'city_name', 
			label	: 'НАЗВАНИЕ ГОРОДА', 
			type	: 'varchar(100) NOT NULL',
		},
	];
	
};
module.exports = Model;
```
### Пример подключения моделей
```JS
var mdl_users = new(require('./models/mdl_users'));
var mdl_cities = new(require('./models/mdl_cities'));
```

## Примеры выполнения запросов
### СОЗДАНИЕ ТАБЛИЦЫ
```JS
mdl_users.create(function(success) {})
```
```
Возвращает флаг успешности
```


### УДАЛЕНИЕ ТАБЛИЦЫ
```JS
mdl_users.drop(function(success) {});
```
```
Возвращает флаг успешности
```


### ДОБАВЛЕНИЕ СТРОКИ
```JS
var data = {
	data 	: {
		user_name	: 'Александр',
		user_family	: 'Иванов',
		user_age	: 40,
		//Добавление бинарного файла
		user_photo  	: require('fs').readFileSync(filename),
	}
};
mdl_users.insert(data, function (id) {});
```
```
Возвращает ID строки или 0 в случае неудачи
```


### УДАЛЕНИЕ СТРОК
```JS
var data = {
	where	: {
		user_family	: 'Иванов',
		'user_age >'	: 25
	}, 
	in		: {
		user_id 	: [1,2,3]
	},
};
mdl_users.delete(data, function (count_rows) {})
```
```
Возвращает число удаленных строк или 0 в случае неудачи
```


### ОБНОВЛЕНИЕ СТРОК
```JS
var data = {
	in	: {
		user_age 	: [40,45,50]
	}, 
	like 	: {
		user_family	: '%Ив'
	},
	where	: {
		user_status	: 'Новичок',
	}, 
	data 	: {
		user_status	: 'Старина',
		//Данные бинарного файла
		user_photo  	: require('fs').readFileSync(filename),
	},
};
mdl_users.update(data, function (count_rows) {});
```
```
Возвращает число обновленных строк или 0 в случае неудачи
```


### ПОЛУЧЕНИЕ СТРОК	
```JS
var data = {
	fields 	: ['user_id', 'user_name', 'user_family'],  //[] - все поля строки
	join 	: {
		cities 		: 'users.user_city_id = cities.city_id',
		statuses 	: 'users.user_status_id = statuses.status_id',
	},
	where	: {
		status_name	: 'Рабочий',
		'user_age >'	: 45,
	}, 
	like	: {
		user_family	: '%Ива',
		user_about	: '%женат%',
	}, 
	in		: {
		user_company_id : [1,2,3]
	}, 
	group 	: ['user_family', 'user_name'],
	order   : {
		user_family 	: 'asc',
		user_age 	: 'desc',
	},
	limit	: 10,
	offset	: 5,
};
mdl_users.select(data, function (rows) {});
```
```
Возвращает массив строк таблицы или [] в случае неудачи
```


### ФОРМИРОВАНИЕ(ПОЛУЧЕНИЕ) СТРОКИ ДЛЯ ФОРМЫ ДОБАВЛЕНИЯ(ОБНОВЛЕНИЯ) ЕСЛИ ID=0(ID>0)
```JS
mdl_users.get(1, function(row) {})
```
```
Возвращает {user_id:1, user_family:'Иванов', user_name:'Иван'...}
```
```JS
mdl_users.get(0, function(row) {})
```
```
Возвращает {user_id:0}
```


### ДОБАВЛЕНИЕ(ОБНОВЛЕНИЕ) СТРОКИ ИЗ ФОРМЫ ДОБАВЛЕНИЯ(ОБНОВЛЕНИЯ) ЕСЛИ ID=0(ID>0)
```JS
//Обновляет в таблице(id>0) или добавляет в таблицу(id=0) одну строку
//Условия игнорируются
var data = {
	user_name 	: 'Иван',
	user_family 	: 'Иванов',
}
mdl_users.set(0, data, function(id) {});
```
```
Добавляет новую строку и возвращает ID
```
```JS
var data = {
	user_name 	: 'Иван',
	user_family 	: 'Иванов',
}
mdl_users.set(1, data, function(success) {});
```
```
Обновляет существующую строку и возвращает флаг успешности
```


### ПОЛУЧЕНИЕ ОДНОЙ СТРОКИ С ЗАДАННЫМИ ПОЛЯМИ ПО ID
```JS
mdl_users.get_row_for_id(10, ['user_name', 'user_family'], function(row) {})
```
```
Возвращает строку или null
```


### УДАЛЕНИЕ ОДНОЙ СТРОКИ ПО ID
```JS
mdl_users.delete_row_for_id(10, function(success) {})
```
```
Возвращает флаг успешности
```


### ПОЛУЧЕНИЕ СТРАНИЦЫ СТРОК ПО НОМЕРУ СТРАНИЦЫ (С НУЛЯ) И ЧИСЛУ СТРОК НА СТРАНИЦУ
```JS
var data = {
	fields 	: ['user_family', 'user_name'],
	where 	: {
		'user_age >' : 30
	}
};
mdl_users.get_page_rows(0, 10, data, function(total, rows) {})
```
```
Возвращает общее число строк и массив строк требуемой страницы
```


### ПОЛУЧЕНИЕ ОБЩЕГО ЧИСЛА СТРОК НА УСЛОВИЯХ
```JS
var data = {
	where 	: {
		'user_age >' 	: 50
	},
	like 	: {
		user_family 	: 'ман%'
	},
}
mdl_user.get_count_rows(data, function (count_rows) {})
```
```
Возвращает число строк удовлетворяющих условиям
```

## Тестирование
```
Код тестов в файле "_demo/server.js".
В файле "_demo/uploads/passport.jpg" расположено небольшое изображение для демонстрации загрузки двоичного файла

Для тестирования требуется создать пустую (без таблиц) БД, например "test".
В файле "_demo/server.js" указать параметры доступа к БД.
```
### Запуск тестов
```
node server
```
### Результат
```
http://localhost:2020
```
