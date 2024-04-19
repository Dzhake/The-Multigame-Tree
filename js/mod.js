let modInfo = {
	name: "The MultyGame Tree",
	id: "MultyGameTreeAndIHopeThisIsUniqueIdLOL",
	author: "Dzhake",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.0.0.1",
	name: "VVVVV update",
}

let changelog = `<h1>Changelog:</h1><br><br>
	<h2><span class="shinyText_white">Endgame: VVVVVV milestones 2 and inverted 2 and 800 prlogue points</span></h2><br>
	<h2><span class="shinyText_white">v0.0.0.0.1</span></h2><br>
	<span class="shinyText_prologue">- Added Prologue.</span><br>
	<span class="shinyText_VVVVVV">- Added VVVVVV.</span><br>`

let winText = `Thanks for playing!`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)
		
	let gain = new Decimal(0);

	if (hasUpgrade("p",11)) gain = gain.add(2);
	if (hasUpgrade("p",12)) gain = gain.times(2);
	if (hasUpgrade("p",13)) gain = gain.times(upgradeEffect("p",13));
	if (hasUpgrade("p",14)) gain = gain.times(2);


	if (hasUpgrade("VVVVVV",11)) gain = gain.times(upgradeEffect("VVVVVV",11))
	if (hasMilestone("VVVVVV",1)) gain = gain.times(player.VVVVVV.points.add(1))



	if (inChallenge("VVVVVV",11)) gain = gain.pow((9-challengeCompletions("VVVVVV", 11))*0.1)

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return hasMilestone("VVVVVV",2) && hasMilestone("VVVVVV",12) && player.p.points.gte(800)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}