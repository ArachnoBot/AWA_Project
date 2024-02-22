const { createTheme } = require("@mui/material");
const { blue, red, blueGrey, grey } = require("@mui/material/colors");

const theme = createTheme({
  palette: {
    primary: {
      main: blue[900]
    },
    secondary: {
      main: red[900]
    },
    background: {
      main: "#000000",
      box: blueGrey[900]
    },
    message: {
      home: blue[900],
      away: blueGrey[800],
      time: grey[500]
    },
    textColor: grey[400],
    iconColor: grey[400],
    textFieldBg: blueGrey[900]
  },
  breakpoints: {
    values: {
      desktop: 600
    }
  }
})

export default theme