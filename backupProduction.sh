#!/usr/bin/env bash
gcloud config set project ebombo-events
gcloud beta firestore export gs://ebombo-events-backups
