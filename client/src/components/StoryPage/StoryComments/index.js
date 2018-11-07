import React, { Component } from 'react';
import './style.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    minWidth: 320,
    maxWidth: 420,
    margin: '0 auto',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  pos: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    float: 'left',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    float: 'right',
  },
  comment: {
    paddingTop: 5,
    fontSize: 16,
    float: 'none',
  },
};

class StoryComments extends Component {

  render() {
    const dateFormat = require('dateformat');
    const { classes, comments } = this.props;
    return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            Comments: {comments ? comments.length : 0}
          </Typography>
            {
              comments.map((comment, i) => {
                  return (
                    <div key={i} className="comments__comment">
                      <div className="clearfix">
                        <Typography className={classes.userName}>
                          {comment.name}
                        </Typography>
                        <Typography className={classes.date} color="textSecondary">
                          {dateFormat(comment.date, "h:MM TT, mmmm dS")}
                        </Typography>
                      </div>
                      <Typography className={classes.comment}>
                        {comment.text}
                      </Typography>
                    </div>
                  );
                }
              )
            }
        </CardContent>
      </Card>
    </div>
    );
  }
}

StoryComments.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StoryComments);