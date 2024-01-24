
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

function buildQAHTML() {
    fs.readFile('./buildData/qa.json', (err, data) => {
        config.template.index.centerqa = '';
        config.template.index.leftqa = '';
        config.template.index.rightqa = '';
        if(err) {
            console.error(`Error reading qa.json file`);
            console.error(err);
            console.log('Will skip generating QA section');

            return;
        }
        let qa = JSON.parse(data);
        console.log(qa);

        let center = '';
        let left = '';
        let right = '';
        for(let i = 0; i < qa.list.length; i++) {
            center = center + `
                <br>
                <strong>${qa.list[i].q}</strong>
                <br>
                <br>

            `;
            if(Array.isArray(qa.list[i].a)) {
                for(let j = 0 ; j < qa.list[i].a.length; j++) {
                    center = center + `
                        <p>${qa.list[i].a[j]}</p>
                    `
                }
            } else {
                center = center + `

                 <p>${qa.list[i].a}</p>

            `;
            }
        }
        config.template.index.centerqa = center;
        config.template.index.leftqa = left;
        config.template.index.rightqa = right;
        
        // for(let i = 0; i < qa.list.length; i++) {
        //     if((i%2) == 1) {
        //         right = right + `
        //          <strong>${qa.list[i].q}</strong>
        //          <p>${qa.list[i].a}</p>
        //         `;
        //     } else {
        //         left = left + `
        //         <strong>${qa.list[i].q}</strong>
        //         <p>${qa.list[i].a}</p>
        //        `;
        //     }
        // }
        // config.template.index.centerqa = center;
        // config.template.index.leftqa = left;
        // config.template.index.rightqa = right;
    });
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
        buildQAHTML();
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