#!/usr/bin/env bash
gcloud config set project blank-297915-dev
gcloud firestore import gs://blank-297915-backups/games/8febr
