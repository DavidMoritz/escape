escapeApp.controller('EscapeCtrl', [
	'$scope',
	'$interval',
	'EscapeFactory',
	function EscapeCtrl($s, $interval, EF) {
		'use strict';

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
			if ($s.activeTeam) {
				$s.activeTeam.timeRemaining -= 1;
			}
		}, 1000);

		//	initialize scoped variables
		_.assign($s, {
			questions: EF.getFBArray('questions'),
			allTeams: [],
			teamId: null
		});

		$s.chooseTeam = function chooseTeam(teamId) {
			//	turn all teams inactive
			_.forEach($s.allTeams, function eachTeam(team) {
				EF.getFB('teams/' + team.$id + '/active').set(false);
			});

			//	activate the chosen team
			EF.getFBObject('teams/' + teamId).$bindTo($s, 'activeTeam').then(function afterTeamLoaded() {
				$s.activeTeam.active = true;
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

		$s.allTeams = EF.getFBArray('teams')
		$s.allTeams.$loaded(function afterTeamsLoaded() {
			if ($s.getUnfinishedTeams().length === 1) {
				$s.chooseTeam($s.getUnfinishedTeams()[0].$id);
			}
		});
	}
]);
