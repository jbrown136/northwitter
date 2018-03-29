import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import PropTypes from 'prop-types'
import Linkify from 'react-linkify'

class App extends Component {
  state = {
    user: {},
    profile_img : '',
    profileBanner: '', 
    trends: [],
    trendsUrls: [],
    timeline: [],
    tweetToSend: '',
}

componentDidMount () {
  this.fetchUser("nc_students_say")
  this.fetchTrends();
  this.fetchTimeline();
}
  render() {
    return (
      <div className="container">
      <div className="header">
        <input id="SearchUsers" placeholder="Search users" onKeyUp={this.setUser}/>
        <input id="writeTweet" placeholder="Send tweet" onChange={this.setTweet} maxLength="280" />
        <button className="sendTweet" onClick={this.sendTweet}>Send Tweet</button>
        <button className="showTimeline" onClick={this.showTimeline}>Show Timeline</button>
        </div>
        <div className="output" id="output">{this.state.postMessage}</div>
        <div className="banner">
        <img src={this.state.profileBanner} alt="" className="bannerImg" />
        </div>
        <div id="data">
        <div id="user">
        <h2>{this.state.user.screen_name}</h2>
        <h3>{this.state.user.name}</h3>
        <img src={this.state.profile_img} alt=""/>
        <h3>Followers: {this.state.user.followers_count}</h3>
        <h3>Following: {this.state.user.friends_count}</h3>
        {/* <h3>Tweets: {this.state.user.tweet_count}</h3>
        <h3>Likes: {}</h3> */}
        <h3>Lists: {this.state.user.listed_count}</h3>
        </div>
        <div id="tweets">
        <h2>Timeline</h2>
        <Tweets user={this.state.user.screen_name} />
        </div>
          <div id="trends">
        <ListMaker items={this.state.trends} title="Trending" urls={this.state.trendsUrls} id="trends"/>
        </div>
        </div>
      </div>
    );
  }

  fetchTrends = () => {
    axios.get("https://northcoders-sprints-api.now.sh/api/twitter/trends")
    .then(trends => {
      //console.log(trends)
      const trendsArr = []
      const trendsUrls = []
      trends.data.trends.forEach(trend => { 
        trendsArr.push(trend.name)
        trendsUrls.push(trend.url)
      })
      this.setState({
        trends: trendsArr,
        trendsUrls: trendsUrls
    })
  })
  .catch(err => console.log(err))
}

  fetchTimeline = () => {
    axios.get("https://northcoders-sprints-api.now.sh/api/twitter/timeline")
    .then(timeline => {
      //console.log(timeline);
      timeline = timeline.data.tweets.map(tweet=> tweet.text)
      this.setState({
        timeline: timeline
      })
    })
  }


  showTimeline = events => {
    this.fetchUser("nc_students_say")
  }

  setUser = event => {
    const user = event.target.value;
    //console.log(user)
    if(user === '') return
    if(event.key === "Enter") {
     event.target.value = ''
     this.fetchUser(user)
    }
  }

  fetchUser = user => {
  axios.get(`https://northcoders-sprints-api.now.sh/api/twitter/users/${user}`)
    .then(userData => {
      const user_img = userData.data.user.profile_image_url.replace("_normal", "");
      const name = userData.data.user.name;
      const banner = userData.data.user.profile_banner_url ? userData.data.user.profile_banner_url : "data:image/png;base64,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";
      this.setState({ 
        username: name,
        user: userData.data.user,
        profile_img: user_img,
        profileBanner: banner
    })
  })
    .catch(err => {
      this.setState({
        profile_img: "",
        user: {Screen_name: "User does not exist"}
      })
    })
  }

  setTweet = event => {
    this.setState({
      tweetToSend: event.target.value
    })
  }

  sendTweet = () => {
    if (this.state.tweetToSend === '') return;
    const tweet = {status: this.state.tweetToSend}
    axios.post('https://northcoders-sprints-api.now.sh/api/twitter/tweets', tweet)
    .then(res => {
      this.fetchUser("nc_students_say")
    })
    .catch(err => console.log(err))

    this.setState({
      tweetToSend: ''
    })
    document.getElementById("writeTweet").value = ""
  }
}

App.PropTypes = {
  username: PropTypes.string,
  user: PropTypes.string
}
class Tweets extends Component {
  state = {
    tweets: [],
    tweetImages: []
  }
  componentWillReceiveProps (nextProps) {
    this.fetchTweets(nextProps.user)
  }
  render () {
    return <ListMaker items={this.state.tweets} images={this.state.tweetImages}/>
  }

  fetchTweets = (user) => {
    if(user === "") return this.setState({
      tweets: [],
      tweetImages: []
    })
     axios.get(`https://northcoders-sprints-api.now.sh/api/twitter/tweets/${user}`)
  .then(tweets => {
    const tweetImages = []
    tweets = tweets.data.tweets.map(tweet => {
      tweetImages.push(tweet.user.profile_image_url)
      return tweet.text
    })
    this.setState({
      tweets: tweets.reverse(),
      tweetImages: tweetImages
    })
    })
    .catch(err => {
      this.setState({
        tweets: []
      })
    })
  }
}

function ListMaker (props) {
  //console.log(props.images)
  if (props.images){
  return (
    <div>
      <h2>{props.title}</h2>
    <ul>{props.items.map((item, i) => {
      return <List item={item} key={i}  image={props.images[i]}/>
    }
    )}</ul>
    </div>
  )
}
else return (
  <div>
      <h2>{props.title}</h2>
    <ul>{props.items.map((item, i) => {
      return <List item={item} key={i} url={props.urls[i]}/>
    }
    )}</ul>
    </div>
)
}


function List (props) {
  return (
  <li className="box">
    <img src={props.image} alt="" className="tweetImage"/><br/>
    <a href={props.url} target="_blank"><Linkify properties={{target: "_blank", style: {color: 'black'}}}>{props.item}</Linkify></a>
    </li>
  )
}


export default App;
