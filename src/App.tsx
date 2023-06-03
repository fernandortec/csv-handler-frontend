import { Box, Modal, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { apiClient } from "./services/api";
import "./styles/app.styles.css";
import { Card } from "./components/card";

export const App = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [csvData, setCsvData] = useState<string[][]>();
  const [filter, setFilter] = useState<string>("");

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (filter === "") {
        const apiCsvData = await apiClient.get("/api/users");

        setCsvData(apiCsvData.data);
      } else {
        const filteredData = await apiClient.get("/api/users", {
          params: {
            name: filter,
          },
        });

        setCsvData(filteredData.data);
      }
    }
  };

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

  return (
    <div className="app">
      <h1>Hello, please insert your CSV data below</h1>
      <label htmlFor="file-upload" className="custom-file-upload">
        INSERT FILE
      </label>
      <input id="file-upload" type="file" onChange={handleFileChange} />
      <Modal className="modal" open={open} onClose={() => setOpen(false)}>
        <Box className="box">
          <TextField
            fullWidth={true}
            placeholder="Filter the data by columns"
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {csvData?.map((row) => {
            return <Card row={row} />;
          })}
        </Box>
      </Modal>
      <Toaster />
    </div>
  );
};
