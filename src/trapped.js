trappedApp.controller('TrappedCtrl', [
	'$scope',
	'$interval',
	'$timeout',
	'$firebaseObject',
	function TrappedCtrl($s, $interval, $timeout, $fbObject) {
		'use strict';

		var dateID = getDateID(),
			sessionID = prompt('What is your team name?');

		//	initialize scoped variables
		_.assign($s, {
			clues: 0,
			user: 'Guest ' + Math.round(Math.random() * 100),
			admin: location.search == '?host=false' ? true : false,
			store: {
				message: ''
			}
		});

		function getDateID() {
			var today = new Date(),
				dd = today.getDate(),
				mm = today.getMonth()+1, //January is 0!
				yyyy = today.getFullYear();

			dd = dd < 10 ? ('0' + dd) : dd;
			mm = mm < 10 ? ('0' + mm) : mm;

			return yyyy + mm + dd;
		}

		function newSession(id, obj) {
			var ref = new Firebase('http://kewl.firebaseio.com/' + id);

			return $fbObject(ref.child(obj));
		}

		function convertTimer(time) {
			var timeLeft = (time - Date.now()) / 1000,
				minutes = Math.floor(timeLeft / 60),
				seconds = Math.floor(timeLeft - (minutes * 60));

			seconds = seconds < 10 ? ('0' + seconds) : seconds;
			minutes = minutes < 10 ? ('0' + minutes) : minutes;

			return minutes + ':' + seconds;
		}

		newSession(dateID, sessionID).$bindTo($s, 'session');

		$interval(function everySecond() {
			if ($s.session.timer) {
				$s.displayTime = convertTimer($s.session.timer);
			}
		}, 1000);

		$s.restartTimer = function restartTimer() {
			if(confirm('Are you sure?')) {
				$s.session.timer = Date.now() + 60 * 60 * 1000;
			}
		};

		$s.changeMessage = function changeMessage() {
			$s.session.displayMessage = $s.store.message;
			$s.store.message = '';
		};

		$('body').removeClass('angularNotDone');
	}
]);