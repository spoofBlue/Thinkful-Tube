
let INPUT;    // User's text input stored.

function handlePreviousPageButton() {
  // On click of next-button, moves on to retrieve data for previous page of results.
  $(".request-more-results-section").on("click", ".request-previous-results-button", function() {
    const prevToken = getPrevPageToken();
    if (prevToken !== "") {
      getDataFromApi(prevToken);
    }
  });
}

function handleNextPageButton() {
  // On click of next-button, moves on to retrieve data for next page of results.
  $(".request-more-results-section").on("click", ".request-next-results-button", function() {
    const nextToken = getNextPageToken();
    if (nextToken !==  "") {
      getDataFromApi(nextToken);
    }
  });
}

////////////////////////////////////////

function getPrevPageToken() {
  return $(".request-previous-results-button").attr("value");
}

function getNextPageToken() {
  return $(".request-next-results-button").attr("value");
}

function displayMoreResultsButtons(data) {
  // Displays the HTML for the Previous and Next Button. If prevPageToken or nextPageToken is in data, it's stored in attribute value of it's respective button.
  $(".request-more-results-section").html(`
  <button role="button" value=${data.hasOwnProperty("prevPageToken") ? data.prevPageToken : ""} class="request-previous-results-button">Previous Page
  </button>
  
  <button role="button" value=${data.hasOwnProperty("nextPageToken") ? data.nextPageToken : ""} class="request-next-results-button">Next Page
  </button>
  `);
}

function convertMonthNumberToWord(strNumber) {
  // Takes in the String representing the month's number, and returns the month's name.
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const number = parseInt(strNumber);
  return months[number - 1];
}

function makeDateUserFriendly(rawDate) {
  // Given String rawDate, returns a String in a date format more appealling to a user. original '2014-02-28T10:45:04.000Z'
  const year = rawDate.substr(0,4);
  const month = convertMonthNumberToWord(rawDate.substr(5,2));
  const day = rawDate.substr(8,2);
  return `${month} ${day}, ${year}`;
}

function displayResults(item) {
  // Dispalys HTML of results. Includes the video name, channel name, date, thumbnail, video-link, and channel-link for a result. 
  const snip = item.snippet;
  $(".results-section").append(`
  
    <li class="result">
      
      <div class="container">
        <img src="${item.snippet.thumbnails.medium.url}" class="result-thumbnail" alt="Video Thumbnail">

        <h2 class="result-title"> 
        Name : <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank" class="result-video-link">${item.snippet.title}</a>
        </h2>
      
        <p class="result-channel"> 
        Channel : <a href="https://www.youtube.com/channel/${item.snippet.channelId}" target="_blank" class="result-channel-link">${item.snippet.channelTitle}</a>
        </p>
      
        <p class="result-publish-date">
        Date : ${makeDateUserFriendly(item.snippet.publishedAt)}
        </p>
      </div>
      
    </li>
    `);
}

function getInformation(data) {
  // data is an object containing general results info, than an array called items with results shown as objects.
  // Child function displays info about result.
  // Event handlers for previous, next page buttons set.
  console.log(data);
  displayInput();
  const results = data.items.map( function(item) {
    displayResults(item);
  }); 
  displayMoreResultsButtons(data);
  
}

function displayInput() {
  // Dispalys HTML just showing user their input for the search.
  const input = getUserInput();
  $(".results-section").append(`
    
    <h2>Results for: ${INPUT}</h2>
    
    <ul class="results-list">
    </ul>
    
    `);
}

function emptyResults() {
  $(".results-section").empty();
}

function getDataFromApi(pageRequested) {
  // Gets results from Youtube and continues processing in getInformation(data).
  // if specified, parameter String pageRequested chooses a specifc page to retrieve (given by handlePreviousPageButton or handleNextPageButton).
  const resultsDesired = 5;
  emptyResults();
  const settings = {
    part: 'snippet' ,
    key : "AIzaSyAwPO-ttsEJ1iOjDySFFgSKOegIS3c6Fmc" ,
    q: `${getUserInput()}` ,
    maxResults : resultsDesired ,
    pageToken : pageRequested
  };
  $.getJSON('https://www.googleapis.com/youtube/v3/search', settings, getInformation);
}

function getUserInput() {
  // Retrieve user's text input.
  return INPUT;
}

function setUserInput() {
  INPUT = $("#search-bar").val();
}

function handleSeeResultsButton() {
  // On click, get text input and pass into ajax function.  Then displays.
  $(".search-form").submit( function(event) {
    event.preventDefault();
    setUserInput();
    getDataFromApi();
  });
}


function main() {
  handleSeeResultsButton();
  handlePreviousPageButton();
  handleNextPageButton();
}

$(main)

/** 
 * Just practicing incorpating information from Youtube.
 * 
 * Things to improve if more time allocated to this project:
 * - Channel thumbnails have larger heights, the sizing is off when those channel thumbnails are here.  Would make .container larger and probably use flexbox sizing to compensate.
 * - Could make argument into getDataFromApi() an object instead.  We could have custom-settings inside that object, and then combine custonm-settings with standard-settings to make function more robust.
 * - Can incorporate a radio input, allowing user to search for videos on criteria besides relevance (ex date, rating, alphabetical).  This criteria could be put into the object described in the prveious point.
 * - Will like to discuss alternatives to making INPUT global.  In this context, it certainly seems more appropriate, as we're referencing this input repeatedly if we use the handlePreviousPageButton() etc.  Is the global in this case appropriate?
 * - I stored prevPageToken and nextPageToken values in their respective button under the (value) attribute. Is this a fine practice?  Are there disadvantages?
**/
