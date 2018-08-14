import 'babel-polyfill';

import chalk from 'chalk';
import chokidar from 'chokidar';
import del from 'del';
import gulp from 'gulp';
import gulpBabel from 'gulp-babel';
import gulpEslint from 'gulp-eslint';
import gulpMocha from 'gulp-mocha';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpUtil from 'gulp-util';
import path from 'path';

const srcBaseDir = path.resolve('src');
const srcPattern = path.resolve(srcBaseDir, '**/!(*.spec).js');
const specPattern = path.resolve(srcBaseDir, '**/*.spec.js');

const libBaseDir = path.resolve('lib');

function compile(pattern, logErrors) {
    function handleCompileError(error) {
        if (!logErrors) throw error;

        gulpUtil.log(error.toString());

        this.end();
    }

    gulpUtil.log('Compiling', chalk.magenta(pattern));

    return gulp.src(pattern, { base: srcBaseDir })
        .pipe(gulpSourcemaps.init())
        .pipe(gulpBabel()).on('error', handleCompileError)
        .pipe(gulpSourcemaps.write('.', {
            includeContent: false,
            sourceRoot: file => {
                let srcDir = path.dirname(file.path);
                let libDir = path.resolve(libBaseDir, path.relative(srcBaseDir, srcDir));

                return path.relative(libDir, srcBaseDir);
            }
        }))
        .pipe(gulp.dest('lib'));
}

gulp.task('test', [ 'test:eslint', 'test:mocha' ]);

gulp.task('test:eslint', [ 'test:eslint:gulpfile', 'test:eslint:src', 'test:eslint:spec' ]);

gulp.task('test:eslint:gulpfile', () => {
    return gulp.src(__filename)
        .pipe(gulpEslint())
        .pipe(gulpEslint.format())
        .pipe(gulpEslint.failAfterError());
});

gulp.task('test:eslint:src', () => {
    return gulp.src(srcPattern)
        .pipe(gulpEslint())
        .pipe(gulpEslint.format())
        .pipe(gulpEslint.failAfterError());
});

gulp.task('test:eslint:spec', () => {
    return gulp.src(specPattern)
        .pipe(gulpEslint())
        .pipe(gulpEslint.format())
        .pipe(gulpEslint.failAfterError());
});

gulp.task('test:mocha', [], () => {
    return gulp.src(specPattern, { read: false })
        .pipe(gulpMocha({ require: [ 'babel-core/register', 'babel-polyfill' ] }));
});

gulp.task('compile', () => compile(srcPattern));

gulp.task('watch:compile', [ 'compile' ], () => {
    chokidar.watch(srcPattern, { ignoreInitial: true })
        .on('add', srcPath => compile(srcPath, true))
        .on('change', srcPath => compile(srcPath, true))
        .on('unlink', srcPath => {
            let libPath = path.resolve(libBaseDir, path.relative(srcBaseDir, srcPath));

            del([libPath, `${libPath}.map`]);
        });
});

gulp.task('clean', [ 'clean:coverage', 'clean:lib' ]);

gulp.task('clean:coverage', () => del([ '.nyc_output', 'coverage' ]));

gulp.task('clean:lib', () => del([ libBaseDir ]));