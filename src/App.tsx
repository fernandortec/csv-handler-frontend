import {
  Box,
  Card,
  CardContent,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { apiClient } from "./services/api";
import "./styles/app.css";

export const App = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [csvData, setCsvData] = useState<string[][]>();
  const [params, setParams] = useState<{ [key: string]: any }>();
  const [filter, setFilter] = useState<string>("");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      if (!file) {
        toast("Please insert a file.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post("/api/files", formData);

        if (response.status === 200)
          toast("File inserted successfully!", {
            position: "top-right",
          });
      } catch (e) {
        toast("Error while inserting file, please try again.");
        return;
      }

      const apiCsvData = await apiClient.get("/api/users");

      setCsvData(apiCsvData.data);
      setOpen(true);
    }
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    "min-width": 650,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="app">
      <h1>Hello, please insert your CSV data below</h1>
      <label htmlFor="file-upload" className="custom-file-upload">
        INSERT FILE
      </label>
      <input id="file-upload" type="file" onChange={handleFileChange} />
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <TextField
            fullWidth={true}
            placeholder="Filter the data by columns"
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                const filteredData = await apiClient.get("/api/users", {
                  params: {
                    name: filter,
                  },
                });

                setCsvData(filteredData.data);
              }
            }}
          />
          <Card variant="outlined">
            {csvData?.map((row) => {
              return (
                <CardContent>
                  <Typography sx={{ fontSize: 18 }} color="text.primary">
                    Name: {row[0]}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    City: {row[1]}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.primary">
                    Country: {row[2]}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Favorite sport: {row[3]}
                  </Typography>
                </CardContent>
              );
            })}

            <hr />
          </Card>
        </Box>
      </Modal>
      <Toaster />
    </div>
  );
};
