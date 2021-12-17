#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

git init
git add -A
git commit -m 'New Deployment'

git push -f git@github.com:Trevor-Warthman/Trevor-Warthman.github.io.git master:gh-pages

cd -
