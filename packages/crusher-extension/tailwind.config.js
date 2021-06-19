const getSpacingSizes = (remBaseUnit) => {
  const sizingMap = {};
  for (let i = 0; i <= 100; i++) {
    if (i > 8 && i % 4 !== 0) {
      continue;
    }
    sizingMap[i] = `${i / remBaseUnit}rem`;
  }
  return sizingMap;
};

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    padding: {
      ...getSpacingSizes(16)
    },
    screens: {},
    margin: {
      ...getSpacingSizes(16)
    },
    fontSize: {
      '12': '0.75rem',
      '13': '0.81rem',
      '15': '0.94rem',
      '17': '1.05rem'
    },
  },

  variants: {
    extend: {

    },
  },
  plugins: [],
}