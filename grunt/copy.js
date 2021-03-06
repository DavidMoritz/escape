module.exports = function exportCopy(grunt) {
	grunt.config('copy', {
		dev: {
			files: [
				// copy all html pages
				{
					expand: true,
					cwd: 'src/html',
					src: ['**'],
					dest: '<%= distRoot %>/html'
				},

				// copy all bootstrap fonts
				{
					expand: true,
					cwd: 'lib/bootstrap/fonts/',
					src: ['**'],
					dest: '<%= distRoot %>/fonts/'
				},

				// copy all fontawesome fonts
				{
					expand: true,
					cwd: 'lib/fontawesome/fonts/',
					src: ['**'],
					dest: '<%= distRoot %>/fonts/'
				},

				// copy all custom fonts
				{
					expand: true,
					cwd: 'src/fonts/',
					src: ['**'],
					dest: '<%= distRoot %>/fonts/'
				},

				// copy Angular for head
				{
					src: 'lib/angular/angular.min.js',
					dest: '<%= distPath %>angular.js'
				},

				// copy all img files too
				{
					expand: true,
					cwd: 'src/img',
					src: ['**'],
					dest: '<%= distRoot %>/img'
				},

				// copy favicon & apple-icon
				{
					expand: true,
					cwd: 'src/',
					src: ['favicon.ico', 'apple-touch-icon.png'],
					dest: '<%= distRoot %>/'
				}
			]
		},
		tests: {
			files: [

				// Create tests
				{
					src: '<%= distRoot %>/tests/tests.html',
					dest: '<%= distRoot %>/tests.html'
				},

				// Create tests
				{
					src: 'src/tests/tests.js',
					dest: '<%= distPath %>tests.js'
				}
			]
		},
		prod: {
			files: [
				// copy all images / svgs
				{
					expand: true,
					cwd: 'src/',
					src: ['*.html'],
					dest: '<%= distRoot %>'
				},

				// copy all fontawesome fonts
				{
					expand: true,
					cwd: 'lib/fontawesome/fonts/',
					src: ['**'],
					dest: '<%= distRoot %>/fonts/'
				},

				// copy all bootstrap fonts
				{
					expand: true,
					cwd: 'lib/bootstrap/fonts/',
					src: ['**'],
					dest: '<%= distRoot %>/fonts/'
				},

				// copy Angular for head
				{
					src: 'lib/angular/angular.min.js',
					dest: '<%= distPath %>angular.js'
				},

				// copy Angular for head
				{
					src: 'lib/angular/angular.min.js.map',
					dest: '<%= distPath %>angular.min.js.map'
				},

				// copy all img files too
				{
					expand: true,
					cwd: 'src/',
					src: ['*.png'],
					dest: '<%= distRoot %>/inc/'
				}
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
};
