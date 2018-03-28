import React, { Component } from 'react';
import './App.css';
import axios from 'axios'


class App extends Component {
  state = {
    username: '',
    user: '',
    profile_img : '', 
    trends: [],
    timeline: [],
    tweetToSend: '',
}

componentDidMount () {
  this.fetchTrends()
}
  render() {
    return (
      <div className="container">
        <input className="user" placeholder="Search users" onKeyUp={this.setUser}/>
        <input className="writeTweet" placeholder="Send tweet" onChange={this.setTweet} />
        <button className="sendTweet" onClick={this.sendTweet}>Send Tweet</button>
        <div className="output" id="output"></div>
        <p>{this.state.user}</p>
        <img src={this.state.profile_img} alt=""/>
        <Tweets user={this.state.user} />
        <p> Trending</p>
        <ListMaker items={this.state.trends}/>
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

  setUser = event => {
    const user = event.target.value;
    //console.log(user)
    if(user === '') return this.setState({
      user: "",
      profile_img: "",
    })
    if(event.key === "Enter") {
    axios.get(`https://northcoders-sprints-api.now.sh/api/twitter/users/${user}`)
    .then(userData => {
      const user_img = userData.data.user.profile_image_url.replace("_normal", "")
      const name = userData.data.user.name
      this.setState({ 
        username: name,
        user: user,
        profile_img: user_img
    })
  })
    .catch(err => {
      this.setState({
        user: "user does not exist",
        profile_img: '',
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
      output.className = "output";
      //output.innerHTML = res.data;
      console.log(res.data)
    })
    .catch(function(err) {
      output.className = "container text-danger"
      output.innerHTML = err.message
    })

    this.setState({
      tweetToSend: ''
    })
  }
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
    <ul>{props.items.map((item, i) => {
      return <List item={item} key={i}/>
    }
    )}</ul>
  )
}

function List (props) {
  return <li>{props.item}</li>
}
export default App;
