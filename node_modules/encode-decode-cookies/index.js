var Cookies = function (config) {
	var self = this;
	
	//Формируем конфигурацию
	this.config = config || {};
	this.config.password = this.config.password || ''; ////Не шифруем

	//Шифрование текста
	this.encode = function (text, password) {
		if (! password) return text; //Без шифрования
		//Формируем ключ шифрования
		var n = Math.ceil(text.length / password.length);
		var secret_key = new Array(n + 1).join(password);
		//Кодируем строку
		var mask 	= '0000';
		var result = '';
		for (var i = 0; i < text.length; i++) {
			result += (mask + (text.charCodeAt(i) + secret_key.charCodeAt(i)).toString(16)).substr(-mask.length);
		};
		return result;
	};

	//Расшифрование текста
	this.decode = function (text, password) {
		if (! password) return text; //Без шифрования
		//Формируем ключ шифрования
		var n = Math.ceil(text.length/4/ password.length);
		var secret_key = new Array(n + 1).join(password);
		//Раскодируем строку
		var mask 	= '0000';
		var result 	= '';
		for (var i = 0; i < text.length/4; i++) {
			result +=  String.fromCharCode(parseInt(text.substr(i * mask.length, mask.length), 16) - secret_key.charCodeAt(i));
		};
		return result;
	};
	
	//Старт модуля
	this.start = function (req, res) {
		//Формируеи объект
		req.cookies = {};
		//Значение до расшифровки
		req.cookies.headers	= req.headers.cookie;
		//Функция установки кукиса
		req.cookies.set	= function (name_decode, value_decode, time, path) {
			time = time==null ? 0 : Number(time);
			path = path==null ? '/' : path;
			//Считываем массив существующих в заголовке зашифрованных кукисов
			var cookies_encode = res.getHeader ('Set-Cookie') || [];
			//Добавляем новый кукис
			var name_encode  = self.encode(name_decode + '', self.config.password);
			var value_encode = self.encode(value_decode + '', self.config.password);
			cookies_encode.push([
				name_encode + '=' + value_encode,
				'path' + '=' + path,
				'expires' + '=' + (time ? (new Date(Date.now() + time*1000)).toGMTString() : 0),
			].join('; '));
			//Устанавливаем в заголовок обновленный массив кукисов
			res.setHeader('Set-Cookie', cookies_encode);
		};
		//Функция удаления кукиса
		req.cookies.delete	= function (name) {
			this.set(name, '', -1);
		};
		//Значения расшифрованных кукисов
		req.cookies.parse = {};
		if (req.headers.cookie) {
			//Парсим
			var cookies_encode = req.headers.cookie.replace(/\ +/g, '').split(';');
			for (var key in cookies_encode) {
				//пара ключ-значение
				var name_value = cookies_encode[key].split('=');
				var name_encode = name_value[0];
				var value_encode = name_value[1];
				if (name_encode && value_encode) {
					var name_decode 	= this.decode(name_encode, this.config.password);
					var value_decode 	= this.decode(value_encode, this.config.password)
					req.cookies.parse[name_decode] = value_decode;
				};
			};
			if (this.config.password) {
				//Расшифровываем req.headers.cookie
				var cookies_decode = [];
				for (var name_decode in req.cookies.parse) {
					cookies_decode.push(name_decode + '=' + req.cookies.parse[name_decode]);
				};
				req.headers.cookie = cookies_decode.join('; ');
			}
		}
	};
};
module.exports = function (config) {
	return new Cookies(config);
};