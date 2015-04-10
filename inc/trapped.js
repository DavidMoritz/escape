/*!
 * Thrive is a text-based RPG - v0.2.0 
 * Build Date: 2015.04.09 
 * Docs: http://moritzcompany.com 
 * Coded @ Moritz Company 
 */ 
 
var trappedApp = angular.module('trappedApp', ['firebase']);

trappedApp.run(function runWithDependencies($rootScope) {
	$rootScope._ = _;
	$rootScope.moment = moment;
});

(function($) {
    $.fn.writeText = function(content) {
        var contentArray = content.split(''),
            current = 0,
            elem = this;
        setInterval(function() {
            if(current < contentArray.length) {
                elem.text(elem.text() + contentArray[current++]);
            }
        }, 100);
    };

})(jQuery);
trappedApp.controller('TrappedCtrl', [
	'$scope',
	'$interval',
	'$timeout',
	'$firebaseObject',
	'$firebaseArray',
	function TrappedCtrl($s, $interval, $timeout, $fbObject, $fbArray) {
		'use strict';

		function getTeams($s) {
			var ref = new Firebase('http://kewl.firebaseio.com/escape');

			window.allTeams = $fbArray(ref);
			allTeams.$loaded(function() {
				$s.listTeams = _.where(allTeams, {finished: false});
				if($s.listTeams.length == 1 && !$s.admin) {
					$s.chooseSession($s.listTeams[0].$id);
				}
				$('body').removeClass('angularNotDone');
			});
		}

		function newSession(id) {
			var ref = new Firebase('http://kewl.firebaseio.com/escape');

			return $fbObject(ref.child(id));
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

		$interval(function everySecond() {
			if ($s.session) {
				$s.displayTime = convertTimer($s.session.timer);
			}
		}, 1000);

		//	initialize scoped variables
		_.assign($s, {
			user: 'Guest ' + Math.round(Math.random() * 100),
			admin: location.search ? true : false,
			questions: [
				{
					text: 'What color is a fire truck?',
					answer: 'Red',
					guess: '',
					placeholder: 'Mix magenta and yellow'
				}, {
					text: 'Who shot Alexander Hamilton?',
					answer: 'Aaron Burr',
					guess: '',
					placeholder: 'Drink Milk'
				}, {
					text: 'How many men does it take to invent a light bulb?',
					answer: '1.  Thomas Edison',
					guess: ''
				}, {
					text: 'Who\'s got the show that gets the most applause?',
					answer: 'Colonel Buff\'lo Bill',
					guess: ''
				}, {
					text: 'What makes the world go around?',
					answer: 'Money',
					guess: ''
				}, {
					text: 'What is Superman\'s weakness?',
					answer: 'Kryptonite',
					guess: ''
				}, {
					text: 'What is the capital of Texas?',
					answer: 'Austin',
					guess: ''
				}
			]
		});

		$s.chooseSession = function chooseSession(id) {
			var session = newSession(id);

			session.$bindTo($s, 'session');
			session.$watch(function() {
				typeOutMessage();
			});
			// show most recent message
			$timeout(function() {
				$('.displayMessage :last-child').addClass('typed');
			}, 100);
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
			var timeId = moment().format('YYMMDD-HHmm'),
				idx = allTeams.push({
				$id: timeId,
				name: name,
				clues: 0,
				finished: false,
				storedMessages: [{
					time: Date.now(),
					text: 'We are about to begin'
				}]
			});
			allTeams.$save(--idx);
			$s.chooseSession(timeId);
		};

		$s.finish = function finishGame() {
			$s.session.finished = true;
			$s.session.timeLeft = convertTimer($s.session.timer);
		};

		$s.getPlaceholder = function getPlaceholder(question) {
			return question.placeholder || 'Answer here';
		};

		getTeams($s);
	}
]);
