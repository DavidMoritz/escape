escapeApp.controller('SignUpCtrl', [
	'$scope',
	'EscapeFactory',
	function EscapeCtrl($s, EF) {
		'use strict';

		//	initialize scoped variables
		var initialSessions = [
			'2015-06-19 18:00',
			'2015-06-19 19:00',
			'2015-06-19 20:00',
			'2015-06-19 21:00',

			'2015-06-20 10:00',
			'2015-06-20 11:00',
			'2015-06-20 12:00',

			'2015-06-20 14:00',
			'2015-06-20 15:00',
			'2015-06-20 16:00',

			'2015-06-20 18:00',
			'2015-06-20 19:00',
			'2015-06-20 20:00',
			'2015-06-20 21:00'
		];

		$s.fbSessions = EF.getFBArray('sessions');
		$s.fbSessions.$loaded(function afterTeamsLoaded() {
			console.log('sessions loaded');
			console.log($s.fbSessions);
		});

		$s.doTheCodez = function doTheCodez() {
			// var fbRef = EF.getFB('sessions');
			// _.forEach(initialSessions, function eachSession(sess) {
			// 	var newSession = fbRef.push();
			// 	newSession.startTime = sess.startTime;
			// 	console.log('new id for this session is ' + newSession.key());
			// 	console.log(newSession);
			// });

			_.forEach(initialSessions, function eachSession(sess) {
				$s.fbSessions.$add(sess).then(function addSessionThen(newSess) {
					console.log('new session created with id: ' + newSess.key());

					_.forEach(_.range(1, 11), function eachNum(i) {
						newSess.child('slots/' + i).set({
							id: i,
							name: null
						});
					});
				});
			});
		};
	}
]);
