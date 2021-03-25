#!/usr/bin/env bash
gcloud config set project ebombo-events
gcloud firestore import gs://ebombo-events-landings/25marzv1
