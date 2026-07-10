#!/usr/bin/env bun
import { run } from './cli.js'

await run(process.argv.slice(2))
