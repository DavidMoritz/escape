escapeApp.factory('EscapeFactory', [
	'$firebaseArray',
	'$firebaseObject',
	'PuzzleFactory',
	'LockFactory',
	function EscapeFactory($fbArray, $fbObject, PuzzleFactory, LockFactory) {
		'use strict';
		var FB = null;

		return {
			initialTimeAllowed: 60 * 60,

			bufferTime: 60 * 5,

			defaultLockoutPeriod: 45,

			statuses: [{
				text: 'Gold',
				path: 'img/gold.png'
			},{
				text: 'Silver',
				path: 'img/silver.png'
			},{
				text: 'Bronze',
				path: 'img/bronze.png'
			},{
				text: 'Honorable Mention',
				path: 'img/honorable-mention.png'
			}],

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

			questions: PuzzleFactory,

			locks: LockFactory,

			tracks: {
				a: [
					'operation',
					'monopoly',
					'yahtzee',
					'scrabble'
				],
				b: [
					'battleship',
					'clue',
					'guessWho',
					'chess',
					'crossword'
				], 
				c: [
					'texasHoldEm',
					'connect4',
					'fiveRoutes',
					'wordFind',
					'taboo'
				]
			}
		};
	}
]);

