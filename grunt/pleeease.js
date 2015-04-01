module.exports = function exportPleeease(grunt) {
	grunt.config('pleeease', {
		dev: {
			options: {
				optimizers: {
					minifier: false
				}
			},
			files: {
				'<%= distPath %>trapped.css': '<%= distPath %>trapped.css'
			}
		},
		prod: {
			options: {
				optimizers: {
					minifier: true
				}
			},
			files: {
				'<%= distPath %>trapped.css': '<%= distPath %>trapped.css'
			}
		}
	});

	grunt.loadNpmTasks('grunt-pleeease');
};
