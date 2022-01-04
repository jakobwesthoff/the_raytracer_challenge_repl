#!/bin/bash
VERSION="$(jq -r .version package.json)"
HASH="$(git rev-parse --short HEAD)"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

GIT_VERSION="${VERSION}-${BRANCH}+${HASH}"
BUILD_DATE="$(date -R)"
WASM_WRAPPER_INFO="$(pushd rust >/dev/null && cargo tree -e build && popd >/dev/null)"
WASM_RAYTRACER_INFO="$(pushd rust >/dev/null && cargo tree -e normal -p the_ray_tracer_challenge | head -n1 && popd >/dev/null)"

cat <<EOF
{
  "gitVersion": "${GIT_VERSION}",
  "buildDate": "${BUILD_DATE}",
  "wasmWrapperInfo": "${WASM_WRAPPER_INFO}",
  "wasmRaytracerInfo": "${WASM_RAYTRACER_INFO}"
}
EOF
