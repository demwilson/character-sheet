'use strict';
/*exported pf*/

var pf = {
	concat: function () {
		var args = Array.prototype.slice.call(arguments);
		for (var i = args.length - 1; i >= 0; i--) {
			if (typeof args[i] === 'number') {
				args[i] = args[i] < 0 ? args[i].toString() : '+' + args[i].toString();
			}
		}
		return args.join('');
	},
	dice: function (die, mod) {
		mod = mod || 0;
		if (die === '1d20') {
			return mod <= 0 ? mod.toString() : '+' + mod.toString();
		} else {
			return die + (mod < 0 ? mod.toString() : '+' + mod.toString());
		}
	}
};

String.prototype.contains = function (c) {
	return this.indexOf(c) > -1;
};

String.prototype.lacks = function (c) {
	return this.indexOf(c) === -1;
};

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

Number.prototype.toOrdinal = function() {
	var s = ['th','st','nd','rd'];
	var v = this%100;
	return this + (s[(v-20)%10]||s[v]||s[0]);
};

String.prototype.toProperCase = function () {
	return this.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};