/** @type {import('tailwindcss').Config} */
const spacing = {};
let index = 0;
while (index < 100) {
  spacing[index] = `${index}px`;
  spacing[index * 4] = `${index * 4}px`;
  index += 1;
}
const maxSetting = {
  '1/4': '25%',
  '1/2': '50%',
  '3/5': '60%',
  '3/4': '75%',
  full: '100%',
};
const colors = {
  primary: '#1677ff',
  transparent: 'transparent',
  current: 'currentColor',
  black: '#000',
  white: '#fff',
  green: 'rgb(68, 183, 0)',
  red: '#d9514c',
  blue: '#2b7bd6',
  orange: '#eda20c',
  list: 'rgb(248, 250, 255)',
  panel: 'rgb(240, 244, 250)',
  panelheader: '#F8FAFF',
  'tp-gray': {
    0: 'rgba(0, 0, 0, 0)',
    50: 'rgba(0, 0, 0, 0.02)',
    100: 'rgba(0, 0, 0, 0.06)',
    200: 'rgba(0, 0, 0, 0.08)',
    300: 'rgba(0, 0, 0, 0.1)',
    400: 'rgba(0, 0, 0, 0.12)',
    500: 'rgba(0, 0, 0, 0.16)',
    600: 'rgba(0, 0, 0, 0.22)',
    700: 'rgba(0, 0, 0, 0.36)',
    800: 'rgba(0, 0, 0, 0.58)',
    900: 'rgba(0, 0, 0, 0.88)',
  },
  gray: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f2f2f2',
    200: '#ebebeb',
    300: '#e6e6e6',
    400: '#e0e0e0',
    500: '#d6d6d6',
    600: '#c7c7c7',
    700: '#a3a3a3',
    800: '#6b6b6b',
    900: '#1f1f1f',
    1000: '#000000',
  },
};
/**
 * 对 t r b l 四个方向单面的 1px shadow
 */
const shadows = {};
['1', '2'].forEach((length) => {
  const prefix = `${length}-`;
  Object.keys(colors).forEach((key) => {
    const value = colors[key];
    if (typeof value === 'string') {
      shadows[`${prefix}${key}`] = `0 0 0 ${length}px ${value}`;
      shadows[`${prefix}inset-${key}`] = `0 0 0 ${length}px ${value} inset`;
      shadows[`${prefix}t-${key}`] = `0 -${length}px 0 ${value}`;
      shadows[`${prefix}t-inset-${key}`] = `0 ${length}px 0 ${value} inset`;
      shadows[`${prefix}b-${key}`] = `0 ${length}px 0 ${value}`;
      shadows[`${prefix}b-inset-${key}`] = `0 -${length}px 0 ${value} inset`;
      shadows[`${prefix}r-${key}`] = `${length}px 0 0 ${value}`;
      shadows[`${prefix}r-inset-${key}`] = `-${length}px 0 0 ${value} inset`;
      shadows[`${prefix}l-${key}`] = `-${length}px 0 0 ${value}`;
      shadows[`${prefix}l-inset-${key}`] = `${length}px 0 0 ${value} inset`;
      shadows[`${prefix}x-${key}`] = `-${length}px 0 0 ${value}, ${length}px 0 0 ${value}`;
      shadows[
        `${prefix}x-inset-${key}`
      ] = `-${length}px 0 0 ${value} inset, ${length}px 0 0 ${value} inset`;
      shadows[`${prefix}y-${key}`] = `0 -${length}px 0 ${value}, 0 ${length}px 0 ${value}`;
      shadows[
        `${prefix}y-inset-${key}`
      ] = `0 -${length}px 0 ${value} inset, 0 ${length}px 0 ${value} inset`;
    } else {
      Object.keys(value).forEach((valKey) => {
        shadows[`${prefix}${key}-${valKey}`] = `0 0 0 ${length}px ${value[valKey]}`;
        shadows[`${prefix}inset-${key}-${valKey}`] = `0 0 0 ${length}px ${value[valKey]} inset`;
        shadows[`${prefix}t-${key}-${valKey}`] = `0 -${length}px 0 ${value[valKey]}`;
        shadows[`${prefix}t-inset-${key}-${valKey}`] = `0 ${length}px 0 ${value[valKey]} inset`;
        shadows[`${prefix}b-${key}-${valKey}`] = `0 ${length}px 0 ${value[valKey]}`;
        shadows[`${prefix}b-inset-${key}-${valKey}`] = `0 -${length}px 0 ${value[valKey]} inset`;
        shadows[`${prefix}r-${key}-${valKey}`] = `${length}px 0 0 ${value[valKey]}`;
        shadows[`${prefix}r-inset-${key}-${valKey}`] = `-${length}px 0 0 ${value[valKey]} inset`;
        shadows[`${prefix}l-${key}-${valKey}`] = `-${length}px 0 0 ${value[valKey]}`;
        shadows[`${prefix}l-inset-${key}-${valKey}`] = `${length}px 0 0 ${value[valKey]} inset`;
        shadows[
          `${prefix}x-${key}-${valKey}`
        ] = `-${length}px 0 0 ${value[valKey]}, ${length}px 0 0 ${value[valKey]}`;
        shadows[
          `${prefix}x-inset-${key}-${valKey}`
        ] = `-${length}px 0 0 ${value[valKey]} inset, ${length}px 0 0 ${value[valKey]} inset`;
        shadows[
          `${prefix}y-${key}-${valKey}`
        ] = `0 -${length}px 0 ${value[valKey]}, 0 ${length}px 0 ${value[valKey]}`;
        shadows[
          `${prefix}y-inset-${key}-${valKey}`
        ] = `0 -${length}px 0 ${value[valKey]} inset, 0 ${length}px 0 ${value[valKey]} inset`;
      });
    }
  });
});
module.exports = {
  content: ['./src/**/*.{html,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors,
      boxShadow: {
        none: 'none',
        0: '0 0 0 1px rgba(223, 223, 223, 0.45)',
        1: '0 0 0 1px rgba(223, 223, 223, 0.5), 0 3px 6px 0 rgba(0, 0, 0, 0.04)',
        2: '0 0 0 1px rgba(219, 219, 219, 0.55),0 3px 5px 0 rgba(0, 0, 0, 0.05), 0 6px 15px 0 rgba(0, 0, 0, 0.05)',
        3: '0 0 0 1px rgba(219, 219, 219, 0.7), 0 8px 20px 0 rgba(0, 0, 0, 0.08), 0 4px 10px 0 rgba(0, 0, 0, 0.07)',
        4: '0 0 0 1px rgba(107, 107, 107, 0.15), 0 10px 36px 0 rgba(0, 0, 0, 0.1), 0 6px 15px 0 rgba(0, 0, 0, 0.07)',
        ...shadows,
      },
      maxWidth: {
        ...maxSetting,
        screen: '100vw',
      },
      maxHeight: {
        ...maxSetting,
        screen: '100vh',
      },
      minHeight: {
        ...maxSetting,
        screen: '100vh',
      },
      spacing: {
        ...spacing,
      },
      margin: {
        ...spacing,
      },
      borderRadius: {
        2: '2px',
        4: '4px',
        6: '6px',
        8: '8px',
        10: '10px',
        12: '12px',
        16: '16px',
      },
    },
  },
  plugins: [],
};
