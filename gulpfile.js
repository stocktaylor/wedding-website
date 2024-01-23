
import gulp from 'gulp';
import uglifyES from 'gulp-uglify-es';
import rename from 'gulp-rename';
import template from 'gulp-template';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import {deleteSync} from 'del';
import fs from 'graceful-fs';
const sass = gulpSass(dartSass);
const uglify = uglifyES.default;

let config = {};


function cleanupOutput() {
    deleteSync(['output']);
}

function minifyJS() {
    gulp.src('./js/scripts.js')
        .pipe(uglify())
        .pipe(rename({basename: 'scripts.min'}))
        .pipe(gulp.dest('./output/js'));
}

function csass() {
    gulp.src('./sass/styles.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({basename: 'styles.min'}))
        .pipe(gulp.dest('./output/css'));
}

function templateHTML() {
    gulp.src('index_template.html')
		.pipe(template(config.template.index))
        .pipe(rename('index.html'))
		.pipe(gulp.dest('./output'))
}

function copyCSSDeps() {
    gulp.src('./css/*.css')
        .pipe(gulp.dest('./output/css'));
    gulp.src('./node_modules/animate.css/animate.min.css')
        .pipe(gulp.dest('./output/css'))
    gulp.src('./node_modules/font-awesome/css/font-awesome.min.css')
        .pipe(gulp.dest('./output/css'))
}

function copyJSDeps() {
    gulp.src('./js/vendor/*')
        .pipe(gulp.dest('./output/js/vendor'));
    gulp.src('./js/fancybox.umd.js')
        .pipe(gulp.dest('./output/js'));
    gulp.src('./js/jquery.counterup.min.js')
        .pipe(gulp.dest('./output/js'));
    gulp.src('./js/jquery.flexslider-min.js')
        .pipe(gulp.dest('./output/js'));
    gulp.src('./js/jquery.mb.YTPlayer.min.js')
        .pipe(gulp.dest('./output/js'));
    if(config.debug) {
        gulp.src('./js/scripts.js')
            .pipe(gulp.dest('./output/js'));
    }
    gulp.src('./node_modules/waypoints/lib/jquery.waypoints.min.js')
        .pipe(gulp.dest('./output/js'));
        
}

function copyImages() {
    gulp.src('./img/*')
        .pipe(gulp.dest('./output/img'))
}

function copyFonts() {
    gulp.src('./fonts/*')
        .pipe(gulp.dest('./output/fonts'))
}

function defaultTask(cb) {
    fs.readFile('./buildData/config.json', (err, data) => {
        if(err) {
            console.log(err);
        }

        config = JSON.parse(data);
        if(config.debug) {
            console.log(`debug on`);
            config.template.index.script = 'scripts.js';
        } else {
            console.log(`debug off`);
            config.template.index.script = 'scripts.min.js';
        }
        
        cleanupOutput();
        templateHTML();
        csass();
        if(!config.debug)
        minifyJS();
        copyCSSDeps();
        copyJSDeps();
        copyImages();
        copyFonts();
        cb();
        
    });
}
  
export default defaultTask;