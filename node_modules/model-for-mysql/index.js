var Model = function (db) {
	//Наследуем active-record
	require('active-record-for-mysql').call(this);
	//Текущий объект
	var self = this;
	
	//Параметры базы данных
	this.db = {
		host 		: db.host || '',
		user 		: db.user || '',
		password 	: db.password || '',
		database 	: db.database || '',
	};
	//Последний запрос
	this.lastQuery = '';
	
	//Последняя ошибка
	this.lastErrorIndex		= 0;
	this.lastErrorCode 		= '';
	this.lastErrorText		= '';
	
	//Коллекция ошибок
	this.errors 		= {
		0 : '',
		1 : 'Ошибка подключения модуля mysql',
		2 : 'Ошибка открытия соединения',
		3 : 'Ошибка запроса к базе данных',
		4 : 'Ошибка закрытия соединения',
	};
	
	//Выполнение запроса
	this.bind = function (query, next) {
		//Сохраняем запрос
		this.lastQuery = query;
		//Очищаем ошибку
		this.lastErrorIndex		= 0;
		this.lastErrorCode 		= '';
		this.lastErrorText		= '';
		//Подключаем модуль mysql
		try {
			var mysql 	= require('mysql');
		} catch (e_require) {
			//Ошибка подключения модуля mysql
			self.lastErrorIndex		= 1;
			self.lastErrorCode 		= e_require.code;
			self.lastErrorText		= '';
			return next();
		};
		//Создание соединения
		var connection = mysql.createConnection (this.db);
		//Открытие соединения
		connection.connect(function (e_connect) {
			if (e_connect) {
				//Ошибка открытия соединения
				self.lastErrorIndex		= 2;
				self.lastErrorCode 		= e_connect.code;
				self.lastErrorText		= e_connect.sqlMessage;
				return next();
			};
			//Отправка запроса в БД
			connection.query(query, self.query.flag_binary_data ? self.query.binary_data : {}, function (e_query, result) {
				//Закрытие соединения	
				connection.end (function(e_end) {
					if (e_query) {
						//Ошибка запроса к базе данных
						self.lastErrorIndex		= 3;
						self.lastErrorCode 		= e_query.code;
						self.lastErrorText		= e_query.sqlMessage;
						return next();
					}
					if (e_end) {
						//Ошибка закрытия соединения
						self.lastErrorIndex		= 4;
						self.lastErrorCode 		= e_end.code;
						self.lastErrorText		= e_end.sqlMessage;
						return next();
					};
					//Возврат результата
					next (result);
				});
			});
		});
	};

//==============БАЗОВЫЕ МЕТОДЫ=================

/*
СОЗДАНИЕ ТАБЛИЦЫ
Пример:
mdl_users.create(function(success) {})
Возвращает флаг успешности
*/
	this.create = function (next) {
		var query = this.query_create();
		this.bind(query, function (result) {
			if (self.lastErrorIndex) {
				console.error(['ERROR', self.errors[self.lastErrorIndex], self.lastErrorCode, self.lastErrorText].join(': '));
				return next(0);
			}
			//Формируем результат
			next(result && !result.warningCount ? 1 : 0);
		});
	};

/*
УДАЛЕНИЕ ТАБЛИЦЫ
Пример:
mdl_users.drop(function(success) {});
Возвращает флаг успешности
*/
	this.drop = function(next) {
		var query = this.query_drop();
		this.bind(query, function (result) {
			if (self.lastErrorIndex) {
				console.error(['ERROR', self.errors[self.lastErrorIndex], self.lastErrorCode, self.lastErrorText].join(': '));
				return next(0);
			}
			//Формируем результат
			next(result && !result.warningCount ? 1 : 0);
		});
	};

/*	
ДОБАВЛЕНИЕ СТРОКИ
Пример: 
var data = {
	data 	: {
		user_name		: 'Александр',
		user_family		: 'Иванов',
		user_age		: 40,
		//Данные бинарных файлов
		user_passport  	: require('fs').readFileSync(filename1),
		user_photo  	: require('fs').readFileSync(filename2),
	}
};
mdl_users.insert(data, function (id) {});
Возвращает ID строки или 0 в случае неудачи
*/	
	this.insert = function (params, next) {
		var query = this.query_insert(params);
		this.bind(query, function (result) {
			if (self.lastErrorIndex) {
				console.error(['ERROR', self.errors[self.lastErrorIndex], self.lastErrorCode, self.lastErrorText].join(': '));
				return next(0);
			}
			//Формируем результат
			next ((result && result.insertId) ? (result.insertId) : (0));
		});
	};

/*
УДАЛЕНИЕ СТРОК
Пример:
var data = {
	where	: {
		user_family	: 'Иванов',
		'user_age >'	: 25
	}, 
	in		: {
		user_id : [1,2,3]
	},
};
mdl_users.delete(data, function (count_rows) {})
Возвращает число удаленных строк или 0 в случае неудачи
*/	
	this.delete = function (params, next) {
		var query = this.query_delete(params);
		this.bind(query, function (result) {
			if (self.lastErrorIndex) {
				console.error(['ERROR', self.errors[self.lastErrorIndex], self.lastErrorCode, self.lastErrorText].join(': '));
				return next(0);
			}
			//Формируем результат
			next ((result && result.affectedRows) ? (result.affectedRows) : (0));
		});
	};
	
/*	
ОБНОВЛЕНИЕ СТРОК
Пример 1: на условиях WHERE и IN
var data = {
	in		: {
		user_age 		: [40,45,50]
	}, 
	like 	: {
		user_family		: '%Ив'
	},
	where	: {
		user_status		: 'Новичок',
	}, 
	data : {
		user_status		: 'Старина'
	},
};
mdl_users.update(data, function (count_rows) {});
Возвращает число обновленных строк или 0 в случае неудачи

Пример2: Добавление бинарных данных, например изображения (редко используется)
var data = {
	where	: {
		user_id	: 20,
	}, 
	data 	: {
		//Данные бинарного файла
		user_photo  	: require('fs').readFileSync(filename),
	},
};
mdl_users.update(data, function (count_rows) {});
Возвращает число обновленных строк или 0 в случае неудачи

Пример3: Заполнение поля в зависимости от значения в другом поле (редко используется)
var data = {
	where	: {
		user_family			: 'Иванов',
		'user_status !='	: 'Шеф',
	}, 
	in		: {
		user_age 		: [40,45,50]
	}, 
	data : {
		//Заполнение поля при условии содержисого другого поля
		user_profi 		: {
			case : {
				user_code : {
					'A 01' 	: 'Инженер-электрик',
					'B 11 3': 'Слесарь-сантехник 3 категории',
					'A 02' 	: 'Инженер-конструктор',
					'С' 	: 'Разнорабочий',
				}
			}
		}
	},
};
mdl_users.update(data, function (count_rows) {});
Возвращает число обновленных строк или 0 в случае неудачи
*/

	this.update = function (params, next) {
		var query = this.query_update(params);
		this.bind(query, function (result) {
			if (self.lastErrorIndex) {
				console.error(['ERROR', self.errors[self.lastErrorIndex], self.lastErrorCode, self.lastErrorText].join(': '));
				return next(0);
			}
			//Формируем результат
			next ((result && result.affectedRows) ? (result.affectedRows) : (0));
		});
	};

/*
ПОЛУЧЕНИЕ СТРОК	
//Пример:
var data = {
	fields 	: ['user_id', 'user_name', 'user_family'],  //[] - все поля строки
	join 	: {
		'cities' 		: 'users.user_city_id = cities.city_id',
		'statuses' 		: 'users.user_status_id = statuses.status_id',
	},
	where	: {
		status_name	: 'Рабочий',
		'user_age >': 45
	}, 
	like	: {
		user_family	: '%Ива',
		user_about	: '%женат%'
	}, 
	in		: {
		user_company_id : [1,2,3]
	}, 
	group 	: ['user_family', 'user_name'],
	order   : {
		user_family : 'asc',
		user_age 	: 'desc'
	},
	limit	: 10,
	offset	: 5,
};
mdl_users.select(data, function (rows) {});
Возвращает массив строк таблицы или [] в случае неудачи
*/
	this.select = function (params, next) {
		var query = this.query_select(params);
		this.bind(query, function (result) {
			if (self.lastErrorIndex) {
				console.error(['ERROR', self.errors[self.lastErrorIndex], self.lastErrorCode, self.lastErrorText].join(': '));
				return next([]);
			}
			//Формируем результат
			next (result || []);
		});
	};
	
//==============ПРОИЗВОДНЫЕ МЕТОДЫ=================

/*
ФОРМИРУЕТ/ВОЗВРАЩАЕТ СТРОКУ ДЛЯ ФОРМЫ ДОБАВЛЕНИЯ/ОБНОВЛЕНИЯ
Возвращает по ID строку в виде объекта или {<idkey>:id}
Пример 
mdl_users.get(0, function(row) {})
=> {user_id:0}
*/
	//Считывает из таблицы строку (формирует для id=0 пустую строку)
	this.get = function (id, next) {
		var data = {where:{}};
		data.where[self.idkey] = id;
		data.limit = 1;
		self.select(data, function (rows) {
			next ((rows[0]) ? (rows[0]) : (data.where));
		});
	};

/*
ДОБАВЛЯЕТ/ОБНОВЛЯЕТ СТРОКУ ИЗ ФОРМЫ ДОБАВЛЕНИЯ/ОБНОВЛЕНИЯ
Обновляет в таблице(id>0) или добавляет в таблицу(id=0) строку без дополнительных условий
Пример
var data = {
	user_name 	: 'Иван'
	user_family : 'Иванов'
}

mdl_users.set(0, data, function(id) {});
Добавляет новую строку и возвращает ID

mdl_users.set(1, data, function(success) {});
//Обновляет существующую строку и возвращает флаг успешности
*/	
	this.set = function (id, data, next) {
		if (Object.keys(data).length==0) return next(0);
		var self = this;
		var data = {
			data 	: data,
			where 	: {}
		};
		if (id) {
			data.where[self.idkey] = id;
			self.update (data, next);
		} else {
			self.insert (data, next);
		};
	};
	
/*
ВОЗВРАЩАЕТ ОДНУ СТРОКУ С ЗАДАННЫМИ ПОЛЯМИ ПО ID
Пример
mdl_users.get_row_for_id(10, ['user_name', 'user_family'], function(row) {})
Возвращает строку или null
*/	
	this.get_row_for_id = function (id, fields, next) {
		var data = {
			fields 	: fields,
			where 	: {},
			limit	: 1,
		};
		data.where[this.idkey] = id;
		this.select(data, function (rows) {
			next(rows[0]);
		})
	};
	
/*
УДАЛЯЕТ ОДНУ СТРОКУ ПО ID
Пример
mdl_users.delete_row_for_id(10, function(success) {})
Возвращает флаг успеха (true или false)
*/	
	this.delete_row_for_id = function (id, next) {
		var data = {
			where 	: {},
		};
		data.where[this.idkey] = id;
		this.delete (data, function (count_rows) {
			next (count_rows)
		});
	};

/*
ВОЗВРАЩАЕТ ЗАДАННУЮ СТРАНИЦУ СТРОК
Задается номер страницы (с нуля) и число строк на страницу
Пример
var data = {
	fields : ['user_family', 'user_name'],
	where : {
		'user_age >' : 30
	}
};
mdl_users.get_page_rows(0, 10, data, function(total, rows) {})
Возвращает общее число найденных строк и массив строк требуемой страницы
*/
	this.get_page_rows = function (page, per_page, data, next) {
		var _data = {};
		_data.fields 	= [this.idkey];
		if (data.join)	_data.join	= data.join;
		if (data.where) _data.where = data.where;
		if (data.in) 	_data.in	= data_in;
		if (data.like)	_data.like	= data.like;
		if (data.group)	_data.group	= data.group;
		_data.limit 	= 0;
		_data.offset 	= 0;
		this.select(_data, function (all_rows) {
			_data.fields = data.fields;
			_data.limit  = per_page;
			_data.offset = page * per_page;
			if (_data.offset>all_rows.length) return next(all_rows.length, []);
			self.select(_data, function (page_rows) {
				next(all_rows.length, page_rows);
			});
		});
	};

/*
ВОЗВРАЩАЕТ ОБЩЕЕ ЧИСЛО СТРОК НА УСЛОВИЯХ
Пример
var data = {
	where : {
		'user_age >' : 50
	},
	like : {
		user_family : 'ман%'
	},
}
mdl_user.get_count_rows(data, function (count_rows) {})
Возвращает число строк удовлетворяющих условиям
*/
	this.get_count_rows = function (data, next) {
		var _data = {};
		_data.fields 	= [this.idkey];
		if (data.join)	_data.join	= data.join;
		if (data.where) _data.where = data.where;
		if (data.in) 	_data.in	= data_in;
		if (data.like)	_data.like	= data.like;
		if (data.group)	_data.group	= data.group;
		_data.limit 	= 0;
		_data.offset 	= 0;
		this.select(_data, function (rows) {
			next(rows.length);
		});
	};
	
};
module.exports = Model;
