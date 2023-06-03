import { Card as MuiCard, CardContent, Typography } from "@mui/material";
import "./card.styles.css";

export const Card = ({ row }: { row: string[] }): JSX.Element => {
  return (
    <MuiCard className="card">
      <CardContent>
        <Typography className="header" color="text.primary">
          Name: {row[0]}
        </Typography>
        <Typography className="paragraph" color="text.secondary">
          City: {row[1]}
        </Typography>
        <Typography className="paragraph" color="text.primary">
          Country: {row[2]}
        </Typography>
        <Typography className="paragraph" color="text.secondary">
          Favorite sport: {row[3]}
        </Typography>
      </CardContent>
    </MuiCard>
  );
};
