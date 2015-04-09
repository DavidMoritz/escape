trappedApp.controller('TrappedCtrl', [
	'$scope',
	'$interval',
	'$timeout',
	'$firebaseObject',
	'$firebaseArray',
	function TrappedCtrl($s, $interval, $timeout, $fbObject, $fbArray) {
		'use strict';

		function getTeams($s) {
			var ref = new Firebase('http://kewl.firebaseio.com/escape');

			window.allTeams = $fbArray(ref);
			allTeams.$loaded(function() {
				$s.listTeams = _.where(allTeams, {finished: false});
				if($s.listTeams.length == 1 && !$s.admin) {
					$s.chooseSession($s.listTeams[0].$id);
				}
				$('body').removeClass('angularNotDone');
			});
		}

		function newSession(id) {
			var ref = new Firebase('http://kewl.firebaseio.com/escape');

			return $fbObject(ref.child(id));
		}

		function convertTimer(time) {
			var timeLeft = moment(time).diff();

			return moment(timeLeft).format('mm:ss');
		}

		//	initialize scoped variables
		_.assign($s, {
			user: 'Guest ' + Math.round(Math.random() * 100),
			admin: location.search ? true : false
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
				$s.changeMessage('Timer started');
			}
		};

		$s.changeMessage = function changeMessage(message) {
			var oldMessages = $s.session.storedMessages;

			$s.session.displayMessage = message;
			oldMessages.push({
				time: Date.now(),
				text: message
			});
			$s.session.storedMessages = oldMessages;

			$('.changeMessage').val('');
		};

		$s.createTeam = function createTeam(name) {
			var timeId = moment().format('YYMMDD-HHmm'),
				idx = allTeams.push({
				$id: timeId,
				name: name,
				clues: 0,
				finished: false,
				storedMessages: [{
					time: Date.now(),
					text: 'We are about to begin'
				}]
			});
			allTeams.$save(--idx);
			$s.chooseSession(timeId);
		};

		$s.finish = function finishGame() {
			$s.session.finished = true;
			$s.session.timeLeft = convertTimer($s.session.timer);
		};

		$s.questions = [
			{
				text: 'What color is a fire truck?',
				answer: 'Red',
				guess: '',
				placeholder: 'Answer here'
			}, {
				text: 'Who shot Alexander Hamilton?',
				answer: 'Aaron Burr',
				guess: '',
				placeholder: 'Drink Milk'
			}
		];

		getTeams($s);
	}
]);
