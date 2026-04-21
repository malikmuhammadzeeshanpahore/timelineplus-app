#!/bin/bash
# Use the portable Node.js v20 binary
export PATH=$PWD/.node_bin/node-v20.18.0-linux-x64/bin:$PATH

echo "Starting Server with Node $(node -v)..."
npm run server
