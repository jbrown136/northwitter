import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import PropTypes from 'prop-types'

class App extends Component {
  state = {
    username: '',
    user: '',
    profile_img : '', 
    trends: [],
    trendsUrls: [],
    timeline: [],
    tweetToSend: '',
    listToShow: [],
    title: '',
    postMessage: ""
}

componentDidMount () {
  this.fetchTrends();
  this.fetchTimeline();
}
  render() {
    return (
      <div className="container">
        <input className="user" placeholder="Search users" onKeyUp={this.setUser}/>
        <input className="writeTweet" placeholder="Send tweet" onChange={this.setTweet} maxLength="280https://github.com/jbrown136/northwitter" />
        <button className="sendTweet" onClick={this.sendTweet}>Send Tweet</button>
        <button className="showTrends" onClick={this.showTrends}>Show Trends</button>
        <button className="showTimeline" onClick={this.showTimeline}>Show Timeline</button>
        <div className="output" id="output">{this.state.postMessage}</div>
        <div id="user">
        <p>{this.state.user}</p>
        <img src={this.state.profile_img} alt=""/>
        <Tweets user={this.state.user} />
        </div>
          <div id="timeline">
        <ListMaker items={this.state.listToShow} title={this.state.title} urls={this.state.trendsUrls}/>
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
    //.catch(err => console.log(err))
  })
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

  showTrends = event => {
    const trends = this.state.trends
    this.setState({
      user: '',
      profile_img: '',
      listToShow: trends,
      title: 'Trending',
      postMessage: ''
    })
  }

  showTimeline = events => {
    const timeline = this.state.timeline;
    this.setState({
      user: '',
      profile_img: '',
      listToShow: timeline,
      title: 'Timeline',
      postMessage: ''
    })
  }

  setUser = event => {
    const user = event.target.value;
    //console.log(user)
    if(user === '') return this.setState({
      user: "",
      profile_img: "",
      ussrname: "",
      listToShow: "",
      title: "",
      postMessage: ""
    })
    if(event.key === "Enter") {
      event.target.value = ''
    axios.get(`https://northcoders-sprints-api.now.sh/api/twitter/users/${user}`)
    .then(userData => {
      const user_img = userData.data.user.profile_image_url.replace("_normal", "")
      const name = userData.data.user.name
      this.setState({ 
        username: name,
        user: user,
        profile_img: user_img,
        listToShow: [],
        title: '',
        postMessage: ''
    })
  })
    .catch(err => {
      this.setState({
        user: `${user} does not exist`,
        profile_img: '',
        username: '',
        listToShow: [],
        title: '',
        postMessage: ''
      })
    })
  }
  }

  setTweet = event => {
    this.setState({
      tweetToSend: event.target.value
    })
  }

  sendTweet = () => {
    //console.log(this.state.tweetToSend)
    if (this.state.tweetToSend === '') return;
    const tweet = {status: this.state.tweetToSend}
    const output = document.getElementById("output")
    axios.post('https://northcoders-sprints-api.now.sh/api/twitter/tweets', tweet)
    .then(res => {
      this.setState({
        postMessage: "tweet successfully sent",
        user: '',
        profile_img: '',
        username: '',
        listToShow: [],
        title: '',
      })
    //  console.log(res.data)
    })
    .catch(err => {
      output.className = "error"
      this.setState({
        postMessage: err.message,
        user: '',
        profile_img: '',
        username: '',
        listToShow: [],
        title: '',
      })
    })

    this.setState({
      tweetToSend: ''
    })
  }
}

App.PropTypes = {
  username: PropTypes.string,
  user: PropTypes.string
}
class Tweets extends Component {
  state = {
    tweets: []
  }
  componentWillReceiveProps (nextProps) {
    this.fetchTweets(nextProps.user)
  }
  render () {
    return <ListMaker items={this.state.tweets} />
  }

  fetchTweets = (user) => {
    if(user === "") return this.setState({
      tweets: []
    })
     axios.get(`https://northcoders-sprints-api.now.sh/api/twitter/tweets/${user}`)
  .then(tweets => {
    tweets = tweets.data.tweets.map(tweet => tweet.text)
    this.setState({
      tweets: tweets
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
  if (props.title === 'Trending'){
  return (
    <div>
      <h2>{props.title}</h2>
    <ul>{props.items.map((item, i) => {
      return <List item={item} key={i} url={props.urls[i]}/>
    }
    )}</ul>
    </div>
  )
}
else return (
  <div>
      <h2>{props.title}</h2>
    <ul>{props.items.map((item, i) => {
      return <List item={item} key={i} />
    }
    )}</ul>
    </div>
)
}


function List (props) {
  return <li><a href={props.url}>{props.item}</a></li>
}


export default App;
