#!/usr/bin/env bash
# One-time setup for a fresh cloud session. Safe to re-run.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; M="$HERE/models"; mkdir -p "$M"
pip install -q --break-system-packages kokoro-onnx soundfile playwright pillow numpy >/dev/null 2>&1 || true
[ -s "$M/kokoro-v1.0.onnx" ] || curl -sSL -o "$M/kokoro-v1.0.onnx" https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
[ -s "$M/voices-v1.0.bin" ] || curl -sSL -o "$M/voices-v1.0.bin" https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
which ffmpeg >/dev/null && echo "setup ok"
