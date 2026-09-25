#!/usr/bin/env node
// Clínica DLux — Slack Block Kit payloads for every customer journey (Jornadas do Cliente).
//
// Source of truth for the JSON in ./payloads. Edit here, then run:
//   node clients/sara/slack-block-kits/build.mjs           # write + validate
//   node clients/sara/slack-block-kits/build.mjs --check   # validate only, fail if JSON is stale
//   node clients/sara/slack-block-kits/build.mjs --links   # also print Block Kit Builder links
//
// Each payload is a chat.postMessage body ({ channel, text, blocks }). Button values carry ids only —
// the daemon re-reads the record at click time and never trusts the payload.

import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const OUT = join(ROOT, 'payloads')
const BUK = 'clinica-dlux.buk.pt'
// #marketing in the Clínica DLux Slack workspace — every journey card posts there.
const CHANNEL = 'C0BMCASQL1L'

// ── Block helpers ────────────────────────────────────────────────────────────

const plain = (text) => ({ type: 'plain_text', text, emoji: true })
const mrkdwn = (text) => ({ type: 'mrkdwn', text })
const header = (text) => ({ type: 'header', text: plain(text) })
const divider = () => ({ type: 'divider' })
const section = (text, accessory) => ({ type: 'section', text: mrkdwn(text), ...(accessory && { accessory }) })
const fields = (pairs) => ({ type: 'section', fields: pairs.map(([k, v]) => mrkdwn(`*${k}*\n${v}`)) })
const context = (...texts) => ({ type: 'context', elements: texts.map(mrkdwn) })
const actions = (block_id, ...elements) => ({ type: 'actions', block_id, elements })
const value = (obj) => JSON.stringify(obj)

// Slack mrkdwn needs &, < and > escaped; > at line start is added afterwards for the quote.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const quote = (s) => esc(s).split('\n').map((l) => `>${l}`).join('\n')

const confirm = (title, text, yes, no = 'Voltar') => ({
  title: plain(title),
  text: mrkdwn(text),
  confirm: plain(yes),
  deny: plain(no),
})

const button = (text, action_id, val, { style, confirm: c, url } = {}) => ({
  type: 'button',
  text: plain(text),
  action_id,
  ...(val !== undefined && { value: typeof val === 'string' ? val : value(val) }),
  ...(style && { style }),
  ...(url && { url }),
  ...(c && { confirm: c }),
})

const overflow = (action_id, options) => ({
  type: 'overflow',
  action_id,
  options: options.map(([text, v]) => ({ text: plain(text), value: typeof v === 'string' ? v : value(v) })),
})

const MOCK = ':construction: *MAQUETA* — nomes inventados, `demo.*`, nada ligado.'
const LOCK =
  ':lock: Nada sai sem aprovação. *Aprovar* põe na fila — o envio é espaçado, não instantâneo. ' +
  'Uma falha volta a *por decidir* sozinha e não afeta as outras. *Não enviar* é definitivo.'

// Row menu used by every approval list (per-message decision). action_ids are unique per
// message: the daemon routes on the part before ':'.
const rowMenu = (j, card, cliente) =>
  overflow(`dlux.${j}.linha.menu:${cliente}`, [
    [':white_check_mark: Aprovar', { acao: 'aprovar', card, cliente }],
    [':pencil2: Editar', { acao: 'editar', card, cliente }],
    [':no_entry_sign: Não enviar', { acao: 'nao_enviar', card, cliente }],
    [':bust_in_silhouette: Ver a ficha', { acao: 'ficha', card, cliente }],
  ])

// Standard single-message decision row (J4, J5, J3 one-by-one).
const decisionRow = (j, card, cliente, { approveLabel = 'Aprovar e enviar' } = {}) =>
  actions(
    `dlux.${j}.decisao`,
    button(`:white_check_mark: ${approveLabel}`, `dlux.${j}.aprovar`, { card, cliente }, {
      style: 'primary',
      confirm: confirm('Enviar esta mensagem?', 'Sai exatamente como está escrita, pelo canal preferido da cliente.', 'Aprovar e enviar'),
    }),
    button(':pencil2: Editar', `dlux.${j}.editar`, { card, cliente }),
    button(':no_entry_sign: Não enviar', `dlux.${j}.nao_enviar`, { card, cliente }, {
      style: 'danger',
      confirm: confirm('Não enviar?', '*Não enviar* é definitivo — esta mensagem não volta a ser gerada.', 'Não enviar'),
    }),
    button(':bust_in_silhouette: Ver ficha', `dlux.${j}.ficha`, { cliente }),
  )

// A touchpoint inside a journey reference card.
const step = (n, title, when, mode, text, note) =>
  section(`*${n} · ${title}* · ${when} · ${mode}\n${quote(text)}${note ? `\n_${esc(note)}_` : ''}`)

const AUTO = ':zap: automático'
const APPROVAL = ':lock: com aprovação'

// Controls every journey reference card ends with.
const journeyControls = (j, { approval }) =>
  actions(
    `dlux.${j}.jornada`,
    ...(approval ? [button(':inbox_tray: Ver por decidir', `dlux.${j}.jornada.por_decidir`, { jornada: j })] : []),
    button(':pencil2: Editar mensagens', `dlux.${j}.jornada.editar_modelos`, { jornada: j }),
    button(':scroll: Ver o registo', `dlux.${j}.jornada.registo`, { jornada: j }),
    button(':double_vertical_bar: Pausar jornada', `dlux.${j}.jornada.pausar`, { jornada: j }, {
      style: 'danger',
      confirm: confirm('Pausar a jornada?', 'Nada desta jornada sai enquanto estiver em pausa. O que já saiu não é afetado.', 'Pausar'),
    }),
  )

