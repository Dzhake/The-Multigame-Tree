addLayer("p", {
    name: "prologue", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(1),
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
        if (hasUpgrade("p",13)) mult = mult.times(upgradeEffect("p",13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "h", description: "H: Hard reset WITHOUT options reset", onPress(){hardReset(false)}},
        {key: "H", description: "Shift+H: Hard reset WITH options reset", onPress(){hardReset(true)}},
        {key: "p", description: "P: Reset for prologue points", onPress(){if (canReset(this.layer)) doReset(this.layer)},unlocked(){return hasUpgrade("p",13)}},
    ],
    layerShown(){return true},
    upgrades:{
        11:{
            title:"Points!",
            description:"+2 point/s",
            cost: new Decimal(1),
        },
        12:{
            title:"More points!",
            description:"You get more points based on prologue points!",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() {return format(upgradeEffect(this.layer,this.id))+"x"},
        },
        13:{
            title:"Even more points!",
            description:"More prologue points based on points and you can use hotkey to prestige now!",
            cost: new Decimal(5),
            effect() {
                return player.points.add(1).pow(0.15)
            },
            effectDisplay() {return format(upgradeEffect(this.layer,this.id))+"x"},
        },
        14:{
            title:"POINTS!!!",
            description:"You get more points based on time played",
            cost: new Decimal(10),
            effect() {
                return player.timePlayed**0.15
            },
            effectDisplay() {return format(upgradeEffect(this.layer,this.id))+"x"},
        },
    }
})
