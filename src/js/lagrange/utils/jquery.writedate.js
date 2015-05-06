
/*
version 2015-05-06
*/

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

	'use strict';

	var pluginName = 'writeDate';

	var months = {
		fr:['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
		en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
	};
	var monthsShort = {
		fr:['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'],
		en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		es: ['enero', 'feb', 'marzo', 'abr', 'mayo', 'jun', 'jul', 'agosto', 'sept', 'oct', 'nov', 'dec']
	};
	var days = {
		fr:['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
		en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
	};
	
	/*
	formats:
	%A day name (Sunday, Monday...)
	%e Day of the month (1 to 31)
	%d Day of the month (01 to 31)
	%Y Four digit representation for the year
	%b	Abbreviated month name, based on the locale (Jan, Feb...)
	%B  Full month name, based on the locale
	%m Month (01 to 12)
	*/ 


	var defaults = {
		format : {
			fr : '%A %e %B %Y',
			en : '%A %B %e, %Y',
			es : '%A %e %B %Y'
		},
		lang : 'fr'
	};

	var parseStr = function(lang){
		var parsers = {};
		if(parsers[lang]) return parsers[lang];
		parsers[lang] = function(str){
			var monthStr = str.substr(5,2);
			var month = Number(monthStr)-1;
			var year = str.substr(0, 4);
			var dayStr = str.substr(8, 2);
			var day = Number(dayStr);/**/
			if(isNaN(day) || isNaN(month) || isNaN(year)) return;
			var dObj = new Date(year, month, day);
			return {
				A : days[lang][dObj.getDay()],
				e : day,
				d : dayStr,
				Y : year,
				b: monthsShort[lang][month],
				B: months[lang][month],
				m: monthStr
			};
		};
		return parsers[lang];
	};

	var plugin = function(el, settings) {

		settings = $.extend({}, defaults, settings);
		var lang = settings.lang;
			
		var _self = $(el);
		var desc = parseStr(lang)(_self.text());

		var textDate = typeof settings.format == 'string' ? settings.format : settings.format[lang] ;
		$.each(desc, function(key, val){
			textDate = textDate.replace('%'+key, val);
		});

		/*console.log(day, month, year, date);
		console.log(parsedStr);/**/

		_self.html(textDate);
		
	
	};

	var writeDate = function(options) {
		var input = arguments;
		if ( this.length ) {
			return this.each(function () {

				plugin(this, options);
				
			});
		}
	};

	writeDate.parseStr = parseStr;

	$.fn[pluginName] = writeDate;
	
}));