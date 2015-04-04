var trappedApp = angular.module('trappedApp', ['firebase']);

trappedApp.run(function runWithDependencies($rootScope) {
	$rootScope._ = _;
	$rootScope.moment = moment;
});
