escapeApp.factory('EscapeFactory', [
	'$firebaseArray',
	'$firebaseObject',
	function EscapeFactory($fbArray, $fbObject) {
		'use strict';
		var FB = null;

		return {
			initialTimeAllowed: 60 * 60,

			getFB: function getFB(childPath) {
				if (!FB) {
					FB = new Firebase('https://escape.firebaseio.com/')
				}

				return childPath ? FB.chile(childPath) : FB;
			},

			getFBArray: function getFBArray(childPath) {
				return $fbArray(this.getFB(childPath));
			},

			getFBObject: function getFBObject(childPath) {
				return $fbObject(this.getFB(childPath));
			},

			setFB: function setFB(childPath, value) {
				this.getFB(childPath).set(value);
			}
		};
	}
]);
