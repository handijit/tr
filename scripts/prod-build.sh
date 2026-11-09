#!/bin/sh
set -e

# Leftovers of an earlier build must not reach the tarball.
rm -rf build
rollup -c
