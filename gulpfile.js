import gulp from 'gulp';
import template from 'gulp-template';
import data from 'gulp-data';

export default () => (
	gulp.src('index.html')
		.pipe(data(() => ({name: 'Sindre'})))
		.pipe(template(null, {
			interpolate: /{{(.+?)}}/gs
		}))
		.pipe(gulp.dest('output/'))
);

// // import gulp from "gulp";

// const {src, dest} = require('gulp');
// const uglify = require('gulp-uglify');
// const rename = require('gulp-rename');
// var sass = require('gulp-sass')(require('sass'));
// const data = require('gulp-data');

// function minJS() {
//     return src('js/*.js')
//         .pipe(uglify())
//         .pipe(dest(`output/`));
// }

// function compSASS() {
//     return src(`./sass/styles.scss`)
//         .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
//         .pipe(rename({basename: 'styles.min'}))
//         .pipe(dest(`output/`));
// }

// function tempHTML() {
//     return src('index.html')
// }
 
// function print() {
//     console.log(`done`);
// }

// function defaultTask(cb) {
//     minJS();
//     compSASS();
//     print();

//     cb();
//   }
  
//   exports.default = defaultTask