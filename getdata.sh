#!/bin/bash
if [ ! -d "data/raw" ]; then
  mkdir -p data/raw
fi

# download file passed as 1st param
file=${1:-"datasources.txt"}
cd data/raw

for i in `cat ../../sources/$file` ; do
    path=`dirname $i`
    id=`basename $path`
  if [ -e $id.csv ]; then
    echo "File exists: $id.csv"
  else
    echo "Downloading: $id.csv"
    # curl $i > $id.csv
  fi

done
