var Model = function (config) {
	//наследование и конструктор
	require('model-for-mysql').call(this, config);
	
	var self = this;

	//Название таблицы
	this.table 			= 'sessions';
	//Ключевое поле
	this.idkey 			= 'session_name';	
	//Ник таблицы
	this.table_nick 	= 'Таблица сессий';
	//Структура полей таблицы	
	this.fields 		= [
		{
			field	: 'session_name', 
			label	: 'ИМЯ СЕССИИ (ВРЕМЯ СОЗДАНИЯ)', 
			type	: 'varchar(50) NOT NULL'
		},
		{
			field	: 'session_activity', 
			label	: 'ВРЕМЯ ПОСЛЕДНЕЙ АКТИВНОСТИ ПОЛЬЗОВАТЕЛЯ', 
			type	: 'bigint NOT NULL'
		},
		{
			field	: 'session_ip', 
			label	: 'IP АДРЕС ПОЛЬЗОВАТЕЛЯ', 
			type	: 'varchar(50) NOT NULL'
		},
		{
			field	: 'session_agent', 
			label	: 'АГЕНТ ПОЛЬЗОВАТЕЛЯ', 
			type	: 'varchar(200) NOT NULL'
		},
		{
			field	: 'session_data',
			label	: 'ДАННЫЕ ПОЛЬЗОВАТЕЛЯ',
			type	: 'text NOT NULL',
		},
	];

	this.suffix = 0;
	this.suffixMax = 100;
	//Создание имени сессии
	this.createSessionName = function () {
		var suffix = this.suffix;
		this.suffix++;
		if (this.suffix>this.suffixMax) this.suffix = 0;
		return new Date().getTime() + '_' + suffix;
	};
	//Удаление просроченных сессий
	this.delete_timeout_rows = function (timeout, next) {
		var data = {
			where	: {
				'session_activity <' : Date.now()- timeout
			}
		};
		this.delete (data, next);
	};
	//Обновление строки
	this.update_row = function (session_row, next) {
		var data = {
			data 	: session_row,
			where	: {
				session_name : session_row['session_name']
			}
		};
		this.update (data, next);
	};
	//Добавление строки
	this.insert_row = function (session_row, next) {
		var data = {
			data	: session_row
		};
		this.insert (data, next);
	};
	//Обновление или добавление строки
	this.set_row = function (session_row, next) {
		if (session_row['session_name']) {
			//сессия существует. Обновление
			this.update_row(session_row, function (success) {
				//Возвращаем строку сессии
				return next (success, session_row);
			});
		} else {
			//сессия не существует. Создание новой
			session_row['session_name'] = this.createSessionName(),
			this.insert_row(session_row, function (success) {
				//Возвращаем строку сессии
				return next (success, session_row);
			});
		};
	};
	
	//Создаем таблицу, если не создана
	this.create( function (success) {});
};

var Sessions = function (config) {
	var self = this;
	//Формируем модель
	var mdl_sessions = new Model(config.db);
	//Формируем конфигурацию
	this.config = config || {};
	this.config.label 	= this.config.label || 'SN';	//Название метки в кукисах
	this.config.timeout = this.config.timeout || 15*60;	//Время жизни сессии при бездействии, секунд
	this.config.checkIP	= this.config.checkIP==null ? false : Boolean(this.config.checkIP);			//По умролчанию не проверяем IP адрес клиенти
	
	//Обработка сессий
	this.start = function (req, res, next) {
		if (! req.cookies) {
			console.error(['SESSIONS', 'ERROR', 'Кукисы не определены'].join(': '));
			return next();
		};
		//Удаление просроченных сессий
		mdl_sessions.delete_timeout_rows (self.config.timeout*1000, function (success) {
			//Считываем сессию по метке в куки
			mdl_sessions.get_row_for_id (req.cookies.parse[self.config.label], [], function (session_row) {
				var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress).split(':').pop();
				if (!session_row) session_row = {};	//Создаем строку
				//Защита от подмены существующей сессии  - проверка агента и ip
				if ((session_row['session_agent']!=req.headers['user-agent']) || (self.config.checkIP && session_row['session_ip']!=ip)) {
					session_row['session_name'] = '';
					session_row['session_data'] = JSON.stringify({});
				}
				//Обновляем/устанавливаем активность
				session_row['session_activity'] = new Date().getTime();
				session_row['session_agent'] 	= req.headers['user-agent'];
				session_row['session_ip'] 		= ip;
				//Добавляем или обновляем строку сессии
				mdl_sessions.set_row (session_row, function (success, session_row) {
					//Сохранение метки в куки
					req.cookies.set(self.config.label, session_row['session_name'], 0, '/');
					//Формируем объект req.session
					req.session = {
						//Сохранение строки
						row		: session_row,
						//Парсинг данных клиента
						parse	: session_row['session_data'] ? JSON.parse(session_row['session_data']) : {},
						//Функция устанавки данных клиента
						set	: function (data, next) {
							//Устанавливаем значения
							for (var name in data) {
								var value = data[name];
								if ((value*1).toString()==value.toString()) value *=1;
								req.session.parse[name] = value;
							};
							//Сохраняем данные пользователя в базе данных (в сессии)
							req.session.row['session_data'] = JSON.stringify(req.session.parse);
							mdl_sessions.update_row(req.session.row, next);
						},
						//Функция удаления данных клиента
						delete	: function (name, next) {
							if (!(name instanceof Array)) name = [name];
							//Удаление элементов
							for (var key in name) {
								delete req.session.parse[name[key]];
							}
							//Сохраняем данные пользователя в базе данных (в сессии)
							req.session.row['session_data'] = JSON.stringify(req.session.parse);
							mdl_sessions.update_row(req.session.row, next);
						},
						//Функция получения и удаления данных клиента (флэш-данных)
						pop		: function (name, next) {
							//Считывание значения
							var value = req.session.parse[name];
							//Удаление элемента из объекта
							delete req.session.parse[name];
							//Удаление элемента из БД
							req.session.delete(name, function (success) {
								next (success, value);
							});
						},
					};
					//Возврат на сервер
					next ();
				});
			});
		});
	};
};
module.exports = function (config) {
	return new Sessions(config);
};