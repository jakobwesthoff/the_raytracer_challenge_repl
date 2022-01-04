#!/bin/bash
set -euxo pipefail
npm run clean
npm run build
VERSION="$(jq -r .version package.json)"
HASH="$(git rev-parse --short HEAD)"
git checkout raytracer.xyz
cp -vR public/* ./
while read -r path; do
    git add "${path#./public/}"
done < <(find ./public -mindepth 1)
git ci -m "Release version ${VERSION} (${HASH})"
git push origin raytracer.xyz
git checkout main
