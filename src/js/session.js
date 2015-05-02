escapeApp.controller('SessionCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	function SessionCtrl($s, $timeout, $interval, EF) {
		'use strict';

		function typeOutMessage() {
			$s.curMsg.display = '';
			var curMsgArray = $s.curMsg.text.split('');
			var curPos = 0;

			var typingInterval = $interval(function typeGradually() {
				if(curPos >= curMsgArray.length) {
					return $interval.cancel(typingInterval);
				}

				$s.curMsg.display = $s.curMsg.display + curMsgArray[curPos++];
			}, 40);
		}

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';

		$interval(function everySecond() {
			if ($s.activeTeam && $s.activeTeam.timerStarted) {
				// convertTimer
				var start = moment($s.activeTeam.timerStarted, timeFormat);

				$s.timeRemaining = $s.activeTeam.timeAllowed - moment().diff(start, 'seconds');
			}
		}, 1000);

		//	initialize scoped variables
		_.assign($s, {
			allTeams: [],
			teamId: null,
			curMsg: '',
			timeRemaining: 0,
			q25: {
				id: 25,
				guess: {
					property: '',
					money: ''
				},
				answers: ['Illinois10']
			}
		});

		$s.chooseTeam = function chooseTeam(teamId) {
			EF.getFBObject('teams/' + teamId).$bindTo($s, 'activeTeam').then(function afterTeamLoaded() {
				$s.$watch('activeTeam.storedMessages', function onNewMessages(messages) {
					$s.curMsg = {
						text: messages[_.keys(messages)[_.keys(messages).length - 1]].text,
						display: ''
					};

					typeOutMessage();
				}, true);
			});
		};

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

		//	some guesses need to be massaged before submitting them
		$s.submitGuessSpecial = function submitGuessSpecial(qNum) {
			if (qNum.id === 25) {
				var property = _.contains(qNum.guess.property, 'Illinois') ? 'Illinois' : qNum.guess.property;
				var money = qNum.guess.money.replace(/\$/g, '').replace('.00', '');
				var reformattedQuestion = {
					guess: property + money,
					answers: qNum.answers
				};

				$s.submitGuess(reformattedQuestion);
			} else {
				console.log('error');
			}
		};

		$s.getPlaceholder = function getPlaceholder(question) {
			return question.placeholder || 'Answer here';
		};

		$s.allTeams = EF.getFBArray('teams');
		$s.allTeams.$loaded(function afterTeamsLoaded() {
			var activeTeamIdObject = EF.getFBObject('activeTeamId');

			activeTeamIdObject.$loaded().then(function afterIdLoaded() {
				$s.chooseTeam(activeTeamIdObject.$value);
			});
		});
	}
]);
