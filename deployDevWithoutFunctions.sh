#!/usr/bin/env bash
npm run build && firebase deploy -P dev --except functions
