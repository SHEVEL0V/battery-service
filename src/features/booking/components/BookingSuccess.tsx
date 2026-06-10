import { Box, Stack, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";

export function BookingSuccess({ dict }: { dict: { success: string } }) {
  return (
    <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center", py: 6 }}>
      <Box sx={{ color: "success.main" }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 64 }} />
      </Box>
      <Typography variant="h4">{dict.success}</Typography>
    </Stack>
  );
}
