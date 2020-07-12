#!/bin/bash
if [ ! -d "geo" ]; then
  mkdir -p geo
fi

file="geosources.txt"
cd geo

for i in `cat ../sources/$file` ; do
  foo=`basename $i`
  id=${foo:0:9}
  if [ -e $id.json ]; then
    echo "File exists: $id.json"
  else
    echo "Downloading: $id.json"
    curl $i > $id.json
  fi

done