// ── Journey reference cards (pinnable, one per journey) ──────────────────────

const jornadas = {
  'jornadas/00-mapa-jornadas.json': {
    text: 'Jornadas do Cliente · Clínica DLux',
    blocks: [
      header(':compass: Jornadas do Cliente · Clínica DLux'),
      section(
        'Seis jornadas sobre a mesma base de dados.\n' +
          ':zap: *Automático* — o Claude envia sozinho e só aparece aqui se falhar.\n' +
          ':lock: *Com aprovação* — nada sai sem um cartão aprovado pela equipa.',
      ),
      divider(),
      ...[
        ['j2', '*J2 · Cliente Recorrente* · :zap: automático', 'Cuidados pré/pós por tipo de tratamento, check-in de criolipólise, prova de presença, avaliação Google, próxima sessão, manutenção de laser.'],
        ['j3', '*J3 · Reativação* · :lock: com aprovação', 'Sem visita há 6–18 meses · ondas diárias · desconto com validade.'],
        ['j4', '*J4 · Recuperação de falta* · :zap: lista de espera · :lock: contacto a quem faltou', 'Vaga libertada oferecida por prioridade; mensagem de reagendamento a quem faltou.'],
        ['j5', '*J5 · Plano / Pack* · :lock: com aprovação', 'Proposta de renovação quando faltam 1–2 sessões para acabar o pack.'],
        ['j6', '*J6 · Formação Profissional* · :zap: automático', 'Portfólio de formações, seguimento aos 7 dias, último seguimento a 1 mês, onboarding.'],
        ['j8', '*J8 · Campanhas* · :lock: com aprovação', 'Aniversário 15% (fixa), campanhas sazonais, flash de reativação e de fidelização.'],
      ].map(([j, title, body]) => section(`${title}\n${body}`, button('Ver jornada', `dlux.mapa.ver_${j}`, { jornada: j }))),
      divider(),
      context(
        ':calendar: A J1 · Novo Cliente fica na Buk — o 1.º contacto e a confirmação da marcação já saem de lá, não enviamos nada por cima.',
        'A antiga J7 (cuidados de tratamentos intrusivos) vive agora dentro da J2, por tipo de tratamento.',
        ':shield: Mensagens comerciais (J3, J8) só saem para clientes que deram consentimento na Buk.',
      ),
    ],
  },

  'jornadas/j2-cliente-recorrente.json': {
    text: 'J2 · Cliente Recorrente',
    blocks: [
      header(':repeat: J2 · Cliente Recorrente'),
      context(`${AUTO} · WhatsApp · só aparece no canal se falhar`),
      section('*Quando:* cada sessão marcada ou concluída no Buk. Os cuidados dependem do tipo de tratamento. O lembrete de 24h do Buk mantém-se — não enviamos lembrete extra.'),
      divider(),
      step(1, 'Pós-tratamento · 1.ª vez', 'após a 1.ª sessão', AUTO,
        'Olá {Nome}, foi um prazer recebê-la hoje na DLux. Seguem em anexo os cuidados a ter após a sua sessão. Qualquer dúvida, estamos aqui para si.',
        'Anexo: PDF de cuidados pós-tratamento.'),
      step(2, 'Pré-laser', '48h antes', AUTO,
        'Olá {Nome}, a sua sessão de laser é já {data}. Para o melhor resultado: evite a exposição solar e não aplique cremes ou perfumes na zona nas 48h anteriores. Até já!'),
      step(3, 'Pós-laser', 'logo após a sessão', AUTO,
        'Olá {Nome}, obrigada pela sua visita. Após o laser: hidrate a zona, use protetor solar e evite sol direto nos próximos dias. Estamos aqui para qualquer questão.'),
      step(4, 'Criolipólise · check-in', 'dia seguinte', AUTO,
        'Olá {Nome}, como se está a sentir após a sessão de criolipólise de ontem? Alguma sensibilidade na zona é normal. Qualquer dúvida, conte connosco.',
        'Vai para todas as clientes de criolipólise, não só as de 1.ª vez.'),
      step(5, 'Peeling / microagulhamento', 'após a sessão', AUTO,
        'Olá {Nome}, seguem em anexo os cuidados após o seu {tratamento}. Siga as indicações para o melhor resultado — e qualquer dúvida é só dizer.',
        'Anexo: PDF de cuidados pós-tratamento.'),
      step(6, 'Prova de presença', 'após a sessão', AUTO,
        'Olá {Nome}, confirma que concluiu a sua sessão de hoje na DLux? Responda SIM para registarmos. Obrigada!',
        'Mensagem à parte dos cuidados. Substitui aos poucos a assinatura em papel.'),
      step(7, 'Pedido de avaliação (Google)', '3 dias após a visita', AUTO,
        'Olá {Nome}, esperamos que tenha gostado da sua experiência na DLux. A sua opinião ajuda muito quem procura a clínica — deixe a sua avaliação aqui: {link Google}. Obrigada!',
        'Uma só vez por cliente — o sistema regista que já pediu.'),
      step(8, 'Sugestão de próxima sessão', 'no ritmo do tratamento (laser ~1 mês)', AUTO,
        'Olá {Nome}, está na altura ideal de agendar a sua próxima sessão para manter os resultados. Escolha o horário que lhe der mais jeito: {link Buk}',
        'Só para quem ainda não tem a sessão seguinte marcada.'),
      step(9, 'Lembrete de manutenção · laser', '+1 ano sem sessão', AUTO,
        'Olá {Nome}, já passou algum tempo desde a sua última sessão de laser. Que tal retomar e manter os resultados? Temos disponibilidade — marque aqui: {link Buk}'),
      divider(),
      journeyControls('j2', { approval: false }),
    ],
  },

  'jornadas/j3-reativacao.json': {
    text: 'J3 · Reativação',
    blocks: [
      header(':arrows_counterclockwise: J3 · Reativação'),
      context(`${APPROVAL} · WhatsApp · cada mensagem passa por um cartão`),
      section(
        '*Quando:* todos os dias às 08:00 — clientes sem visita há 6–18 meses, consentimento verificado, ordenadas por lealdade.\n' +
          '*Envio:* devagar, no máximo 1 mensagem por minuto, só em horário de clínica. Um grupo de controlo fica retido para medir o efeito.',
      ),
      divider(),
      step(1, 'Mensagem de reativação', 'onda diária', APPROVAL,
        'Olá {Nome}, sentimos a sua falta na DLux! Gostávamos muito de a voltar a ver. {oferta} Marque a sua sessão quando quiser: {link Buk}',
        'Texto personalizado por cliente — quando é seguro dizê-lo, junta «Da última vez fez {tratamento}.» (nunca em criolipólise).'),
      fields([
        ['Miracle DLux', '20% na próxima sessão'],
        ['Peeling', '15% no próximo tratamento'],
        ['Depilação laser', 'sessão de manutenção com 25%'],
        ['Criolipólise', 'avaliação gratuita + 10% na sessão seguinte'],
      ]),
      context(
        '`{Nome}` `{tratamento}` `{oferta}` `{link Buk}` são substituídos por cliente. Chaves desconhecidas fazem falhar a geração — nunca chegam à cliente como texto literal.',
        'Clientes inativas há mais de 36 meses ficam fora — alargar é decisão da Sara. O Claude regista quem voltou para medir o impacto.',
      ),
      divider(),
      journeyControls('j3', { approval: true }),
    ],
  },

  'jornadas/j4-recuperacao-falta.json': {
    text: 'J4 · Recuperação de falta',
    blocks: [
      header(':calendar: J4 · Recuperação de falta'),
      context(`Lista de espera ${AUTO} · contacto a quem faltou ${APPROVAL}`),
      section('*Quando:* o Claude deteta no Buk que uma cliente cancelou ou faltou. A falta fica no histórico para acompanhar padrões de absentismo.'),
      divider(),
      step(1, 'Oferta de horário livre (lista de espera)', 'abre uma vaga e há procura', AUTO,
        'Olá {Nome}, abriu uma vaga para {tratamento} no dia {data} às {hora}. Quer ficar com ela? Responda SIM e confirmamos consigo.',
        'Por prioridade (VIP → recorrentes → novos) e conforme a duração do tratamento. A lista de espera é inserida pela equipa.'),
      step(2, 'Contacto a quem faltou', '1h depois da hora marcada', APPROVAL,
        'Olá {Nome}, notámos que não conseguiu comparecer à sua sessão — sem problema! Quer reagendar? Escolha um novo horário aqui: {link Buk}',
        'Se ninguém decidir até às 18:00, não sai — a regra é aprovar, não silenciar.'),
      divider(),
      journeyControls('j4', { approval: true }),
    ],
  },

  'jornadas/j5-plano-pack.json': {
    text: 'J5 · Plano / Pack',
    blocks: [
      header(':package: J5 · Plano / Pack'),
      context(`${APPROVAL} · WhatsApp`),
      section(
        '*Como segue o pack:* por uma nota no Buk (ex.: «próximas 5 sessões = pack XPTO») — o Buk não marca packs sozinho.\n' +
          '*Quando:* faltam 1–2 sessões para terminar o pack, contadas pelas sessões *concluídas* no Buk.',
      ),
      divider(),
      step(1, 'Proposta de renovação de pack', 'faltam 1–2 sessões', APPROVAL,
        'Olá {Nome}, o seu pack está a chegar ao fim. Para dar continuidade aos seus resultados, preparámos uma proposta de renovação. Quer que agendemos já as próximas sessões?',
        'Sem link de marcação de propósito: packs não são reserváveis no Buk, a renovação fecha-se em conversa.'),
      context('A sugestão da sessão seguinte depois de cada sessão vem da J2 — nunca para quem já a tem marcada.'),
      divider(),
      journeyControls('j5', { approval: true }),
    ],
  },

  'jornadas/j6-formacao.json': {
    text: 'J6 · Formação Profissional',
    blocks: [
      header(':mortar_board: J6 · Formação Profissional'),
      context(`${AUTO} · WhatsApp · só aparece no canal se falhar`),
      section('*Quando:* uma profissional pede informações sobre formações (site, Instagram ou anúncio). Os seguimentos param assim que ela responde.'),
      divider(),
      step(1, 'Resposta + portfólio', 'imediato', AUTO,
        'Olá {Nome}, obrigada pelo interesse nas formações DLux! Seguem em anexo o portfólio, com datas e níveis disponíveis. Qualquer questão, estou à sua disposição.',
        'Anexo: Portfólio de Formações (PDF).'),
      step(2, 'Seguimento', '7 dias sem resposta', AUTO,
        'Olá {Nome}, teve oportunidade de ver o portfólio de formações que enviámos? Fico disponível para esclarecer qualquer dúvida e ajudar a escolher o nível certo para si.'),
      step(3, 'Último seguimento', '1 mês sem resposta', AUTO,
        'Olá {Nome}, um último contacto sobre as nossas formações — se ainda tiver interesse, teria todo o gosto em ajudar. As vagas são limitadas.',
        'Proposta da DLux. Último contacto — não insistimos mais do que isso.'),
      step(4, 'Onboarding da inscrição', 'após confirmar a vaga', AUTO,
        'Olá {Nome}, parabéns pela inscrição! Seguem em anexo o manual, a ficha RGPD e o que deve trazer no dia. Até breve na DLux!',
        'Anexos: manual, ficha RGPD, lista do que trazer.'),
      divider(),
      journeyControls('j6', { approval: false }),
    ],
  },

  'jornadas/j8-campanhas.json': {
    text: 'J8 · Campanhas',
    blocks: [
      header(':mega: J8 · Campanhas'),
      context(`${APPROVAL} · WhatsApp · toda a base com consentimento`),
      section('*Regra:* qualquer campanha passa pela aprovação prévia da DLux antes de ser enviada. Aprovar a campanha gera ondas diárias — cada onda tem o seu cartão.'),
      divider(),
      step(1, 'Aniversário · 15% (fixa)', 'mês de aniversário', APPROVAL,
        'Olá {Nome}, feliz aniversário da parte de toda a equipa DLux! Este mês oferecemos-lhe 15% num pack ou serviço à sua escolha. Marque aqui: {link Buk}',
        '15% · uso único · durante o mês de aniversário · a toda a base. Cartão semanal.'),
      step(2, 'Promoção sazonal', 'ao longo do ano', APPROVAL,
        'Olá {Nome}, {campanha} na DLux! {desconto} em {serviço} até {data}. Aproveite e marque a sua sessão aqui: {link Buk}'),
      step(3, 'Flash · reativação', 'horários de baixa procura', APPROVAL,
        'Olá {Nome}, promoção relâmpago só {período}: {oferta}. Temos horários disponíveis — reserve já o seu: {link Buk}',
        'Ligada à J3 (reativação).'),
      step(4, 'Flash · fidelização', 'clientes recorrentes', APPROVAL,
        'Olá {Nome}, porque é cliente DLux, temos uma oferta especial só para si: {oferta}. Válida até {data}.'),
      divider(),
      journeyControls('j8', { approval: true }),
    ],
  },
}

