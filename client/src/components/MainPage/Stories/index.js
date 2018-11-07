import React, { Component } from 'react';
import './style.css';
import StoryCard from '../../StoryCard';
import Masonry from 'react-masonry-component';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactPaginate from 'react-paginate';
import deeppurple from '@material-ui/core/colors/deepPurple';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const imagesLoadedOptions = { background: '.my-bg-image-el' };
const CancelToken = axios.CancelToken;
let cancel;

class Stories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      arrayOfStories: [],
      offset: 0,
      perPage: 20,
      paginationLength: 0,
      activePage: +window.location.hash.slice(1) || 0,
    };
  }

  componentDidMount() {
    axios
      .get('/api/posts/length', {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      })
      .then(res => {
        if (this.timerID) {
          clearInterval(this.timerID);
        }
        if (window.location.pathname.slice(1,5) === 'home') {
          this.setState({
            paginationLength: Math.ceil(res.data / this.state.perPage),
            offset: Math.ceil(window.location.hash.slice(1) * this.state.perPage),
          });

          this.getData();
          this.timerID = setInterval(this.getData, 5000);
        }
      })
      .catch(function (error) {console.log(error)});

    window.addEventListener('hashchange', this.changePagination);
  }

  componentWillUnmount() {
    if (this.timerID) clearInterval(this.timerID);
    window.removeEventListener('hashchange', this.changePagination);

    if (cancel) cancel();
  }

  changePagination = () => {
    let selected = window.location.hash.slice(1);
    let offset = Math.ceil(selected * this.state.perPage);

    this.setState({
      offset: offset,
      arrayOfStories: [],
      activePage: +window.location.hash.slice(1)
    }, () => {

      this.getData();
    });
  };

  handlePageClick = (data) => {
    window.location.hash = data.selected;
    //BAG shouldComponentUpdate()
  };

  getData = () => {
    const data = {
      perPage: this.state.perPage, offset: this.state.offset
    };

    this.setState({ isLoading: true });
    axios
      .get('/api/posts', {params : data,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      })})
      .then(res => {
        if (this.timerID) {
          clearInterval(this.timerID);
        }

        if (window.location.pathname.slice(1,5) === 'home') {
          this.setState({
            isLoading: false,
            arrayOfStories: res.data,
          });
        }
      })
      .catch(function (error) {console.log(error)});
  };

  render() {
    return (
      <div>
        {
          this.state.paginationLength !== 0 &&
          <ReactPaginate previousLabel={<FontAwesomeIcon icon={faArrowLeft} />}
                         nextLabel={<FontAwesomeIcon icon={faArrowRight} />}
                         breakLabel={'...'}
                         breakClassName={"pagination__break-me"}
                         pageCount={this.state.paginationLength}
                         marginPagesDisplayed={1}
                         pageRangeDisplayed={2}
                         onPageChange={this.handlePageClick}
                         containerClassName={"pagination"}
                         activeClassName={"pagination__active"}
                         forcePage={this.state.activePage}
                         disableInitialCallback={true}
          />
        }
        {
          this.state.arrayOfStories.length !== 0
            ? <Masonry
              className={'masonry-stories'} // default ''
              elementType={'div'} // default 'div'
              disableImagesLoaded={false} // default false
              updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
              imagesLoadedOptions={imagesLoadedOptions} // default {}
            >
              {
                this.state.arrayOfStories.map((post, i) => {
                  return (
                    <StoryCard
                      cardID={post._id}
                      key={i}
                      userAvatar={post.avatar}
                      userName={post.name}
                      storyTitle={post.text}
                      storyImage={post.picture}
                      dateOfPost={post.date}
                      likes={post.likes}
                      userID={post.userID}
                    />
                  );
                })
              }
            </Masonry>
            : <CircularProgress
                style={{display: 'block', margin: '100px auto', color: deeppurple[500]}}
                size={200}
                thickness={2}
              />
        }
      </div>
    );
  }
}

export default Stories;