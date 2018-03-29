import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import PropTypes from 'prop-types'

class App extends Component {
  state = {
    username: '',
    user: '',
    profile_img : '',
    profileBanner: '', 
    trends: [],
    trendsUrls: [],
    timeline: [],
    tweetToSend: '',
    // listToShow: [],
    // title: '',
    postMessage: ""
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
        <input className="user" placeholder="Search users" onKeyUp={this.setUser}/>
        <input className="writeTweet" placeholder="Send tweet" onChange={this.setTweet} maxLength="280https://github.com/jbrown136/northwitter" />
        <button className="sendTweet" onClick={this.sendTweet}>Send Tweet</button>
        {/* <button className="showTrends" onClick={this.showTrends}>Show Trends</button> */}
        <button className="showTimeline" onClick={this.showTimeline}>Show Timeline</button>
        </div>
        <div className="output" id="output">{this.state.postMessage}</div>
        <div className="banner">
        <img src={this.state.profileBanner} alt="" className="bannerImg" />
        </div>
        <div id="data">
        <div id="user">
        <h2>{this.state.user}</h2>
        <img src={this.state.profile_img} alt=""/>
        </div>
        <div id="tweets">
        <h2>Timeline</h2>
        <Tweets user={this.state.user} />
        </div>
          <div id="trends">
        <ListMaker items={this.state.trends} title="Trending" urls={this.state.trendsUrls}/>
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

  // showTrends = event => {
  //   const trends = this.state.trends
  //   this.setState({
  //     user: '',
  //     profile_img: '',
  //     listToShow: trends,
  //     title: 'Trending',
  //     postMessage: ''
  //   })
  // }

  showTimeline = events => {
    this.fetchUser("nc_students_say")
    // const timeline = this.state.timeline;
    // this.setState({
    //   user: '',
    //   profile_img: '',
    //   listToShow: timeline,
    //   title: 'Timeline',
    //   postMessage: ''
    // })
  }

  setUser = event => {
    const user = event.target.value;
    //console.log(user)
    if(user === '') return this.setState({
      user: "",
      profile_img: "",
      username: "",
      postMessage: ""
    })
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
        user: user,
        profile_img: user_img,
        profileBanner: banner
        // listToShow: [],
        // title: '',
        //postMessage: ''
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
      this.fetchUser("nc_students_say")
    //  console.log(res.data)
    })
    .catch(err => console.log(err))

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
      tweets: tweets.reverse()
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
  return <li><a href={props.url} target="_blank">{props.item}</a></li>
}


export default App;
