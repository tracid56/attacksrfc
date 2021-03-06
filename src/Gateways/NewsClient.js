export const NewsClient = {getArticles};
export default NewsClient;

const CVESERVICE_URL = process.env.REACT_APP_CVESERVICE_URL;

function getArticles(cve, success) {
    console.log("Fetching articles for: " + cve);
    return fetch(CVESERVICE_URL
        + '/api/v1/articles/search/findDistinctByCvesMentionedIn?cve='
        + encodeURI(cve), {
        headers: {
          Accept: 'application/json',
        },
      }).then(checkStatus)
        .then(parseJSON)
        .then(success);
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error: ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      console.log(error);
      throw error;
    }
  }
 
  function parseJSON(response) {
    return response.json();
  }