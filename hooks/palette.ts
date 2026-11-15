// The "Liquid Glass" tokens of a homelab dashboard (its stylesheet custom properties),
// carried into the Claude design system. Edit the hex values here to adjust the look.
export const PALETTE = {
  label: 'Homelab Liquid Glass',
  // --accent, --crit, --ok, --warn, and the purple of the colour field (--field-2).
  roles: { accent: '#0a6cff', danger: '#ff3b30', success: '#34c759', warning: '#ff9500', pro: '#af52de' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#eef0f6', // --canvas
        'surface-1': '#f6f7fb',
        'surface-2': '#fbfbfd', // --glass-solid
        'text-primary': '#1c1c1e', // --ink
        'text-secondary': '#48484a', // --ink-2
        'text-muted': '#66666b', // --ink-3, a shade darker for 4.5:1 on the canvas
      },
    },
  },
  dark: {
    // The dashboard's dark tokens; pro is the iOS dark purple, chosen for contrast.
    roles: { accent: '#3d8bff', danger: '#ff453a', success: '#30d158', warning: '#ff9f0a', pro: '#bf5af2' },
    gray: {
      anchors: {
        'surface-0': '#05060a', // --canvas
        'surface-1': '#111218',
        'surface-2': '#1c1d23', // --glass-solid
        'surface-3': '#24262e', // --glass
        'text-primary': '#f5f5f7', // --ink
        'text-secondary': '#c7c7cc', // --ink-2
        'text-muted': '#98989f', // --ink-3
      },
    },
  },
}

// How the app frosts its panels over the colour field: the dashboard's
// frosted glass, thinned so the moving colour field reads through the panels.
// Raise blur (to 28) and opacity (to 0.62) for calmer, dashboard-exact panels.
// blur 0: the glows are already soft, and any blur smears the status dot away.
export const GLASS = { blur: 0, opacity: 0.5 }

// A second look, switched with /look christmas: evergreen and snow, cranberry
// accent, gold and candlelight. Status colours keep their meaning.
export const CHRISTMAS = {
  label: 'Christmas Glass',
  roles: { accent: '#c62f3d', danger: '#e0522d', success: '#2e9e5b', warning: '#d69e1c', pro: '#4f9fd0' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#eef3ef', // snow, a breath of green
        'surface-1': '#f6f9f6',
        'surface-2': '#fcfdfc',
        'text-primary': '#1a261f',
        'text-secondary': '#3f4f46',
        'text-muted': '#5c6b62',
      },
    },
  },
  dark: {
    roles: { accent: '#e5505c', danger: '#ff7a4d', success: '#3fbf74', warning: '#f0b93a', pro: '#7dbfe8' },
    gray: {
      anchors: {
        'surface-0': '#06100b', // pine at night
        'surface-1': '#0d1912',
        'surface-2': '#14231a',
        'surface-3': '#1a2c21',
        'text-primary': '#f5f0e4', // candlelit cream
        'text-secondary': '#d0cab9',
        'text-muted': '#a0a696',
      },
    },
  },
}
