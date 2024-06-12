import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  text1: {
    paddingHorizontal: 60,
    borderRadius: 30,
    paddingVertical: 10,
    fontSize: 18,
    marginTop: 30,
    textAlign: 'center',
    fontWeight:"500"
  },
  text2: {
    fontSize: 14,
  }
});

export default styles;
