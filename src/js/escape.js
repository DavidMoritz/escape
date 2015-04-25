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
			questions: $fbArray(getFBRef('questions')),
			allTeams: [],
			unfinishedTeams: [],
			teamId: null
		});

		$s.chooseTeam = function chooseTeam(teamId) {
			$s.activeTeam = _.find($s.allTeams, {$id: teamId});
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

		$s.allTeams = $fbArray(getFBRef('teams'));
		$s.allTeams.$loaded(function afterTeamsLoaded() {
			$s.unfinishedTeams = _.where($s.allTeams, {finished: false});
			if ($s.unfinishedTeams.length === 1) {
				$s.activeTeam = $s.unfinishedTeams[0];
			}
		});
	}
]);
