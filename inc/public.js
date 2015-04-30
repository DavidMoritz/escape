/*!
 * The Game Escape - v0.2.0 
 * Build Date: 2015.04.30 
 * Docs: http://moritzcompany.com 
 * Coded @ Moritz Company 
 */ 
 
var escapeApp = angular.module('escapeApp', ['firebase']);

escapeApp.run(function runWithDependencies($rootScope) {
	$rootScope._ = _;
	$rootScope.moment = moment;
});

escapeApp.controller('AdminCtrl', [
	'$scope',
	'EscapeFactory',
	function AdminCtrl($s, EF) {
		'use strict';

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';

		//	initialize scoped variables
		_.assign($s, {
			allTeams: [],
			activeTeam: null,
			formFields: {
				newTeamName: '',
				newMessage: ''
			},
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

		$s.restartTimer = function restartTimer() {
			if(confirm('Are you sure?')) {
				$s.activeTeam.timeRemaining = EF.initialTimeAllowed;
				$s.changeMessage('Timer restarted');
			}
		};

		$s.addNewMessage = function addNewMessage() {
			if (!$s.activeTeam) {
				return false;
			}

			var stoMsgs = EF.getFBArray('teams/' + $s.activeTeam.$id + '/storedMessages');
			stoMsgs.$add({
				text: $s.formFields.newMessage,
				time: moment().format(timeFormat)
			});
		};

		$s.createTeam = function createTeam() {
			var teams = EF.getFBArray('teams'),
				currentTime = moment().format(timeFormat);
				
			teams.$add({
				createdDate: currentTime,
				name: $s.formFields.newTeamName,
				clues: 0,
				active: false,
				finished: false,
				timeRemaining: 60 * 60
			}).then(function(newTeam) {
				console.log('new team created with id: ' + newTeam.key());

				newTeam.child('storedMessages').push({
					time: currentTime,
					text: 'We are about to begin'
				});

				$s.chooseTeam(newTeam.key());
			});
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

escapeApp.controller('EscapeCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	function EscapeCtrl($s, $timeout, $interval, EF) {
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
			if ($s.activeTeam) {
				$s.activeTeam.timeRemaining -= 1;
			}
		}, 1000);

		//	initialize scoped variables
		_.assign($s, {
			questions: EF.getFBArray('questions'),
			allTeams: [],
			teamId: null,
			curMsg: ''
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

escapeApp.controller('FirebaseScriptsCtrl', [
	'$scope',
	'$firebaseObject',
	'$firebaseArray',
	function FirebaseScriptsCtrl($s, $fbObject, $fbArray) {
		'use strict';

		function getFBRef(childPath) {
			childPath = childPath ? '/' + childPath : '';

			return new Firebase('https://kewl.firebaseio.com/escape' + childPath);
		}

		function doneMessage(msg) {
			$s.extraMessage = msg;

			console.log(msg);
		}

		$s.doTheCodez = function doTheCodez() {
			var fbRef = getFBRef();

			//	CREATE QUESTIONS ARRAY
			// _.forEach(questions, function eachQuestion(q) {
			// 	var newQuestion = fbRef.child('questions').push();
			// 	console.log('new id for this question is ' + newQuestion.key());
			// 	newQuestion.set(q);
			// });
			// doneMessage('all questions added!');

			// //	CREATE TEAMS ARRAY
			// fbRef.child('teams').set({
			//   '150418-1408' : {
			//     'clues' : 0,
			//     'finished' : false,
			//     'name' : 'SuperTeam',
			//     'storedMessages' : [ {
			//       'text' : 'We are about to begin',
			//       'time' : 1429391301319
			//     }, {
			//       'text' : 'Here is the first message for SuperTeam!',
			//       'time' : 1429391337020
			//     } ],
			//     'timeLeft' : '00:00'
			//   }
			// });
			// doneMessage('team added!');

			// window.questions = $fbArray(getFBRef('questions'));
			// questions.$loaded(function whenQuestionsLoaded(err) {
			// 	if (err) {
			// 		console.log(err);
			// 	}

			// 	throw 'Aagh!  What are you doing??';

			// 	//	THIS IS BAD!  IT WIPED OUT THE DATABASE!
			// 	// getFBRef().set({testQuestions: []}, function afterComplete() {
			// 	// 	_.forEach(questions, function eachQuestion(q) {
			// 	// 		getFBRef('testQuestions').push(q);
			// 	// 		console.log(q.text);
			// 	// 	});
			// 	// });
			// 	// getFBRef('questions').set($s.questions);
			// 	// getFBRef('questions').update($s.questions);

			// 	// $s.questions = questions;
			// 	// console.log('Questions');
			// 	// console.log(questions);
			// });
		};
	}
]);

escapeApp.controller('EscapeCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	function EscapeCtrl($s, $timeout, $interval) {
		'use strict';

		function typeOutMessage() {
			$s.public.display = '';
			var curMsgArray = $s.public.text.split('');
			var curPos = 0;

			var typingInterval = $interval(function typeGradually() {
				if(curPos >= curMsgArray.length) {
					return $interval.cancel(typingInterval);
				}

				$s.public.display = $s.public.display + curMsgArray[curPos++];
			}, 40);
		}

		$interval(function everySecond() {
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
		}, 1000);

		//	initialize scoped variables
		_.assign($s, {
			public: {
				timeRemaining: 45 * 60
			}
		});
	}
]);

escapeApp.factory('EscapeFactory', [
	'$firebaseArray',
	'$firebaseObject',
	function EscapeFactory($fbArray, $fbObject) {
		'use strict';

		return {
			initialTimeAllowed: 60 * 60,

			getFB: function getFB(childPath) {
				return new Firebase('https://kewl.firebaseio.com/escape/' + (childPath || ''));
			},

			getFBArray: function getFBArray(childPath) {
				return $fbArray(this.getFB(childPath));
			},

			getFBObject: function getFBObject(childPath) {
				return $fbObject(this.getFB(childPath));
			}
		};
	}
]);

// (function($) {
//     $.fn.writeText = function(content) {
//         var contentArray = content.split(''),
//             current = 0,
//             elem = this;
//         setInterval(function() {
//             if(current < contentArray.length) {
//                 elem.text(elem.text() + contentArray[current++]);
//             }
//         }, 100);
//     };

// })(jQuery);
