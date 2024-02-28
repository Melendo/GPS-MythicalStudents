//Устанавливаем конфигурацию
myConfig = {};
//Конфигурация пользователя (глобальная)
myConfig.data = {
	port		: 2020,
	isDebug		: true,		//Сообшения сервера
};

//Вспомогательные функции
String.prototype.replaceTABS = function () {
	return this.replace(/((?!\r\n)[\s\S]+?)($|(?:\r\n))/g, function (s, STR, CRLN, POS) {
		return STR.replace(/([^\t]*?)\t/g, function (s, STR, POS) {
			return STR + (new Array(4 - (STR.length + 4 ) % 4 + 1)).join(' ');
		}) + CRLN;
	});
};
String.prototype.replaceLN = function () {
	return this.replace(/\n/g, '<br/>');
};
String.prototype.replaceSPACES = function () {
	return this.replace(/ +/g, function (s) {
		return (s.length==1) ? (' ') : ((new Array(s.length)).join('&nbsp;') + ' ');
	});
};

var model_users = new (require('../index.js'))({
	table		: 'users',
	idkey 		: 'user_id',
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

//Тесты
var test = {
	0	: function () {
		var info = [];
		info.push('<b>Выберите тест или укажите его номер, например "/10"</b>');
		info.push('');
		info.push('1. <a href="/1">Запрос создания таблицы</a>');
		info.push('2. <a href="/2">Запрос удаления таблицы</a>');
		info.push('3. <a href="/3">Запрос всех строк со всеми полями</a>');
		info.push('4. <a href="/4">Запрос всех строк с перечисленными полями</a>');
		info.push('5. <a href="/5">Запрос одной строки с заданным ID</a>');
		info.push('6. <a href="/6">Запрос строк на условиях WHERE и IN</a>');
		info.push('7. <a href="/7">Запрос страницы строк сгруппированных GROUP на условиях LIKE с сортировкой</a>');
		info.push('8. <a href="/8">Запрос добавления строки</a>');
		info.push('9. <a href="/9">Запрос добавления двоичных данных из файла (редко используется)</a>');
		info.push('10. <a href="/10">Запрос обновления строк на условиях WHERE, IN, LIKE</a>');
		info.push('11. <a href="/11">Запрос обновления двоичных данных из файла (редко используется)</a>');
		info.push('12. <a href="/12">Запрос обносления поля в зависимости от значения в другом поле (редко используется)</a>');
		info.push('13. <a href="/13">Запрос удаления строк</a>');
		info.push('');
		return info;
	},
	1	: function () {
		var info = [];
		info.push('<b>ЗАПРОС СОЗДАНИЯ ТАБЛИЦЫ</b>');
		info.push('model_users.query_create()');
		info.push('------------------------------------');
		info.push(model_users.query_create());
		info.push('------------------------------------');
		return info;
	},
	2	: function () {
		var info = [];
		info.push('<b>ЗАПРОС УДАЛЕНИЯ ТАБЛИЦЫ</b>');
		info.push('model_users.query_drop()');
		info.push('------------------------------------');
		info.push(model_users.query_drop());
		info.push('------------------------------------');
		return info;
	},
	3	: function () {
		var info = [];
		info.push('<b>ЗАПРОС ВСЕХ СТРОК СО ВСЕМИ ПОЛЯМИ</b>');
		var data = {};
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).replaceTABS().replaceLN().replaceSPACES());
		info.push('model_users.query_select(data)');
		info.push('------------------------------------');
		info.push(model_users.query_select(data));
		info.push('------------------------------------');
		return info;
	},
	4	: function () {
		var info = [];
		info.push('<b>ЗАПРОС ВСЕХ СТРОК С ПЕРЕЧИСЛЕННЫМИ ПОЛЯМИ</b>');
		var data = {
			fields : ['user_id', 'user_name', 'user_family']
		};
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).replaceTABS().replaceLN().replaceSPACES());
		info.push('model_users.query_select(data)');
		info.push('------------------------------------');
		info.push(model_users.query_select(data));
		info.push('------------------------------------');
		return info;
	},
	5	: function () {
		var info = [];
		info.push('<b>ЗАПРОС ОДНОЙ СТРОКИ С ЗАДАННЫМ ID</b>');
		var data = {
			fields : [],
			where : {
				user_id : 1,
			},
			limit : 1
		};
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).replaceTABS().replaceLN().replaceSPACES());
		info.push('model_users.query_select(data)');
		info.push('------------------------------------');
		info.push(model_users.query_select(data));
		info.push('------------------------------------');
		return info;
	},
	6	: function () {
		var info = [];
		info.push('<b>ЗАПРОС СТРОК НА УСЛОВИЯХ WHERE И IN</b>');
		var data = {
			fields	: ['user_id', 'user_name', 'user_family'],
			where	: {
				user_family			: 'Иванов',
				'user_name !='		: 'Петр',
				'OR user_name !='	: 'Вася',
			},
			in		: {
				'user_id'		: [1,2,3],
				'user_profi'	: ['Сантехник', 'Электрик', 'Дворник']
			},
		};
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).replaceTABS().replaceLN().replaceSPACES());
		info.push('model_users.query_select(data)');
		info.push('------------------------------------');
		info.push(model_users.query_select(data));
		info.push('------------------------------------');
		return info;
	},
	7	: function () {
		var info = [];
		info.push('<b>ЗАПРОС СТРАНИЦЫ СТРОК СГРУППИРОВАННЫХ GROUP НА УСЛОВИЯХ LIKE С СОРТИРОВКОЙ</b>');
		var data = {
			fields 	: ['user_name', 'user_family'],
			group 	: ['user_name', 'user_family'],
			like 	: {
				user_family : 'Ива',
				user_name 	: 'etr%',
			},
			order   : {
				user_family : 'asc',
				user_age 	: 'desc'
			},
			limit	: 10,
			offset	: 5,
		};
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).replaceTABS().replaceLN().replaceSPACES());
		info.push('model_users.query_select(data)');
		info.push('------------------------------------');
		info.push(model_users.query_select(data));
		info.push('------------------------------------');
		return info;
	},
	8	: function () {
		var info = [];
		info.push('<b>ЗАПРОС ДОБАВЛЕНИЯ СТРОКИ</b>');
		var data = {
			data : {
				user_family 	: 'Иванов',
				user_name 		: 'Петр',
			}
		};
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).replaceTABS().replaceLN().replaceSPACES());
		info.push('model_users.query_insert(data)');
		info.push('------------------------------------');
		info.push(model_users.query_insert(data));
		info.push('------------------------------------');
		return info;
	},
	9	: function () {
		var info = [];
		info.push('<b>ЗАПРОС ДОБАВЛЕНИЯ ДВОИЧНЫХ ДАННЫХ ИЗ ФАЙЛА (РЕДКО ИСПОЛЬЗУЕТСЯ)</b>');
		var data = {
			data : {
				user_family 	: 'Иванов',
				user_name 		: 'Петр',
				user_passport  	: require('fs').readFileSync('./uploads/passport.jpg'),
			}
		};
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).replaceTABS().replaceLN().replaceSPACES());
		info.push('model_users.query_insert(data)');
		info.push('------------------------------------');
		info.push(model_users.query_insert(data));
		info.push('------------------------------------');
		return info;
	},
	10	: function () {
		var info = [];
		info.push('<b>ЗАПРОС ОБНОВЛЕНИЯ СТРОК НА УСЛОВИЯХ WHERE, IN, LIKE</b>');
		var data = {
			data : {
				user_family 	: 'Иванов',
				user_name 		: 'Петр',
			},
			where : {
				user_family		: 'Петров',
				user_name 		: 'Иван',
			},
			in : {
				user_id			: [1,2,3],
			},
			like 	: {
				user_family : 'Ива',
				user_name 	: 'etr%',
			},
		};
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).replaceTABS().replaceLN().replaceSPACES());
		info.push('model_users.query_update(data)');
		info.push('------------------------------------');
		info.push(model_users.query_update(data));
		info.push('------------------------------------');
		return info;
	},
	11	: function () {
		var info = [];
		info.push('<b>ЗАПРОС ОБНОВЛЕНИЯ ДВОИЧНЫХ ДАННЫХ ИЗ ФАЙЛА (РЕДКО ИСПОЛЬЗУЕТСЯ)</b>');
		var data = {
			data : {
				user_family 	: 'Иванов',
				user_name 		: 'Петр',
				user_passport  	: require('fs').readFileSync('./uploads/passport.jpg'),
			},
			in : {
				user_id			: [1,2,3],
			},
		};
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).replaceTABS().replaceLN().replaceSPACES());
		info.push('model_users.query_update(data)');
		info.push('------------------------------------');
		info.push(model_users.query_update(data));
		info.push('------------------------------------');
		return info;
	},
	12	: function () {
		var info = [];
		info.push('<b>ЗАПРОС ОБНОВЛЕНИЯ ПОЛЯ В ЗАВИСИМОСТИ ОТ ЗНАЧЕНИЯ В ДРУГОМ ПОЛЕ (РЕДКО ИСПОЛЬЗУЕТСЯ)</b>');
		var data = {
			data : {
				user_profi 		: {
					case : {
						user_code : {
							'A 01' 	: 'Инженер-электрик',
							'B 11 3': 'Слесарь-сантехник 3 категории',
							'A 02' 	: 'Инженер-конструктор',
							'С' 	: 'Разнорабочий',
						},
					},
				}
			},
			in : {
				user_id			: [1,2,3],
			},
		};
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).replaceTABS().replaceLN().replaceSPACES());
		info.push('model_users.query_update(data)');
		info.push('------------------------------------');
		info.push(model_users.query_update(data));
		info.push('------------------------------------');
		return info;
	},
	13	: function () {
		var info = [];
		info.push('<b>ЗАПРОС УДАЛЕНИЯ СТРОК</b>');
		var data = {
			where	: {
				user_family	: 'Иванов',
				'user_age >': 25
			}, 
			in		: {
				user_id 	: [1,2,3]
			},
		};
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).replaceTABS().replaceLN().replaceSPACES());
		info.push('model_users.query_delete(data)');
		info.push('------------------------------------');
		info.push(model_users.query_delete(data));
		info.push('------------------------------------');
		return info;
	},
};

var http = require('http');
//Формируем задачу
var app = function(req, res) {
	
	var url = req.url.split('/');
	
	//Удаляем все запросы кроме числового индекса (favicon.ico)
	if (url[1] && (url[1]*1).toString()!=url[1]) {
		return res.end(); //
	}

	//Индекс теста
	var index = url[1]*1;
	
	//Установим метку времени
	if (myConfig.data.isDebug) {
		console.log('\nПолучен запрос req.url', req.url);
		console.time('app');
	}

	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
	res.write('<style>.result {color:blue}</style>');
	var info = test[index]();
	info.push('');
	info.push('<a href="/">МЕНЮ</a>');
	res.end(info.join('<br/>'));
	if (myConfig.data.isDebug) console.timeEnd('app'); //Выводим общее время
};
//Создаем и запускаем сервер для задачи
var server = http.createServer(app);
server.listen(myConfig.data.port);
//Отображаем информацию о старте сервера
if (myConfig.data.isDebug) console.log('Server start on port ' + myConfig.data.port + ' ...');
