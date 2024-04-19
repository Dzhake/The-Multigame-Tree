addLayer("p", {
    name: "prologue", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(1),
        upgradesToKeep:[],
        upgradesToAutomate:[],
    }},
    color: "#2ECC71",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prologue points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)

        if (hasUpgrade("p",12)) {mult = mult.times(2)}
        if (inChallenge("VVVVVV",11)) mult = mult.pow((9-challengeCompletions("VVVVVV", 11))*0.1)


        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)

    hotkeys: [
        {key: "h", description: "H: Hard reset WITHOUT options reset", onPress(){hardReset(false)}},
        {key: "H", description: "Shift+H: Hard reset WITH options reset", onPress(){hardReset(true)}},
        {key: "p", description: "P: Reset for prologue points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    passiveGeneration() {
        let gain = new Decimal(0)

        if (hasMilestone("VVVVVV",0)) { gain = gain.add(player.VVVVVV.inverted.resets).times(0.1)}
        return gain
    },

    doReset(resettingLayer) {
        if (resettingLayer == "p") return 
        let keep = [];
        let keepUpgrades = [];

        keep.push("upgradesToKeep")
        keep.push("upgradesToAutomate")

        for (const id of player.p.upgradesToKeep) {
            if ( hasUpgrade("p",id) ) keepUpgrades.push(id)
        }


        layerDataReset("p",keep)

        player.p.upgrades = keepUpgrades

        if (inChallenge("VVVVVV",11)) player.p.upgrades = []

    },


    automate() {
        let chal = 0
        if (inChallenge("VVVVVV",11)) chal = 111
        if (chal == 0) {
            for (const id of player.p.upgradesToAutomate) {
                buyUpgrade("p",id)
            }
        }
    },

    upgrades:{
        11:{
            description:"+2 point/s",
            cost: new Decimal(1),
            //onPurchase() {player.devSpeed = 100}
        },
        12:{
            description:"Double points and prologue points gain",
            cost: new Decimal(2),
        },
        13:{
            description:"More points based on prologue points!",
            cost: new Decimal(10),
            effect() {
                return player[this.layer].points.add(1).pow(0.25)
            },
            effectDisplay() {return format(upgradeEffect(this.layer,this.id))+"x"},
        },
        14:{
            description:"Unlock new layer and x2 points gain!",
            cost: new Decimal(15),
        },
    }
})






