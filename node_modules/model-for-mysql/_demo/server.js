//Устанавливаем конфигурацию
myConfig = {};
//Конфигурация пользователя (глобальная)
myConfig.data = {
	port		: 2020,
	isDebug		: true,		//Сообшения сервера
};
//Конфигурация базы данных 
myConfig.db = {
	host 			: 'localhost',
	user 			: 'user',	
	password 		: 'password',
	database 		: 'test',	
};

//Вспомогательная функция
String.prototype.myFormat = function () {
	var str = '' + this;
	//TABS
	str = str.replace(/((?!\r\n)[\s\S]+?)($|(?:\r\n))/g, function (s, STR, CRLN, POS) {
		return STR.replace(/([^\t]*?)\t/g, function (s, STR, POS) {
			return STR + (new Array(4 - (STR.length + 4 ) % 4 + 1)).join(' ');
		}) + CRLN;
	});
	//LN
	str = str.replace(/\n/g, '<br/>');
	//SPACES
	return str.replace(/ +/g, function (s) {
		return (s.length==1) ? (' ') : ((new Array(s.length)).join('&nbsp;') + ' ');
	});
};

var mdl_users = new(require('./models/mdl_users'));
var mdl_cities = new(require('./models/mdl_cities'));

//Тесты
var test = {
	success : function(rows) {
	},
	error	: function (model) {
		return '<div class="error">' + ['ERROR', model.errors[model.lastErrorIndex], model.lastErrorCode, model.lastErrorText].join(': ') + '</div>';
	},
	//Меню
	0	: function (next) {
		var info = [];
		info.push('<b>Выберите тест или укажите его номер, например "/10"</b>');
		info.push('');
		info.push('1. <a href="/1">Установка первоначальных таблиц</a>');
		info.push('2. <a href="/2">Добавление пользователя с предварительной проверкой существования</a>');
		info.push('3. <a href="/3">Список пользователей с присоединенными городами и с сортировкой по фамилии</a>');
		info.push('4. <a href="/4">Список пользователей на условиях LIKE с сортировкой по фамилии и имени</a>');
		info.push('5. <a href="/5">Список пользователей на условиях IN</a>');
		info.push('6. <a href="/6">Список уникальных отсортированных имен с использованием GROUP</a>');
		info.push('7. <a href="/7">Список отсортированных по возрасту пользователей старше 25 лет за исключением 30 лет</a>');
		info.push('8. <a href="/8">Обновление пользователя - добавление изображения</a>');
		info.push('9. <a href="/9">Получение и просмотр изображения пользователя</a>');
		info.push('10. <a href="/10">Удаление пользователей на условиях WHERE</a>');
		info.push('');
		next(info);
	},
	//Установка первоначальных таблиц
	1	: function (next) {
		var info = [];
		//Удаление таблицы пользователей
		info.push('<b>УДАЛЕНИЕ ТАБЛИЦЫ ' + mdl_users.table + '</b>');
		info.push('mdl_users.drop(function (success){})');
		mdl_users.drop(function (success) {
			if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
			info.push('<div class="success">Таблица ' + mdl_users.table + ((success) ? (' успешно удалена') : (' уже удалена!')) + '</div>');
			info.push('');
			//Удаление таблицы городов
			info.push('<b>УДАЛЕНИЕ ТАБЛИЦЫ ' + mdl_cities.table + '</b>');
			info.push('mdl_cities.drop(function (success){})');
			mdl_cities.drop(function (success) {
				if (mdl_cities.lastErrorIndex) info.push(test.error(mdl_cities));
				info.push('<div class="success">Таблица ' + mdl_cities.table + ((success) ? (' успешно удалена') : (' уже удалена!')) + '</div>');
				info.push('');
				//Создание таблицы пользователей
				info.push('<b>СОЗДАНИЕ ТАБЛИЦЫ ' + mdl_users.table + '</b>');
				info.push('mdl_users.create(function (success){})');
				mdl_users.create(function(success) {
					if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
					info.push('<div class="success">Таблица ' + mdl_users.table + ((success) ? (' успешно создана') : (' уже существует!')) + '</div>');
					info.push('');
					//Создание тмблицы городов
					info.push('<b>СОЗДАНИЕ ТАБЛИЦЫ ' + mdl_cities.table + '</b>');
					info.push('mdl_cities.create(function (success){})');
					mdl_cities.create(function(success) {
						if (mdl_cities.lastErrorIndex) info.push(test.error(mdl_cities));
						info.push('<div class="success">Таблица ' + mdl_cities.table + ((success) ? (' успешно создана') : (' уже существует!')) + '</div>');
						info.push('');
						//Добавление пользователя
						var data = {
							data : {
								user_family 	: 'Иванов',
								user_name		: 'Иван',
								user_city_id 	: 1,
								user_age 		: 25,
							}
						};
						info.push('<b>ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ:</b>');
						info.push('var data = ');
						info.push(JSON.stringify(data, null, 4).myFormat());
						info.push('mdl_users.insert(data, function(id) {})');
						mdl_users.insert(data, function(id) {
							if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
							info.push('<div class="success">Добавление пользователя в таблицу ' + mdl_users.table + ((id) ? (' успешно выполнено. ID=' + id) : (' не выполнено!')) + '</div>');
							info.push('');
							//Добавление пользователя
							var data = {
								data : {
									user_family 	: 'Петров',
									user_name		: 'Петр',
									user_city_id 	: 2,
									user_age 		: 30,
								}
							};
							info.push('<b>ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ:</b>');
							info.push('var data = ');
							info.push(JSON.stringify(data, null, 4).myFormat());
							info.push('mdl_users.insert(data, function(id) {})');
							mdl_users.insert(data, function(id) {
								if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
								info.push('<div class="success">Добавление пользователя в таблицу ' + mdl_users.table + ((id) ? (' успешно выполнено. ID=' + id) : (' не выполнено!')) + '</div>');
								info.push('');
								//Добавление города
								var data = {
									data : {
										city_name 	: 'Москва',
									}
								};
								info.push('<b>ДОБАВЛЕНИЕ ГОРОДА:</b>');
								info.push('var data = ');
								info.push(JSON.stringify(data, null, 4).myFormat());
								info.push('mdl_cities.insert(data, function(id) {})');
								mdl_cities.insert(data, function(id) {
									if (mdl_cities.lastErrorIndex) info.push(test.error(mdl_cities));
									info.push('<div class="success">Добавление города в таблицу ' + mdl_cities.table + ((id) ? (' успешно выполнено. ID=' + id) : (' не выполнено!')) + '</div>');
									info.push('');
									//Добавление города
									var data = {
										data : {
											city_name 	: 'Санкт-Петербург',
										}
									};
									info.push('<b>ДОБАВЛЕНИЕ ГОРОДА:</b>');
									info.push('var data = ');
									info.push(JSON.stringify(data, null, 4).myFormat());
									info.push('mdl_cities.insert(data, function(id) {})');
									mdl_cities.insert(data, function(id) {
										if (mdl_cities.lastErrorIndex) info.push(test.error(mdl_cities));
										info.push('<div class="success">Добавление города в таблицу ' + mdl_cities.table + ((id) ? (' успешно выполнено. ID=' + id) : (' не выполнено!')) + '</div>');
										info.push('');
										
										info.push('<b>ПОЛУЧЕНИЕ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ:</b>');
										//Вывод списка пользователей
										var data = {
											fields 	: [],
										};
										info.push('var data = ');
										info.push(JSON.stringify(data, null, 4).myFormat());
										info.push('mdl_users.select(data, function(rows) {})');
										mdl_users.select(data, function (rows) {
											if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
											info.push('<div class="success">rows =<br/>' + JSON.stringify(rows, null, 4).myFormat() + '</div>');
											info.push('');
											
											info.push('<b>ПОЛУЧЕНИЕ ВСЕХ ГОРОДОВ:</b>');
											var data = {
												fields 	: [],
											};
											info.push('var data = ');
											info.push(JSON.stringify(data, null, 4).myFormat());
											info.push('mdl_cities.select(data, function(rows) {})');
											mdl_cities.select(data, function (rows) {
												if (mdl_cities.lastErrorIndex) info.push(test.error(mdl_cities));
												info.push('<div class="success">rows =<br/>' + JSON.stringify(rows, null, 4).myFormat() + '</div>');
												next(info);
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	},
	//Добавление пользователя с предварительной проверкой существования
	2	: function (next) {
		var info = [];
		var data = {
			where : {
				user_family : 'Васечкин'
			},
			limit : 1
		};
		info.push('<b>ПРОВЕРКА СУЩЕСТВОВАНИЯ ПОЛЬЗОВАТЕЛЯ:</b>');
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).myFormat());
		info.push('mdl_users.select(data, function(rows) {})');
		mdl_users.select(data, function(rows) {
			if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
			info.push('<div class="success">rows =<br/>' + JSON.stringify(rows, null, 4).myFormat() + '</div>');
			if (rows[0]) {
				info.push('<div class="success">Пользователь уже существует в таблице</div>');
				return next(info);
			} 
			var data = {
				data : {
					user_family  : 'Васечкин',
					user_name	 : 'Иван',
					user_city_id : 1,
					user_age 	 : 35,
				}
			};
			info.push('<b>ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ:</b>');
			info.push('var data = ');
			info.push(JSON.stringify(data, null, 4).myFormat());
			info.push('mdl_users.insert(data, function(id) {})');
			mdl_users.insert(data, function (id) {
				if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
				info.push('<div class="success">Добавление пользователя Васечкин в таблицу ' + mdl_users.table + ((id) ? (' успешно выполнено. ID=' + id) : (' не выполнено!')) + '</div>');
				var data = {
					fields 	: ['user_id', 'user_family', 'user_name', 'city_name'],
					join 	: {
						cities : 'users.user_city_id = cities.city_id'
					}
				};
				info.push('<b>СПИСОК ПОЛЬЗОВАТЕЛЕЙ С ПРИСОЕДИНЕННЫМИ ГОРОДАМИ:</b>');
				info.push('var data = ');
				info.push(JSON.stringify(data, null, 4).myFormat());
				info.push('mdl_users.select(data, function(rows) {})');
				mdl_users.select({}, function (rows) {
					if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
					info.push('<div class="success">rows =<br/>' + JSON.stringify(rows, null, 4).myFormat() + '</div>');
					next(info);
				});
			});
		})
	},
	//Список пользователей с присоединенными городами и с сортировкой по фамилии
	3	: function (next) {
		var info = [];
		var data = {
			fields 	: [],
			join 	: {
				cities : 'users.user_city_id = cities.city_id'
			},
			order : {
				user_family : 'asc'
			}
		};
		info.push('<b>СПИСОК ПОЛЬЗОВАТЕЛЕЙ С ПРИСОЕДИНЕННЫМИ ГОРОДАМИ:</b>');
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).myFormat());
		info.push('mdl_users.select(data, function(rows) {})');
		mdl_users.select(data, function (rows) {
			if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
			info.push('<div class="success">rows =<br/>' + JSON.stringify(rows, null, 4).myFormat() + '</div>');
			next(info);
		});
	},
	//Список пользователей на условиях LIKE с сортировкой по фамилии и имени
	4	: function (next) {
		var info = [];
		var data = {
			fields 	: [],
			like	: {
				user_family : 'ва'
			},
			order : {
				user_family : 'asc',
				user_name 	: 'asc',
			}
		};
		info.push('<b>СПИСОК ПОЛЬЗОВАТЕЛЕЙ С ПОХОЖИМ СОЧЕТАНИЕМ БУКВ В ФАМИЛИИ:</b>');
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).myFormat());
		info.push('mdl_users.select(data, function(rows){})');
		mdl_users.select(data, function (rows) {
			if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
			info.push('<div class="success">rows =<br/>' + JSON.stringify(rows, null, 4).myFormat() + '</div>');
			next(info);
		});
	},
	//Список пользователей на условиях IN
	5	: function (next) {
		var info = [];
		var data = {
			fields 	: [],
			in	: {
				user_id : [1,2,3]
			},
			order : {
				user_id : 'asc'
			}
		};
		info.push('<b>СПИСОК ПОЛЬЗОВАТЕЛЕЙ С ID ИЗ МАССИВА:</b>');
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).myFormat());
		info.push('mdl_users.select(data, function(rows) {})');
		mdl_users.select(data, function (rows) {
			if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
			info.push('<div class="success">rows =<br/>' + JSON.stringify(rows, null, 4).myFormat() + '</div>');
			next(info);
		});
	},
	//Список уникальных отсортированных имен с использованием GROUP
	6	: function (next) {
		var info = [];
		var data = {
			fields 	: ['user_name'],
			group	: ['user_name'],
			order : {
				user_name : 'asc'
			}
		};
		info.push('<b>СПИСОК УНИКАЛЬНЫХ ИМЕН:</b>');
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).myFormat());
		info.push('mdl_users.select(data, function(rows) {})');
		mdl_users.select(data, function (rows) {
			if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
			info.push('<div class="success">rows =<br/>' + JSON.stringify(rows, null, 4).myFormat() + '</div>');
			next(info);
		});
	},
	//Список отсортированных по возрасту пользователей старше 25 лет за исключением 30 лет
	7	: function (next) {
		var info = [];
		var data = {
			fields 	: [],
			where 	: {
				'user_age >'  : 25,
				'user_age !=' : 30,
			},
			order : {
				user_age : 'desc'
			}
		};
		info.push('<b>СПИСОК ПОЛЬЗОВАТЕЛЕЙ СТАРШЕ 25 ЛЕТ:</b>');
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).myFormat());
		info.push('mdl_users.select(data, function(rows) {})');
		mdl_users.select(data, function (rows) {
			if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
			info.push('<div class="success">rows =<br/>' + JSON.stringify(rows, null, 4).myFormat() + '</div>');
			next(info);
		});
	},
	//Обновление пользователя - добавление изображения
	8	: function (next) {
		var info = [];
		var data = {
			where : {
				user_id : 1
			},
			data : {
				user_image : require('fs').readFileSync('./uploads/passport.jpg'),
			}
		};
		info.push('<b>ОБНОВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ. ДОБАВЛЕНИЕ ИЗОБРАЖЕНИЯ</b>');
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).myFormat());
		info.push('mdl_users.update(data, function (count_rows) {})');
		mdl_users.update(data, function (count_rows) {
			if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
			info.push('<div class="success">Обновление пользователя в таблице ' + mdl_users.table + ((count_rows>0) ? (' успешно выполнено. Обновлено строк -' + count_rows) : (' не выполнено!')) + '</div>');
			next(info);
		});
	},
	//Получение и просмотр изображения пользователя
	9	: function (next) {
		var info = [];
		var data = {
			fields : ['user_image'],
			where 	: {
				user_id : 1
			},
			limit : 1
		}
		info.push('<b>ПРОСМОТР ИЗОБРАЖЕНИЯ ПОЛЬЗОВАТЕЛЯ</b>');
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).myFormat());
		info.push('mdl_users.select(data, function(rows) {})');
		mdl_users.select(data, function(rows) {
			if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
			info.push('<div class="success">rows =<br/>' + JSON.stringify(rows, null, 4).myFormat() + '</div>');
			if (!rows[0] || !rows[0]['user_image']) {
				info.push('<div class="error">У пользователя нет изображения</div>');
				return next(info);
			}
			var image_src = 'data:' + 'image/jpeg' + ';base64,' + Buffer.from(rows[0]['user_image']).toString('base64');
			info.push('<img src="' + image_src + '" width="50%" height="50%"/>');
			next(info);
		})
	},
	//Удаление пользователей на условиях WHERE
	10 	: function (next) {
		var info = [];
		var data = {
			where : {
				user_family : 'Васечкин'
			},
		};
		info.push('<b>УДАЛЯЕМ ПОЛЬЗОВАТЕЛЯ:</b>');
		info.push('var data = ');
		info.push(JSON.stringify(data, null, 4).myFormat());
		info.push('mdl_users.delete(data, function(count_rows) {})');
		mdl_users.delete(data, function (count_rows) {
			if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
			info.push('<div class="success">Удаление пользователей из таблицы ' + mdl_users.table + ((count_rows) ? (' успешно выполнено. Удалено строк - ' + count_rows) : (' не выполнено!')) + '</div>');
			info.push('');
			var data = {
				fields 	: ['user_id', 'user_family', 'user_name', 'city_name'],
				join 	: {
					cities : 'users.user_city_id = cities.city_id'
				}
			};
			info.push('<b>СЧИТЫВАЕМ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ C ПРИСОЕДИНИЕМ ГОРОДОВ:</b>');
			info.push('var data =');
			info.push(JSON.stringify(data, null, 4).myFormat());
			info.push('mdl_users.select(data, function(rows) {})');
			mdl_users.select({}, function (rows) {
				if (mdl_users.lastErrorIndex) info.push(test.error(mdl_users));
				info.push('<div class="success">rows =<br/>' + JSON.stringify(rows, null, 4).myFormat() + '</div>');
				next(info);
			});
		})
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
	res.write('<style>.success {color:blue} .error {color:red}</style>');
	test[index](function(info) {
		info.push('');
		info.push('<a href="/">МЕНЮ</a>');
		res.end(info.join('<br/>'));
		if (myConfig.data.isDebug) console.timeEnd('app'); //Выводим общее время
	});
};
//Создаем и запускаем сервер для задачи
var server = http.createServer(app);
server.listen(myConfig.data.port);
//Отображаем информацию о старте сервера
if (myConfig.data.isDebug) console.log('Server start on port ' + myConfig.data.port + ' ...');
