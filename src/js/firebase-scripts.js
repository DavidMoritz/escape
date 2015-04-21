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

			//	CREATE TEAMS ARRAY
			fbRef.child('teams').set({
			  '150418-1408' : {
			    'clues' : 0,
			    'finished' : false,
			    'name' : 'SuperTeam',
			    'storedMessages' : [ {
			      'text' : 'We are about to begin',
			      'time' : 1429391301319
			    }, {
			      'text' : 'Here is the first message for SuperTeam!',
			      'time' : 1429391337020
			    } ],
			    'timeLeft' : '00:00'
			  }
			});
			doneMessage('team added!');

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

// questions: [
// 	{
// 		text: 'What color is a fire truck?',
// 		answers: ['Red'],
// 		guess: '',
// 		placeholder: 'Mix magenta and yellow'
// 	}, {
// 		text: 'Who shot Alexander Hamilton?',
// 		answers: ['Aaron Burr'],
// 		guess: '',
// 		placeholder: 'Drink Milk'
// 	}, {
// 		text: 'How many men does it take to invent a light bulb?',
// 		answers: ['1.  Thomas Edison', 'Thomas Edison', 'Edison'],
// 		guess: ''
// 	}, {
// 		text: 'Who\'s got the show that gets the most applause?',
// 		answers: ['Colonel Buff\'lo Bill'],
// 		guess: ''
// 	}, {
// 		text: 'What makes the world go around?',
// 		answers: ['Money'],
// 		guess: ''
// 	}, {
// 		text: 'What is Superman\'s weakness?',
// 		answers: ['Kryptonite'],
// 		guess: ''
// 	}, {
// 		text: 'What is the capital of Texas?',
// 		answers: ['Austin'],
// 		guess: ''
// 	}
// ];
