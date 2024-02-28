# nodejs-active-record-for-mysql
Динамическое создание запросов в базу данных MySQL для nodejs
```
Используется для динамичного формирования наиболее популярных запросов в БД MySQL
CREATE	- создание таблицы
DROP	- удаление таблицы
INSERT	- добавление записи
UPDATE	- обновление записей
DELETE	- удаление записей
SELECT	- получение записей
```
## Пример подключения
```JS
var model_users = new (require('active-record-for-mysql'))({
	table 		: 'users';
	idkey 		: 'user_id';
	table_nick 	: 'Пользователи',
	engine		: 'InnoDB',
	charset		: 'utf8',
	fields 		: 
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
		}
	]
});
```
## Примеры использования:


### ЗАПРОС СОЗДАНИЯ ТАБЛИЦЫ
```JS
model_users.query_create();
```
```MYSQL
CREATE TABLE IF NOT EXISTS `users` ( `user_id` int(11) NOT NULL AUTO_INCREMENT, `user_name` varchar(100) NOT NULL,`user_family` varchar(100) NOT NULL, `user_city_id` int(11) NOT NULL, PRIMARY KEY (`user_id`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```


### ЗАПРОС УДАЛЕНИЯ ТАБЛИЦЫ
```JS
model_users.query_drop();
```
```MYSQL
DROP TABLE IF EXISTS `users`;
```

### ЗАПРОС ВСЕХ СТРОК СО ВСЕМИ ПОЛЯМИ
```JS
var data = {};
model_users.query_select(data);
```
```MYSQL
SELECT * FROM users;
```


### ЗАПРОС ВСЕХ СТРОК С ПЕРЕЧИСЛЕННЫМИ ПОЛЯМИ
```JS
var data = {
	fields : ['user_id', 'user_name', 'user_family']
};
model_users.query_select(data));
```
```MYSQL
SELECT `user_id`, `user_name`, `user_family` FROM users;
```


### ЗАПРОС ОДНОЙ СТРОКИ С ЗАДАННЫМ ID
```JS
var data = {
	fields 	: [],
	where 	: {
		user_id : 1,
	},
	limit 	: 1
};
model_users.query_select(data)
```
```MYSQL
SELECT * FROM users WHERE `user_id`='1' LIMIT  1;
```


### ЗАПРОС СТРОК НА УСЛОВИЯХ WHERE И IN
```JS
var data = {
	fields	: ['user_id', 'user_name', 'user_family'],
	where	: {
		user_family		: 'Иванов',
		'user_name !='		: 'Петр',
		'OR user_name !='	: 'Вася',
	},
	in		: {
		'user_id'		: [1,2,3],
		'user_profi'		: ['Сантехник', 'Электрик', 'Дворник']
	},
};
model_users.query_select(data)
```
```MYSQL
SELECT `user_id`, `user_name`, `user_family` FROM users WHERE `user_family`='Иванов' AND `user_name`!='Петр' OR `user_name`!='Вася' AND `user_id` IN ('1', '2', '3') AND `user_profi` IN ('Сантехник', 'Электрик', 'Дворник');
```


### ЗАПРОС СТРАНИЦЫ СТРОК СГРУППИРОВАННЫХ GROUP НА УСЛОВИЯХ LIKE С СОРТИРОВКОЙ
```JS
var data = {
	fields	: ['user_name', 'user_family'],
	group	: ['user_name', 'user_family'],
	like	: {
		user_family	: 'Ива',
		user_name	: 'etr%',
	},
	order	: {
		user_family	: 'asc',
		user_age	: 'desc'
	},
	limit	: 10,
	offset	: 5,
};
model_users.query_select(data));
```
```MYSQL
SELECT `user_name`, `user_family` FROM users WHERE `user_family` LIKE '%Ива%' AND `user_name` LIKE 'etr%' GROUP BY user_name, user_family ORDER BY `user_family` ASC, `user_age` DESC LIMIT 5, 10;
```


