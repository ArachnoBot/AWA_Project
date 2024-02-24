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
    textFieldBg: blueGrey[900],
    dividerColor: blueGrey[600]
  },
  breakpoints: {
    values: {
      desktop: 600
    }
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          "&.Mui-selected": {
            backgroundColor: blueGrey[900],
            "&:hover": {
              backgroundColor: blueGrey[900]
            },
          },
          borderRadius: "10px"
        })
      }
    }
  }
})

export default theme