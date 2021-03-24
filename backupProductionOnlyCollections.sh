#!/usr/bin/env bash
gcloud config set project blank-297915
gcloud beta firestore export gs://blank-297915-backups/games/8febr --collection-ids='games'
