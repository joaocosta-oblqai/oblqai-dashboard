# Clínica DLux — Slack Block Kit por jornada

Block Kit payloads for every DLux customer journey (Jornadas do Cliente), in pt-PT, ready for the clinic's Slack. Each JSON file is a `chat.postMessage` body (`{ channel, text, blocks }`) that the Slack daemon on the DLux VPS can post as is.

**Where they go:** `#marketing` (`C0BMCASQL1L`) in the Clínica DLux Slack workspace — set as `channel` in every payload. That workspace isn't the OBLQAI one, so the daemon on the DLux VPS posts them with its own bot token, and the bot must be a member of `#marketing`.

`build.mjs` is the source. Edit the file, then regenerate:

```bash
node clients/sara/slack-block-kits/build.mjs           # write payloads/ + validate
node clients/sara/slack-block-kits/build.mjs --check   # validate only, fails if payloads/ is stale
node clients/sara/slack-block-kits/build.mjs --links   # also print a Block Kit Builder link per payload
```

To put the journey cards on the DLux Slack, run this on the DLux VPS with that workspace's bot token (scopes `chat:write` and `pins:write`, and the bot must be in `#marketing`):

```bash
SLACK_BOT_TOKEN=xoxb-… node clients/sara/slack-block-kits/post.mjs            # posts the map + 7 journey cards, pins the map
node clients/sara/slack-block-kits/post.mjs --dry-run                           # lists what it would post
```

It posts only `payloads/jornadas/`. The operational cards in `payloads/cartoes/` hold demo data and are posted by the daemon when real events happen.

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
  client.chat_postMessage(**payload)  # channel is already in the payload
  ```

## Message texts

Every journey message is the approved wording from `Sara-Mensagens-SMS-Jornadas-PT.pdf` (the 17-message list the clinic reviewed, 2026-07-11). Triggers and rules come from `Sara-Jornadas-Cliente.pptx` (updated with Ana's feedback, 2026-07-04). Placeholders keep the PDF's names: `{Nome}`, `{tratamento}`, `{data}`, `{hora}`, `{oferta}`, `{campanha}`, `{desconto}`, `{serviço}`, `{período}`, `{link Buk}`, `{link Google}`.

- **J3 reactivation:** uses the approved base text. The live waves add "Da última vez fez {tratamento}." when that's safe to say (never for criolipólise), with per-treatment offers from the September mockups.
- **Decided 2026-09-25:**
  - The J2 Google review request goes out automatically 3 days after the visit, once per client.
  - Both J8 flash campaigns (reactivation and loyalty) are in, with approval like every campaign.
- **J6 last follow-up (1 month):** was the clinic's own proposal and has been accepted.
- **Operational cards:** the example messages are these templates filled with demo data.

## Open before go-live

- **RGPD consent.** Source decided: the consent checkbox on the Buk booking form ("Aceito receber informações comerciais e promoções adaptadas ao meu perfil e interesses"). Still to do: confirm Buk exposes that field per client, and store it with channel, date and consent version before J3/J8 bulk sends run.
- **WhatsApp.** The VPS currently sends through WhatsApp Web. After the move to the Cloud API, messages that open a conversation need Meta-approved templates.
- **Packs (J5).** The team writes a note on the client in Buk (e.g. "próximas 5 sessões = pack XPTO"), and the daemon reads it. Keep that wording consistent so it can be parsed.
- **Still to confirm with the clinic (from the journeys deck):**
  - **First-time laser or criolipólise clients:** do they get both messages (first visit and treatment), or only one?
  - **Other treatments** (radiofrequência, pressoterapia, massagens…): generic care messages, or nothing?
  - **Care PDFs by treatment:** the clinic still needs to send them (first visit, pre-laser, post-laser, peeling/microagulhamento).
  - **Birthday 15%:** how single use is controlled — a code, or a note in Buk.
