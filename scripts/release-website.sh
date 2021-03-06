#!/bin/bash
set -euxo pipefail
npm run clean
npm run build
tempdir="$(mktemp -d)"
trap 'rm -rf -- "${tempdir}"' EXIT
cp -vR public "${tempdir}"
VERSION="$(jq -r .version package.json)"
HASH="$(git rev-parse --short HEAD)"
git stash --all
git checkout raytracer.xyz
git clean -fd
git rm -r .
mv -v "${tempdir}/public"/* ./
git add .
git ci -m "Release version ${VERSION} (${HASH})"
git push origin raytracer.xyz
git checkout main
git stash pop
