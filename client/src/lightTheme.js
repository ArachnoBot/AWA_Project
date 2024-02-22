import { light } from "@mui/material/styles/createPalette";

const { createTheme } = require("@mui/material");
const { blue, red, blueGrey, grey } = require("@mui/material/colors");

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500]
    },
    secondary: {
      main: red[500]
    },
    background: {
      main: light,
      box: blue[100]
    },
    message: {
      home: blue[200],
      away: blueGrey[100],
      time: grey[700]
    }
  },
  breakpoints: {
    values: {
      desktop: 600
    }
  }
})

export default theme