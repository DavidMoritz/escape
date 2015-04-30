escapeApp.controller('EscapeCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	function EscapeCtrl($s, $timeout, $interval, EF) {
		'use strict';

		function typeOutMessage(indexPage) {
			if(indexPage) {
				$s.public.display = '';
			} else {
				$s.curMsg.display = '';
			}
			var curMsgArray = indexPage ? $s.public.text.split('') : $s.curMsg.text.split('');
			var curPos = 0;

			var typingInterval = $interval(function typeGradually() {
				if(curPos >= curMsgArray.length) {
					return $interval.cancel(typingInterval);
				}

				if(indexPage) {
					$s.public.display = $s.public.display + curMsgArray[curPos++];
				} else {
					$s.curMsg.display = $s.curMsg.display + curMsgArray[curPos++];
				}
			}, 40);
		}

		function publicFunctions() {
			switch($s.public.timeRemaining % 40) {
				case 20:
					$s.public.text = 'Welcome to The Game Escape.';
					typeOutMessage(true);
					break;
				case 10:
					$s.public.text = 'Will your team get out in time?';
					typeOutMessage(true);
					break;
				case 0:
					$s.public.text = 'Sign up for June 19th or June 20th';
					typeOutMessage(true);
					break;
				case 30:
					$s.public.text = 'Hurry, before it\'s too late...';
					typeOutMessage(true);
					break;
			}
			$s.public.timeRemaining -= 1;
		}

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';

		$interval(function everySecond() {
			if ($s.activeTeam) {
				$s.activeTeam.timeRemaining -= 1;
			} else {
				publicFunctions();
			}
		}, 1000);

		//	initialize scoped variables
		_.assign($s, {
			questions: EF.getFBArray('questions'),
			allTeams: [],
			teamId: null,
			curMsg: '',
			public: {
				timeRemaining: 45 * 60
			}
		});

		$s.chooseTeam = function chooseTeam(teamId) {
			//	turn all teams inactive
			_.forEach($s.allTeams, function eachTeam(team) {
				EF.getFB('teams/' + team.$id + '/active').set(false);
			});

			//	activate the chosen team
			EF.getFBObject('teams/' + teamId).$bindTo($s, 'activeTeam').then(function afterTeamLoaded() {
				$s.activeTeam.active = true;

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

		$s.getPlaceholder = function getPlaceholder(question) {
			return question.placeholder || 'Answer here';
		};

		$s.getUnfinishedTeams = function getUnfinishedTeams() {
			return _.where($s.allTeams, {finished: false});
		};

		$s.allTeams = EF.getFBArray('teams');
		$s.allTeams.$loaded(function afterTeamsLoaded() {
			if ($s.getUnfinishedTeams().length === 1) {
				$s.chooseTeam($s.getUnfinishedTeams()[0].$id);
			}
		});
	}
]);
