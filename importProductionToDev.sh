#!/usr/bin/env bash
gcloud config set project ebombo-events-dev
gcloud firestore import gs://ebombo-events.appspot.com/backup/7apri
