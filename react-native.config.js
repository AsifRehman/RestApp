module.exports = {
  assets: ['./node_modules/react-native-vector-icons/Fonts'],
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null, // This will prevent iOS from linking the fonts, avoiding duplication issues.
      },
    },
  },
};
