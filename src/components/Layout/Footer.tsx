import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 3,
        px: 2,
        borderTop: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        textAlign: "center"
      }}
    >
      <Typography variant="h6" gutterBottom>
        聯絡我們
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Threads:{" "}
        <Link
          href="https://www.threads.net/@play.with.me._artale"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ textDecoration: "none" }}
        >
          @play.with.me._artale
        </Link>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Artale 組隊
      </Typography>
    </Box>
  );
}