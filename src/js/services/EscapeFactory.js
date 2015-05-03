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

			questions: {
				monopoly: {
					id: 25,
					name: 'monopoly',
					guess: '',
					splitGuess: {
						property: '',
						money: ''
					},
					answers: ['Illinois10'],
					attempts: [],
					nextClue: {
						text: 'Cerulean lock: 12345',
						visible: false
					}
				},
				yahtzee: {
					id: 17,
					name: 'yahtzee',
					guess: '',
					splitGuess: {
						die1: '',
						die2: ''
					},
					answers: ['6&4', '4&6'],
					attempts: [],
					nextClue: {
						text: 'Orange lock: 34567',
						visible: false
					}
				},
				scrabble: {
					id: 36,
					name: 'scrabble',
					guess: '',
					answers: ['watermelon'],
					attempts: [],
					nextClue: {
						text: 'White lock: 56789',
						visible: false
					}
				}
			}
		};
	}
]);
