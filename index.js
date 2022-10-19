import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

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
        handleSubmitReplyClick(e.target.id, e.target.dataset.submitreply)
    }

    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }

    
})
 
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

function handleSubmitReplyClick(replySubmitId, replyDataset) {
    //get the button and input
    const replySubmit = document.getElementById(replySubmitId)
    const replyInputs = document.querySelectorAll(".reply-input")
    
    //get the required input
    const currentInput = Array.from(replyInputs).filter(input => {
        if(input.id === `reply-input-${replyDataset}`){
            return input
        }
    })[0]

    //add reply to the tweet reply array
    tweetsData.forEach(function(tweet) {
        if (tweet.uuid === replyDataset) {
            tweet.replies.push(
                {
                    handle: "@Scrimba",
                    profilePic: `images/scrimbalogo.png`,
                    tweetText: currentInput.value
                }
            )
        }
    })
    render()
    //keep the replies open
    document.getElementById(`replies-${replyDataset}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

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

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

