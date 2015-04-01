trappedApp.controller('TrappedCtrl', [
	'$scope',
	'$interval',
	'$timeout',
	'$http',
	function TrappedCtrl($s, $interval, $timeout, $http) {
		'use strict';

		function Hello($s, $http) {
			$http.get('http://rest-service.guides.spring.io/greeting')
				.success(function getData(data) {
					$s.greeting = data;
				});
		}

		//	initialize scoped variables
		_.assign($s, {
			clues: 0,
			time: 60 * 60 * 1000,
			gameStarted: false
		});

		$s.startGame = function startGame() {
			this.Hello(this, $http);
		}
	}
]);
