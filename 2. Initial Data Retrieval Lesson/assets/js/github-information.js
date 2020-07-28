function fetchGitHubInformation(event) {
  // create username variable to store the typed username in the gh-username <div> element
  var username = $("#gh-username").val();

  // if username text box is empty push <h2> text into gh-user-data <div>
  if (!username) {
    $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
    return;
  }

  $("#gh-user-data").html(
    `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`
  );

  // When, Then Promise
  // When a response is returned from the GutHub API pass data into #gh-user-data <div>
  // Then response takes two arguments, one for response and one for error
  $.when($.getJSON(`https://api.github.com/users/${username}`)).then(
    function (response) {
      var userData = response;
      $("#gh-user-data").html(userInformationHTML(userData));
    },

    // if 404 error Response is received return <h2> element to #gh-user-data <div>
    function (errorResponse) {
      if (errorResponse.status === 404) {
        $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);
    // else log error response to console and return Error: text and response to #gh-user-data <div>
      } else {
        console.log(errorResponse);
        $("#gh-user-data").html(
          `<h2>Error: ${errorResponse.responseJSON.message}</h2>`
        );
      }
    }
  );
}