// ── Operational cards (what the team sees day to day) ────────────────────────

const falhas = [
  ['demo.c_0118', 'Ana Ribeiro', 'J2 · Pré-laser 48h', 'número inválido'],
  ['demo.c_0342', 'Inês Moura', 'J2 · Prova de presença', 'WhatsApp sem entrega 24h'],
  ['demo.c_0907', 'Carla Santos', 'J6 · Seguimento 7 dias', 'anexo do portfólio > 16 MB'],
]

const reativacao = [
  ['demo.c_0412', 'Marta Silva', 'Miracle DLux', '8 meses', '20%', 'por_decidir',
    `Olá Marta, sentimos a sua falta na DLux! Da última vez fez Miracle DLux. Gostávamos muito de a voltar a ver. Oferecemos-lhe 20% na próxima sessão. Válida até 16 out. Marque a sua sessão quando quiser: ${BUK}`],
  ['demo.c_0233', 'Sofia Costa', 'Peeling', '11 meses', '15%', 'por_decidir',
    `Olá Sofia, sentimos a sua falta na DLux! Da última vez fez um peeling. Gostávamos muito de a voltar a ver. Oferecemos-lhe 15% no próximo tratamento. Válida até 16 out. Marque a sua sessão quando quiser: ${BUK}`],
  ['demo.c_0578', 'Helena Duarte', 'Depilação laser', '7 meses', '25%', 'na_fila',
    `Olá Helena, sentimos a sua falta na DLux! Da última vez fez depilação laser. Gostávamos muito de a voltar a ver. Oferecemos-lhe uma sessão de manutenção com 25% de desconto. Válida até 16 out. Marque a sua sessão quando quiser: ${BUK}`],
  ['demo.c_0691', 'Joana Pires', 'Criolipólise', '14 meses', 'avaliação + 10%', 'enviada',
    `Olá Joana, sentimos a sua falta na DLux! Gostávamos muito de a voltar a ver. Oferecemos-lhe uma avaliação gratuita e 10% na sessão seguinte. Válida até 16 out. Marque a sua sessão quando quiser: ${BUK}`],
]
const ESTADO = { por_decidir: ':hourglass_flowing_sand: por decidir', na_fila: ':hourglass: na fila', enviada: ':white_check_mark: enviada', recusada: ':no_entry_sign: recusada' }
const contar = (estado) => reativacao.filter((r) => r[5] === estado).length
const porDecidir = contar('por_decidir')

