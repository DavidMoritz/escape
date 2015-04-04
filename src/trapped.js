trappedApp.controller('TrappedCtrl', [
	'$scope',
	'$interval',
	'$timeout',
	'$firebaseObject',
	'$firebaseArray',
	function TrappedCtrl($s, $interval, $timeout, $fbObject, $fbArray) {
		'use strict';

		function getTeams() {
			var ref = new Firebase('http://kewl.firebaseio.com/20150403');

			window.allTeams = $fbArray(ref);
		}

		function newSession(id) {
			var ref = new Firebase('http://kewl.firebaseio.com/20150403');

			return $fbObject(ref.child(id));
		}

		function convertTimer(time) {
			var timeLeft = moment(time).diff();

			return moment(timeLeft).format('mm:ss');
		}

		//	initialize scoped variables
		_.assign($s, {
			clues: 0,
			user: 'Guest ' + Math.round(Math.random() * 100),
			admin: location.search == '?host=false' ? true : false,
			newTeamName: 'My New Team',
			store: {
				message: ''
			}
		});

		$interval(function everySecond() {
			if ($s.session) {
				$s.displayTime = convertTimer($s.session.timer);
			}
		}, 1000);

		$s.chooseSession = function chooseSession(id) {
			newSession(id).$bindTo($s, 'session');
		};

		$s.restartTimer = function restartTimer() {
			if(confirm('Are you sure?')) {
				$s.session.timer = Date.now() + 60 * 60 * 1000;
			}
		};

		$s.changeMessage = function changeMessage() {
			$s.session.displayMessage = $s.store.message;
			$s.store.message = '';
		};

		$s.createTeam = function createTeam() {
			allTeams.$add({
				name: $s.newTeamName,
				finished: false
			}).then(function editNewTeam(ref) {
				var id = ref.key();
				setTimeout(function editDelay() {
					var newest = allTeams.$indexFor(id);

					allTeams[newest].$id = moment().format('YYYYMMDD-HH:mm');
					allTeams.$save();
				}, 100);
			});
		};

		$('body').removeClass('angularNotDone');
		getTeams();
	}
]);
