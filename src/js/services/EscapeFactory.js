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
					prerequisite: null,
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
					prerequisite: 'monopoly',
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
					prerequisite: 'yahtzee',
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
					id: 41,
					name: 'battleship',
					prerequisite: null,
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
				},
				clue: {
					id: 88,
					name: 'clue',
					prerequisite: 'battleship',
					icon: 'key',
					guess: '',
					splitGuess: {
						who: '',
						what: '',
						where: ''
					},
					suspects: [
						'Mr. Green',
						'Professor Plum',
						'Colonel Mustard',
						'Mrs. Peacock',
						'Miss Scarlet',
						'Mrs. White'
					],
					weapons: [
						'Candlestick',
						'Knife',
						'Lead Pipe',
						'Revolver',
						'Rope',
						'Wrench'
					],
					rooms: [
						'Conservatory',
						'Lounge',
						'Kitchen',
						'Library',
						'Hall',
						'Study',
						'Ballroom',
						'Dining Room',
						'Billiard Room'
					],
					answers: ['Colonel Mustard&Wrench&Lounge'],
					attempts: [],
					nextClue: {
						text: 'Yello lock: 90123',
						visible: true
					}
				},
				guessWho: {
					id: 63,
					name: 'guessWho',
					display: 'Guess Who?',
					prerequisite: 'clue',
					icon: 'users',
					guess: '',
					answers: ['tom'],
					attempts: [],
					nextClue: {
						text: 'Magenta lock: 23456',
						visible: true
					}
				},
				chess: {
					id: 59,
					name: 'chess',
					prerequisite: 'guessWho',
					icon: 'delicious',
					guess: '',
					coords: [],
					columns: 'abcdefgh'.split('').reverse(),
					rows: _.range(1, 9),
					answers: ['h4'],
					attempts: [],
					nextClue: {
						text: 'Green lock: 45678',
						visible: true
					}
				},
				texasHoldEm: {
					id: 92,
					name: 'texasHoldEm',
					display: 'Texas Hold \'Em',
					prerequisite: null,
					icon: 'beer',
					guess: '',
					splitGuess: {
						name1: '',
						name2: ''
					},
					answers: ['Daniel Craig', 'Craig Daniel'],
					attempts: [],
					nextClue: {
						text: 'Brown lock: 67890',
						visible: true
					}
				},
				connect4: {
					id: 76,
					name: 'connect4',
					display: 'Connect 4',
					prerequisite: 'texasHoldEm',
					icon: 'table',
					guess: '',
					splitGuess: {
						name1: '',
						name2: ''
					},
					answers: ['4'],
					attempts: [],
					nextClue: {
						text: 'Red lock: 89012',
						visible: true
					}
				}
			}
		};
	}
]);
