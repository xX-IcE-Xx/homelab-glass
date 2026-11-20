import type { Register, ThemeSetArgs } from 'claude-code'

import { CHRISTMAS_SCENE } from './christmas-scene'
import { makeColors } from './make-colors.js'
import { CHRISTMAS, GLASS, PALETTE } from './palette'
import { SCENE } from './scene'

type Look = { args: ThemeSetArgs; scene: string; source: string; alt: string; problems: string[] }

const look = (palette: Parameters<typeof makeColors>[0], scene: string, source: string, alt: string): Look => {
  const { theme, problems } = makeColors(palette)

  return { args: { colors: theme, backdrop: { scene, glass: GLASS } }, scene, source, alt, problems }
}

// Each look: its colours, and the scene its Backdrop hook draws. /look <name> switches.
const LOOKS = {
  homelab: look(PALETTE, 'homelab-colour-field', SCENE, 'A soft blue, purple, green and amber colour field drifting slowly'),
  christmas: look(
    CHRISTMAS,
    'homelab-christmas-snow',
    CHRISTMAS_SCENE,
    'Snowy pines with glowing lights and a lit cottage in the lower corners, falling snow, a string of lights along the top and a sleigh crossing the moon',
  ),
}
type LookName = keyof typeof LOOKS
const DEFAULT: LookName = 'homelab'
const isLook = (value: unknown): value is LookName => typeof value === 'string' && value in LOOKS
const NAMES = Object.keys(LOOKS).join(', ')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'look',
      description: `Switch the app's look: ${NAMES}`,
      argumentHint: NAMES.replaceAll(', ', ' | '),
    })
    const stored = await $.store.get('look')
    const chosen = LOOKS[isLook(stored) ? stored : DEFAULT]
    const unpainted = chosen.problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    await $.theme.set(chosen.args)
    // The theme stands and draws once the app attaches, so a "not drawn yet"
    // answer here is no fault: keep the status line clear.
    $.ui.status(undefined)

    return next(e)
  })

  on('command.run', { command: 'look' }, async ($, e) => {
    const name = e.args.trim().toLowerCase()

    if (name === '') {
      const stored = await $.store.get('look')

      return { text: `Look: ${isLook(stored) ? stored : DEFAULT}. Choose with /look ${NAMES.replaceAll(', ', ' | ')}.` }
    }
    if (!isLook(name)) {
      return { text: `No look named "${name}". The looks are: ${NAMES}.` }
    }
    await $.store.set('look', name)
    await $.theme.set(LOOKS[name].args)

    return { text: `Look set to ${name}. New sessions start with it too.` }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const drawn = Object.values(LOOKS).find(one => one.scene === e.props.scene)

    if (drawn === undefined) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={drawn.source} alt={drawn.alt} isInteractive />
  })
}
