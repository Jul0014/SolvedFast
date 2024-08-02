import { Typography, IconButton } from "@mui/material";
import { Fragment } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ConfigMenu from "../Components/ConfigMenu";
import Menu from "../Components/Menu";

export default function Welcome() {
  return (
    <Fragment>
      <Menu />
      <Box sx={{ flexGrow: 1, position: 'relative', minHeight: '94vh' }}>
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ pt: 4, pl: 6, pr: 6 }}
        >
          <Grid item xs={12} md={8}>
            <Typography variant="h2">Bienvenido</Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 36,
          }}
        >
          <ConfigMenu></ConfigMenu>
        </Box>
      </Box>
    </Fragment>
  );
}

