#!/usr/bin/env node
// Posts the journey reference cards (payloads/jornadas/*.json) to the DLux Slack and pins the map.
// Operational cards (payloads/cartoes/) are not posted here — the daemon posts those with real data.
//
//   SLACK_BOT_TOKEN=xoxb-… node clients/sara/slack-block-kits/post.mjs            # post + pin
//   node clients/sara/slack-block-kits/post.mjs --dry-run                           # list what would be posted
//
// The token is the DLux workspace bot token (scopes: chat:write, pins:write), and the bot must be in #marketing.

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = join(dirname(fileURLToPath(import.meta.url)), 'payloads', 'jornadas')
const PIN = '00-mapa-jornadas.json'
const dryRun = process.argv.includes('--dry-run')
const token = process.env.SLACK_BOT_TOKEN

if (!dryRun && !token) {
  console.error('Set SLACK_BOT_TOKEN (the DLux workspace bot token), or pass --dry-run.')
  process.exit(1)
}

async function slack(method, body) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(`${method}: ${data.error}${data.response_metadata?.messages ? ` ${data.response_metadata.messages.join('; ')}` : ''}`)
  return data
}

// The map goes first so it sits above the journey cards it points to.
const files = readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()

for (const file of files) {
  const payload = JSON.parse(readFileSync(join(DIR, file), 'utf8'))
  if (dryRun) {
    console.log(`would post ${file} → ${payload.channel}${file === PIN ? ' (and pin)' : ''}`)
    continue
  }
  const { channel, ts } = await slack('chat.postMessage', payload)
  console.log(`posted ${file} → ${channel} (${ts})`)
  if (file === PIN) {
    await slack('pins.add', { channel, timestamp: ts })
    console.log('  pinned')
  }
}
