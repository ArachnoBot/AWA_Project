const { createTheme } = require("@mui/material");
const { blue, red, grey } = require("@mui/material/colors");

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500]
    },
    secondary: {
      main: red[500]
    },
    background: {
      main: "",
      box: blue[500]
    },
    message: {
      home: blue[500],
      away: blue[200],
      time: grey[800]
    }
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
            "&:hover": {
              backgroundColor: blue[500]
            },
          },
          borderRadius: "10px"
        })
      }
    }
  }
})

export default theme