### ЗАПРОС ДОБАВЛЕНИЯ СТРОКИ
```JS
var data = {
	data	: {
		user_family	: 'Иванов',
		user_name	: 'Петр',
	}
};
model_users.query_insert(data));
```
```MYSQL
INSERT INTO users SET `user_family`='Иванов', `user_name`='Петр';
```


### ЗАПРОС ДОБАВЛЕНИЯ ДВОИЧНЫХ ДАННЫХ ИЗ ФАЙЛА (РЕДКО ИСПОЛЬЗУЕТСЯ)
```JS
var data = {
	data	: {
		user_family	: 'Иванов',
		user_name	: 'Петр',
		user_passport	: require('fs').readFileSync('./uploads/passport.jpg'),
	}
};
model_users.query_insert(data));
```
```MYSQL
INSERT INTO users SET `user_family`='Иванов', `user_name`='Петр', ?;
```


### ЗАПРОС ОБНОВЛЕНИЯ СТРОК НА УСЛОВИЯХ WHERE, IN, LIKE
```JS
var data = {
	data	: {
		user_family	: 'Иванов',
		user_name	: 'Петр',
	},
	where	: {
		user_family	: 'Петров',
		user_name	: 'Иван',
	},
	in	: {
		user_id		: [1,2,3],
	},
	like	: {
		user_family	: 'Ива',
		user_name	: 'etr%',
	},
};
model_users.query_update(data));
```
```MYSQL
UPDATE users SET `user_family`='Иванов', `user_name`='Петр' WHERE `user_family`='Петров' AND `user_name`='Иван' AND `user_id` IN ('1', '2', '3') AND `user_family` LIKE '%Ива%' AND `user_name` LIKE 'etr%';
```


### ЗАПРОС ОБНОВЛЕНИЯ ДВОИЧНЫХ ДАННЫХ ИЗ ФАЙЛА (РЕДКО ИСПОЛЬЗУЕТСЯ)
```JS
var data = {
	data	: {
		user_family	: 'Иванов',
		user_name	: 'Петр',
		user_passport	: require('fs').readFileSync('./uploads/passport.jpg'),
	},
	in	: {
		user_id		: [1,2,3],
	},
};
model_users.query_update(data));
```
```MYSQL
UPDATE users SET `user_family`='Иванов', `user_name`='Петр', ? WHERE `user_id` IN ('1', '2', '3');
```


### ЗАПРОС ОБНОВЛЕНИЯ ПОЛЯ В ЗАВИСИМОСТИ ОТ ЗНАЧЕНИЯ В ДРУГОМ ПОЛЕ (РЕДКО ИСПОЛЬЗУЕТСЯ)
```JS
var data = {
	data	: {
		user_profi	: {
			case		: {
				user_code	: {
					'A 01'		: 'Инженер-электрик',
					'B 11 3'	: 'Слесарь-сантехник 3 категории',
					'A 02'		: 'Инженер-конструктор',
					'С'		: 'Разнорабочий',
				},
			},
		}
	},
	in	: {
		user_id		: [1,2,3],
	},
};
model_users.query_update(data));
```
```MYSQL
UPDATE users SET `user_profi` = CASE `user_code` WHEN 'A 01' THEN 'Инженер-электрик' WHEN 'B 11 3' THEN 'Слесарь-сантехник 3 категории' WHEN 'A 02' THEN 'Инженер-конструктор' WHEN 'С' THEN 'Разнорабочий' ELSE `user_profi` END WHERE `user_id` IN ('1', '2', '3');
```


### ЗАПРОС УДАЛЕНИЯ СТРОК
```JS
var data = {
	where	: {
		user_family	: 'Иванов',
		'user_age >'	: 25
	}, 
	in	: {
		user_id		: [1,2,3]
	},
};
model_users.query_delete(data));
```
```MYSQL
DELETE FROM users WHERE `user_family`='Иванов' AND `user_age`>'25' AND `user_id` IN ('1', '2', '3');
```

## Тестирование
```
Пример серверного кода для проверки работоспособности расположен в директории "_demo"
```
### Запуск тестов
```
node server
```
### Результат
```
http://localhost:2020
```