const aniversarios = [
  ['demo.c_0150', 'Joana Almeida', '16 set'],
  ['demo.c_0288', 'Rita Carvalho', '17 set'],
  ['demo.c_0463', 'Beatriz Lopes', '19 set'],
  ['demo.c_0714', 'Catarina Reis', '21 set'],
]

const cartoes = {
  'cartoes/automaticos-falhas.json': {
    text: 'Envios automáticos · 3 falharam hoje',
    blocks: [
      header(':warning: Envios automáticos · 3 falharam hoje'),
      section('As jornadas 2, 4 (lista de espera) e 6 saem *sem cartão* — só aparecem aqui quando falham.'),
      divider(),
      ...falhas.map(([id, nome, jornada, motivo]) =>
        section(`*${nome}* · ${jornada} · _${esc(motivo)}_`,
          overflow(`dlux.auto.falha.menu:${id}`, [
            [':arrows_counterclockwise: Tentar de novo', { acao: 'repetir', cliente: id }],
            [':pencil2: Editar e reenviar', { acao: 'editar', cliente: id }],
            [':no_entry_sign: Não enviar', { acao: 'nao_enviar', cliente: id }],
            [':bust_in_silhouette: Ver a ficha', { acao: 'ficha', cliente: id }],
          ])),
      ),
      divider(),
      context('Hoje: 41 enviadas · 3 falharam. Uma falha nunca fica a parecer enviada.', MOCK),
    ],
  },

  'cartoes/j3-reativacao-lista.json': {
    text: `Reativação · onda 1 de 3 · ${porDecidir} por decidir`,
    blocks: [
      header(':arrows_counterclockwise: Reativação · onda 1 de 3 · hoje 08:00'),
      context('Geradas hoje 08:00 · sem visita há 6–18 meses · consentimento verificado · ordenadas por lealdade'),
      fields([
        ['Elegíveis', '274'],
        ['Contactadas', '36'],
        ['Hoje', `${reativacao.length} de 12`],
        ['Retidas (controlo)', '54'],
      ]),
      actions('dlux.j3.lote.topo',
        button(':mag: Rever uma a uma', 'dlux.j3.lote.uma_a_uma', { card: 'j3-onda-1' }),
        button('Não enviar nenhuma', 'dlux.j3.lote.nao_enviar_topo', { card: 'j3-onda-1' }, {
          confirm: confirm('Não enviar nenhuma?', 'As mensagens *por decidir* desta onda são recusadas. O que já saiu não é afetado.', 'Não enviar nenhuma'),
        }),
      ),
      context(`por decidir ${porDecidir} · na fila ${contar('na_fila')} · enviadas ${contar('enviada')} · recusadas ${contar('recusada')}`),
      divider(),
      ...reativacao.map(([id, nome, trat, ultima, oferta, estado, msg]) =>
        section(
          `*${nome}* · ${trat} · última visita há ${ultima} · ${esc(oferta)} · ${ESTADO[estado]}\n${quote(msg)}`,
          estado === 'por_decidir' ? rowMenu('j3', 'j3-onda-1', id) : button('Ver a ficha', `dlux.j3.linha.ficha:${id}`, { cliente: id }),
        ),
      ),
      divider(),
      section(
        '1 472 clientes ficaram fora por estarem inativas há mais de 36 meses — alargar é decisão da Sara.',
        button('Continuar · alargar para 48 meses', 'dlux.j3.alargar_48', { card: 'j3-onda-1' }, {
          confirm: confirm('Alargar para 48 meses?', 'As próximas ondas passam a incluir clientes inativas até 48 meses.', 'Alargar'),
        }),
      ),
      actions('dlux.j3.lote.fundo',
        button(`:white_check_mark: Aprovar as ${porDecidir}`, 'dlux.j3.lote.aprovar_todas', { card: 'j3-onda-1' }, {
          style: 'primary',
          confirm: confirm(`Aprovar as ${porDecidir}?`, `Aprova só as que estão *por decidir* — não toca no que já editou ou recusou.`, `Aprovar as ${porDecidir}`),
        }),
        button('Não enviar nenhuma', 'dlux.j3.lote.nao_enviar', { card: 'j3-onda-1' }, {
          style: 'danger',
          confirm: confirm('Não enviar nenhuma?', 'As mensagens *por decidir* desta onda são recusadas. O que já saiu não é afetado.', 'Não enviar nenhuma'),
        }),
        button(':memo: Editar o modelo', 'dlux.j3.lote.editar_modelo', { card: 'j3-onda-1' }),
      ),
      context(
        `*Aprovar as ${porDecidir}* aprova só as que estão *por decidir*. Se editou várias no mesmo sentido, o errado é o *modelo*.`,
        LOCK,
        MOCK,
      ),
    ],
  },

  'cartoes/j3-reativacao-uma-a-uma.json': {
    text: 'Reativação · 1 de 2 · Marta Silva',
    blocks: [
      header(':arrows_counterclockwise: Reativação · 1 de 2'),
      fields([
        ['Cliente', 'Marta Silva'],
        ['Último tratamento', 'Miracle DLux'],
        ['Última visita', 'há 8 meses'],
        ['Oferta', '20% · válida até 16 out'],
        ['Canal', 'WhatsApp'],
        ['Lealdade', '6 visitas · cliente desde 2023'],
      ]),
      section(quote(reativacao[0][6])),
      decisionRow('j3', 'j3-onda-1', 'demo.c_0412'),
      actions('dlux.j3.navegar',
        button('← Anterior', 'dlux.j3.anterior', { card: 'j3-onda-1', pos: 0 }),
        button('Seguinte →', 'dlux.j3.seguinte', { card: 'j3-onda-1', pos: 2 }),
        button('Voltar à lista', 'dlux.j3.voltar_lista', { card: 'j3-onda-1' }),
      ),
      context(LOCK, MOCK),
    ],
  },

  'cartoes/j3-reativacao-editar.json': {
    text: 'Reativação · a editar · Sofia Costa',
    blocks: [
      header(':pencil2: Reativação · a editar'),
      section('*Sofia Costa* · Peeling · última visita há 11 meses · 15%\nA editar *aqui*, sem janela nova. O que guardar é o que sai — byte a byte.'),
      {
        type: 'input',
        block_id: 'dlux.j3.editar.texto',
        label: plain('Mensagem'),
        element: {
          type: 'plain_text_input',
          action_id: 'dlux.j3.editar.valor',
          multiline: true,
          max_length: 1000,
          initial_value: reativacao[1][6],
        },
        hint: plain('{Nome}, {tratamento}, {oferta} e {link Buk} continuam a funcionar.'),
      },
      actions('dlux.j3.editar.acoes',
        button(':white_check_mark: Guardar e aprovar', 'dlux.j3.editar.guardar_aprovar', { card: 'j3-onda-1', cliente: 'demo.c_0233' }, { style: 'primary' }),
        button('Guardar sem aprovar', 'dlux.j3.editar.guardar', { card: 'j3-onda-1', cliente: 'demo.c_0233' }),
        button('Cancelar', 'dlux.j3.editar.cancelar', { card: 'j3-onda-1', cliente: 'demo.c_0233' }),
      ),
      context(MOCK),
    ],
  },

  'cartoes/j3-reativacao-em-curso.json': {
    text: 'Reativação · em curso',
    blocks: [
      header(':arrows_counterclockwise: Reativação · em curso'),
      fields([
        ['Enviadas', '3'],
        ['Na fila', '1'],
        ['Falharam', '1 · número inválido'],
        ['Ritmo', '1 por minuto · só em horário de clínica'],
      ]),
      actions('dlux.j3.fila',
        button(':octagonal_sign: Parar a fila', 'dlux.j3.fila.parar', { card: 'j3-onda-1' }, {
          style: 'danger',
          confirm: confirm('Parar a fila?', 'O que está na fila volta a *por decidir*. Parar a fila não cancela o que já saiu.', 'Parar a fila'),
        }),
        button(':scroll: Ver o registo', 'dlux.j3.fila.registo', { card: 'j3-onda-1' }),
      ),
      context('Uma falha volta a *por decidir* sozinha — nunca fica a parecer enviada. Parar a fila não cancela o que já saiu.', MOCK),
    ],
  },

  'cartoes/j3-revisao-30-dias.json': {
    text: 'Reativação · revisão dos primeiros 30 dias',
    blocks: [
      header(':bar_chart: Reativação · revisão dos primeiros 30 dias'),
      context('1–30 ago · onda diária · WhatsApp'),
      fields([
        ['Enviadas', '25'],
        ['Entregues', '24'],
        ['Responderam', '9'],
        ['Marcaram', '6'],
        ['Receita', '387 €'],
        ['Custo', '~2 € · mensagens WhatsApp'],
      ]),
      divider(),
      ...[
        ['s1', 'Deixar de contactar clientes com mais de 12 meses sem visita — marcaram 11% contra 36% abaixo dos 12 meses.'],
        ['s2', 'Começar pelo tratamento que a cliente já fez — Miracle DLux marcou 43%; criolipólise 0 em 4.'],
        ['s3', 'Repetir ao fim de 30 dias para quem não respondeu.'],
      ].flatMap(([id, texto], i) => [
        section(`*Sugestão ${i + 1}* · ${texto}`),
        actions(`dlux.j3.revisao.${id}`,
          button(':white_check_mark: Aceitar', `dlux.j3.revisao.aceitar_${id}`, { sugestao: id }, { style: 'primary' }),
          button('Recusar', `dlux.j3.revisao.recusar_${id}`, { sugestao: id }),
        ),
      ]),
      divider(),
      actions('dlux.j3.campanha',
        button(':arrow_forward: Continuar', 'dlux.j3.campanha.continuar', { jornada: 'j3' }, { style: 'primary' }),
        button(':double_vertical_bar: Pausar', 'dlux.j3.campanha.pausar', { jornada: 'j3' }),
        button(':octagonal_sign: Parar', 'dlux.j3.campanha.parar', { jornada: 'j3' }, {
          style: 'danger',
          confirm: confirm('Parar a reativação?', 'Não são geradas novas ondas até voltar a ligar a jornada.', 'Parar'),
        }),
      ),
      context('Cada sugestão cita o número de onde saiu. Sem número não é sugestão, é palpite.', MOCK),
    ],
  },

  'cartoes/j4-falta.json': {
    text: 'Falta à sessão · Rita Baptista',
    blocks: [
      header(':calendar: Falta à sessão · Rita Baptista'),
      section('*Rita Baptista* · Criolipólise · hoje 10:30 · Sara · *não compareceu* · 2.ª falta em 2026'),
      fields([
        ['Sessão perdida', 'hoje 10:30'],
        ['Profissional', 'Sara'],
        ['Pack', 'sessão 4 de 6'],
        ['Contacto', 'WhatsApp · 9xx xxx 412'],
      ]),
      section(quote(`Olá Rita, notámos que não conseguiu comparecer à sua sessão — sem problema! Quer reagendar? Escolha um novo horário aqui: ${BUK}`)),
      decisionRow('j4', 'j4-falta-demo', 'demo.c_0526'),
      section(':white_check_mark: *Lista de espera:* a vaga das 10:30 já foi oferecida a 2 clientes por prioridade (VIP → recorrentes → novas). 1 respondeu SIM às 11:12 — Cátia N. marcada.'),
      context('Gerado 1h depois da hora marcada. Sai exatamente como está escrito. Se não decidir até às 18:00, *não sai* — a regra é aprovar, não silenciar.', MOCK),
    ],
  },

  'cartoes/j5-pack-renovacao.json': {
    text: 'Pack a terminar · Maria Fernandes',
    blocks: [
      header(':package: Pack a terminar · Maria Fernandes'),
      section('*Maria Fernandes* · Miracle DLux · pack 10 sessões · *falta 1* · próxima marcada 23 set'),
      fields([
        ['Progresso', '9 de 10 sessões'],
        ['Última sessão', '16 set'],
        ['Cliente desde', 'mar 2024'],
        ['Packs anteriores', '2'],
      ]),
      section(quote('Olá Maria, o seu pack está a chegar ao fim. Para dar continuidade aos seus resultados, preparámos uma proposta de renovação. Quer que agendemos já as próximas sessões?')),
      section(':warning: *Packs não são reserváveis na Buk* — só sessão avulsa. Sem link de marcação de propósito: a equipa fecha a renovação em conversa.'),
      decisionRow('j5', 'j5-pack-demo', 'demo.c_0305'),
      context('Gerado quando faltam 1–2 sessões, contadas pelas sessões *concluídas* no Buk. Nota do pack no Buk: «próximas 10 sessões = pack Miracle DLux».', MOCK),
    ],
  },

  'cartoes/j8-aniversarios.json': {
    text: `Aniversários 15–21 set · ${aniversarios.length} por decidir`,
    blocks: [
      header(':birthday: Aniversários · 15–21 set'),
      fields([
        ['Esta semana', String(aniversarios.length)],
        ['Já receberam este ano', '0'],
        ['Sem consentimento', '1 (não listada)'],
        ['Oferta', '15% · uso único · mês inteiro'],
      ]),
      section(`*Modelo*\n${quote('Olá {Nome}, feliz aniversário da parte de toda a equipa DLux! Este mês oferecemos-lhe 15% num pack ou serviço à sua escolha. Marque aqui: {link Buk}')}`),
      divider(),
      ...aniversarios.map(([id, nome, dia]) =>
        section(`*${nome}* · faz anos a ${dia} · WhatsApp · ${ESTADO.por_decidir}`, rowMenu('j8', 'j8-aniv-38', id)),
      ),
      divider(),
      actions('dlux.j8.lote',
        button(`:white_check_mark: Aprovar as ${aniversarios.length}`, 'dlux.j8.lote.aprovar_todas', { card: 'j8-aniv-38' }, {
          style: 'primary',
          confirm: confirm(`Aprovar as ${aniversarios.length}?`, 'Cada cliente recebe a mensagem no dia de aniversário. Aprova só as que estão *por decidir*.', `Aprovar as ${aniversarios.length}`),
        }),
        button('Não enviar nenhuma', 'dlux.j8.lote.nao_enviar', { card: 'j8-aniv-38' }, {
          style: 'danger',
          confirm: confirm('Não enviar nenhuma?', 'Nenhuma cliente desta semana recebe a mensagem de aniversário.', 'Não enviar nenhuma'),
        }),
        button(':memo: Editar o modelo', 'dlux.j8.lote.editar_modelo', { card: 'j8-aniv-38' }),
      ),
      context(LOCK, MOCK),
    ],
  },

  'cartoes/j8-nova-campanha.json': {
    text: 'Nova campanha · Outono · por aprovar',
    blocks: [
      header(':mega: Nova campanha · Outono'),
      section('*Outono* · promoção sazonal · Radiofrequência −20% · 1–31 out · *por aprovar*'),
      fields([
        ['Segmento', 'Toda a base com consentimento'],
        ['Alcance', '1 218'],
        ['Ondas', '~87/dia · 14 dias úteis'],
        ['Excluídas', '273 em reativação · 41 sem consentimento'],
      ]),
      section(quote(`Olá {Nome}, Outono na DLux! −20% em Radiofrequência até 31 out. Aproveite e marque a sua sessão aqui: ${BUK}`)),
      actions('dlux.j8.campanha',
        button(':white_check_mark: Aprovar a campanha → gerar ondas', 'dlux.j8.campanha.aprovar', { campanha: 'demo.camp_outono' }, {
          style: 'primary',
          confirm: confirm('Aprovar a campanha?', 'Não envia nada — gera as ondas diárias, e cada onda passa pelo cartão de aprovação normal.', 'Gerar ondas'),
        }),
        button(':pencil2: Editar texto / segmento', 'dlux.j8.campanha.editar', { campanha: 'demo.camp_outono' }),
        button('Cancelar', 'dlux.j8.campanha.cancelar', { campanha: 'demo.camp_outono' }, {
          style: 'danger',
          confirm: confirm('Cancelar a campanha?', 'A campanha é descartada. Nada foi enviado.', 'Cancelar campanha'),
        }),
      ),
      context('*Aprovar a campanha* não envia nada — gera as ondas diárias, e cada onda passa pelo cartão de aprovação normal. *Flash* é a mesma coisa com um período em vez de mês.', MOCK),
    ],
  },
}

