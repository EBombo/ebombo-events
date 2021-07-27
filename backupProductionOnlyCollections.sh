#!/usr/bin/env bash
gcloud config set project ebombo-events
gcloud beta firestore export gs://ebombo-events.appspot.com/backup/27Jul --collection-ids='seo,landings'