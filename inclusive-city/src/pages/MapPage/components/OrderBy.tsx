import MenuButton from "@mui/joy/MenuButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Dropdown from "@mui/joy/Dropdown";

export default function OrderBy() {
  return (
    <Dropdown>
      <MenuButton
        variant="plain"
        color="primary"
        endDecorator={<ArrowDropDown />}
        sx={{ whiteSpace: "nowrap" }}
      >
        Впорядкувати за
      </MenuButton>
      <Menu sx={{ minWidth: 120 }}>
        <MenuItem>Distance</MenuItem>
        <MenuItem>Rating</MenuItem>
      </Menu>
    </Dropdown>
  );
}