// ── Validation against Slack Block Kit limits ────────────────────────────────

function validate(name, payload) {
  const errs = []
  const err = (m) => errs.push(`${name}: ${m}`)
  const max = (s, n, what) => s.length > n && err(`${what} is ${s.length} chars (max ${n})`)
  const { blocks } = payload
  if (!payload.text) err('missing fallback text')
  if (blocks.length > 50) err(`${blocks.length} blocks (max 50)`)
  const actionIds = new Set()
  const blockIds = new Set()

  const checkConfirm = (c, where) => {
    if (!c) return
    max(c.title.text, 100, `${where} confirm title`)
    max(c.text.text, 300, `${where} confirm text`)
    max(c.confirm.text, 30, `${where} confirm button`)
    max(c.deny.text, 30, `${where} deny button`)
  }
  const checkElement = (el, where) => {
    if (el.action_id) {
      max(el.action_id, 255, `${where} action_id`)
      if (actionIds.has(el.action_id)) err(`duplicate action_id ${el.action_id}`)
      actionIds.add(el.action_id)
    }
    if (el.type === 'button') {
      max(el.text.text, 75, `${where} button text`)
      if (el.value) max(el.value, 2000, `${where} button value`)
      checkConfirm(el.confirm, where)
    } else if (el.type === 'overflow') {
      if (el.options.length < 2 || el.options.length > 5) err(`${where} overflow has ${el.options.length} options (2–5)`)
      for (const o of el.options) {
        max(o.text.text, 75, `${where} overflow option`)
        max(o.value, 150, `${where} overflow value`)
      }
    } else if (el.type === 'plain_text_input') {
      if (el.initial_value && el.max_length && el.initial_value.length > el.max_length) err(`${where} initial_value longer than max_length`)
    } else {
      err(`${where} unexpected element ${el.type}`)
    }
  }

  blocks.forEach((b, i) => {
    const where = `block ${i} (${b.type})`
    if (b.block_id) {
      max(b.block_id, 255, `${where} block_id`)
      if (blockIds.has(b.block_id)) err(`duplicate block_id ${b.block_id}`)
      blockIds.add(b.block_id)
    }
    switch (b.type) {
      case 'header':
        max(b.text.text, 150, `${where} text`)
        break
      case 'section':
        if (!b.text && !b.fields) err(`${where} needs text or fields`)
        if (b.text) max(b.text.text, 3000, `${where} text`)
        if (b.fields) {
          if (b.fields.length > 10) err(`${where} has ${b.fields.length} fields (max 10)`)
          b.fields.forEach((f) => max(f.text, 2000, `${where} field`))
        }
        if (b.accessory) checkElement(b.accessory, where)
        break
      case 'context':
        if (b.elements.length > 10) err(`${where} has ${b.elements.length} elements (max 10)`)
        b.elements.forEach((e) => max(e.text, 3000, `${where} element`))
        break
      case 'actions':
        if (b.elements.length > 25) err(`${where} has ${b.elements.length} elements (max 25)`)
        b.elements.forEach((e) => checkElement(e, where))
        break
      case 'input':
        max(b.label.text, 2000, `${where} label`)
        if (b.hint) max(b.hint.text, 2000, `${where} hint`)
        checkElement(b.element, where)
        break
      case 'divider':
        break
      default:
        err(`${where} unexpected block type`)
    }
  })

  // Unescaped < or > in mrkdwn (outside the leading quote marker) breaks rendering.
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk)
    if (node && typeof node === 'object') {
      if (node.type === 'mrkdwn') {
        const body = node.text.split('\n').map((l) => l.replace(/^>/, '')).join('\n')
        if (/[<>]/.test(body)) err(`unescaped < or > in mrkdwn: ${node.text.slice(0, 60)}…`)
      }
      Object.values(node).forEach(walk)
    }
  }
  walk(blocks)
  return errs
}

