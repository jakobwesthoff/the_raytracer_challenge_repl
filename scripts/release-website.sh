#!/bin/bash
set -euxo pipefail
npm run clean
npm run build
mv -v public release
VERSION="$(jq -r .version package.json)"
HASH="$(git rev-parse --short HEAD)"
git checkout raytracer.xyz
cp -vR release/* ./
while read -r path; do
    git add "${path#./release/}"
done < <(find ./release -mindepth 1)
git ci -m "Release version ${VERSION} (${HASH})"
git push origin raytracer.xyz
git checkout main
rm -rf release
