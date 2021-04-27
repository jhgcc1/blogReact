import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React,{useState} from 'react';
import { render } from '@testing-library/react';


const useStyles = makeStyles({
    root: {
      maxWidth: 545,
      width:350
    }
  });


function PostsView(props){
    console.log(props.posts)
  return (
    <React.Fragment>
        {props.posts.map(element => {
            console.log(element.title,"lement.title");
            return(<p>{element.title}</p>)
        })}
    </React.Fragment>
  );
}

export default PostsView;