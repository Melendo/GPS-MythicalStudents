var Model = function () {
	require('./myModel').call(this);
	
	var self = this;
	
	//Название таблицы
	this.table 			= 'cities';
	//Ключевое поле
	this.idkey 			= 'city_id';	
	//Ник таблицы
	this.table_nick 	= 'ГОРОДА';
	//Структура полей таблицы	
	this.fields 		= 
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
