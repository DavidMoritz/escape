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
					icon: 'building-o',
					guess: '',
					splitGuess: {
						property: '',
						money: ''
					},
					answers: ['Illinois10'],
					attempts: [],
					nextClue: {
						text: 'Cerulean lock: 12345',
						visible: true
					}
				},
				yahtzee: {
					id: 17,
					name: 'yahtzee',
					icon: 'cubes',
					guess: '',
					splitGuess: {
						die1: '',
						die2: ''
					},
					answers: ['6&4', '4&6'],
					attempts: [],
					nextClue: {
						text: 'Orange lock: 34567',
						visible: true
					}
				},
				scrabble: {
					id: 36,
					name: 'scrabble',
					icon: 'th-large',
					guess: '',
					answers: ['watermelon'],
					attempts: [],
					nextClue: {
						text: 'White lock: 56789',
						visible: true
					}
				},
				battleship: {
					id: 36,
					name: 'battleship',
					icon: 'ship',
					guess: '',
					coords: [],
					columns: _.range(1, 11),
					rows: 'abcdefghij'.split(''),
					answers: ['b2&d2'],
					attempts: [],
					nextClue: {
						text: 'Black lock: 78901',
						visible: true
					}
				}
			}
		};
	}
]);
