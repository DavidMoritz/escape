escapeApp.controller('AdminCtrl', [
	'$scope',
	'$firebaseObject',
	'$firebaseArray',
	function AdminCtrl($s, $fbObject, $fbArray) {
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

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';

		$interval(function everySecond() {
			if ($s.session) {
				$s.displayTime = convertTimer($s.session.timer);
			}
		}, 1000);

		//	initialize scoped variables
		_.assign($s, {
			questions: $fbArray(getFBRef('questions')),
			allTeams: [],
			activeTeam: null
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
			var newTeam = getFBRef('teams').push();
			console.log('new team created with id: ' + newTeam.key());

			newTeam.set({
				createdDate: moment().format(timeFormat),
				name: name,
				clues: 0,
				active: false,
				finished: false
			});

			newTeam.child('storedMessages').push({
				time: moment().format(timeFormat),
				text: 'We are about to begin'
			});

			$s.chooseSession(newTeam.key());
		};

		$s.finish = function finishGame() {
			$s.session.active = true;
			$s.session.timeLeft = convertTimer($s.session.timer);
		};

		$s.getPlaceholder = function getPlaceholder(question) {
			return question.placeholder || 'Answer here';
		};

		$s.allTeams = $fbArray(getFBRef('teams'));
	}
]);
