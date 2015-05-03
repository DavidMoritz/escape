escapeApp.controller('SessionCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	function SessionCtrl($s, $timeout, $interval, EF) {
		'use strict';

		function typeOutMessage() {
			console.log('SESS> typeOutMessage() called');
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

		function bindMessaging() {
			$s.$watch('activeTeam.storedMessages', function onNewMessages(messages) {
				if(messages) {
					$s.curMsg = {
						text: messages[_.keys(messages)[_.keys(messages).length - 1]].text,
						display: ''
					};

					typeOutMessage();
				}
			}, true);
		}

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';
		var activeTeamFBObj;

		$interval(function everySecond() {
			if ($s.activeTeam && $s.activeTeam.timerStarted) {
				// convertTimer
				var start = moment($s.activeTeam.timerStarted, timeFormat);
				var current = $s.activeTeam.finished ? moment($s.activeTeam.finished, timeFormat) : moment();

				$s.timeRemaining = $s.activeTeam.timeAllowed - current.diff(start, 'seconds');
			} else {
				$s.timeRemaining = 0;
			}
		}, 1000);

		//	initialize scoped variables
		_.assign($s, {
			allTeams: [],
			teamId: null,
			curMsg: {
				text: '',
				display: ''
			},
			timeRemaining: 0,
			solvedQuestions: [],
			q: EF.questions
		});

		$s.chooseTeam = function chooseTeam(teamId) {
			console.log('SESS> choosing Team: ' + teamId);

			if (activeTeamFBObj) {
				activeTeamFBObj.$destroy();
				console.log('SESS> activeTeam is destroyed');
			} else {
				var firstLoad = true;
			}

			console.log('SESS> choosing a team');
			activeTeamFBObj = EF.getFBObject('teams/' + teamId);
			activeTeamFBObj.$bindTo($s, 'activeTeam').then(function afterTeamLoaded() {
				console.log('SESS> afterTeamLoaded');
				if(firstLoad) {
					bindMessaging();
				}
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
		$s.submitGuessSpecial = function submitGuessSpecial(q) {
			if (q.name === 'monopoly') {
				var property = _.contains(q.splitGuess.property, 'Illinois') ? 'Illinois' : q.splitGuess.property;
				var money = q.splitGuess.money.replace(/\$/g, '').replace('.00', '');

				q.guess = property + money;
			} else if (q.name === 'yahtzee') {
				q.guess = q.splitGuess.die1 + '&' + q.splitGuess.die2;
			}

			$s.submitGuess(q);
		};

		$s.isSolved = function isSolved(q) {
			return $s.activeTeam && $s.activeTeam.solvedQuestions && _.contains(_.keys($s.activeTeam.solvedQuestions), q.name);
		};

		$s.toggleNextClue = function toggleNextClue(q) {
			q.nextClue.visible = !q.nextClue.visible;
		};

		$s.allTeams = EF.getFBArray('teams');
		$s.allTeams.$loaded(function afterTeamsLoaded() {
			EF.getFB('activeTeamId').on('value', function gotId(snap) {
				$s.activeTeamId = snap.val();
				console.log('SESS> new team id: ' + $s.activeTeamId);

				if ($s.activeTeamId) {
					$s.chooseTeam($s.activeTeamId);
				}
			});
		});

		$timeout(function makeDropdownSlick() {	//	selects with images
			$('.ddslick').each(function eachSelect() {
				$(this).ddslick({
						onSelected: function onSelected(data) {
							// console.log(data);
							if (_.contains($(data.original).attr('ng-model'), 'q.yahtzee.splitGuess.die1')) {
								$s.q.yahtzee.splitGuess.die1 = data.selectedData.value;
							}
							if (_.contains($(data.original).attr('ng-model'), 'q.yahtzee.splitGuess.die2')) {
								$s.q.yahtzee.splitGuess.die2 = data.selectedData.value;
							}

							$s.$apply();	//	alert the scope that it's been updated
						}
					});
			});
		}, 1500);
	}
]);
