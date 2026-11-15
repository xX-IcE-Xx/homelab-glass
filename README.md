# homelab-glass

A look for the Claude desktop and mobile apps, in two flavours you switch between with `/look`:

- **homelab** (the default): a "Liquid Glass" look. Cool grey surfaces, one blue accent, system-style red, green and amber status colours, and a soft blue, purple, green and amber colour field drifting slowly behind the chat, with a pulsing green status dot.
- **christmas**: pine and snow surfaces with a cranberry accent, falling snow, a string of twinkling lights, pine trees with glowing bulbs, and a sleigh that crosses the sky now and then.

Both looks have light and dark versions and follow the app's mode. All motion is switched off when the system asks for reduced motion.

## Install

At the prompt of a terminal session:

```
/plugin install homelab-glass --marketplace xX-IcE-Xx/homelab-glass
```

From a shell:

```
claude plugin install homelab-glass --marketplace xX-IcE-Xx/homelab-glass
```

Answer `y` to add the marketplace, then choose a scope (user scope loads it in every session).

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `xX-IcE-Xx/homelab-glass`, then Add plugin.

## Use

- `/look` says which look is on.
- `/look christmas` or `/look homelab` switches. The choice is remembered for new sessions.

The terminal and editors draw no look; it shows in the desktop and mobile apps.

## Adjust

- `hooks/palette.ts`: the colours of each look, and `GLASS` (how strongly the app's panels veil the backdrop; raise `opacity` for calmer panels).
- `hooks/scene.ts` and `hooks/christmas-scene.ts`: the animated backdrops. Durations and distances are in each `@keyframes` block.
- `hooks/make-colors.js` is a helper from Claude Code's plugin-authoring skill; leave it as it is.

## Turn off

```
claude plugin disable homelab-glass
```
