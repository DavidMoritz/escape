escapeApp.controller('SessionCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	function SessionCtrl($s, $timeout, $interval, EF) {
		'use strict';

		function typeOutMessage() {
			if(!$s.currentlyTyping) {
				$s.currentlyTyping = true;
				$s.curMsg.display = '';

				var curMsgArray = $s.curMsg.text.split('');
				var curPos = 0;
				var typingInterval = $interval(function typeGradually() {
					if(curPos >= curMsgArray.length) {
						$s.currentlyTyping = false;
						return $interval.cancel(typingInterval);
					}

					$s.curMsg.display = $s.curMsg.display + curMsgArray[curPos++];
				}, 40);
			}
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
			solvedQuestions: [],
			q: {
				monopoly: {
					id: 25,
					name: 'monopoly',
					guess: '',
					splitGuess: {
						property: '',
						money: ''
					},
					answers: ['Illinois10'],
					attempts: [],
					nextClue: {
						text: 'Cerulean lock: 12345',
						visible: false
					}
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

				//	set solvedQuestions
				// EF.getFBObject('teams/' + $s.activeTeam.$id + '/solvedQuestions').$bindTo($s, 'activeTeam.solvedQuestions');
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

			if (_.contains(lowerCaseAnswers, q.guess.toLowerCase())) {	//	correct!
				if (_.isUndefined($s.activeTeam.solvedQuestions)) {
					$s.activeTeam.solvedQuestions = {};
				}
				$s.activeTeam.solvedQuestions[q.name] = moment().format(timeFormat);
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

		$s.isSolved = function isSolved(q) {
			return $s.activeTeam && $s.activeTeam.solvedQuestions && _.contains(_.keys($s.activeTeam.solvedQuestions), q.name);
		};

		$s.toggleNextClue = function toggleNextClue(q) {
			q.nextClue.visible = !q.nextClue.visible;
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
