var trappedApp = angular.module('trappedApp', []);

trappedApp.run(function runWithDependencies($rootScope) {
	$rootScope._ = window._;
});
