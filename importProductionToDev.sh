#!/usr/bin/env bash
gcloud config set project ebombo-events-dev
gcloud firestore import gs://ebombo-events-dev.appspot.com/backup/27Jul
