escapeApp.controller('SignUpCtrl', [
	'$scope',
	'EscapeFactory',
	function EscapeCtrl($s, EF) {
		'use strict';

		$s.maxSlotsPerSession = 10;
		$s.initialSessions = [
			'2015-06-19_18-00',
			'2015-06-19_19-00',
			'2015-06-19_20-00',
			'2015-06-19_21-00',

			'2015-06-20_10-00',
			'2015-06-20_11-00',
			'2015-06-20_12-00',

			'2015-06-20_14-00',
			'2015-06-20_15-00',
			'2015-06-20_16-00',

			'2015-06-20_18-00',
			'2015-06-20_19-00',
			'2015-06-20_20-00',
			'2015-06-20_21-00'
		];

		$s.fbSessions = EF.getFBArray('sessions');
		$s.fbSessions.$loaded(function afterTeamsLoaded() {
			console.log('sessions loaded');
			console.log($s.fbSessions);
		});

		$s.addPlayer = function addPlayer(sessionId, slotId, playerName) {
			EF.getFB('sessions/' + sessionId + '/slots/' + slotId).set({name: playerName});
			console.log('Player ' + playerName + ' was added to the game at ' + sessionId + ' in slot #' + slotId + '!');
		};

			// All of this stuff was used to initially create the sessions in the database...
		$s.setInitialSessions = function setInitialSessions() {
			var initialSessions = [
				'2015-06-19_18-00',
				'2015-06-19_19-00',
				'2015-06-19_20-00',
				'2015-06-19_21-00',

				'2015-06-20_10-00',
				'2015-06-20_11-00',
				'2015-06-20_12-00',

				'2015-06-20_14-00',
				'2015-06-20_15-00',
				'2015-06-20_16-00',

				'2015-06-20_18-00',
				'2015-06-20_19-00',
				'2015-06-20_20-00',
				'2015-06-20_21-00'
			];

			_.forEach(initialSessions, function eachSession(sess) {
				_.forEach(_.range(1, 11), function eachNum(i) {
					theSessions.child(sess + '/slots/' + i).set({
						id: i,
						name: null
					});
				});
			});
		};
	}
]);
