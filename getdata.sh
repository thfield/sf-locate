#!/bin/bash
if [ ! -d "data/raw" ]; then
  mkdir -p data/raw
fi
cd data/raw

# download file passed as 1st param
file=${1:-"../../datasources.txt"}

for i in `cat $file` ; do
    path=`dirname $i`
    id=`basename $path`
  if [ -e $id ]; then
    echo "File exists: $id.csv"
  else
    echo "Downloading: $id.csv"
    curl $i > $id.csv
  fi

done
