#!/usr/bin/env node
// Brings the journey cards already in #marketing in line with payloads/jornadas/, in place:
//   * a card in posted.json whose payload still exists  -> chat.update (same message, same pin)
//   * a card in posted.json whose payload was removed   -> chat.delete
//   * a payload with no card in posted.json             -> reported; post it with post.mjs
//
//   SLACK_BOT_TOKEN=xoxb-… node clients/sara/slack-block-kits/update.mjs
//   node clients/sara/slack-block-kits/update.mjs --dry-run
//
// A journey paused from its card keeps its "Em pausa" line and its Retomar button: the
// current message is read first and those two pieces are carried over. Texts changed with
// "Editar mensagens" are NOT kept — the payload wins, and the run says which cards it redrew.

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const DIR = join(ROOT, 'payloads', 'jornadas')
const posted = JSON.parse(readFileSync(join(ROOT, 'posted.json'), 'utf8'))
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
  if (!data.ok) throw new Error(`${method}: ${data.error}`)
  return data
}

// Carry a live pause over onto the new blocks (see dlux_journeys.with_pause_state).
function keepPause(current, next) {
  const pause = (current || []).find((b) => /^dlux\.j\d\.pausa$/.test(b.block_id || ''))
  if (!pause) return next
  const j = pause.block_id.split('.')[1]
  const curActs = (current || []).find((b) => b.block_id === `dlux.${j}.jornada`)
  const resume = curActs?.elements?.find((e) => e.action_id === `dlux.${j}.jornada.retomar`)
  const blocks = next.map((b) => ({ ...b }))
  const i = blocks.findIndex((b) => b.block_id === `dlux.${j}.jornada`)
  if (i < 0) return next
  if (resume) {
    blocks[i] = { ...blocks[i], elements: blocks[i].elements.map((e) => (e.action_id === `dlux.${j}.jornada.pausar` ? resume : e)) }
  }
  blocks.splice(i, 0, pause)
  return blocks
}

const channel = posted.channel
const names = Object.keys(posted.messages)
for (const name of names) {
  const ts = posted.messages[name]
  const file = join(DIR, `${name}.json`)
  if (!existsSync(file)) {
    if (dryRun) { console.log(`would delete ${name} (${ts})`); continue }
    try {
      await slack('chat.delete', { channel, ts })
      console.log(`deleted ${name} (${ts}) — remove it from posted.json`)
    } catch (e) {
      if (String(e.message).endsWith('message_not_found')) console.log(`${name} (${ts}) already gone — remove it from posted.json`)
      else throw e
    }
    continue
  }
  const payload = JSON.parse(readFileSync(file, 'utf8'))
  if (dryRun) { console.log(`would update ${name} (${ts})`); continue }
  let blocks = payload.blocks
  try {
    const { messages } = await slack('conversations.history', { channel, latest: ts, inclusive: true, limit: 1 })
    if (messages?.[0]?.ts === ts) blocks = keepPause(messages[0].blocks, blocks)
  } catch (e) {
    console.log(`  (could not read ${name} first: ${e.message} — updating without keeping a pause)`)
  }
  await slack('chat.update', { channel, ts, text: payload.text, blocks })
  console.log(`updated ${name} (${ts})`)
}

for (const f of (await import('node:fs')).readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()) {
  const name = f.replace(/\.json$/, '')
  if (!(name in posted.messages)) console.log(`${name} has no card yet — post it with post.mjs and add its ts to posted.json`)
}
