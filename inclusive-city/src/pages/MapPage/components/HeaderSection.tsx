import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

export default function HeaderSection() {
  return (
    <Stack sx={{ mb: 2, mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
        <Typography level="h2">Пошук інклюзивних місць</Typography>
      </Stack>

      <Typography level="body-md" color="neutral">
       Знайди найближчі інклюзивні місця, які відповідають твоїм потребам.
      </Typography>
    </Stack>
  );
}