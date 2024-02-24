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
      box: blue[900]
    },
    message: {
      home: blue[800],
      away: blueGrey[600],
      time: grey[300]
    },
    textColor: grey[300],
    iconColor: grey[300],
    textFieldBg: blueGrey[700],
    dividerColor: blue[600]
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
            backgroundColor: blue[900],
            "&:hover": {
              backgroundColor: blue[900]
            },
          },
          borderRadius: "10px"
        })
      }
    }
  }
})

export default theme