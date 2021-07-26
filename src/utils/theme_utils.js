const theme = {
  chalk: {
    backgroundColor: '#161522',
    titleColor: '#fff'
  },
  vintage: {
    backgroundColor: '#ddd',
    titleColor: '#000'
  }
}

export function getThemeColor (themeName) {
  return theme[themeName]
}
