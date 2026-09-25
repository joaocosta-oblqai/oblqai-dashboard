# Clínica DLux — Slack Block Kit por jornada

Block Kit payloads for every DLux customer journey (Jornadas do Cliente), in pt-PT, ready for the clinic's Slack. Each JSON file is a `chat.postMessage` body (`{ text, blocks }`) that the Slack daemon on the DLux VPS can post as is.

**Where they go:** the marketing channels in the DLux Slack workspace. That workspace isn't the OBLQAI one, so the daemon on the DLux VPS posts these with its own bot token; channel ids live in its config, not here.

`build.mjs` is the source. Edit the file, then regenerate:

```bash
node clients/sara/slack-block-kits/build.mjs           # write payloads/ + validate
node clients/sara/slack-block-kits/build.mjs --check   # validate only, fails if payloads/ is stale
node clients/sara/slack-block-kits/build.mjs --links   # also print a Block Kit Builder link per payload
```

The validator checks Slack's limits on every payload: 50 blocks, header text 150 chars, section text 3000, fields 10, buttons 75 chars, overflow menus 2–5 options, confirm-dialog lengths, unique `action_id`/`block_id`, and escaped `<` / `>` in mrkdwn.

## The journeys

| Jornada | Mode | Reference card |
|---|---|---|
| Map of all journeys (pin this) | — | `payloads/jornadas/00-mapa-jornadas.json` |
| J1 · Novo Cliente | :zap: automatic | `payloads/jornadas/j1-novo-cliente.json` |
| J2 · Cliente Recorrente (includes the old J7) | :zap: automatic | `payloads/jornadas/j2-cliente-recorrente.json` |
| J3 · Reativação | :lock: approval | `payloads/jornadas/j3-reativacao.json` |
| J4 · Recuperação de falta | waitlist :zap: · missed-session contact :lock: | `payloads/jornadas/j4-recuperacao-falta.json` |
| J5 · Plano / Pack | :lock: approval | `payloads/jornadas/j5-plano-pack.json` |
| J6 · Formação Profissional | :zap: automatic | `payloads/jornadas/j6-formacao.json` |
| J8 · Campanhas | :lock: approval | `payloads/jornadas/j8-campanhas.json` |

J7 no longer exists; its treatment-care messages live inside J2, grouped by treatment type. The reference cards list each journey's touchpoints: trigger, timing, mode and message template. Every card ends with the same controls: *Ver por decidir* (approval journeys only), *Editar mensagens*, *Ver o registo* and *Pausar jornada*.

## Operational cards (what the team acts on)

Automatic journeys (J1, J2, J4 waitlist, J6) post nothing when they succeed. They show up only in the failures card. Every approval journey has its own card.

| Card | When it's posted | File |
|---|---|---|
| Envios automáticos · falhas | A J1/J2/J4-waitlist/J6 send fails | `payloads/cartoes/automaticos-falhas.json` |
| J3 · lista da onda (batch) | Every wave, daily at 08:00 | `payloads/cartoes/j3-reativacao-lista.json` |
| J3 · uma a uma | *Rever uma a uma* | `payloads/cartoes/j3-reativacao-uma-a-uma.json` |
| J3 · a editar (in place) | *Editar* on a row | `payloads/cartoes/j3-reativacao-editar.json` |
| J3 · em curso | After *Aprovar* while the queue sends | `payloads/cartoes/j3-reativacao-em-curso.json` |
| J3 · revisão 30 dias | 30 days after a campaign starts | `payloads/cartoes/j3-revisao-30-dias.json` |
| J4 · falta à sessão | 1h after a no-show | `payloads/cartoes/j4-falta.json` |
| J5 · pack a terminar | Next-to-last pack session *concluída* in Buk | `payloads/cartoes/j5-pack-renovacao.json` |
| J8 · aniversários | Weekly | `payloads/cartoes/j8-aniversarios.json` |
| J8 · nova campanha | A seasonal or flash campaign is proposed | `payloads/cartoes/j8-nova-campanha.json` |

All operational cards use demo data: invented names and `demo.*` ids. Like the earlier mockups, they carry the `:construction: MAQUETA` footer. The daemon swaps in real data and drops that footer.

## Wiring notes for the daemon

- **Routing.** Every `action_id` starts with `dlux.<jornada>.`. On per-row controls (`…linha.menu:<cliente>`, `…falha.menu:<cliente>`, `…linha.ficha:<cliente>`) the client id follows the `:`, which keeps ids unique within a message. Route on the part before the `:`.
- **Values are ids only.** A value such as `{"card":"j3-onda-1","cliente":"demo.c_0412"}` never carries message text or prices. Re-read the record at click time, and keep the approval-card guards: one shot per card and artifact, the actor check against `roles.json`, resolved state that survives a restart, and visible failures.
- **Batch semantics.** *Aprovar as N* approves only rows still *por decidir*. It never touches rows the team has edited or refused.
- **Row states.** Only rows still *por decidir* get the overflow menu. Rows that are *na fila* or *enviada* get only *Ver a ficha*.
- **Editing in place.** `j3-reativacao-editar.json` puts an `input` block inside a message. Slack accepts that, but we haven't yet confirmed that the typed value reaches the handler in `block_actions` → `state.values["dlux.j3.editar.texto"]["dlux.j3.editar.valor"]`. Test this before relying on it. If it doesn't arrive, open the same input in a modal.
- **Size.** One section per row keeps the J3 list at 14 blocks for 4 clients. Above roughly 40 clients, paginate to stay under 50 blocks.
- **Posting.** Post a payload as is:

  ```python
  payload = json.load(open("payloads/cartoes/j4-falta.json"))
  client.chat_postMessage(channel=CHANNEL_ID, **payload)
  ```

## Message texts: what's confirmed and what's a draft

- **Taken from the September mockups or from Ana's brief:**
  - J3 reactivation template and its per-treatment offers.
  - J4 message to a client who missed a session.
  - J5 renewal message.
  - J8 birthday message.
  - J2 prova de presença, from the proposal.
  - All journey timings and rules.
- **Written here as drafts:**
  - J1 first-contact reply.
  - J2 care and follow-up messages (steps 1–5, 7–9).
  - J4 waitlist offer.
  - J6 portfolio sequence.
  - J8 seasonal and flash templates.

  Compare these with `Sara-Mensagens-SMS-Jornadas-PT.pdf` (the 2026-07-11 list the clinic reviewed) and replace them with the approved wording before go-live.
- **Decided 2026-09-25:** the J2 Google review request goes out automatically 3 days after the visit, and J8 flash campaigns are in (approval required, like every campaign).

## Open gates before go-live

- **RGPD consent.** Source decided: the consent checkbox on the Buk booking form ("Aceito receber informações comerciais e promoções adaptadas ao meu perfil e interesses"). Still to do: confirm Buk exposes that field per client, and store it with channel, date and consent version before J3/J8 bulk sends run.
- **WhatsApp.** The VPS currently sends through WhatsApp Web. After the move to the Cloud API, messages that open a conversation need Meta-approved templates.
- **Pack flag in Buk.** J5 depends on it, and it's free text today, so confirm its format first.
