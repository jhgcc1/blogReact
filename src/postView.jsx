
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 545,
    width: 350,
    minWidth: 350,
    margin: '40px',
    height: '275px',
  },
});

function PostsView({ posts }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      {posts.map((element) => (
        <Card key={element.title+element.image} className={classes.root}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="220px"
              width="300px"
              style={{ objectFit: 'scale-down' }}
              image={element.image}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {element.title}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </React.Fragment>
  );
}

export default PostsView;
