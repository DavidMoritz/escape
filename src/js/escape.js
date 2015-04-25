escapeApp.controller('EscapeCtrl', [
	'$scope',
	'$interval',
	'$timeout',
	'$firebaseObject',
	'$firebaseArray',
	function EscapeCtrl($s, $interval, $timeout, $fbObject, $fbArray) {
		'use strict';

		function getFBRef(childPath) {
			childPath = childPath ? '/' + childPath : '';

			return new Firebase('https://kewl.firebaseio.com/escape' + childPath);
		}

		function convertTimer(time) {
			var timeLeft = moment(time).diff();

			return moment(timeLeft).format('mm:ss');
		}

		function typeOutMessage() {
			var $latestMessage = $('.displayMessage :last-child'),
				text;

			if (!$latestMessage.hasClass('typed')) {
				text = $latestMessage.text();
				$latestMessage.text('')
					.addClass('typed')
					.writeText(text);
			}
		}

		$interval(function everySecond() {
			if ($s.session) {
				$s.displayTime = convertTimer($s.session.timer);
			}
		}, 1000);

		//	initialize scoped variables
		_.assign($s, {
			user: 'Guest ' + Math.round(Math.random() * 100),
			admin: _.includes(location.search, 'admin') ? true : false,
			questions: $fbArray(getFBRef('questions')),
			activeTeams: []
		});

		$s.submitGuess = function submitGuess(q) {
			var lowerCaseAnswers = _.map(q.answers, function lowerCaseAnswers(ans) {
				return ans.toLowerCase();
			});

			if (_.contains(lowerCaseAnswers, q.guess.toLowerCase())) {
				alert('correct!');
			} else {
				alert('nope!  the correct answer is ' + q.answers[0]);
			}
		};

		$s.chooseSession = function chooseSession(id) {
			var session = $fbObject(getFBRef('teams/' + id));

			session.$bindTo($s, 'session');
			session.$watch(function sessionWatch() {
				typeOutMessage();
			});
			// show most recent message
			$timeout(function afterTimeout() {
				$('.displayMessage :last-child').addClass('typed');
			}, 100);
		};

		$s.restartTimer = function restartTimer() {
			if(confirm('Are you sure?')) {
				$s.session.timer = Date.now() + 60 * 60 * 1000;
				$s.changeMessage('Timer started');
			}
		};

		$s.changeMessage = function changeMessage(message) {
			var oldMessages = $s.session.storedMessages;

			oldMessages.push({
				time: Date.now(),
				text: message
			});
			$s.session.storedMessages = oldMessages;

			$('.changeMessage').val('');
		};

		$s.createTeam = function createTeam(name) {
			var timeId = moment().format('YYMMDD-HHmm');
			var idx = $s.allTeams.$add({
				$id: timeId,
				name: name,
				clues: 0,
				finished: false,
				storedMessages: [{
					time: Date.now(),
					text: 'We are about to begin'
				}]
			});
			$s.allTeams.$save(--idx);
			$s.chooseSession(timeId);
		};

		$s.finish = function finishGame() {
			$s.session.finished = true;
			$s.session.timeLeft = convertTimer($s.session.timer);
		};

		$s.getPlaceholder = function getPlaceholder(question) {
			return question.placeholder || 'Answer here';
		};

		$s.allTeams = $fbArray(getFBRef('teams'));
		$s.allTeams.$loaded(function afterTeamsLoaded() {
			$s.activeTeams = _.where($s.allTeams, {finished: false});
			if ($s.activeTeams.length === 1 && !$s.admin) {
				$s.chooseSession($s.activeTeams[0].$id);
			}
		});
	}
]);
