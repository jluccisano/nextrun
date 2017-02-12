#!/bin/bash

./mongo 192.95.25.173:27017/nextrun localhost:27017/nextrun --eval 'db.workouts.remove({"date": { $lt: new Date() }})'



"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"