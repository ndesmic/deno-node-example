import fetch from "node-fetch";

const response = await fetch(`https://api.github.com/users/ndesmic/repos`, { 
	"Accept": "application/vnd.github.v3+json"
 });

const json = await response.json();

console.log(json);