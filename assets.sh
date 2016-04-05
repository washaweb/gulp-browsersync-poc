#!/bin/bash

publish() {
  rsync -e ssh -avz ./ lamp-lxc:/home/washaweb/dev/gulp-browsersync-starter
}

$*
