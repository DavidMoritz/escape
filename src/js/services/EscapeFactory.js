escapeApp.factory('EscapeFactory', [
	'$firebaseArray',
	'$firebaseObject',
	function EscapeFactory($fbArray, $fbObject) {
		'use strict';

		return {
			initialTimeAllowed: 60 * 60,

			getFB: function getFB(childPath) {
				return new Firebase('https://escape.firebaseio.com/' + (childPath || ''));
			},

			getFBArray: function getFBArray(childPath) {
				return $fbArray(this.getFB(childPath));
			},

			getFBObject: function getFBObject(childPath) {
				return $fbObject(this.getFB(childPath));
			},

			setFB: function setFB(childPath, value) {
				var fbValue = this.getFBObject(childPath);

				fbValue.$value = value;
				fbValue.$save();
			},
		};
	}
]);
