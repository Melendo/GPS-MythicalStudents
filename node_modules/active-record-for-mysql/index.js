var ActiveRecord = function (config) {
	//Текущий объект
	var self = this;
	
	config = config || {};
	this.table 		= config.table || '';		//Название таблицы
	this.idkey 		= config.idkey || '';		//Ключевое поле
	this.table_nick 	= config.table_nick || '';	//Ник таблицы
	this.engine		= config.engine || 'InnoDB';	//Движок
	this.charset		= config.charset || 'utf8';	//Кодироква
	this.fields 		= config.fields	 || [];		//Структура полей таблицы

	this.query = {
		binary_data : {},
		flag_binary_data : false,
		// Формат data: { field_name: field_value }
		SET : function (data) {
			this.flag_binary_data = false;
			this.binary_data = {};
			var items = [];
			for (var key in data) {
				if (data[key] instanceof Buffer) {
					//Двоичные данные
					this.binary_data[key] = data[key];
					this.flag_binary_data = true;
				} else if (data[key] instanceof Object) {
					//Множественное обноаление
					var field_update = key;
					for (var key1 in data[key]) {
						if (key1.toUpperCase()=='CASE') {
							var field_where = Object.keys(data[key][key1])[0];
							var cases = data[key][key1][field_where];
							var fields = [];
							for (var key2 in cases) {
								fields.push("WHEN '" + key2.toString().trim() + "' THEN '" + cases[key2].toString().trim() + "'");
							}
							var item = "`" + key.toString().trim() +  "` = CASE `" + field_where + "` " + fields.join(' ') + " ELSE `" + key.toString().trim() + "` END";
							items.push(item);
						};
					};
				} else {
					items.push('`' + key.toString().trim() + '`' + '='  + "'" + data[key] + "'");
				}
			};
			if (this.flag_binary_data) items.push('?');
			return items.join(', ');
		},
		// Формат data: { "('OR'|'AND'=default) field_name ('<'|'<='|'!='|'>='|'>'|'='default)" : value }
		WHERE : function (data) {
			var items = [];
			for (var key in data) {
				var key_array = key.toString().trim().replace(/ +/g, ' ').split(' ');
				//Корректировка
				if (key_array.length==1) {
					key_array = ['AND', key_array[0], '='];
				} else if (key_array.length==2) {
					var word = key_array[0].toUpperCase();
					if (['AND', 'OR'].indexOf(word)!=-1) {
						key_array = [word, key_array[1], '='];
					} else {
						key_array = ['AND', key_array[0], key_array[1]];
					};
				} else if (key_array.length==3) {
					key_array[0] = key_array[0].toUpperCase();
				};
				items.push(((items.length==0) ? ('') : (key_array[0] + ' '))  + '`' + key_array[1] + '`' + key_array[2]  + "'" + data[key] + "'");
			};
			return items.join(' ');
		},
		// Формат data: [field_name1, field_name2]
		FIELDS : function (data) {
			var items = [];
			for (var key in data) {
				items.push('`' + data[key].toString().trim() + '`');
			};
			return items.join(', ');
		},
		// Формат data: {"('LEFT'|'RIGHT'|'OUTER'|'INNER'|''=default) table_name" : link}
		JOIN : function (data) { 
			var items = [];
			for (var key in data) {
				var key_array = key.toString().trim().replace(/ +/g, ' ').split(' ');
				//Корректировка
				if (key_array.length==1) {
					key_array = ['', key_array[0]];
				} else if (key_array.length==2) {
					key_array = [key_array[0].toUpperCase(), key_array[1]];
					if (['LEFT', 'RIGHT', 'OUTER', 'INNER'].indexOf(key_array[0])==-1) {
						key_array[0] = '';
					};
				};
				
				items.push(key_array[0] + ((key_array[0]=='') ? ('') : (' ')) + 'JOIN ' + key_array[1] + ' ON ' + data[key].toString().replace(/ +/g,''));
			}
			return items.join(' ');
		},
		// Формат data: { "('OR'|'AND'=default) field_name" : "(%value|value%|%value%=default)" }
		LIKE : function (data) {
			var items = [];
			for (var key in data) {
				var key_array = key.toString().trim().replace(/ +/g, ' ').split(' ');
				//Корректировка
				if (key_array.length==1) {
					key_array = ['AND', key_array[0]];
				} else if (key_array.length==2) {
					key_array = [key_array[0].toUpperCase(), key_array[1]];
					if (['AND', 'OR'].indexOf(key_array[0])==-1) {
						key_array[0] = 'AND';
					};
				};
				var value = data[key].toString().trim();
				var both_char = (value.indexOf('%')!=0 && value.lastIndexOf('%')!=(value.length-1)) ? ('%') : ('');
				items.push(((items.length==0) ? ('') : (key_array[0] + ' '))  + '`' + key_array[1].toString().trim() + '`' + ' LIKE ' + "'" + both_char + data[key].toString().trim() + both_char + "'");
			};
			return items.join(' ');
		},
		// Формат data: { "('OR'|'AND'=default) field_name" : "[value1, value2]" }
		IN : function (data) {
			var items = [];
			for (var key in data) {
				var key_array = key.toString().trim().replace(/ +/g, ' ').split(' ');
				//Корректировка
				if (key_array.length==1) {
					key_array = ['AND', key_array[0], 'IN'];
				} else if (key_array.length==2) {
					var word = key_array[0].toUpperCase();
					if (key_array[1]=='!=') {
						key_array = [word, key_array[0], 'NOT IN'];
					} else {
						if (['AND', 'OR'].indexOf(word)==-1) {
							key_array = ['AND', key_array[0], key_array[1]];
						} else {
							key_array = [word, key_array[1], 'IN'];
						};
					}
				} else if (key_array.length==3) {
					key_array[0] = key_array[0].toUpperCase();
					key_array[2] = (key_array[2]=='!=') ? ('NOT IN') : ('IN');
				};
				var values = [];
				for (var i in data[key]) {
					values.push("'" + data[key][i] + "'");
				};
				
				items.push(((items.length==0) ? ('') : (key_array[0] + ' '))  + '`' + key_array[1] + '` ' + key_array[2] + ' (' + ((values.length==0) ? ('0') : (values.join(', '))) + ')');
			};
			return (items.length>0) ? (items.join(' ')) : ('');
		},
		// Формат data: { "field_name" : "asc|desc" }
		ORDER : function (data) {
			//console.log(data);
			var items = [];
			for (var key in data) {
				var order = data[key].toString().trim().toUpperCase();
				if (['ASC', 'DESC'].indexOf(order)==-1) {
					order = 'ASC';
				};
				items.push('`' + key.toString().trim() + '`' + ' ' + order);
			};
			return items.join(', ');
		},
		// Формат data: [field_name1, field_name2]
		GROUP : function (data) {
			var items = [];
			for (var key in data) {
				items.push(data[key].toString().trim());
			};
			return items.join(', ');
		},
		// Формат data: [field_name1, field_name2]
		SUM : function (data) {
			var items = [];
			for (var key in data) {
				items.push('SUM(`' + data[key] + '`)' + ' AS ' + "'" + data[key] + "'");
			};
			return items.join(', ');
		},
		
	};
	
	//Пример заполнения полей
/*
	this.table 	= 'users',
	this.idkey	= 'user_id',
	this.engine	= 'InnoDB',
	this.charset	= 'utf8',
	this.fields	=
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
	];
*/	

/*	
//Пример создания таблицы
	var query = this.query_create();
*/
	this.query_create = function () {
		var items = [];
		items.push('CREATE TABLE IF NOT EXISTS');
		items.push('`' + this.table + '`');
		var fields = [];
		var auto_increment = 0;
		for (var i in this.fields) {
			if (this.fields[i].auto) {
				auto_increment = this.fields[i].auto;
			}
			fields.push('`' + this.fields[i].field + '` ' + this.fields[i].type + ((this.fields[i].auto) ? (' AUTO_INCREMENT') : ('')));
		};
		fields.push('PRIMARY KEY (`' + this.idkey + '`)');
		items.push('(' + fields.join(',') + ')');
		items.push('ENGINE=' + this.engine);
		if (auto_increment) {
			items.push('AUTO_INCREMENT=' + auto_increment);
		};
		items.push('DEFAULT CHARSET=' + this.charset);
		return items.join(' ') + ';';
	};

/*	
//Пример удаления таблицы
	var query = this.query_drop();
*/
	this.query_drop = function () {
		return 'DROP TABLE IF EXISTS `' + this.table + '`;';
	};
	
//Добавление строки в таблицу. 
//Пример: 
/*
	var params = {
		data 	: {
			user_name	: 'Александр',
			user_family	: 'Иванов',
			user_age	: 40,
			//Добавление бинарного файла
			user_passport  	: require('fs').readFileSync(userfiles[0]['tmp']),
			user_photo  	: require('fs').readFileSync(userfiles[1]['tmp']),
		}
	};
	var query = this.query_insert(params);
*/	

	this.query_insert = function (params) {
		//Параметры по-умолчанию
		params 	= (params && typeof(params)=='object' && params.data) ? (params) : ({data:{}});
		//Формируем запрос
		var items = ['INSERT'];
		items.push('INTO');
		items.push(this.table);
		if (Object.keys(params.data).length>0) {
			items.push('SET');
			items.push(this.query.SET(params.data));
		};
		//Запрос
		return items.join(' ') + ';';
	};

//Удаление строк из таблицы на условиях. 
//Пример:
/* 
	var params = {
		where	: {
			user_family	: 'Иванов',
			'user_age >'	: 25
		}, 
		in	: {
			user_id 	: [1,2,3]
		},
	};
	var query = this.query_delete(params);
*/	
	this.query_delete = function (params) {
		//Параметры по-умолчанию
		params 	= (params && typeof(params)=='object') ? (params) : ({where:{},in:{}});
		params.where = (params.where && typeof(params.where)=='object') ? (params.where) : ({});
		params.in = (params.in && typeof(params.in)=='object') ? (params.in) : ({});
		//Формируем запрос
		var items = ['DELETE'];
		items.push('FROM');
		items.push(this.table);
		//Не добавляем WHERE, если нет условий - удаление всех данных
		if (Object.keys(params.where).length>0) {
			items.push('WHERE');
			items.push(this.query.WHERE(params.where, 'AND'));
		};
		if (Object.keys(params.in).length>0) {
			items.push((items.indexOf('WHERE')>0) ? ('AND') : ('WHERE'));
			items.push(this.query.IN(params.in, 'AND'));
		};
		//Запрос
		return items.join(' ') + ';';
	};
	
//Обновление строк на условиях. 
//Пример1: 
/*
	params = {
		data : {
			user_family		: 'Иванов (старший)', 
			user_status		: 'Старина'
		}
		where	: {
			user_family		: 'Иванов',
			'user_status !='	: 'Шеф',
		}, 
		in		: {
			user_age 		: [40,45,50]
		}, 
	};
	var query = this.query_update(params);
*/
//Пример2: Редко используемые варианты
/*
	params = {
		data : {
			//Обновление бинарного файла
			user_passport  	: require('fs').readFileSync(userfiles[0]['tmp']),
			user_photo  	: require('fs').readFileSync(userfiles[1]['tmp']),
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
		}
		where	: {
			user_family		: 'Иванов',
			'user_status !='	: 'Шеф',
		}, 
		in	: {
			user_age 		: [40,45,50]
		}, 
	};
	var query = this.query_update(params);
*/
//	
	this.query_update = function (params) {
		//Параметры по-умолчанию
		params 	= (params && typeof(params)=='object') ? (params) : ({where:{},in:{},data:{}});
		params.where 	= (params.where && typeof(params.where)=='object') ? (params.where) : ({});
		params.in 		= (params.in && typeof(params.in)=='object') ? (params.in) : ({});
		params.like 	= (params.like && typeof(params.like)=='object') ? (params.like) : ({});
		params.data 	= (params.data && typeof(params.data)=='object') ? (params.data) : ({});
		//Формируем запрос
		var items = ['UPDATE'];
		items.push(this.table);
		items.push('SET');
		items.push(this.query.SET(params.data));
		
		if (Object.keys(params.where).length>0) {
			items.push('WHERE');
			items.push(this.query.WHERE(params.where, 'AND'));
		};

		if (Object.keys(params.in).length>0) {
			items.push((items.indexOf('WHERE')>0) ? ('AND') : ('WHERE'));
			items.push(this.query.IN(params.in, 'AND'));
		};
		if (Object.keys(params.like).length>0) {
			items.push((items.indexOf('WHERE')>0) ? ('AND') : ('WHERE'));
			items.push(this.query.LIKE(params.like, 'AND'));
		};
		return items.join(' ') + ';';
	};
	
//Считывание строк на условиях
//Пример:
/*
	params = {
		fields 			: ['user_id', 'user_name', 'user_family'],  //[] - все поля строки
		join 	: {
			'cities' 	: 'users.user_city_id = cities.city_id',
			'statuses' 	: 'users.user_status_id = statuses.status_id',
		},
		where	: {
			status_name	: 'Рабочий',
			'user_age >'	: 45
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
			user_family 	: 'asc',
			user_age 	: 'desc'
		},
		limit	: 10,
		offset	: 5,
	};
	var query = this.query_select(params);
*/
	this.query_select = function (params, next) {
		//Параметры по-умолчанию
		params 	= (params && typeof(params)=='object') ? (params) : ({fields:[], join:{}, where:{}, like:{}, in:{}, group:[], order:{}, limit:0, offset:0});
		params.fields 	= (params.fields && (params.fields instanceof Array)) ? (params.fields) : ([]);
		params.join 	= (params.join && typeof(params.join)=='object') ? (params.join) : ({});
		params.where 	= (params.where && typeof(params.where)=='object') ? (params.where) : ({});
		params.like 	= (params.like && typeof(params.like)=='object') ? (params.like) : ({});
		params.in 		= (params.in && typeof(params.in)=='object') ? (params.in) : ({});
		params.group 	= (params.group && (params.group instanceof Array)) ? (params.group) : ([]);
		params.order	= (params.order && typeof(params.order)=='object') ? (params.order) : ({});
		params.limit	= (params.limit!=null && !isNaN(parseInt(params.limit))) ? (parseInt(params.limit)) : (0);
		params.offset	= (params.offset!=null && !isNaN(parseInt(params.offset))) ? (parseInt(params.offset)) : (0);
		//Формирование запроса
		var items = ['SELECT'];
		if (Object.keys(params.fields).length>0) {
			items.push(this.query.FIELDS(params.fields));
		} else {
			items.push('*');
		};
		items.push('FROM');
		items.push(this.table);
		if (Object.keys(params.join).length>0) {
			items.push(this.query.JOIN(params.join));
		};
		if (Object.keys(params.where).length>0) {
			items.push((items.indexOf('WHERE')>0) ? ('AND') : ('WHERE'));
			items.push(this.query.WHERE(params.where, 'AND'));
		};
		if (Object.keys(params.like).length>0) {
			items.push((items.indexOf('WHERE')>0) ? ('AND') : ('WHERE'));
			items.push(this.query.LIKE(params.like, 'BOTH', 'AND'));
		};
		if (Object.keys(params.in).length>0) {
			items.push((items.indexOf('WHERE')>0) ? ('AND') : ('WHERE'));
			items.push(this.query.IN(params.in, 'AND'));
		};
		if (Object.keys(params.group).length>0) {
			items.push('GROUP BY');
			items.push(this.query.GROUP(params.group));
		};
		if (Object.keys(params.order).length>0) {
			items.push('ORDER BY');
			items.push(this.query.ORDER(params.order));
		};
		if (params.limit>0) {
			items.push('LIMIT');
			items.push((params.offset>0) ? (params.offset + ', ') : (''));
			items.push(params.limit);
		};
		//Запрос
		return items.join(' ') + ';';
	};
	
};
module.exports = ActiveRecord;