// ── Write / check ────────────────────────────────────────────────────────────

const args = new Set(process.argv.slice(2))
const all = { ...jornadas, ...cartoes }

const problems = []

// A payload removed from this file must disappear from payloads/ too, or post.mjs
// keeps posting a journey that no longer exists.
for (const dir of ['jornadas', 'cartoes']) {
  const d = join(OUT, dir)
  if (!existsSync(d)) continue
  for (const f of readdirSync(d)) {
    const name = `${dir}/${f}`
    if (f.endsWith('.json') && !(name in all)) {
      if (args.has('--check')) problems.push(`${name}: stale — run build.mjs`)
      else rmSync(join(d, f))
    }
  }
}

for (const [name, payload] of Object.entries(all)) {
  problems.push(...validate(name, payload))
  const file = join(OUT, name)
  const json = `${JSON.stringify({ channel: CHANNEL, ...payload }, null, 2)}\n`
  if (args.has('--check')) {
    if (!existsSync(file) || readFileSync(file, 'utf8') !== json) problems.push(`${name}: stale — run build.mjs`)
  } else {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, json)
  }
  if (args.has('--links')) {
    console.log(`${name}\n  https://app.slack.com/block-kit-builder/#${encodeURIComponent(JSON.stringify({ blocks: payload.blocks }))}\n`)
  }
}

if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(`${Object.keys(all).length} payloads ${args.has('--check') ? 'up to date' : 'written'} in ${relative(process.cwd(), OUT) || '.'} — all within Block Kit limits.`)
