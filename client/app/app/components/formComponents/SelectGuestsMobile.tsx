import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { useCloseOnClick } from "./utils";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";

const DEFAULT_PARAMS = {
  adults: "2",
  children: "0",
};

export default function SelectGuestsMobile({
  defaultParams = DEFAULT_PARAMS,
}: {
  defaultParams?: typeof DEFAULT_PARAMS;
}) {
  const { t } = useTranslation();
  const [selectedValues, setSelectedValues] = useState({
    adults: Number(defaultParams.adults),
    children: Number(defaultParams.children),
  });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useCloseOnClick(wrapperRef, checkboxRef, null, []);

  const genGuestOptions = (num: number, guestType: "adults" | "children") => {
    const guestNum = guestType === "children" ? num + 1 : num;
    return Array.from({ length: guestNum }, (_, i) => {
      const count = guestType === "children" ? i : i + 1;
      const key = `opt-${guestType}-${count}`;
      // const translationKey = guestType + "WithCount";

      return (
        <MenuItem key={key} value={count}>
          {count}
        </MenuItem>
      );
    });
  };
  return (
    <fieldset className="flex flex-col">
      <legend className="font-light">{t("Number of guests") + ":"}</legend>
      <div className="flex gap-6">
        <FormControl sx={{ minWidth: 100 }}>
          <Select
            variant="standard"
            label={t("adults")}
            id="select-adults"
            defaultValue={selectedValues.adults}
            name="adults"
            onChange={(e) =>
              setSelectedValues({
                ...selectedValues,
                adults: Number(e.target.value),
              })
            }
          >
            {genGuestOptions(12, "adults")}
          </Select>
          <FormHelperText>{t("adults")}</FormHelperText>
        </FormControl>
        <FormControl>
          <Select
            variant="standard"
            label={t("children")}
            id="select-children"
            defaultValue={selectedValues.children}
            name="children"
            onChange={(e) =>
              setSelectedValues({
                ...selectedValues,
                children: Number(e.target.value),
              })
            }
          >
            {genGuestOptions(12, "children")}
          </Select>
          <FormHelperText>{t("children")}</FormHelperText>
        </FormControl>
      </div>
    </fieldset>
  );
}
