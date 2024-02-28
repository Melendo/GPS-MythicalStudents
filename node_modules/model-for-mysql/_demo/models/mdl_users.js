var Model = function () {
	require('./myModel').call(this);
	
	var self = this;
	
	//Название таблицы
	this.table 			= 'users';
	//Ключевое поле
	this.idkey 			= 'user_id';	
	//Ник таблицы
	this.table_nick 	= 'ПОЛЬЗОВАТЕЛИ';
	//Структура полей таблицы	
	this.fields 		= 
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
