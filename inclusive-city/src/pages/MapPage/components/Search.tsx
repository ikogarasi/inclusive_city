import * as React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Typography from "@mui/joy/Typography";

export default function Search(props: {
  len: number;
  onSearch?: () => void;
  onChange?: (value: string) => void;
  value?: string;
}) {
  return (
    <div>
      <Stack spacing={1} direction="row" sx={{ mb: 2 }}>
        <FormControl sx={{ flex: 1 }}>
          <Input
            placeholder="Search..."
            value={props.value || ""}
            onChange={(e) => props.onChange && props.onChange(e.target.value)}
            startDecorator={<SearchRoundedIcon />}
            aria-label="Search"
            onKeyDown={(e) => {
              if (e.key === "Enter" && props.onSearch) props.onSearch();
            }}
          />
        </FormControl>
        <Button variant="solid" color="primary" onClick={props.onSearch}>
          Пошук
        </Button>
      </Stack>
      <Typography level="body-sm">{props.len} місць знайдено</Typography>
    </div>
  );
}
