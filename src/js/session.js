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
			q: {
				monopoly: {
					id: 25,
					guess: '',
					splitGuess: {
						property: '',
						money: ''
					},
					answers: ['Illinois10'],
					solved: false,
					attempts: [],
					nextClue: 'Cerulean (light blue) lock: 12345'
				}
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

			q.attempts.push({
				guess: q.guess,
				time: moment().format(timeFormat)
			});

			if (_.contains(lowerCaseAnswers, q.guess.toLowerCase())) {
				q.solved = true;
			} else {
				alert('Incorrect answer.  Try again!');
			}
		};

		//	some guesses need to be massaged before submitting them
		$s.submitGuessSpecial = function submitGuessSpecial(qNum) {
			if (qNum.id === 25) {
				var property = _.contains(qNum.splitGuess.property, 'Illinois') ? 'Illinois' : qNum.splitGuess.property;
				var money = qNum.splitGuess.money.replace(/\$/g, '').replace('.00', '');

				qNum.guess = property + money;
				$s.submitGuess(qNum);
			} else {
				console.log('error');
			}
		};

		$s.revealNextClue = function revealNextClue(q) {
			alert(q.nextClue);
		};

		$s.allTeams = EF.getFBArray('teams');
		$s.allTeams.$loaded(function afterTeamsLoaded() {
			EF.getFBObject('activeTeamId').$bindTo($s, 'activeTeamIdObject').then(function afterIdLoaded() {
				$s.$watch('activeTeamIdObject.$value', function onIdChange() {
					$s.chooseTeam($s.activeTeamIdObject.$value);
				});
			});
		});
	}
]);
