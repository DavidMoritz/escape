escapeApp.factory('EscapeFactory', [
	'$firebaseArray',
	'$firebaseObject',
	'PuzzleFactory',
	function EscapeFactory($fbArray, $fbObject, PuzzleFactory) {
		'use strict';
		var FB = null;

		return {
			initialTimeAllowed: 60 * 60,

			defaultLockoutPeriod: 45,

			getFB: function getFB(childPath) {
				if (!FB) {
					FB = new Firebase('https://escape.firebaseio.com/');
				}

				return childPath ? FB.child(childPath) : FB;
			},

			getFBArray: function getFBArray(childPath) {
				return $fbArray(this.getFB(childPath));
			},

			getFBObject: function getFBObject(childPath) {
				return $fbObject(this.getFB(childPath));
			},

			setFB: function setFB(childPath, value) {
				var ref = this.getFB(childPath);
				ref.set(value);
				return false;
			},

			questions: PuzzleFactory
		};
	}
]);
