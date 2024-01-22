
import gulp from 'gulp';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import template from 'gulp-template';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import fs from 'graceful-fs';
const sass = gulpSass(dartSass);
// const data = require('gulp-data');

function minifyJS() {
    gulp.src('./js/scripts.js')
        .pipe(uglify())
        .pipe(rename({basename: 'scripts.min'}))
        .pipe(gulp.dest('./js'));
}

function csass() {
    gulp.src('./sass/styles.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({basename: 'styles.min'}))
        .pipe(gulp.dest('./css'));
}

function templateHTML() {
    fs.readFile('./buildData/config.json', (err, data) => {
        if(err) {
            console.log(err);
        }

        let cfgJSON = JSON.parse(data);
        if(cfgJSON.debug) {
            console.log(`debug on`);
            cfgJSON.template.index.script = 'scripts.js';
        } else {
            console.log(`debug off`);
            cfgJSON.template.index.script = 'scripts.min.js';
        }
        
        gulp.src('index_template.html')
		.pipe(template(cfgJSON.template.index))
        .pipe(rename('index.html'))
		.pipe(gulp.dest('./'))
    });

}


function defaultTask(cb) {
    templateHTML();
    csass();
    minifyJS();
    cb();
}
  
export default defaultTask;