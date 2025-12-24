// All possible baseball bingo events
export const BINGO_EVENTS = [
    // Silly/Fun Events
    "Dropped Nachos", "Spilled Beer", "Beach Ball in Stands",
    "Kiss Cam Couple", "Dancing Fan", "Backwards Cap",
    "Baby Crying", "Mascot Appearance", "Hot Dog Race",
    "Wave Started", "Someone Catches Foul Ball", "Fan Asleep",
    "Jersey of Wrong Team", "Sunburn Spotted", "Proposal on Jumbotron",

    // Cool Baseball Moments
    "Home Run", "Strikeout", "Double Play", "Stolen Base",
    "Diving Catch", "Grand Slam", "Walk-off Hit", "Pitcher's Duel",
    "Arguing with Umpire", "Bat Flip", "Foul Ball", "Pitching Change",
    "Replay Review", "7th Inning Stretch", "Triple",

    // Stadium Experience
    "Fireworks", "Organist Playing", "T-Shirt Cannon",
    "Beer Vendor Yelling", "Scoreboard Malfunction", "Rain Delay",
    "Crowd Boos Call", "National Anthem", "First Pitch Ceremony",
    "Giveaway Item Spotted", "Crowd Chant", "Stadium Food Line",
    "Security Escort", "Ball Boy/Girl Catch", "PA Announcer Voice Crack"
];

export const EVENT_EMOJIS = {
    // Silly / Fun Events
    "Dropped Nachos": "🌮",
    "Spilled Beer": "🍺",
    "Beach Ball in Stands": "🏖️",
    "Kiss Cam Couple": "💋",
    "Dancing Fan": "💃",
    "Backwards Cap": "🧢",
    "Baby Crying": "👶",
    "Mascot Appearance": "🐻",
    "Hot Dog Race": "🌭",
    "Wave Started": "🌊",
    "Someone Catches Foul Ball": "🙌",
    "Fan Asleep": "😴",
    "Jersey of Wrong Team": "👕",
    "Sunburn Spotted": "☀️",
    "Proposal on Jumbotron": "💍",

    // Cool Baseball Moments
    "Home Run": "⚾",
    "Strikeout": "❌",
    "Double Play": "✌️",
    "Stolen Base": "🏃",
    "Diving Catch": "🤸",
    "Grand Slam": "💥",
    "Walk-off Hit": "🚶‍♂️",
    "Pitcher's Duel": "🔥",
    "Arguing with Umpire": "🗣️",
    "Bat Flip": "🪵",
    "Foul Ball": "⚾",
    "Pitching Change": "🔄",
    "Replay Review": "📺",
    "7th Inning Stretch": "🎵",
    "Triple": "3️⃣",

    // Stadium Experience
    "Fireworks": "🎆",
    "Organist Playing": "🎹",
    "T-Shirt Cannon": "👕",
    "Beer Vendor Yelling": "📣",
    "Scoreboard Malfunction": "🛑",
    "Rain Delay": "🌧️",
    "Crowd Boos Call": "👎",
    "National Anthem": "🦅",
    "First Pitch Ceremony": "🎤",
    "Giveaway Item Spotted": "🎁",
    "Crowd Chant": "🗣️",
    "Stadium Food Line": "🍔",
    "Security Escort": "🚨",
    "Ball Boy/Girl Catch": "🧤",
    "PA Announcer Voice Crack": "🎙️",

    // Fallback
    "default": "⚾"
};


export const getEventEmoji = (eventName) => {
    return EVENT_EMOJIS[eventName] || EVENT_EMOJIS.default;
};