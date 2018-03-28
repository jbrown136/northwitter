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
        <p>{this.state.user}</p>
        <img src={this.state.profile_img} alt=""/>
        <Tweets user={this.state.user} />
        <ListMaker items={this.state.listToShow} title={this.state.title} />
      </div>
    );
  }

  fetchTrends = () => {
    axios.get("https://northcoders-sprints-api.now.sh/api/twitter/trends")
    .then(trends => {
      //console.log(trends)
      const trendsArr = trends.data.trends.map(trend => trend.name)
      this.setState({
        trends: trendsArr
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
    .then(function (res) {
      this.setState({
        postMessage: "tweet successfully sent"
      })
    //  console.log(res.data)
    })
    .catch(function(err) {
      output.className = "error"
      this.setState({
        postMessage:err.message
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
  return (
    <div>
      <h2>{props.title}</h2>
    <ul>{props.items.map((item, i) => {
      return <List item={item} key={i}/>
    }
    )}</ul>
    </div>
  )
}


function List (props) {
  return <li>{props.item}</li>
}


export default App;
