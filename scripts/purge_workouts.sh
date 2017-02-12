#!/bin/bash

./mongo ip:port/nextrun localhost:port/nextrun --eval 'db.workouts.remove({"date": { $lt: new Date() }})'



"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
