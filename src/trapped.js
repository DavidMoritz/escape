trappedApp.controller('TrappedCtrl', [
	'$scope',
	'$interval',
	'$timeout',
	'$firebaseObject',
	function TrappedCtrl($s, $interval, $timeout, $fbObject) {
		'use strict';

		var timer = 60 * 60; // one hour in seconds

		//	initialize scoped variables
		_.assign($s, {
			clues: 0,
			gameStarted: false,
			user: 'Guest ' + Math.round(Math.random() * 100)
		});

		function newProfile(id, obj) {
			var ref = new Firebase('http://kewl.firebaseio.com/' + id);

			return $fbObject(ref.child(obj));
		}

		function subtractSecond($s) {
			var minutes = Math.floor((--timer % 3600) / 60),
				seconds = timer - (minutes * 60);

			seconds = seconds < 10 ? ('0' + seconds) : seconds;
			minutes = minutes < 10 ? ('0' + minutes) : minutes;

			$s.profile.displayTime = minutes + ':' + seconds;
		}

		newProfile(749687, 'myNewId').$bindTo($s, 'profile');

		$interval(function everySecond() {
			if ($s.gameStarted) {
				subtractSecond($s);
			}
		}, 1000, $s.timer);

		$s.startGame = function startGame() {
			$s.gameStarted = true;
		};
/*
		// a method to create new messages; called by ng-submit
		$s.addMessage = function() {
			// calling $add on a synchronized array is like Array.push(),
			// except that it saves the changes to Firebase!
			$s.messages.$add({
				from: $s.user,
				content: $s.displayTime
			});

			// reset the message input
			$s.message = '';
		};

		// if the messages are empty, add something for fun!
		$s.messages.$loaded(function() {
			if ($s.messages.length === 0) {
				$s.messages.$add({
					from: 'Firebase Docs',
					content: 'Hello world!'
				});
			}
		});
*/
	}
]);