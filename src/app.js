var trappedApp = angular.module('trappedApp', ['firebase']);

trappedApp.run(function runWithDependencies($rootScope) {
	$rootScope._ = window._;
});
