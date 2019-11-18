import React from "react";

import {
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography
} from "@material-ui/core";

export default function App(props) {
  const { card, knowHandle, deleteHandle } = props;
  const word = card.name;

  const sayHandle = () => {
    speechSynthesis.speak(new SpeechSynthesisUtterance(word));
  };

  const copyWordHandle = async () => {
    await navigator.clipboard.writeText(word);
  };

  return (
    <Card style={{ marginBottom: "2rem" }}>
      <CardActionArea onClick={sayHandle}>
        <CardMedia
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {card.name}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
          ></Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={knowHandle}>
          Know it
        </Button>
        <Button size="small" color="primary" onClick={copyWordHandle}>
          Copy
        </Button>
        <Button size="small" color="primary" onClick={deleteHandle}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
