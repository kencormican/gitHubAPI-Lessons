function userInformationHTML(user) {
  // Return the user's name, a link to the user's public profile on GitHub, their avatar image, the number of followers
  // the number of people they are following and the number of public Repos
  // all captured in discrete divs with their own style classes.
  return `
        <h2>${user.name}
            <span class="small-name">
                (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
            <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`;
}

function repoInformationHTML(repos) {
  // The Repos is returned as an Array so the Array.length() method can be used to determine if it's an empty array
  if (repos.length == 0) {
    return `<div class="clearfix repo-list">No repos!</div>`;
  }

  // If data returned use map method (like forEach() function) to iterate through and return array items
  // The returned array is to be stored in the listItemsHTML variable and the below ancor tag assigned
  var listItemsHTML = repos.map(function (repo) {
    return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
  });

  // The list of Repos is also to be returned to the screen using the .join() method splitting eacj with a new line.
  return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

function fetchGitHubInformation(event) {
  // Empty divs if text box emptied
  $("#gh-user-data").html("");
  $("#gh-repo-data").html("");

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
  // When a response is returned from the GutHub API pass data into #gh-user-data or #gh-user-data divs
  // Then response takes two arguments, one for response and one for error
  $.when(
    $.getJSON(`https://api.github.com/users/${username}`),
    $.getJSON(`https://api.github.com/users/${username}/repos`)
  ).then(
    // With 2x getJSON Calls we require 2x Responses
    // Note*, for two calls like this, the when() method packs a response up into arrays
    // Each response is  first element of the array
    function (firstResponse, secondResponse) {
      var userData = firstResponse[0];
      var repoData = secondResponse[0];
      $("#gh-user-data").html(userInformationHTML(userData));
      $("#gh-repo-data").html(repoInformationHTML(repoData));
    },
    // if 404 error Response is received return <h2> element to #gh-user-data <div>
    function (errorResponse) {
      if (errorResponse.status === 404) {
        $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);
      } else if (errorResponse.status === 403) {
        // If 403 Forbidden Error Converts GitHub Throttle response to human readable format.
        var resetTime = new Date(
          errorResponse.getResponseHeader("X-RateLimit-Reset") * 1000
        );
        $("#gh-user-data").html(
          `<h4>Too Many Requests. Please wait until: ${resetTime.toLocaleTimeString()}</h4>`
        );
      }
      // else log error response to console and return Error: text and response to #gh-user-data <div>
      else {
        console.log(errorResponse);
        $("#gh-user-data").html(
          `<h2>Error: ${errorResponse.responseJSON.message}</h2>`
        );
      }
    }
  );
}

$(document).ready(fetchGitHubInformation); // Fetch Octocat data when document has been fully loaded
