import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  statsHead: {
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  container: {
    width: '100%'
  },
  scrollView: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  bulletsContainer: {
    position: 'absolute',
    bottom: 35,
    left: 0,
    width: '100%',
    alignContent: 'center'
  },
  bullets: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  bullet: {
    paddingHorizontal: 5,
    fontSize: 20,
  }
});

export default styles;