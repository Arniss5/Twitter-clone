import { tweetsDataFile } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


//Get data from localStorage/Data file
let tweetsData

if (localStorage.getItem('tweets') === null) {
    tweetsData = tweetsDataFile;
} else {
    tweetsData = JSON.parse(localStorage.getItem('tweets'))
};

//EVENT LISTENERS
document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.delete) {
        handleDeleteClick(e.target.dataset.delete)
    }
    else if(e.target.dataset.submitreply) {
        handleSubmitReplyClick(e.target.dataset.submitreply)
    }

    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }    
})

//FUNCTIONS

//Button handling functions
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleDeleteClick(deleteId) {
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === deleteId
    })[0]
    const index = tweetsData.indexOf(targetTweetObj)

    tweetsData.splice(index, 1)
    render()
}

function handleSubmitReplyClick(replyDataset) {
  
    const replyInputs = document.querySelectorAll(".reply-input")
    
    //get the required input field
    const currentInput = Array.from(replyInputs).filter(input => {
        if(input.id === `reply-input-${replyDataset}`){
            return input
        }
    })[0]

    //if input isn't empty, add reply to the tweet reply array
    if(currentInput.value) {
        tweetsData.forEach(function(tweet) {
            if (tweet.uuid === replyDataset) {
                tweet.replies.unshift(
                    {
                        handle: "@Scrimba",
                        profilePic: `images/scrimbalogo.png`,
                        tweetText: currentInput.value
                    }
                )
            }
        })
    }
    
    render()
    //keep the replies open
    document.getElementById(`replies-${replyDataset}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    //if input isn't empty, add new tweet object to tweets Data
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

//function for html structure

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){

                //structure for replies
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          //structure for main tweets
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div> 
        <div class="close-icon-container">${tweet.handle === "@Scrimba"? `<i class="fa-solid fa-xmark" data-delete=${tweet.uuid}></i></i>` : ""}</div>           
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        <div class="reply-input-container">
            <input type="text" placeholder="Type reply here" class="reply-input" id="reply-input-${tweet.uuid}"></Input>
            <button class="reply-btn" data-submitreply=${tweet.uuid} id="reply-submit-${tweet.uuid}">Reply</button>
        </div>
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

//Other functions

function saveStorage(){
    localStorage.setItem('tweets', JSON.stringify(tweetsData))
}

function render(){
    saveStorage()
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

