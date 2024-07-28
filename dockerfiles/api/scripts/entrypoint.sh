#!/bin/bash

/usr/src/app/wait-for-it.sh db:3306 -t 0 -- sh /usr/src/app/build.sh