addLayer("VVVVVV", {
    name: "VVVVVV", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "V", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        resets: new Decimal(0),
        inverted: {
            points: new Decimal(0),
            resets: new Decimal(0),
        },
        
    }},
    color: "#aab7b8",
    invertedColor:"#a8baa5",
    requires: new Decimal(25), // Can be a function that takes requirement increases into account
    layerShown(){return hasUpgrade("p",14) || player["VVVVVV"].best.gte(1)},
    resource: "trinkets", // Name of prestige currency
    baseResource: "prologue points", // Name of resource prestige is based on
    baseAmount() {return player["p"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.2, // Prestige currency exponent

    
    onPrestige(gain) {
        let inverted = getClickableState("VVVVVV",11);
        if (!inverted) player.VVVVVV.resets = player.VVVVVV.resets.add(1);
        else {
            player.VVVVVV.points = player.VVVVVV.points.sub(gain)
            player.VVVVVV.inverted.resets = player.VVVVVV.inverted.resets.add(1)
            player.VVVVVV.inverted.points = player.VVVVVV.inverted.points.add(gain)
        }
    },

    doReset(resettingLayer) {
        let keep = []
        let chal = 0
        if (layers[resettingLayer].row <= this.row) return
        if (inChallenge("VVVVVV",11)) keep.push("milestones"); keep.push("resets"); keep.push("inverted"); keep.push("best"); chal = 111  //reset points and upgrades if player is in challenge

        layerDataReset("VVVVVV",keep)

        if (chal == 111) player.VVVVVV.inverted.points = Decimal.dZero
    },


    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.add(challengeCompletions("VVVVVV", 11)*0.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "v", description: "V: Reset for trinkets", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["p"],



    clickables: {
        11: {
            title:"Invert gravity",
            display() {let state = "Normal"; if(getClickableState("VVVVVV",11)) {state = "Inverted"} return "Current state: "+state},
            unlocked() {return player["VVVVVV"].best.gte(1)},
            canClick() {return player["VVVVVV"].best.gte(1)},
            onClick() {setClickableState(this.layer, this.id, !getClickableState(this.layer,this.id))},
            },
        12: {
            title:"DevSpeed toggle",
            display() {return "Current state: "+getClickableState("VVVVVV",12)},
            unlocked() {return true},
            canClick() {return true},
            onClick() {setClickableState(this.layer, this.id, !getClickableState(this.layer,this.id));if(getClickableState(this.layer,this.id) == true) player.devSpeed = 100;else player.devSpeed = 1},
            },
        },
        

    milestones: {
        0: {
            requirementDescription: "2 trinkets",
            effectDescription() {return "Get 10% of prologue points per inverted reset<br>Currently: "+player.VVVVVV.inverted.resets.times(10)+"%"}, 
            done() { return player[this.layer].points.gte(2) },
        },
        1: {
            requirementDescription: "5 trinkets",
            effectDescription: "Automate first prlogue upgrade/keep it if got after inverted milestone 2",
            done() { return player[this.layer].points.gte(5) },
            onComplete() {if (hasMilestone("VVVVVV",11)) {player.p.upgradesToKeep.push(11)} else {player.p.upgradesToAutomate.push(11)} } // Keep if got 11, else automate
        },
        2: {
            requirementDescription: "10 trinkets",
            effectDescription: "Automate third prologue upgrade/keep it if got after inverted milestone 3 <br> Unlock challenge if you have inverted milestone 3",
            done() { return player[this.layer].points.gte(10) },
            onComplete() {if (hasMilestone("VVVVVV",11)) {player.p.upgradesToKeep.push(13)} else {player.p.upgradesToAutomate.push(13)} } // Keep if got 11, else automate
        },
        10: {
            requirementDescription: "2 inverted trinkets",
            effectDescription() {return "Boost points gain based on trinkets<br>Currently: "+format(player.VVVVVV.points.add(1).pow(0.5))},
            done() { return player[this.layer].inverted.points.gte(2) },
        },
        11: {
            requirementDescription: "5 inverted trinkets",
            effectDescription: "Automate second prologue upgrade/keep it if got after VVVVVV milestone 2",
            done() { return player[this.layer].inverted.points.gte(5) },
            onComplete() {if (hasMilestone("VVVVVV",1)) {player.p.upgradesToKeep.push(12)} else {player.p.upgradesToAutomate.push(12) }}
        },
        12: {
            requirementDescription: "10 inverted trinkets",
            effectDescription: "Automate forth prologue upgrade/keep it if got after milestone 3 <br> Unlock challenge if you have VVVVVV milestone 3",
            done() { return player[this.layer].inverted.points.gte(10) },
            onComplete() {if (hasMilestone("VVVVVV",2)) {player.p.upgradesToKeep.push(14)} else {player.p.upgradesToAutomate.push(14) }}
        },
    },

    upgrades:{
        11:{
            description:"Get more points based on prologue points and trinkets",
            cost: new Decimal(1),
            effect() {
                let effect = new Decimal(0)
                if (hasUpgrade("VVVVVV",21)) effect = player.p.points.add(1).pow(0.2).times(player.VVVVVV.points.add(1)).pow(0.6)
                else effect = player.p.points.add(1).pow(0.15).times(player.VVVVVV.points.add(1)).pow(0.5)
                
                return effect
            },
            effectDisplay() {return format(upgradeEffect(this.layer,this.id))+"x"},
        },
        21:{
            description:"VVVVVV Upgrade 11 uses a better formula",
            cost: new Decimal(3),
            currencyDisplayName: "inverted trinkets",
            currencyLocation: () => player.VVVVVV.inverted,
            currencyInternalName: "points",
        },
    },

    challenges: {
        11: {
            name: "Less things :(",
            fullDisplay() {return `Points and prologue points are <span class="shinyText_VVVVVV_darker">^0.`+(9-challengeCompletions("VVVVVV", 11))+`</span><br><br>Get 1 trinket to win<br><br>Reward: Multiply trinkets gain.<br><br>Currenlty: x`+(challengeCompletions("VVVVVV", 11)*0.5+1)},
            //goalDescription: "Get 1 trinket to win",
            //rewardDescription() {return "Multiply trinkets gain.<br>Currenlty: "+challengeEffect("VVVVVV",11)},
            canComplete() {return player.VVVVVV.points.gte(1)},
            unlocked() {return hasMilestone("VVVVVV",2) && hasMilestone("VVVVVV",12)},
            completionLimit: 10,
            onEnter() {
                layerDataReset("VVVVVV", ["milestones","resets","inverted","best"])
                player.VVVVVV.inverted.points = Decimal.dZero
                layerDataReset("p",["upgradesToKeep","upgradesToAutomate"])
            },
        },
    },


    tabFormat: {
        "Main": {
            content: [
                ["display-text", function() {return `
                You have <span style="color: `+layers.VVVVVV.color+`; text-shadow: `+layers.VVVVVV.color+` 0 0 10px;"><h2>`+player.VVVVVV.points+`</h2></span> trinkets and
                <span style="color: `+layers.VVVVVV.color+`; text-shadow: `+layers.VVVVVV.color+` 0 0 10px;"><h2>`+player.VVVVVV.inverted.points+`</h2></span> inverted trinkets
                `}],
                ["prestige-button","VVVVVV"],
                ["display-text", function() {return `
                You have <span style="color: `+layers.p.color+`; text-shadow: `+layers.p.color+` 0 0 10px;">`+format(player.p.points)+`</span> prologue points
                `}],
                "blank",
                "clickables",
                "blank",
                ["milestones",[0,1,2]],
                ["upgrades",[1]],
                "blank",
                ["challenges",[1]],
            ],
        },
        "Inverted": {
            content: [
                ["display-text", function() {return `
                You have <span style="color: `+layers.VVVVVV.color+`; text-shadow: `+layers.VVVVVV.color+` 0 0 10px;"><h2>`+player.VVVVVV.points+`</h2></span> trinkets and
                <span style="color: `+layers.VVVVVV.color+`; text-shadow: `+layers.VVVVVV.color+` 0 0 10px;"><h2>`+player.VVVVVV.inverted.points+`</h2></span> inverted trinkets
                `}],
                ["prestige-button","VVVVVV"],
                ["display-text", function() {return `
                You have <span style="color: `+layers.p.color+`; text-shadow: `+layers.p.color+` 0 0 10px;">`+format(player.p.points)+`</span> prologue points
                `}],
                "blank",
                "clickables",
                "blank",
                ["milestones",[10,11,12]],
                ["upgrades",[2]],
            ],
            unlocked() {return player.VVVVVV.best.gte(1)},
        },
    },
    
    

})
