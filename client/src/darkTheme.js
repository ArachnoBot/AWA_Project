const { createTheme } = require("@mui/material");
const { blue, red, blueGrey, grey } = require("@mui/material/colors");

const theme = createTheme({
  palette: {
    primary: {
      main: blue[700]
    },
    secondary: {
      main: red[700]
    },
    background: {
      main: blueGrey[900],
      box: blueGrey[700]
    },
    message: {
      home: blue[600],
      away: blueGrey[600],
      time: grey[300]
    },
    textColor: grey[300],
    iconColor: grey[300],
    textFieldBg: blueGrey[700]
  },
  breakpoints: {
    values: {
      desktop: 600
    }
  }
})

export default theme