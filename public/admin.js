const SECTIONS={
  reports:{
    title:"Attendee Reports",
    description:"Review safety, venue, assistance, harassment, medical, accessibility and vendor AI-policy reports submitted from the attendee app.",
    addLabel:"Reports",
    singular:"report"
  },
  registrations:{
    title:"App Registrations",
    description:"Review attendee-provided app registration profiles including name, pronouns, email and phone.",
    addLabel:"Registrations",
    singular:"registration"
  },
  devices:{
    title:"Anonymous Devices",
    description:"Review anonymous app installations, server-stored My Con favorites, and individualized reminder schedules.",
    addLabel:"Devices",
    singular:"device"
  },
  analytics:{
    title:"App Analytics",
    description:"See approximately how many attendees are using the digital program right now and review daily usage history.",
    addLabel:"Analytics",
    singular:"analytics"
  },
  broadcasts:{
    title:"Push Broadcasts",
    description:"Send a custom convention-wide push notification to every attendee device that has opted into Event Alerts.",
    addLabel:"Push Broadcast",
    singular:"broadcast"
  },
  mapSettings:{
    title:"Floor Map Settings",
    description:"Publish or hide the interactive SVG floor plan and vendor assignments.",
    addLabel:"Floor Map Settings",
    singular:"map settings"
  },
  mapLayout:{
    title:"Map Designer",
    description:"Edit live SVG table positions, booth positions, and room labels for the interactive floor plan.",
    addLabel:"Map Designer",
    singular:"map layout"
  },
  settings:{
    title:"Event Details",
    description:"Update the convention dates and core event information shown throughout the attendee app.",
    addLabel:"Event Details",
    singular:"event settings"
  },
  directions:{
    title:"Venue & Directions",
    description:"Update the venue address and publish the current shuttle / Park & Ride pickup location shown in the attendee app.",
    addLabel:"Venue & Directions",
    singular:"directions settings"
  },
  homeBanner:{
    title:"Home Celebrity Banner",
    description:"Control the celebrity guest banner shown near the top of the attendee app Home screen.",
    addLabel:"Home Banner",
    singular:"home banner"
  },
  faq:{
    title:"Frequently Asked Questions",
    description:"Add, edit, reorder, hide, or remove the FAQ entries shown in the attendee app.",
    addLabel:"+ Add FAQ",
    singular:"FAQ"
  },
  celebrityInfo:{
    title:"Celebrity Guide Info",
    description:"Control publication, notices, photo-op location information and panel policies.",
    addLabel:"Celebrity Guide Info",
    singular:"celebrity guide settings"
  },
  pricing:{
    title:"Guest Pricing",
    description:"Manage autograph, selfie, combo and professional photo-op prices.",
    addLabel:"+ Add Guest Price",
    singular:"guest price"
  },
  photoOps:{
    title:"Photo Op Schedule",
    description:"Manage tentative solo, duo and reunion professional photo-op times.",
    addLabel:"+ Add Photo Op",
    singular:"photo op"
  },
  autographs:{
    title:"Autograph Availability",
    description:"Manage flexible autograph table availability for each guest by day.",
    addLabel:"+ Add Guest",
    singular:"autograph schedule"
  },
  groupOps:{
    title:"Group & Duo Photo Ops",
    description:"Manage reunion and duo professional photo-op participants and pricing.",
    addLabel:"+ Add Group Op",
    singular:"group photo op"
  },
  panels:{
    title:"Celebrity Panels",
    description:"Manage celebrity Q&A panel times, locations, participants and descriptions.",
    addLabel:"+ Add Panel",
    singular:"panel"
  },
  guests:{
    title:"Celebrity Guests",
    description:"Edit guest profiles without touching app code.",
    addLabel:"+ Add Guest",
    singular:"guest"
  },
  schedule:{
    title:"Schedule",
    description:"Manage panels, activities, photo ops and other timed program items.",
    addLabel:"+ Add Event",
    singular:"schedule item"
  },
  vendors:{
    title:"Vendors & Booths",
    description:"Assign vendors, artists, services and celebrity tables to interactive floor-map locations.",
    addLabel:"+ Add Location Assignment",
    singular:"location assignment"
  },
  events:{
    title:"Event Guide",
    description:"Edit café menus, contests, workshops, gaming and other program information.",
    addLabel:"+ Add Section",
    singular:"event section"
  },
  socialLinks:{
    title:"Social Media",
    description:"Add, remove, reorder, or update the social media links shown in the attendee app.",
    addLabel:"+ Add Social Link",
    singular:"social link"
  },
  tshirts:{
    title:"Official T-Shirts",
    description:"Add, remove, reorder, hide, or update official Sci-Fi Valley Con shirt listings shown in the attendee app.",
    addLabel:"+ Add T-Shirt",
    singular:"t-shirt"
  },
  sponsors:{
    title:"Sponsors",
    description:"Manage the sponsor logos and links shown automatically in the attendee app sponsor strip.",
    addLabel:"+ Add Sponsor",
    singular:"sponsor"
  }
};

/* V2.7: embedded map recovery copy. This prevents Map Designer from ever starting with an empty canvas just because a live GitHub lookup fails. */
const EMBEDDED_MAP_LAYOUT=[{"id":"layout-1","canvas":{"width":1200,"height":1780,"defaultWidth":820},"elements":[{"id":"main-outline","type":"path","d":"M84 58 L782 58 L782 138 L862 138 L862 585 L964 585 L964 786 L770 786 L770 842 L324 842 L250 752 L160 752 L114 644 L84 620 Z","fill":null,"className":"outline","editable":false},{"id":"main-title","type":"text","text":"MAIN LEVEL","x":418,"y":118,"fontSize":56,"className":"level-label","anchor":"middle","lineHeight":1.15,"fontWeight":"900","fontStyle":"normal","fontFamily":"Arial, sans-serif","fill":"#251e1a","editable":true},{"id":"panel-room-2-box","type":"rect","x":170,"y":170,"width":105,"height":186,"fill":"#efc448","className":"zone","rx":3,"editable":false},{"id":"panel-room-2-label","type":"text","text":"Panel\nRoom 2","x":223,"y":242,"fontSize":24,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"event-room-box","type":"rect","x":74,"y":354,"width":96,"height":170,"fill":"#ed6f8a","className":"zone","rx":3,"editable":false},{"id":"event-room-label","type":"text","text":"Event\nRoom","x":122,"y":438,"fontSize":28,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"paint-room-box","type":"rect","x":170,"y":356,"width":105,"height":164,"fill":"#eaa069","className":"zone","rx":3,"editable":false},{"id":"paint-room-label","type":"text","text":"Paint &\nHobby\nRoom","x":223,"y":425,"fontSize":24,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"paint-room-sub","type":"text","text":"Snake Eyes\nGaming","x":223,"y":490,"fontSize":14,"className":"tiny","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"mini-cafe-box","type":"path","d":"M74 524 L170 524 L170 622 L120 680 L74 605 Z","fill":"#71b86c","className":"zone","editable":false},{"id":"mini-cafe-label","type":"text","text":"The\nMini\nCafé","x":117,"y":595,"fontSize":25,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"panel-room-1-box","type":"rect","x":300,"y":170,"width":392,"height":136,"fill":"#73c7cb","className":"zone","rx":3,"editable":false},{"id":"panel-room-1-label","type":"text","text":"Panel Room 1","x":496,"y":232,"fontSize":38,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"panel-room-1-sub","type":"text","text":"Celebrity Guest Panel Room","x":496,"y":271,"fontSize":18,"className":"tiny","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"main-hall-box","type":"rect","x":276,"y":306,"width":354,"height":271,"fill":"#ebe8dd","className":"hall-floor","rx":0,"editable":false},{"id":"main-hall-label","type":"text","text":"EXHIBIT HALL – MAIN","x":453,"y":334,"fontSize":18,"className":"tiny","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"retro-box","type":"rect","x":724,"y":170,"width":100,"height":192,"fill":"#d36a9b","className":"zone","rx":3,"editable":false},{"id":"retro-label","type":"text","text":"Retro\nGaming\nArcade\nVault","x":774,"y":255,"fontSize":22,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"conquest-signup","type":"rect","x":309,"y":584,"width":258,"height":36,"fill":"#e65338","className":"zone","rx":3,"editable":false},{"id":"conquest-signup-label","type":"text","text":"Con-Quest Sign-Up","x":438,"y":607,"fontSize":15,"className":"tiny","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"admissions-box","type":"rect","x":576,"y":584,"width":84,"height":54,"fill":"#f2bd3f","className":"zone","rx":3,"editable":false},{"id":"admissions-label","type":"text","text":"Admissions","x":618,"y":617,"fontSize":18,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"stairs-main","type":"rect","x":336,"y":633,"width":178,"height":48,"fill":null,"className":"stairs","rx":0,"editable":false},{"id":"stairs-main-label","type":"text","text":"Stairs  ↔","x":425,"y":662,"fontSize":16,"className":"tiny","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"yo-box","type":"rect","x":734,"y":218,"width":24,"height":45,"fill":null,"className":"service","rx":2,"editable":false},{"id":"yo-label","type":"text","text":"YO","x":746,"y":245,"fontSize":12,"className":"tiny","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"entrance-main","type":"text","text":"Entrance","x":642,"y":738,"fontSize":14,"className":"tiny","anchor":"start","lineHeight":1.15,"fontWeight":"800","fontStyle":"italic","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"bag-check","type":"text","text":"Bag\nCheck\nArea","x":608,"y":681,"fontSize":12,"className":"tiny","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"lower-outline","type":"path","d":"M82 876 L780 876 L780 946 L860 946 L860 1568 L706 1568 L706 1694 L322 1694 L236 1620 L158 1620 L102 1518 L82 1390 Z","fill":null,"className":"outline","editable":false,"translateX":0,"translateY":0},{"id":"lower-title","type":"text","text":"LOWER LEVEL","x":308,"y":942,"fontSize":56,"className":"level-label","anchor":"middle","lineHeight":1.15,"fontWeight":"900","fontStyle":"normal","fontFamily":"Arial, sans-serif","fill":"#251e1a","editable":true},{"id":"celeb-left-box","type":"rect","x":120,"y":1040,"width":180,"height":124,"fill":"#ef744f","className":"zone","rx":3,"editable":false},{"id":"celeb-top-box","type":"rect","x":300,"y":984,"width":414,"height":128,"fill":"#ef744f","className":"zone","rx":3,"editable":false},{"id":"celeb-left-label","type":"text","text":"Celebrity Guest Alley","x":210,"y":1098,"fontSize":24,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"celeb-top-label","type":"text","text":"Celebrity Guest Alley","x":507,"y":1060,"fontSize":26,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"photo-box","type":"path","d":"M120 1164 L300 1164 L300 1388 L210 1442 L120 1388 Z","fill":"#f3b444","className":"zone","editable":false},{"id":"photo-label","type":"text","text":"Photo Op Area","x":210,"y":1268,"fontSize":34,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"lawn-box","type":"path","d":"M74 1220 Q18 1390 96 1568 L210 1620 L210 1442 L120 1388 Z","fill":"#a3ca4b","className":"zone","editable":false},{"id":"lawn-label","type":"text","text":"The\nLawn","x":126,"y":1472,"fontSize":34,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"cafe-box","type":"path","d":"M210 1442 L300 1388 L368 1388 L368 1600 L264 1600 Z","fill":"#efc08b","className":"zone","editable":false},{"id":"cafe-label","type":"text","text":"The\nCafé","x":290,"y":1516,"fontSize":34,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"lower-hall-box","type":"rect","x":314,"y":1120,"width":364,"height":356,"fill":"#ebe8dd","className":"hall-floor","rx":0,"editable":false},{"id":"lower-hall-label","type":"text","text":"EXHIBIT HALL – LOWER","x":496,"y":1150,"fontSize":18,"className":"tiny","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"tattoo-box","type":"path","d":"M690 1188 L810 1142 L852 1326 L740 1378 Z","fill":"#6fb7a7","className":"zone","editable":false},{"id":"tattoo-label","type":"text","text":"The\nTattoo\nParlor","x":760,"y":1270,"fontSize":24,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"patio-box","type":"path","d":"M820 1128 L1110 1060 L1080 1506 L840 1452 L780 1380 Z","fill":"#f3efe2","className":"zone","editable":false},{"id":"patio-label","type":"text","text":"The Patio\nOutdoor Vendors","x":949,"y":1244,"fontSize":30,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"wolves-box","type":"path","d":"M780 1382 L905 1512 L832 1560 L742 1468 Z","fill":"#e6e2d8","className":"zone","editable":false},{"id":"wolves-label","type":"text","text":"Wildefell\nWolves","x":820,"y":1488,"fontSize":20,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"gaming-room-box","type":"rect","x":820,"y":1544,"width":180,"height":126,"fill":"#60b9dc","className":"zone","rx":3,"editable":false},{"id":"gaming-room-label","type":"text","text":"Gaming\nRoom","x":910,"y":1624,"fontSize":34,"className":"zone-label","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"gaming-room-sub","type":"text","text":"Snake Eyes Gaming","x":910,"y":1654,"fontSize":12,"className":"tiny","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"stairs-lower","type":"rect","x":350,"y":1536,"width":168,"height":44,"fill":null,"className":"stairs","rx":0,"editable":false},{"id":"stairs-lower-label","type":"text","text":"Stairs  ↔","x":434,"y":1562,"fontSize":16,"className":"tiny","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true},{"id":"star-wars-label","type":"text","text":"Star\nWars\nBartolini Cantina","x":570,"y":1578,"fontSize":14,"className":"tiny","anchor":"middle","lineHeight":1.15,"fontWeight":"800","fontStyle":"normal","fontFamily":"Georgia, serif","fill":"#291f1a","editable":true}],"locations":[{"id":"A1","shape":"rect","x":646,"y":550,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"A2","shape":"rect","x":646,"y":522,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"A3","shape":"rect","x":646,"y":494,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"A4","shape":"rect","x":646,"y":466,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"A5","shape":"rect","x":646,"y":438,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"A6","shape":"rect","x":646,"y":410,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"A7","shape":"rect","x":646,"y":382,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"A8","shape":"rect","x":646,"y":354,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"A9","shape":"rect","x":646,"y":326,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"B1","shape":"rect","x":285,"y":546,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"B2","shape":"rect","x":285,"y":508,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"B3","shape":"rect","x":285,"y":470,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"B4","shape":"rect","x":285,"y":432,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"B5","shape":"rect","x":285,"y":394,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"B6","shape":"rect","x":285,"y":356,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"B7","shape":"rect","x":285,"y":318,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"C1","shape":"rect","x":302,"y":552,"w":26,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"C2","shape":"rect","x":342,"y":552,"w":26,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"C3","shape":"rect","x":382,"y":552,"w":26,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"C4","shape":"rect","x":422,"y":552,"w":26,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"C5","shape":"rect","x":462,"y":552,"w":26,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"C6","shape":"rect","x":502,"y":552,"w":26,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"C7","shape":"rect","x":542,"y":552,"w":26,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"C8","shape":"rect","x":582,"y":552,"w":26,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"C9","shape":"rect","x":622,"y":552,"w":26,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D1","shape":"rect","x":318,"y":592,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D2","shape":"rect","x":354,"y":592,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D3","shape":"rect","x":390,"y":592,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D4","shape":"rect","x":426,"y":592,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D5","shape":"rect","x":462,"y":592,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D6","shape":"rect","x":498,"y":592,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D7","shape":"rect","x":534,"y":592,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D8","shape":"rect","x":200,"y":627,"w":24,"h":10,"rotation":-58,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D9","shape":"rect","x":218,"y":653,"w":24,"h":10,"rotation":-58,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D10","shape":"rect","x":236,"y":679,"w":24,"h":10,"rotation":-58,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D11","shape":"rect","x":254,"y":705,"w":24,"h":10,"rotation":-58,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D12","shape":"rect","x":300,"y":660,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"D13","shape":"rect","x":300,"y":700,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E1","shape":"rect","x":328,"y":510,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E2","shape":"rect","x":374,"y":510,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E3","shape":"rect","x":420,"y":510,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E4","shape":"rect","x":466,"y":510,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E5","shape":"rect","x":512,"y":510,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E6","shape":"rect","x":558,"y":510,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E7","shape":"rect","x":592,"y":510,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E8","shape":"rect","x":592,"y":474,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E9","shape":"rect","x":592,"y":438,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E10","shape":"rect","x":592,"y":402,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E11","shape":"rect","x":558,"y":366,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E12","shape":"rect","x":512,"y":366,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E13","shape":"rect","x":466,"y":366,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E14","shape":"rect","x":420,"y":366,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E15","shape":"rect","x":374,"y":366,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E16","shape":"rect","x":328,"y":366,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E17","shape":"rect","x":286,"y":402,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"E18","shape":"rect","x":286,"y":438,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F1","shape":"rect","x":328,"y":454,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F2","shape":"rect","x":374,"y":454,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F3","shape":"rect","x":420,"y":454,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F4","shape":"rect","x":466,"y":454,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F5","shape":"rect","x":512,"y":454,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F6","shape":"rect","x":558,"y":454,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F7","shape":"rect","x":592,"y":454,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F8","shape":"rect","x":592,"y":418,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F9","shape":"rect","x":592,"y":382,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F10","shape":"rect","x":558,"y":346,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F11","shape":"rect","x":512,"y":346,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F12","shape":"rect","x":466,"y":346,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F13","shape":"rect","x":420,"y":346,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F14","shape":"rect","x":374,"y":346,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F15","shape":"rect","x":328,"y":346,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F16","shape":"rect","x":286,"y":382,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F17","shape":"rect","x":286,"y":418,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"F18","shape":"rect","x":286,"y":454,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"G1","shape":"rect","x":346,"y":324,"w":22,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"G2","shape":"rect","x":390,"y":324,"w":22,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"G3","shape":"rect","x":434,"y":324,"w":22,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"G4","shape":"rect","x":478,"y":324,"w":22,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"G5","shape":"rect","x":522,"y":324,"w":22,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"G6","shape":"rect","x":566,"y":324,"w":22,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"G8","shape":"rect","x":604,"y":330,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"G9","shape":"rect","x":604,"y":298,"w":12,"h":24,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"G10","shape":"rect","x":318,"y":286,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"G11","shape":"rect","x":582,"y":286,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"I1","shape":"rect","x":360,"y":1520,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"I2","shape":"rect","x":393,"y":1520,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"I3","shape":"rect","x":426,"y":1520,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"I4","shape":"rect","x":459,"y":1520,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"I5","shape":"rect","x":492,"y":1520,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"I6","shape":"rect","x":525,"y":1520,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"I7","shape":"rect","x":558,"y":1520,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"I8","shape":"rect","x":591,"y":1520,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"I9","shape":"rect","x":624,"y":1520,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"I10","shape":"rect","x":657,"y":1520,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"J1","shape":"rect","x":664,"y":1452,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"J2","shape":"rect","x":664,"y":1421,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"J3","shape":"rect","x":664,"y":1390,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"J4","shape":"rect","x":664,"y":1359,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"J5","shape":"rect","x":664,"y":1328,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"J6","shape":"rect","x":664,"y":1297,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"J7","shape":"rect","x":664,"y":1266,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"J8","shape":"rect","x":664,"y":1235,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"J9","shape":"rect","x":664,"y":1204,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"J10","shape":"rect","x":664,"y":1173,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K1","shape":"rect","x":132,"y":1060,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K2","shape":"rect","x":166,"y":1058.5,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K3","shape":"rect","x":200,"y":1060,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K4","shape":"rect","x":234,"y":1060,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K5","shape":"rect","x":268,"y":1060,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K6","shape":"rect","x":286,"y":1060,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K7","shape":"rect","x":361.5,"y":1003,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K8","shape":"rect","x":393.5,"y":1004.5,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K9","shape":"rect","x":424,"y":1003,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K10","shape":"rect","x":456,"y":1003,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K11","shape":"rect","x":488,"y":1003,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K12","shape":"rect","x":520,"y":1003,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K13","shape":"rect","x":552,"y":1003,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K14","shape":"rect","x":584,"y":1003,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K15","shape":"rect","x":616,"y":1003,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K16","shape":"rect","x":648,"y":1003,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K17","shape":"rect","x":680,"y":1003,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"K18","shape":"rect","x":712,"y":1003,"w":14,"h":44,"rotation":90,"labelDx":0,"labelDy":null,"hidden":false},{"id":"N1","shape":"rect","x":300,"y":1520,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"N2","shape":"rect","x":300,"y":1490,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O1","shape":"rect","x":355,"y":1468,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O2","shape":"rect","x":388,"y":1468,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O3","shape":"rect","x":421,"y":1468,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O4","shape":"rect","x":454,"y":1468,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O5","shape":"rect","x":487,"y":1468,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O6","shape":"rect","x":520,"y":1468,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O7","shape":"rect","x":553,"y":1468,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O8","shape":"rect","x":586,"y":1468,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O9","shape":"rect","x":619,"y":1468,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O10","shape":"rect","x":646,"y":1446,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O11","shape":"rect","x":646,"y":1416,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O12","shape":"rect","x":619,"y":1408,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O13","shape":"rect","x":586,"y":1408,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O14","shape":"rect","x":553,"y":1408,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O15","shape":"rect","x":520,"y":1408,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O16","shape":"rect","x":487,"y":1408,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O17","shape":"rect","x":454,"y":1408,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O18","shape":"rect","x":421,"y":1408,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O19","shape":"rect","x":388,"y":1408,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O20","shape":"rect","x":355,"y":1408,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O21","shape":"rect","x":334,"y":1425,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"O22","shape":"rect","x":334,"y":1455,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P1","shape":"rect","x":355,"y":1360,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P2","shape":"rect","x":388,"y":1360,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P3","shape":"rect","x":421,"y":1360,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P4","shape":"rect","x":454,"y":1360,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P5","shape":"rect","x":487,"y":1360,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P6","shape":"rect","x":520,"y":1360,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P7","shape":"rect","x":553,"y":1360,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P8","shape":"rect","x":586,"y":1360,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P9","shape":"rect","x":619,"y":1360,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P10","shape":"rect","x":646,"y":1338,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P11","shape":"rect","x":646,"y":1308,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P12","shape":"rect","x":619,"y":1300,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P13","shape":"rect","x":586,"y":1300,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P14","shape":"rect","x":553,"y":1300,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P15","shape":"rect","x":520,"y":1300,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P16","shape":"rect","x":487,"y":1300,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P17","shape":"rect","x":454,"y":1300,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P18","shape":"rect","x":421,"y":1300,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P19","shape":"rect","x":388,"y":1300,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P20","shape":"rect","x":355,"y":1300,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P21","shape":"rect","x":334,"y":1316,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"P22","shape":"rect","x":334,"y":1346,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R1","shape":"rect","x":355,"y":1250,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R2","shape":"rect","x":388,"y":1250,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R3","shape":"rect","x":421,"y":1250,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R4","shape":"rect","x":454,"y":1250,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R5","shape":"rect","x":487,"y":1250,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R6","shape":"rect","x":520,"y":1250,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R7","shape":"rect","x":553,"y":1250,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R8","shape":"rect","x":586,"y":1250,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R9","shape":"rect","x":619,"y":1250,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R10","shape":"rect","x":646,"y":1226,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R11","shape":"rect","x":646,"y":1196,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R12","shape":"rect","x":619,"y":1185,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R13","shape":"rect","x":586,"y":1185,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R14","shape":"rect","x":553,"y":1185,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R15","shape":"rect","x":520,"y":1185,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R16","shape":"rect","x":487,"y":1185,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R17","shape":"rect","x":454,"y":1185,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R18","shape":"rect","x":421,"y":1185,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R19","shape":"rect","x":388,"y":1185,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R20","shape":"rect","x":355,"y":1185,"w":23,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R21","shape":"rect","x":334,"y":1206,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"R22","shape":"rect","x":334,"y":1236,"w":10,"h":22,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"T1","shape":"rect","x":748,"y":1320,"w":12,"h":28,"rotation":-20,"labelDx":0,"labelDy":null,"hidden":false},{"id":"T2","shape":"rect","x":770,"y":1296,"w":12,"h":28,"rotation":-20,"labelDx":0,"labelDy":null,"hidden":false},{"id":"T3","shape":"rect","x":790,"y":1268,"w":12,"h":28,"rotation":-20,"labelDx":0,"labelDy":null,"hidden":false},{"id":"T4","shape":"rect","x":812,"y":1240,"w":12,"h":28,"rotation":-20,"labelDx":0,"labelDy":null,"hidden":false},{"id":"U1","shape":"rect","x":346,"y":1566,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"U2","shape":"rect","x":380,"y":1566,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"U3","shape":"rect","x":414,"y":1566,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"U4","shape":"rect","x":448,"y":1566,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"U5","shape":"rect","x":482,"y":1566,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"U6","shape":"rect","x":516,"y":1566,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"U7","shape":"rect","x":550,"y":1566,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"U8","shape":"rect","x":584,"y":1566,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"U9","shape":"rect","x":618,"y":1566,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"U10","shape":"rect","x":652,"y":1566,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"U11","shape":"rect","x":686,"y":1566,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"U12","shape":"rect","x":720,"y":1566,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"V1","shape":"rect","x":330,"y":1608,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"V2","shape":"rect","x":364,"y":1608,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"V3","shape":"rect","x":398,"y":1608,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"V4","shape":"rect","x":432,"y":1608,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"V5","shape":"rect","x":466,"y":1608,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"V6","shape":"rect","x":500,"y":1608,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"V7","shape":"rect","x":600,"y":1608,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"V8","shape":"rect","x":634,"y":1608,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"V9","shape":"rect","x":668,"y":1608,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"V10","shape":"rect","x":702,"y":1608,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"V11","shape":"rect","x":736,"y":1608,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"V11","shape":"rect","x":770,"y":1608,"w":24,"h":10,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X1","shape":"booth","x":874,"y":1496,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X2","shape":"booth","x":892,"y":1441,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X3","shape":"booth","x":910,"y":1386,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X4","shape":"booth","x":928,"y":1331,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X5","shape":"booth","x":946,"y":1276,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X6","shape":"booth","x":964,"y":1221,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X7","shape":"booth","x":982,"y":1166,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X8","shape":"booth","x":1000,"y":1111,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X9","shape":"booth","x":1018,"y":1056,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X10","shape":"booth","x":1036,"y":1001,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X11","shape":"booth","x":1054,"y":946,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X12","shape":"booth","x":1072,"y":891,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"X13","shape":"booth","x":1090,"y":836,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y0","shape":"booth","x":920,"y":980,"w":40,"h":40,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y1","shape":"booth","x":990,"y":1528,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y2","shape":"booth","x":1006,"y":1478,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y3","shape":"booth","x":1022,"y":1428,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y4","shape":"booth","x":1038,"y":1378,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y5","shape":"booth","x":1054,"y":1328,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y6","shape":"booth","x":1070,"y":1278,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y7","shape":"booth","x":1086,"y":1228,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y8","shape":"booth","x":1102,"y":1178,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y9","shape":"booth","x":1118,"y":1128,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y10","shape":"booth","x":1134,"y":1078,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y11","shape":"booth","x":1150,"y":1028,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y12","shape":"booth","x":1166,"y":978,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y13","shape":"booth","x":1182,"y":928,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y14","shape":"booth","x":1198,"y":878,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y15","shape":"booth","x":1214,"y":828,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Y16","shape":"booth","x":1230,"y":778,"w":40,"h":40,"rotation":-14,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Z1","shape":"service","x":579,"y":620,"w":28,"h":12,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Z2","shape":"service","x":622,"y":620,"w":28,"h":12,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Z3","shape":"service","x":556,"y":694,"w":12,"h":26,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false},{"id":"Z4","shape":"service","x":144,"y":1318,"w":84,"h":42,"rotation":0,"labelDx":0,"labelDy":null,"hidden":false}]}];

const state={
  section:"guests",
  data:[],
  selectedIndex:null,
  dirty:false,
  authenticated:false,
  email:"",
  currentSha:null,
  exists:true,
  mapLayoutMode:"locations",
  mapLayoutSelectedId:"",
  mapLayoutSelectedItems:new Set(),
  mapLayoutPrimaryItem:null,
  mapLayoutZoom:1,
  mapVendors:[],
  mapDrag:null
};

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function escapeHtml(v=""){
  return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function setStatus(message,type=""){
  const el=$("#statusMessage");
  el.textContent=message;
  el.className=`status-message ${type}`.trim();
  el.classList.remove("hidden");
  clearTimeout(setStatus.timer);

  // Errors stay visible so staff can read/copy them.
  // Success and informational messages disappear automatically.
  if(type!=="error"){
    setStatus.timer=setTimeout(()=>el.classList.add("hidden"),6000);
  }
}
function setDirty(value=true){
  state.dirty=value;
  $("#dirtyBadge").classList.toggle("hidden",!value);
}
async function api(url,options={}){
  const res=await fetch(url,{
    credentials:"same-origin",
    ...options,
    headers:{"Content-Type":"application/json",...(options.headers||{})}
  });
  const contentType=res.headers.get("content-type")||"";
  let body={};

  if(contentType.includes("application/json")){
    body=await res.json().catch(()=>({}));
  }else{
    const text=await res.text().catch(()=>"");
    body={error:text.includes("Error 1101")
      ? "Cloudflare Worker exception (1101). Check Worker Logs for the runtime exception."
      : ""};
  }

  if(!res.ok){
    if(res.status===403 && !body.error){
      throw new Error("Cloudflare Access denied the publish request. Refresh this admin page and sign in again if prompted.");
    }
    throw new Error(body.error||`Request failed (${res.status})`);
  }
  return body;
}
async function checkAuth(){
  try{
    const me=await api("/api/me");
    state.authenticated=true;
    state.email=me.email;
    $("#staffEmail").textContent=me.email;
    $("#authDot").classList.add("good");
  }catch(err){
    state.authenticated=false;
    $("#staffEmail").textContent="Not authenticated";
    $("#authDot").classList.add("bad");
    $("#securityBanner").classList.remove("hidden");
    $("#securityMessage").textContent=err.message;
    $("#saveButton").disabled=true;
  }
}

function normalizeVendorHeader(value){const raw=String(value||'').trim();if(raw==='#')return 'location';return raw.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'')}
function vendorCell(row,aliases){for(const [key,value] of Object.entries(row||{})){const norm=normalizeVendorHeader(key);if(aliases.includes(norm))return value}return ''}
function truthyImportValue(value){
  return ['1','true','yes','y','x','checked','conquest','con-quest','participant','participating'].includes(String(value||'').trim().toLowerCase());
}
function deriveVendorArea(location){const p=(String(location||'').trim().toUpperCase().match(/[A-Z]+/)||[''])[0];if('ABCDEFG'.includes(p[0]||''))return 'Main Level';if(['I','J','N','O','P','R','T','U','V'].includes(p))return 'Lower Level';if(p==='K')return 'Celebrity Guest Alley';if(['X','Y'].includes(p))return 'Patio';if(p==='Z')return 'Convention Services';return 'Other'}
function deriveVendorType(location){const p=(String(location||'').trim().toUpperCase().match(/[A-Z]+/)||[''])[0];if(p==='K')return 'Celebrity';if(p==='Z')return 'Service';if(['X','Y'].includes(p))return 'Outdoor Vendor';return 'Vendor / Artist'}
function expandAdminLocationCodes(value){const result=[];String(value||'').split(',').map(x=>x.trim()).filter(Boolean).forEach(part=>{const m=part.match(/^([A-Z]+)(\d+)\s*-\s*([A-Z]+)?(\d+)$/i);if(m){const p1=m[1].toUpperCase(),a=Number(m[2]),p2=(m[3]||m[1]).toUpperCase(),b=Number(m[4]);if(p1===p2){const step=a<=b?1:-1;for(let n=a;step>0?n<=b:n>=b;n+=step)result.push(`${p1}${n}`);return}}result.push(part.toUpperCase().replace(/\s+/g,''))});return [...new Set(result)]}
async function importVendorSpreadsheet(file){
if(!file)return;if(typeof XLSX==='undefined'){setStatus('Excel reader did not load. Check your internet connection and reload the Admin page.','error');return}
try{
  const buffer=await file.arrayBuffer(),book=XLSX.read(buffer,{type:'array'}),sheet=book.Sheets[book.SheetNames[0]],rows=XLSX.utils.sheet_to_json(sheet,{defval:'',raw:false});
  const imported=[],warnings=[];rows.forEach((row,index)=>{
    const location=String(vendorCell(row,['location','table','tablenumber','booth','boothnumber','space','spacenumber','number'])||'').trim().toUpperCase();
    const name=String(vendorCell(row,['businessname','vendor','vendorname','name','company','business'])||'').trim();if(!location&&!name)return;if(!location||!name){warnings.push(`Row ${index+2}: skipped because table/booth or business name was blank.`);return}
    const totalRaw=vendorCell(row,['totaltables','totalbooths','totalspaces','tables','booths']),totalTables=String(totalRaw).trim()===''?expandAdminLocationCodes(location).length:Number(totalRaw);
    const area=String(vendorCell(row,['area','maparea'])||'').trim()||deriveVendorArea(location),type=String(vendorCell(row,['type','locationtype','vendortype'])||'').trim()||deriveVendorType(location);
    const cq=truthyImportValue(vendorCell(row,[
      'conquest',
      'conquestparticipant',
      'conquestparticipation',
      'conquestmember',
      'quest',
      'cq'
    ]));
    const description=String(vendorCell(row,[
      'description','vendordescription','businessdescription','itemsforsale',
      'itemsselling','whattheysell','merchandise'
    ])||'').trim();
    const categories=String(vendorCell(row,['categories','products','productscategories','category'])||'').trim(),notes=String(vendorCell(row,['notes','publicnotes','note'])||'').trim();
    const actualCount=expandAdminLocationCodes(location).length;if(Number.isFinite(totalTables)&&totalTables>0&&actualCount!==totalTables)warnings.push(`${location}: spreadsheet says ${totalTables} tables, location code expands to ${actualCount}.`);
    imported.push({id:`import-${Date.now()}-${index+1}`,name,description,categories,location,totalTables:Number.isFinite(totalTables)?totalTables:actualCount,area,type,conQuest:cq,notes});
  });
  if(!imported.length)throw new Error('No vendor rows were found. The spreadsheet needs a table/booth column and a business-name column.');
  const ok=confirm(`Replace the current ${state.data.length} vendor/booth records with ${imported.length} rows from ${file.name}?\n\nThis will NOT delete physical table objects from Map Designer. You will still need to click Save & Publish.`);if(!ok)return;
  state.data=imported;state.selectedIndex=null;setDirty(true);renderList();
  let missing=[];try{const mapResult=await api('/api/content/mapLayout'),codes=new Set((mapResult.data?.[0]?.locations||[]).map(x=>String(x.id||'').toUpperCase()));missing=[...new Set(imported.flatMap(v=>expandAdminLocationCodes(v.location)).filter(code=>!codes.has(code)))]}catch{}
  const cqImported=imported.filter(v=>v.conQuest).length;
  const cqLocations=new Set(imported.filter(v=>v.conQuest).flatMap(v=>expandAdminLocationCodes(v.location))).size;
  const descriptionsImported=imported.filter(v=>String(v.description||'').trim()).length;
  const status=document.getElementById('vendorImportStatus');if(status){status.classList.remove('hidden');status.innerHTML=`<strong>${imported.length} rows imported from ${escapeHtml(file.name)}.</strong><br><span><strong>${descriptionsImported}</strong> vendor description(s) imported from the Description column.</span><br><span><strong>${cqImported}</strong> roster row(s) are marked Con-Quest, covering <strong>${cqLocations}</strong> table/booth location(s). These locations will display red on the attendee floor map.</span>${missing.length?`<br><span>${missing.length} location code(s) do not currently exist in Map Designer: ${escapeHtml(missing.slice(0,18).join(', '))}${missing.length>18?'…':''}</span>`:''}${warnings.length?`<br><span>${warnings.length} spreadsheet warning(s). First: ${escapeHtml(warnings[0])}</span>`:''}<br><span>Click Save & Publish to overwrite the live vendor list.</span>`}
  setStatus(`Imported ${imported.length} vendor records. Review them, then click Save & Publish.`,'success');
}catch(err){setStatus(`Spreadsheet import failed: ${err.message}`,'error')}
}
async function deleteAllVendors(){
  if(state.section!=="vendors"){
    setStatus("Open Vendors & Booths before using Delete All.","error");
    return;
  }

  const first=confirm(
    "Delete ALL vendor and booth assignments for this event?\n\n" +
    "This clears the vendor directory only. The physical tables and booths in Map Designer will remain."
  );
  if(!first)return;

  const second=confirm(
    "FINAL CONFIRMATION\n\n" +
    "This will immediately publish an EMPTY vendor list to the attendee app.\n\nContinue?"
  );
  if(!second)return;

  const previous=JSON.parse(JSON.stringify(state.data||[]));
  const button=document.getElementById("vendorDeleteAll");

  if(button){
    button.disabled=true;
    button.textContent="DELETING…";
  }

  try{
    state.data=[];
    state.selectedIndex=null;
    renderList();

    const result=await api("/api/content/vendors",{
      method:"POST",
      body:JSON.stringify({data:[]})
    });

    state.currentSha=result.sha||null;
    state.exists=true;
    if(state.section==="mapLayout")state.mapSource="live";
    setDirty(false);

    const status=document.getElementById("vendorImportStatus");
    if(status){
      status.classList.remove("hidden");
      status.innerHTML="<strong>All vendor and booth assignments were deleted and published.</strong><br>The physical floor-map tables remain available in Map Designer.";
    }

    setStatus(
      `Vendor roster reset successfully. GitHub commit ${String(result.commit||"").slice(0,7)} created.`,
      "success"
    );
    loadHistory();
  }catch(err){
    state.data=previous;
    renderList();
    setDirty(false);
    setStatus(`Delete All failed: ${err.message}`,"error");
  }finally{
    if(button){
      button.disabled=false;
      button.textContent="DELETE ALL VENDORS & BOOTHS";
    }
  }
}
function mapKeyboardNudge(event){
  if(state.section!=='mapLayout')return;
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;

  if(event.key==='Escape'){
    clearMapLayoutSelection();
    renderMapLayoutDesigner(false);
    event.preventDefault();
    return;
  }

  if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;
  const base=Number(document.getElementById('mapNudgeStep')?.value||5)*(event.shiftKey?10:1);
  const delta={ArrowUp:[0,-base],ArrowDown:[0,base],ArrowLeft:[-base,0],ArrowRight:[base,0]}[event.key];
  mapNudge(...delta);
  event.preventDefault();
}
function restoreNudgePadPosition(){const pad=document.getElementById('mapNudgePad');if(!pad)return;try{const p=JSON.parse(localStorage.getItem('sfvc-map-nudge-pad-position')||'null');if(p&&Number.isFinite(p.left)&&Number.isFinite(p.top)){pad.style.left=`${p.left}px`;pad.style.top=`${p.top}px`;pad.style.right='auto';pad.style.bottom='auto'}}catch{}}
function initNudgePadDrag(){const pad=document.getElementById('mapNudgePad'),handle=document.getElementById('mapNudgeHandle');if(!pad||!handle)return;restoreNudgePadPosition();let drag=null;handle.addEventListener('pointerdown',e=>{const r=pad.getBoundingClientRect();drag={id:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top};handle.setPointerCapture?.(e.pointerId);e.preventDefault()});handle.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const left=Math.max(4,Math.min(window.innerWidth-pad.offsetWidth-4,e.clientX-drag.dx)),top=Math.max(4,Math.min(window.innerHeight-pad.offsetHeight-4,e.clientY-drag.dy));pad.style.left=`${left}px`;pad.style.top=`${top}px`;pad.style.right='auto';pad.style.bottom='auto';e.preventDefault()});const end=e=>{if(!drag||e.pointerId!==drag.id)return;const r=pad.getBoundingClientRect();localStorage.setItem('sfvc-map-nudge-pad-position',JSON.stringify({left:r.left,top:r.top}));drag=null};handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end)}


async function loadBundledDefaultMap(){
  return JSON.parse(JSON.stringify(EMBEDDED_MAP_LAYOUT));
}


function updateMapSourceBadge(){
  const badge=document.getElementById("mapDataSource");
  if(!badge)return;

  const live=state.mapSource==="live";
  badge.textContent=live?"MAP SOURCE: LIVE GITHUB":"MAP SOURCE: RECOVERY COPY";
  badge.classList.toggle("live-source",live);
  badge.classList.toggle("recovery-source",!live);
}

function mapDocumentHasContent(data){
  const doc=Array.isArray(data)?data[0]:null;
  return Boolean(
    doc &&
    Array.isArray(doc.locations) &&
    Array.isArray(doc.elements) &&
    (doc.locations.length>0 || doc.elements.length>0)
  );
}

async function restoreBaseFloorMap(){
  if(state.section!=="mapLayout")return;
  const ok=confirm(
    "Restore the bundled Sci-Fi Valley Con base floor map?\n\n" +
    "This replaces the current Map Designer layout in the editor. Click Save & Publish afterward to write it to GitHub."
  );
  if(!ok)return;

  try{
    state.data=await loadBundledDefaultMap();
    clearMapLayoutSelection();
    setDirty(true);
    renderMapLayoutDesigner();
    setStatus("Base floor map restored in the editor. Click Save & Publish to make it live.","success");
  }catch(err){
    setStatus(`Could not restore base floor map: ${err.message}`,"error");
  }
}


function shortDeviceId(id){const value=String(id||"");return value.length<=18?value:`${value.slice(0,8)}…${value.slice(-6)}`}
function formatDeviceDate(value){const n=Number(value);return n?new Date(n).toLocaleString():"—"}
function formatDeviceReminder(minutes){const n=Number(minutes||0);return n?`${n} MIN`:"NONE"}

let registrationSearchTimer=null;

function registrationDate(value){
  if(!value)return "—";
  const date=new Date(Number(value));
  return Number.isNaN(date.getTime())?"—":date.toLocaleString();
}

let reportRefreshTimer=null;
let reportSearchTimer=null;
let activeReportId="";

const REPORT_ADMIN_LABELS={venue:"VENUE",staff:"STAFF HELP",security:"SECURITY",harassment:"HARASSMENT / MISCONDUCT",medical:"MEDICAL",ai:"AI POLICY",accessibility:"ACCESSIBILITY",other:"OTHER"};
function reportAdminLabel(value){return REPORT_ADMIN_LABELS[value]||String(value||"REPORT").toUpperCase()}
function reportStatusLabel(value){return ({new:"NEW",reviewing:"REVIEWING",actioned:"ACTIONED",closed:"CLOSED",dismissed:"DISMISSED"})[value]||String(value||"").toUpperCase()}
function formatReportTime(value){if(!value)return "—";try{return new Date(Number(value)).toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return "—"}}

async function loadReportDashboard(){
  const table=$("#reportTableBody");
  if(table)table.innerHTML='<tr><td colspan="7">Loading attendee reports…</td></tr>';
  const params=new URLSearchParams();
  const q=$("#reportSearch")?.value.trim();const status=$("#reportStatusFilter")?.value;const category=$("#reportCategoryFilter")?.value;
  if(q)params.set("q",q);if(status)params.set("status",status);if(category)params.set("category",category);
  try{
    const result=await api(`/api/reports${params.toString()?`?${params}`:""}`);
    const counts=result.counts||{};
    $("#reportNewCount").textContent=String(counts.new??0);$("#reportHighCount").textContent=String(counts.highOpen??0);$("#report24hCount").textContent=String(counts.last24??0);$("#reportAiCount").textContent=String(counts.aiOpen??0);
    const nav=$("#reportNavCount");if(nav){const n=Number(counts.new||0);nav.textContent=n>99?"99+":String(n);nav.classList.toggle("hidden",n<=0)}
    const reports=Array.isArray(result.reports)?result.reports:[];
    if(table)table.innerHTML=reports.map(r=>{
      const where=r.vendorTable?`${r.vendorName||"Vendor"} • ${r.vendorTable}`:(r.location||"—");
      const reporter=r.reporterMode==="identified"?(r.reporterName||r.reporterEmail||r.reporterPhone||"Identified"):"Anonymous";
      return `<tr class="report-row ${escapeHtml(r.priority||"")} ${escapeHtml(r.status||"")}"><td>${escapeHtml(formatReportTime(r.createdAt))}${r.happeningNow?'<span class="report-now-flag">NOW</span>':""}</td><td><b>${escapeHtml(r.reportId)}</b><small>${escapeHtml(String(r.description||"").slice(0,95))}</small></td><td><span class="report-category-pill ${escapeHtml(r.category)}">${escapeHtml(reportAdminLabel(r.category))}</span>${r.fileCount?`<small>📎 ${Number(r.fileCount)} image${Number(r.fileCount)===1?"":"s"}</small>`:""}</td><td>${escapeHtml(where)}</td><td>${escapeHtml(reporter)}</td><td><span class="report-status-pill ${escapeHtml(r.status)}">${escapeHtml(reportStatusLabel(r.status))}</span></td><td><button class="btn small secondary" data-open-report="${escapeHtml(r.reportId)}">OPEN</button></td></tr>`;
    }).join("")||'<tr><td colspan="7">No attendee reports match these filters.</td></tr>';
    $$('[data-open-report]').forEach(button=>button.addEventListener('click',()=>openReportDetail(button.dataset.openReport)));
    updateReportPushStatus().catch(()=>{});
  }catch(err){if(table)table.innerHTML=`<tr><td colspan="7">Could not load reports: ${escapeHtml(err.message)}</td></tr>`}
}

async function openReportDetail(reportId){
  activeReportId=reportId;
  const modal=$("#reportDetailModal"),host=$("#reportDetailContent");
  host.innerHTML='<p class="muted">Loading report…</p>';
  if(typeof modal.showModal==="function"&&!modal.open)modal.showModal();else modal.setAttribute("open","");
  try{
    const result=await api(`/api/reports/${encodeURIComponent(reportId)}`);const r=result.report||{};const files=result.files||[];
    const contact=r.reporterMode==="identified"?`<div class="report-detail-contact"><h4>REPORTER CONTACT</h4><p><b>Name:</b> ${escapeHtml(r.reporterName||"Not provided")}</p><p><b>Phone:</b> ${escapeHtml(r.reporterPhone||"Not provided")}</p><p><b>Email:</b> ${escapeHtml(r.reporterEmail||"Not provided")}</p></div>`:'<div class="report-detail-contact anonymous"><h4>REPORTER</h4><p>Anonymous submission</p></div>';
    const vendor=r.category==="ai"?`<section class="report-detail-section ai"><h4>VENDOR / AI POLICY DETAILS</h4><p><b>Vendor / artist:</b> ${escapeHtml(r.vendorName||"Not provided")}</p><p><b>Table / booth:</b> ${escapeHtml(r.vendorTable||"Not provided")}</p><p>${escapeHtml(r.aiDetails||"No additional AI details provided.")}</p></section>`:"";
    const fileHtml=files.length?`<section class="report-detail-section"><h4>PHOTO EVIDENCE • ${files.length}</h4><div class="report-evidence-grid">${files.map(f=>`<a href="/api/reports/${encodeURIComponent(r.reportId)}/files/${Number(f.id)}" target="_blank" rel="noopener"><img src="/api/reports/${encodeURIComponent(r.reportId)}/files/${Number(f.id)}" alt="Report evidence: ${escapeHtml(f.filename)}"><span>${escapeHtml(f.filename)}</span></a>`).join("")}</div></section>`:"";
    host.innerHTML=`<div class="report-detail-head"><div><p class="eyebrow">${escapeHtml(formatReportTime(r.createdAt))}</p><h2>${escapeHtml(r.reportId)}</h2><div class="report-detail-badges"><span class="report-category-pill ${escapeHtml(r.category)}">${escapeHtml(reportAdminLabel(r.category))}</span><span class="report-priority-pill ${escapeHtml(r.priority)}">${escapeHtml((r.priority||"normal").toUpperCase())} PRIORITY</span>${r.happeningNow?'<span class="report-now-flag">HAPPENING NOW</span>':""}</div></div></div>
      <section class="report-detail-section"><h4>REPORT</h4><p class="report-description">${escapeHtml(r.description||"")}</p><p><b>Location:</b> ${escapeHtml(r.location||"Not provided")}</p></section>${vendor}${contact}${fileHtml}
      <section class="report-detail-section staff-action"><h4>STAFF WORKFLOW</h4><label>Status<select id="reportDetailStatus"><option value="new">New</option><option value="reviewing">Reviewing</option><option value="actioned">Actioned</option><option value="closed">Closed</option><option value="dismissed">Dismissed</option></select></label><label>Internal staff notes<textarea id="reportDetailNotes" maxlength="6000" placeholder="Document staff follow-up, action taken, or why a report was closed/dismissed.">${escapeHtml(r.staffNotes||"")}</textarea></label><button id="saveReportStatus" class="btn primary" type="button">SAVE REPORT STATUS</button><p id="reportDetailStatusMessage" class="muted"></p></section>
      <section class="report-detail-audit"><small>First viewed: ${escapeHtml(formatReportTime(r.firstViewedAt))}${r.viewedBy?` by ${escapeHtml(r.viewedBy)}`:""}</small>${r.updatedBy?`<small>Last updated by ${escapeHtml(r.updatedBy)}</small>`:""}</section>`;
    $("#reportDetailStatus").value=r.status||"new";$("#saveReportStatus")?.addEventListener("click",saveOpenReportStatus);
  }catch(err){host.innerHTML=`<p class="muted">Could not load report: ${escapeHtml(err.message)}</p>`}
}

async function saveOpenReportStatus(){
  if(!activeReportId)return;const button=$("#saveReportStatus"),msg=$("#reportDetailStatusMessage");button.disabled=true;msg.textContent="Saving…";
  try{await api(`/api/reports/${encodeURIComponent(activeReportId)}/status`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:$("#reportDetailStatus").value,staffNotes:$("#reportDetailNotes").value})});msg.textContent="✓ Report status saved.";await loadReportDashboard()}catch(err){msg.textContent=`Could not save: ${err.message}`}finally{button.disabled=false}
}

function urlBase64ToUint8Array(base64String){const padding="=".repeat((4-base64String.length%4)%4);const base64=(base64String+padding).replace(/-/g,"+").replace(/_/g,"/");const raw=atob(base64);return Uint8Array.from([...raw].map(ch=>ch.charCodeAt(0)))}
async function ensureAdminReportServiceWorker(){if(!("serviceWorker" in navigator))throw new Error("Service workers are not supported on this device.");return navigator.serviceWorker.register("/admin-report-sw.js",{scope:"/"})}
async function updateReportPushStatus(){
  const el=$("#reportPushStatus"),button=$("#enableReportPush");if(!el||!button)return;
  if(!("Notification" in window)||!("serviceWorker" in navigator)){el.textContent="Browser push notifications are not supported here.";button.disabled=true;return}
  const reg=await ensureAdminReportServiceWorker().catch(()=>null);const sub=await reg?.pushManager?.getSubscription?.().catch(()=>null);
  if(Notification.permission==="granted"&&sub){
    await api("/api/reports/push/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subscription:sub.toJSON()})}).catch(()=>{});
    el.textContent="✓ Report alerts are enabled on this admin device.";button.textContent="REPORT ALERTS ENABLED";button.classList.add("success");return
  }
  if(Notification.permission==="denied"){el.textContent="Notifications are blocked in this browser's site settings.";button.textContent="NOTIFICATIONS BLOCKED";return}
  el.textContent="Enable this device to receive a push notification whenever an attendee report is submitted.";button.textContent="ENABLE REPORT ALERTS";button.classList.remove("success")
}
async function enableAdminReportPush(){
  const button=$("#enableReportPush"),status=$("#reportPushStatus");button.disabled=true;
  try{const permission=await Notification.requestPermission();if(permission!=="granted")throw new Error("Notification permission was not granted.");const reg=await ensureAdminReportServiceWorker();let sub=await reg.pushManager.getSubscription();if(!sub){const key=await api("/api/reports/push/public-key");sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(key.publicKey)})}await api("/api/reports/push/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subscription:sub.toJSON()})});status.textContent="✓ Report alerts are enabled on this admin device.";button.textContent="REPORT ALERTS ENABLED";button.classList.add("success")}catch(err){status.textContent=`Could not enable report alerts: ${err.message}`}finally{button.disabled=false}
}
function startReportPolling(){clearInterval(reportRefreshTimer);reportRefreshTimer=setInterval(()=>{if(state.section==="reports"&&document.visibilityState==="visible")loadReportDashboard()},30000)}

async function loadRegistrationDashboard(){
  const body=document.getElementById("registrationTableBody");
  if(body)body.innerHTML='<tr><td colspan="7">Loading app registrations…</td></tr>';
  try{
    const q=encodeURIComponent(String(document.getElementById("registrationSearch")?.value||"").trim());
    const result=await api(`/api/registrations${q?`?q=${q}`:""}`);
    document.getElementById("registrationTotalCount").textContent=Number(result.totals?.total||0).toLocaleString();
    document.getElementById("registrationEmailCount").textContent=Number(result.totals?.withEmail||0).toLocaleString();
    document.getElementById("registrationPhoneCount").textContent=Number(result.totals?.withPhone||0).toLocaleString();
    document.getElementById("registrationUpdated24h").textContent=Number(result.totals?.updated24h||0).toLocaleString();

    const rows=Array.isArray(result.registrations)?result.registrations:[];
    if(body)body.innerHTML=rows.length?rows.map(item=>`
      <tr>
        <td><strong>${escapeHtml(item.name||"—")}</strong></td>
        <td>${escapeHtml(item.pronouns||"—")}</td>
        <td><a href="mailto:${escapeHtml(item.email||"")}">${escapeHtml(item.email||"—")}</a></td>
        <td><a href="tel:${escapeHtml(item.phone||"")}">${escapeHtml(item.phone||"—")}</a></td>
        <td>${escapeHtml(registrationDate(item.updatedAt))}</td>
        <td><code>${escapeHtml(shortDeviceId(item.deviceId||""))}</code></td>
        <td><button class="btn small danger" type="button" data-delete-registration="${escapeHtml(item.deviceId||"")}">REMOVE</button></td>
      </tr>`).join(""):'<tr><td colspan="7">No app registrations match this search.</td></tr>';

    document.querySelectorAll("[data-delete-registration]").forEach(button=>{
      button.addEventListener("click",()=>removeAdminRegistration(button.dataset.deleteRegistration));
    });
  }catch(err){
    if(body)body.innerHTML=`<tr><td colspan="7">${escapeHtml(err.message)}</td></tr>`;
    setStatus(err.message,"error");
  }
}

async function removeAdminRegistration(deviceId){
  if(!deviceId)return;
  if(!confirm("Remove this attendee's app registration? This does not delete their anonymous Device ID, My Schedule, push subscription or admission ticket."))return;
  try{
    const result=await api(`/api/registrations/${encodeURIComponent(deviceId)}`,{method:"DELETE"});
    setStatus(`Removed app registration for ${result.name||shortDeviceId(deviceId)}.`,"success");
    await loadRegistrationDashboard();
  }catch(err){
    setStatus(`Could not remove app registration: ${err.message}`,"error");
  }
}

async function loadDeviceDashboard(){
  const body=document.getElementById("deviceTableBody");
  if(body)body.innerHTML='<tr><td colspan="6">Loading anonymous devices…</td></tr>';
  try{
    const q=encodeURIComponent(String(document.getElementById("deviceSearch")?.value||"").trim());
    const [result,engine]=await Promise.all([
      api(`/api/devices${q?`?q=${q}`:""}`),
      api("/api/reminders/health").catch(()=>null)
    ]);

    const engineEl=document.getElementById("reminderEngineHealth");
    if(engineEl&&engine){
      const age=engine.lastCronAgeSeconds;
      engineEl.classList.remove("checking","healthy","warning");
      if(engine.cronHealthy){
        engineEl.classList.add("healthy");
        engineEl.textContent=`REMINDER ENGINE ONLINE • CRON ${age}s AGO • ${Number(engine.statuses?.pending||0)} PENDING • ${Number(engine.statuses?.queued||0)} QUEUED`;
      }else{
        engineEl.classList.add("warning");
        engineEl.textContent=`REMINDER ENGINE WARNING • LAST CRON ${engine.lastCronAt?`${age}s AGO`:"NEVER"} • CHECK CLOUDFLARE CRON TRIGGER`;
      }
    }

    document.getElementById("deviceTotalCount").textContent=Number(result.totals?.devices||0).toLocaleString();
    document.getElementById("deviceSeen24h").textContent=Number(result.totals?.seen24h||0).toLocaleString();
    document.getElementById("devicePushCount").textContent=Number(result.totals?.pushEnabled||0).toLocaleString();
    document.getElementById("deviceSavedEventCount").textContent=Number(result.totals?.savedEvents||0).toLocaleString();

    const rows=Array.isArray(result.devices)?result.devices:[];
    if(body)body.innerHTML=rows.length?rows.map(d=>`
      <tr>
        <td><button class="device-id-button" data-device-id="${escapeHtml(d.device_id)}" type="button">${escapeHtml(shortDeviceId(d.device_id))}</button>${d.registeredName?`<small class="device-registered-name">REGISTERED: ${escapeHtml(d.registeredName)}</small>`:""}<small>${escapeHtml(d.endpointHash||"NO PUSH ENDPOINT")}</small></td>
        <td>${escapeHtml(formatDeviceDate(d.last_seen))}</td>
        <td><span class="device-push-badge ${d.pushConnected?"connected":"off"}">${d.pushConnected?"CONNECTED":"OFF"}</span></td>
        <td>${Number(d.favorite_count||0)}</td>
        <td>${escapeHtml(formatDeviceReminder(d.reminder_minutes))}</td>
        <td>${d.next_notify_at?escapeHtml(formatDeviceDate(d.next_notify_at)):"—"}</td>
      </tr>`).join(""):'<tr><td colspan="6">No anonymous devices match this search.</td></tr>';

    document.querySelectorAll(".device-id-button").forEach(button=>button.addEventListener("click",()=>loadDeviceDetail(button.dataset.deviceId)));
  }catch(err){
    if(body)body.innerHTML=`<tr><td colspan="6">${escapeHtml(err.message)}</td></tr>`;
    setStatus(err.message,"error");
  }
}

async function loadDeviceDetail(deviceId){
  const panel=document.getElementById("deviceDetailPanel");
  if(!panel)return;
  panel.innerHTML='<div class="device-detail-empty"><strong>LOADING DEVICE…</strong></div>';
  try{
    const result=await api(`/api/devices/${encodeURIComponent(deviceId)}`);
    const d=result.device||{};
    const profile=result.profile&&typeof result.profile==="object"?result.profile:null;
    const favorites=Array.isArray(result.favorites)?result.favorites:[];
    const reminders=Array.isArray(result.reminders)?result.reminders:[];
    const deliveries=Array.isArray(result.deliveries)?result.deliveries:[];

    const favHtml=favorites.length?favorites.map(item=>`
      <article class="device-favorite-card">
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.day)} • ${escapeHtml(item.time)} • ${escapeHtml(item.location)}</p>
        <div class="device-favorite-meta"><span>${escapeHtml(item.eventId)}</span><span>${escapeHtml(formatDeviceReminder(item.reminderMinutes))} BEFORE</span></div>
        <small>NEXT NOTIFICATION: ${item.notifyAt?escapeHtml(formatDeviceDate(item.notifyAt)):"NONE"}</small>
      </article>`).join(""):'<p class="muted">This device has no saved My Schedule events.</p>';

    const latestReminder=reminders[0];
    const latestDelivery=deliveries[0];

    panel.innerHTML=`
      <div class="device-detail-head"><p class="eyebrow">ANONYMOUS DEVICE</p><h3>${escapeHtml(shortDeviceId(d.deviceId))}</h3><button id="copyDeviceId" class="btn small secondary" type="button">Copy Full ID</button>
        <button id="testDevicePushNow" class="btn small secondary" type="button">SEND TEST NOW</button>
        <button id="testDevicePush" class="btn small secondary" type="button">TEST IN 1 MIN</button></div>
      <div class="device-detail-stats">
        <div><small>FULL DEVICE ID</small><b class="device-full-id">${escapeHtml(d.deviceId||"")}</b></div>
        <div><small>LAST SEEN</small><b>${escapeHtml(formatDeviceDate(d.lastSeen))}</b></div>
        <div><small>PUSH</small><b>${d.pushConnected?"CONNECTED":"NOT CONNECTED"}</b></div>
        <div><small>REMINDER DEFAULT</small><b>${escapeHtml(formatDeviceReminder(d.reminderMinutes))}</b></div>
        <div><small>APP VERSION</small><b>${escapeHtml(d.appVersion||"—")}</b></div>
        <div><small>TIMEZONE</small><b>${escapeHtml(d.timezone||"—")}</b></div>
      </div>
      ${profile?`<div class="device-detail-section registered-profile-detail">
        <p class="eyebrow">REGISTERED APP PROFILE</p>
        <div class="device-profile-grid">
          <div><small>NAME</small><b>${escapeHtml(profile.name||"—")}</b></div>
          <div><small>PRONOUNS</small><b>${escapeHtml(profile.pronouns||"—")}</b></div>
          <div><small>EMAIL</small><b><a href="mailto:${escapeHtml(profile.email||"")}">${escapeHtml(profile.email||"—")}</a></b></div>
          <div><small>PHONE</small><b><a href="tel:${escapeHtml(profile.phone||"")}">${escapeHtml(profile.phone||"—")}</a></b></div>
        </div>
      </div>`:""}
      <div class="device-detail-section"><p class="eyebrow">MY CON FAVORITES • ${favorites.length}</p><div class="device-favorites-list">${favHtml}</div></div>
      <div class="device-detail-section"><p class="eyebrow">REMINDER DELIVERY</p>
        <p><strong>Latest reminder:</strong> ${latestReminder?`${escapeHtml(latestReminder.title||"")} • ${escapeHtml(String(latestReminder.status||"").toUpperCase())}`:"No reminder records yet."}</p>
        <p><strong>Latest push attempt:</strong> ${latestDelivery?`${escapeHtml(String(latestDelivery.delivery_type||"").toUpperCase())} • ${escapeHtml(String(latestDelivery.outcome||"").toUpperCase())} • HTTP ${Number(latestDelivery.push_service_status||0)}`:"No delivery attempts yet."}</p>
      </div>`;

    document.getElementById("copyDeviceId")?.addEventListener("click",async()=>{
      await navigator.clipboard.writeText(String(d.deviceId||""));
      setStatus("Anonymous Device ID copied.","success");
    });
    document.getElementById("testDevicePushNow")?.addEventListener("click",async()=>{
      const button=document.getElementById("testDevicePushNow");
      button.disabled=true;
      button.textContent="SENDING…";
      try{
        const result=await api(`/api/devices/${encodeURIComponent(d.deviceId)}/test-now`,{
          method:"POST",
          body:JSON.stringify({})
        });

        const delivery=result.delivery||{};
        const http=Number(delivery.push_service_status||0);
        setStatus(
          result.ok
            ? `Immediate push accepted by the push service${http?` (HTTP ${http})`:""}. Check the selected phone now.`
            : `Immediate push was not accepted. ${delivery.detail||""}`,
          result.ok?"success":"error"
        );
      }catch(err){
        setStatus(`Immediate device test failed: ${err.message}`,"error");
      }finally{
        button.disabled=false;
        button.textContent="SEND TEST NOW";
        setTimeout(()=>loadDeviceDetail(d.deviceId),500);
      }
    });

    document.getElementById("testDevicePush")?.addEventListener("click",async()=>{
      const button=document.getElementById("testDevicePush");
      button.disabled=true;
      button.textContent="SCHEDULING…";
      try{
        const result=await api(`/api/devices/${encodeURIComponent(d.deviceId)}/test`,{
          method:"POST",
          body:JSON.stringify({})
        });
        const when=new Date(Number(result.notifyAt));
        setStatus(
          `Device test scheduled for ${when.toLocaleTimeString([],{hour:"numeric",minute:"2-digit",second:"2-digit"})}. Close and lock that phone now.`,
          "success"
        );
        button.textContent="TEST SCHEDULED";
        setTimeout(()=>{button.disabled=false;button.textContent="TEST IN 1 MIN"},65000);
      }catch(err){
        setStatus(`Device test failed: ${err.message}`,"error");
        button.disabled=false;
        button.textContent="TEST IN 1 MIN";
      }
    });
  }catch(err){
    panel.innerHTML=`<div class="device-detail-empty"><strong>DEVICE COULD NOT LOAD</strong><p>${escapeHtml(err.message)}</p></div>`;
  }
}


async function loadTshirtSyncStatus(){
  const box=document.getElementById("tshirtSyncStatus");
  const button=document.getElementById("tshirtSyncNow");
  if(!box)return;

  box.className="tshirt-sync-status";
  box.textContent="Checking store sync configuration…";

  try{
    const result=await api("/api/tshirts/sync/status");
    const parts=[
      result.authorized?"AUTHORIZED":"NOT AUTHORIZED",
      result.storeIdConfigured?"STORE ID READY":"STORE ID MISSING",
      result.publicTokenConfigured?"PUBLIC TOKEN READY":"PUBLIC TOKEN MISSING",
      `${Number(result.automaticProducts||0)} AUTO-SYNCED`,
      `${Number(result.manualProducts||0)} MANUAL`
    ];
    box.textContent=parts.join(" • ");
    box.classList.toggle("ready",Boolean(result.authorized&&result.configured));
    box.classList.toggle("warning",!result.authorized||!result.configured);
    if(result.lastCatalogUpdate){
      const small=document.createElement("small");
      small.textContent=` Catalog last updated ${new Date(result.lastCatalogUpdate).toLocaleString()}.`;
      box.appendChild(small);
    }
    if(button)button.disabled=!(result.authorized&&result.configured);
  }catch(err){
    box.textContent=`Store sync status unavailable: ${err.message}`;
    box.classList.add("warning");
    if(button)button.disabled=true;
  }
}

async function runTshirtSync(){
  const button=document.getElementById("tshirtSyncNow");
  if(!button)return;

  button.disabled=true;
  button.textContent="CHECKING STORE…";

  try{
    const result=await api("/api/tshirts/sync",{
      method:"POST",
      body:JSON.stringify({})
    });

    setStatus(
      result.changed
        ? `T-shirt store synchronized. ${result.matchedProducts} Cryptoteeology products loaded. GitHub commit ${String(result.commit||"").slice(0,7)} created.`
        : `T-shirt store checked. ${result.matchedProducts} products found and no catalog changes were needed.`,
      "success"
    );

    if(state.section==="tshirts")await loadSection("tshirts");
  }catch(err){
    setStatus(`T-shirt store sync failed: ${err.message}`,"error");
  }finally{
    button.disabled=false;
    button.textContent="CHECK STORE NOW";
    loadTshirtSyncStatus();
  }
}


async function loadHomeBannerSyncStatus(){
  const box=document.getElementById("homeBannerSyncStatus");
  const button=document.getElementById("homeBannerCheckNow");
  if(!box)return;

  box.className="home-banner-sync-status";
  box.textContent="Checking banner status…";

  try{
    const result=await api("/api/home-banner/status");
    box.textContent=[
      result.enabled?"VISIBLE":"HIDDEN",
      result.autoUpdate?"DAILY AUTO-SYNC ON":"MANUAL MODE",
      result.sourceMode==="website-auto"?"WEBSITE SOURCE":"MANUAL SOURCE"
    ].join(" • ");

    box.classList.toggle("ready",Boolean(result.enabled&&result.autoUpdate));
    box.classList.toggle("warning",!result.autoUpdate);

    if(result.sourceUpdatedAt){
      const small=document.createElement("small");
      small.textContent=` Last banner change: ${new Date(result.sourceUpdatedAt).toLocaleString()}.`;
      box.appendChild(small);
    }

    if(button)button.disabled=false;
  }catch(err){
    box.textContent=`Banner status unavailable: ${err.message}`;
    box.classList.add("warning");
    if(button)button.disabled=false;
  }
}

async function checkHomeBannerNow(){
  const button=document.getElementById("homeBannerCheckNow");
  if(!button)return;

  if(state.section==="homeBanner" && !commitFormToState())return;

  button.disabled=true;
  button.textContent="CHECKING WEBSITE…";

  try{
    // Save any current Auto Update/source URL changes first so the website check
    // uses the same configuration the editor is showing.
    if(state.section==="homeBanner"&&state.dirty){
      await saveSection();
    }

    const result=await api("/api/home-banner/check",{
      method:"POST",
      body:JSON.stringify({})
    });

    if(result.changed){
      setStatus(
        `Website banner updated automatically. GitHub commit ${String(result.commit||"").slice(0,7)} created.`,
        "success"
      );
    }else{
      setStatus("Website checked. The attendee app is already using the current first celebrity guest banner.","success");
    }

    await loadSection("homeBanner");
  }catch(err){
    setStatus(`Website banner check failed: ${err.message}`,"error");
  }finally{
    button.disabled=false;
    button.textContent="CHECK WEBSITE NOW";
    loadHomeBannerSyncStatus();
  }
}

async function loadSection(section=state.section){
  if(state.dirty&&!confirm("Discard unsaved changes and reload?"))return;
  state.section=section;
  if(section!=="reports")clearInterval(reportRefreshTimer);
  state.selectedIndex=null;
  setDirty(false);

$$(".nav[data-section]").forEach(b=>b.classList.toggle("active",b.dataset.section===section));
  const meta=SECTIONS[section];
  $("#sectionTitle").textContent=meta.title;
  $("#sectionDescription").textContent=meta.description;

  const reportsMode=section==="reports";
  const broadcastMode=section==="broadcasts";
  const analyticsMode=section==="analytics";
  const registrationsMode=section==="registrations";
  const devicesMode=section==="devices";
  const mapLayoutMode=section==="mapLayout";
  const specialMode=reportsMode||broadcastMode||analyticsMode||registrationsMode||devicesMode||mapLayoutMode;

  $("#reportsPanel")?.classList.toggle("hidden",!reportsMode);
  $("#broadcastPanel")?.classList.toggle("hidden",!broadcastMode);
  $("#analyticsPanel")?.classList.toggle("hidden",!analyticsMode);
  $("#registrationsPanel")?.classList.toggle("hidden",!registrationsMode);
  $("#devicesPanel")?.classList.toggle("hidden",!devicesMode);
  $("#mapLayoutPanel")?.classList.toggle("hidden",!mapLayoutMode);
  $("#vendorBulkTools")?.classList.toggle("hidden",section!=="vendors");
  $("#tshirtSyncTools")?.classList.toggle("hidden",section!=="tshirts");
  $("#homeBannerTools")?.classList.toggle("hidden",section!=="homeBanner");
  $("#editorGrid")?.classList.toggle("hidden",specialMode);
  $("#contentHistoryPanel")?.classList.toggle("hidden",reportsMode||broadcastMode||analyticsMode||registrationsMode||devicesMode);
  $("#addButton").classList.toggle("hidden",specialMode||section==="settings"||section==="directions"||section==="homeBanner"||section==="celebrityInfo"||section==="mapSettings");
  $("#saveButton").classList.toggle("hidden",reportsMode||broadcastMode||analyticsMode||registrationsMode||devicesMode);

  if(reportsMode){
    await loadReportDashboard();
    startReportPolling();
    return;
  }

  if(broadcastMode){
    await loadBroadcastDashboard();
    return;
  }

  if(analyticsMode){
    await loadAnalyticsDashboard();
    return;
  }
  if(registrationsMode){
    await loadRegistrationDashboard();
    return;
  }
  if(devicesMode){
    await loadDeviceDashboard();
    return;
  }
  if(mapLayoutMode){
    $("#addButton").textContent=meta.addLabel;

    // Always render a complete recovery map immediately.
    // A valid live GitHub map may replace it a moment later.
    state.data=await loadBundledDefaultMap();
    state.mapSource="recovery";
    clearMapLayoutSelection();
    renderMapLayoutDesigner();
    updateMapSourceBadge();

    try{
      const [result,vendorsResult]=await Promise.all([
        api(`/api/content/${section}`),
        api(`/api/content/vendors`).catch(()=>({data:[]}))
      ]);

      state.currentSha=result.sha||null;
      state.exists=result.exists!==false;
      state.mapVendors=Array.isArray(vendorsResult.data)?vendorsResult.data:[];

      if(mapDocumentHasContent(result.data)){
        state.data=JSON.parse(JSON.stringify(result.data));
        state.mapSource="live";
        setDirty(false);
        renderMapLayoutDesigner();
        updateMapSourceBadge();
        setStatus("Live floor map loaded from GitHub.","success");
      }else{
        state.mapSource="recovery";
        setDirty(true);
        renderMapLayoutDesigner();
        updateMapSourceBadge();
        setStatus(
          "The live map response was empty, so Map Designer kept the embedded recovery floor map. Click Save & Publish if you want to recreate the live map file from this copy.",
          "error"
        );
      }

      loadHistory();
    }catch(err){
      state.mapSource="recovery";
      setDirty(true);
      renderMapLayoutDesigner();
      updateMapSourceBadge();
      setStatus(
        `The live GitHub map could not be loaded (${err.message}). The complete embedded recovery map is still available for editing. Save & Publish will write it back to the attendee repository.`,
        "error"
      );
    }
    return;
  }

  $("#addButton").textContent=meta.addLabel;
  $("#recordSearch").value="";
  $("#emptyEditor").classList.remove("hidden");
  $("#recordForm").classList.add("hidden");
  $("#recordList").innerHTML=`<p class="muted">Loading ${meta.title.toLowerCase()}…</p>`;

  try{
    const result=await api(`/api/content/${section}`);
    state.data=Array.isArray(result.data)?result.data:[];
    state.currentSha=result.sha||null;
    state.exists=result.exists!==false;
    if(section==="tshirts")loadTshirtSyncStatus();
    if(section==="homeBanner")loadHomeBannerSyncStatus();
    if((section==="settings"||section==="directions"||section==="homeBanner"||section==="celebrityInfo"||section==="mapSettings")&&state.data.length){
      state.selectedIndex=0;
      renderList();
      renderForm();
    }else{
      renderList();
    }
    loadHistory();
  }catch(err){
    state.data=[];
    renderList();
    setStatus(err.message,"error");
  }
}

function recordInfo(item,index){
  if(state.section==="mapLayout")return [item.id||"Map Layout","Editable floor map SVG data"];
  if(state.section==="mapSettings")return [item.title||"Interactive Floor Map",item.published?"MAP PUBLISHED":"DRAFT / HIDDEN"];
  if(state.section==="directions")return [item.venueName||"Venue & Directions",item.shuttleEnabled?(item.shuttleAddress||"SHUTTLE ADDRESS NEEDED"):"SHUTTLE HIDDEN"];
  if(state.section==="settings")return [item.eventName||"Event Details",`${item.startDate||"Date TBD"} → ${item.endDate||"Date TBD"}`];
  if(state.section==="homeBanner")return ["Home Celebrity Banner",item.autoUpdate===false?"MANUAL IMAGE":"AUTO WEBSITE SYNC"];
  if(state.section==="faq")return [item.question||`FAQ ${index+1}`,`${item.category||"General"}${item.enabled===false?" • HIDDEN":""}`];
  if(state.section==="celebrityInfo")return ["Celebrity Guide Settings",item.published?"PUBLISHED":"DRAFT / HIDDEN"];
  if(state.section==="pricing")return [item.guestName||`GUEST ${index+1}`,`${item.autograph||"TBD"} auto • ${item.proPhoto||"TBD"} pro photo`];
  if(state.section==="photoOps")return [item.title||`PHOTO OP ${index+1}`,`${item.day||""} ${item.time||""} • ${item.type||""}`];
  if(state.section==="autographs")return [item.guestName||`GUEST ${index+1}`,"Flexible autograph availability"];
  if(state.section==="groupOps")return [item.title||`GROUP OP ${index+1}`,`${item.participants||""} • ${item.price||"TBD"}`];
  if(state.section==="panels")return [item.title||`PANEL ${index+1}`,`${item.day||""} ${item.startTime||""} • ${item.location||""}`];
  if(state.section==="guests")return [item.name||`Guest ${index+1}`,`${item.group||""}${item.character?` • ${item.character}`:""}`];
  if(state.section==="schedule")return [item.title||`Schedule item ${index+1}`,`${item.day||""} ${item.time||""} • ${item.location||""}`];
  if(state.section==="vendors")return [item.name||`Vendor ${index+1}`,`${item.location||""} • ${item.area||""}${item.conQuest?" • CON-QUEST":""}`];
  if(state.section==="events")return [item.title||`Event section ${index+1}`,item.category||""];
  if(state.section==="socialLinks")return [item.label||`Social Link ${index+1}`,item.url||""];
  if(state.section==="tshirts")return [item.title||`T-Shirt ${index+1}`,`${item.price||""}${item.enabled===false?" • HIDDEN":""}`];
  if(state.section==="sponsors")return [item.name||`Sponsor ${index+1}`,item.url||""];
  return [`Item ${index+1}`,""];
}

let recordDragIndex=null;

function reorderRecords(fromIndex,targetIndex,dropAfter=false){
  fromIndex=Number(fromIndex);
  targetIndex=Number(targetIndex);
  if(!Number.isInteger(fromIndex)||!Number.isInteger(targetIndex))return;
  if(fromIndex<0||targetIndex<0||fromIndex>=state.data.length||targetIndex>=state.data.length)return;
  if(fromIndex===targetIndex)return;
  if(!commitFormToState())return;

  const selectedItem=state.selectedIndex===null?null:state.data[state.selectedIndex];
  const [moved]=state.data.splice(fromIndex,1);

  let insertAt=targetIndex;
  if(fromIndex<targetIndex)insertAt-=1;
  if(dropAfter)insertAt+=1;
  insertAt=Math.max(0,Math.min(state.data.length,insertAt));
  state.data.splice(insertAt,0,moved);

  state.selectedIndex=selectedItem?state.data.indexOf(selectedItem):null;
  setDirty(true);
  renderList();
  if(state.selectedIndex!==null)renderForm();
}

function moveRecordOneStep(index,direction){
  index=Number(index);
  direction=Number(direction);
  const target=index+direction;
  if(!Number.isInteger(index)||!Number.isInteger(target)||target<0||target>=state.data.length)return;
  if(!commitFormToState())return;

  const selectedItem=state.selectedIndex===null?null:state.data[state.selectedIndex];
  [state.data[index],state.data[target]]=[state.data[target],state.data[index]];
  state.selectedIndex=selectedItem?state.data.indexOf(selectedItem):null;
  setDirty(true);
  renderList();
  if(state.selectedIndex!==null)renderForm();
}

function clearRecordDropIndicators(){
  document.querySelectorAll(".record.drag-before,.record.drag-after,.record.dragging")
    .forEach(row=>row.classList.remove("drag-before","drag-after","dragging"));
}

function renderList(){
  const q=$("#recordSearch").value.trim().toLowerCase();
  const rows=state.data.map((item,index)=>({item,index,info:recordInfo(item,index)}))
    .filter(row=>JSON.stringify(row.item).toLowerCase().includes(q));

  $("#recordCount").textContent=`${rows.length} OF ${state.data.length} ITEMS`;
  const help=$("#recordReorderHelp");
  if(help)help.textContent=q
    ? "☷ DRAG SEARCH RESULTS TO REORDER THE ORIGINAL LIST • OR USE ↑ ↓"
    : "☷ DRAG ITEMS TO REORDER • OR USE ↑ ↓";

  $("#recordList").innerHTML=rows.map(row=>`
    <div class="record ${state.selectedIndex===row.index?"active":""}"
      data-index="${row.index}" draggable="true">
      <span class="record-drag-handle" title="Drag to reorder" aria-hidden="true">☷</span>
      <button class="record-select" type="button" data-select-index="${row.index}">
        <span class="record-main">
          <span class="record-title">${escapeHtml(row.info[0])}</span>
          <span class="record-sub">${escapeHtml(row.info[1])}</span>
        </span>
      </button>
      <span class="record-order">#${row.index+1}</span>
      <span class="record-step-controls">
        <button type="button" data-move-index="${row.index}" data-move-direction="-1" ${row.index===0?"disabled":""} aria-label="Move item up">↑</button>
        <button type="button" data-move-index="${row.index}" data-move-direction="1" ${row.index===state.data.length-1?"disabled":""} aria-label="Move item down">↓</button>
      </span>
    </div>`).join("") || `<p class="muted">No matching records.</p>`;

  document.querySelectorAll("[data-select-index]").forEach(button=>{
    button.addEventListener("click",()=>selectRecord(Number(button.dataset.selectIndex)));
  });

  document.querySelectorAll("[data-move-index]").forEach(button=>{
    button.addEventListener("click",event=>{
      event.preventDefault();
      event.stopPropagation();
      moveRecordOneStep(button.dataset.moveIndex,button.dataset.moveDirection);
    });
  });

  document.querySelectorAll(".record[draggable=true]").forEach(row=>{
    row.addEventListener("dragstart",event=>{
      recordDragIndex=Number(row.dataset.index);
      row.classList.add("dragging");
      if(event.dataTransfer){
        event.dataTransfer.effectAllowed="move";
        event.dataTransfer.setData("text/plain",String(recordDragIndex));
      }
    });

    row.addEventListener("dragover",event=>{
      if(recordDragIndex===null)return;
      event.preventDefault();
      const rect=row.getBoundingClientRect();
      const after=event.clientY>rect.top+(rect.height/2);
      clearRecordDropIndicators();
      row.classList.add(after?"drag-after":"drag-before");
      const source=document.querySelector(`.record[data-index="${recordDragIndex}"]`);
      source?.classList.add("dragging");
      if(event.dataTransfer)event.dataTransfer.dropEffect="move";
    });

    row.addEventListener("drop",event=>{
      if(recordDragIndex===null)return;
      event.preventDefault();
      const rect=row.getBoundingClientRect();
      const after=event.clientY>rect.top+(rect.height/2);
      const targetIndex=Number(row.dataset.index);
      const sourceIndex=recordDragIndex;
      recordDragIndex=null;
      clearRecordDropIndicators();
      reorderRecords(sourceIndex,targetIndex,after);
    });

    row.addEventListener("dragend",()=>{
      recordDragIndex=null;
      clearRecordDropIndicators();
    });
  });
}

function selectRecord(index){
  commitFormToState();
  state.selectedIndex=index;
  renderList();
  renderForm();
}

function field(name,label,value="",type="text",full=false,help=""){
  const safe=escapeHtml(value??"");
  if(type==="textarea"){
    return `<div class="field ${full?"full":""}"><label>${label}</label><textarea name="${name}">${safe}</textarea>${help?`<span class="help">${help}</span>`:""}</div>`;
  }
  return `<div class="field ${full?"full":""}"><label>${label}</label><input type="${type}" name="${name}" value="${safe}">${help?`<span class="help">${help}</span>`:""}</div>`;
}
function selectField(name,label,value,options){
  return `<div class="field"><label>${label}</label><select name="${name}">${options.map(o=>`<option value="${escapeHtml(o)}" ${o===value?"selected":""}>${escapeHtml(o)}</option>`).join("")}</select></div>`;
}
function checkboxField(name,label,checked,help=""){
  return `<div class="field full checkbox-field"><label><input type="checkbox" name="${name}" ${checked?"checked":""}> <strong>${label}</strong></label>${help?`<span class="help">${help}</span>`:""}</div>`;
}

function renderForm(){
  const item=state.data[state.selectedIndex];
  if(!item)return;
  $("#emptyEditor").classList.add("hidden");
  const form=$("#recordForm");
  form.classList.remove("hidden");

  let fields="";
  if(state.section==="mapSettings"){
    fields=[
      checkboxField("published","PUBLISH INTERACTIVE FLOOR PLAN",item.published,"When off, the public app keeps the map hidden. Staff can still preview with ?mapPreview=1."),
      checkboxField("directoryPublished","PUBLISH VENDOR / TABLE ASSIGNMENTS",item.directoryPublished,"Keep this off until the current event vendor and celebrity location list is verified."),
      field("title","MAP TITLE",item.title,"text",true),
      field("subtitle","MAP SUBTITLE / DESCRIPTION",item.subtitle,"textarea",true),
      field("conQuestNote","CON-QUEST LEGEND NOTE",item.conQuestNote,"textarea",true),
      field("draftNote","DRAFT / PREVIEW NOTE",item.draftNote,"textarea",true)
    ].join("");
  }else if(state.section==="homeBanner"){
    fields=[
      checkboxField("enabled","SHOW CELEBRITY GUEST BANNER IN ATTENDEE APP",item.enabled!==false,"Turn this off to temporarily hide the banner without deleting the configuration."),
      checkboxField("autoUpdate","AUTO-UPDATE FROM WEBSITE ONCE PER DAY",item.autoUpdate!==false,"When enabled, the Admin Worker checks the Sci-Fi Valley Con homepage daily and replaces this image when the first guest slider banner changes."),
      field("imageUrl","CURRENT BANNER IMAGE URL",item.imageUrl||"","url",true,"You can paste a different image here and Save & Publish for a manual change."),
      field("alt","IMAGE ALT TEXT",item.alt||"Sci-Fi Valley Con celebrity guest banner","text",true),
      field("sourceUrl","WEBSITE SOURCE PAGE",item.sourceUrl||"https://scifivalleycon.com/","url",true,"Normally the Sci-Fi Valley Con homepage."),
      `<div class="field full home-banner-admin-preview">
        <label>CURRENT BANNER PREVIEW</label>
        <img src="${escapeHtml(item.imageUrl||"")}" alt="Current celebrity guest banner preview">
        <span class="help">The attendee app links this banner directly to the native Celebrity Guests page.</span>
      </div>`
    ].join("");
  }else if(state.section==="directions"){
    fields=[
      `<div class="field full directions-admin-note">
        <strong>DIRECTIONS PAGE</strong>
        <span>The attendee app opens Google Maps using universal Maps URLs. No Google Maps API key or billing integration is required.</span>
      </div>`,
      field("venueName","VENUE NAME",item.venueName||"Blair County Convention Center","text",true,"Normally Blair County Convention Center."),
      field("venueAddress","VENUE STREET ADDRESS",item.venueAddress||"1 Convention Center Dr, Altoona, PA 16602","text",true,"This is the destination used by the attendee app's driving directions button."),
      field("venueNotes","VENUE DIRECTIONS NOTE",item.venueNotes||"Parking and convention entrance destination","textarea",true,"Optional note shown with the venue destination."),
      checkboxField("shuttleEnabled","PUBLISH SHUTTLE / PARK & RIDE LOCATION",item.shuttleEnabled===true,"Turn this on only after the current event shuttle pickup location is confirmed."),
      field("shuttleName","SHUTTLE LOCATION NAME",item.shuttleName||"Shuttle Pickup / Park & Ride","text",true,"Example: Logan Valley Mall - Former Macy's Storefront"),
      field("shuttleAddress","SHUTTLE PICKUP ADDRESS",item.shuttleAddress||"","text",true,"Example from a previous event: 5580 Goods Ln, Altoona, PA 16602. Update this for each event."),
      field("shuttleNotes","SHUTTLE PICKUP INSTRUCTIONS",item.shuttleNotes||"","textarea",true,"Example: Pick up in front of the former Macy's storefront. Look for the Sci-Fi Valley Con shuttle sign."),
      field("shuttleHours","SHUTTLE HOURS / SERVICE NOTE",item.shuttleHours||"","text",true,"Optional. Example: Saturday 9:00 AM - 9:00 PM")
    ].join("");
  }else if(state.section==="settings"){
    fields=[
      field("eventName","EVENT NAME",item.eventName,"text",true,"Shown in the app header."),
      field("editionLabel","EDITION / PROGRAM LABEL",item.editionLabel,"text",true,"Example: FALL 2026 or JUNE 2027."),
      field("startDate","START DATE",item.startDate,"date",false,"The Friday/start date for this event."),
      field("endDate","END DATE",item.endDate,"date",false,"The final date for this event."),
      field("venue","VENUE",item.venue,"text",true),
      field("city","CITY",item.city,"text",false),
      field("state","STATE",item.state,"text",false,"Example: PA"),
      field("photoShop","PHOTO OP STORE URL",item.photoShop,"url",true,"Updates the main Photo Ops buttons in the attendee app."),
      field("pushApiUrl","PUSH NOTIFICATION API URL",item.pushApiUrl||"https://notify.scifivalleycon.com","url",true,"Normally https://notify.scifivalleycon.com")
    ].join("");
  }else if(state.section==="celebrityInfo"){
    fields=[
      checkboxField("published","PUBLISH CELEBRITY GUIDE",item.published,"Keep this off while the GUEST 1 / REUNION 1 placeholder data is being prepared."),
      field("statusNotice","GENERAL TENTATIVE / SUBJECT TO CHANGE NOTICE",item.statusNotice,"textarea",true),
      field("photoOpLineupMinutes","PHOTO OP LINE-UP MINUTES",item.photoOpLineupMinutes,"number",false,"Example: 15"),
      field("photoOpLocation","PHOTO OP AREA NAME",item.photoOpLocation,"text",false),
      field("photoOpLocationDetail","PHOTO OP LOCATION DETAIL",item.photoOpLocationDetail,"text",true),
      field("photoOpUpdatePoint","PHOTO OP UPDATE / CHECK-IN POINT",item.photoOpUpdatePoint,"text",true),
      field("photoOpNotice","PHOTO OP NOTICE",item.photoOpNotice,"textarea",true),
      field("autographNotice","AUTOGRAPH SCHEDULE NOTICE",item.autographNotice,"textarea",true),
      field("panelRoom","DEFAULT CELEBRITY PANEL ROOM",item.panelRoom,"text",false),
      field("panelNotice","PANEL SCHEDULE NOTICE",item.panelNotice,"textarea",true),
      field("panelSeatingNote","PANEL SEATING / PASS POLICY",item.panelSeatingNote,"textarea",true),
      field("generalNote","PRICING / CELEBRITY GUIDE FOOTNOTE",item.generalNote,"textarea",true)
    ].join("");
  }else if(state.section==="pricing"){
    fields=[
      field("guestName","GUEST NAME",item.guestName,"text",true,"Use the exact celebrity name once finalized."),
      field("autograph","AUTOGRAPH PRICE",item.autograph,"text",false),
      field("selfie","SELFIE PRICE",item.selfie,"text",false),
      field("combo","COMBO PRICE",item.combo,"text",false),
      field("proPhoto","PRO PHOTO OP PRICE",item.proPhoto,"text",false),
      field("notes","OPTIONAL PRICE NOTES",item.notes,"textarea",true)
    ].join("");
  }else if(state.section==="photoOps"){
    fields=[
      selectField("day","DAY",item.day||"Friday",["Friday","Saturday","Sunday"]),
      field("time","START TIME",item.time,"text",false,"Use format like 3:00 PM."),
      field("title","GUEST / DUO / REUNION NAME",item.title,"text",true),
      selectField("type","PHOTO OP TYPE",item.type||"Solo",["Solo","Duo","Reunion","Group","Other"]),
      field("notes","OPTIONAL NOTES",item.notes,"textarea",true)
    ].join("");
  }else if(state.section==="autographs"){
    fields=[
      field("guestName","GUEST NAME",item.guestName,"text",true),
      field("Friday","FRIDAY AVAILABILITY",item.Friday,"textarea",true,"Use a new line for each flexible autograph window."),
      field("Saturday","SATURDAY AVAILABILITY",item.Saturday,"textarea",true),
      field("Sunday","SUNDAY AVAILABILITY",item.Sunday,"textarea",true)
    ].join("");
  }else if(state.section==="groupOps"){
    fields=[
      field("title","GROUP / DUO NAME",item.title,"text",true),
      field("participants","PARTICIPATING GUESTS",item.participants,"textarea",true),
      field("price","PRO PHOTO OP PRICE",item.price,"text",false),
      field("notes","OPTIONAL NOTES",item.notes,"textarea",true)
    ].join("");
  }else if(state.section==="panels"){
    fields=[
      selectField("day","DAY",item.day||"Friday",["Friday","Saturday","Sunday"]),
      field("startTime","START TIME",item.startTime,"text",false,"Use format like 1:30 PM."),
      field("endTime","END TIME",item.endTime,"text",false),
      field("title","PANEL TITLE",item.title,"text",true),
      field("location","PANEL ROOM / LOCATION",item.location,"text",true),
      field("participants","PARTICIPANTS",item.participants,"text",true),
      field("description","PANEL DESCRIPTION",item.description,"textarea",true)
    ].join("");
  }else   if(state.section==="guests"){
    fields=[
      field("name","NAME",item.name,"text",false),
      field("group","REUNION / GROUP",item.group,"text",false),
      field("character","CHARACTER / ROLE",item.character,"text",true),
      field("knownFor","KNOWN FOR",item.knownFor,"text",true),
      field("bio","BIO",item.bio,"textarea",true),
      field("photo","PROFILE PHOTO URL",item.photo,"url",true,"Paste the full image URL used by the attendee app."),
      field("imdb","IMDb URL",item.imdb,"url",false),
      field("instagram","INSTAGRAM URL",item.instagram,"url",false),
      field("photoOp","PHOTO OP PRICE",item.photoOp,"text",false,'Example: $75'),
      field("photoShop","PHOTO OP ORDER URL",item.photoShop,"url",false)
    ].join("");
  }else if(state.section==="schedule"){
    fields=[
      field("id","PERMANENT EVENT ID",item.id||"","text",true,"Keep this ID unchanged when editing the event time or room. Device reminders follow this ID."),
      selectField("day","DAY",item.day||"Friday",["Friday","Saturday","Sunday"]),
      field("time","TIME",item.time,"text",false,"Use format like 3:30 PM."),
      field("title","TITLE",item.title,"text",true),
      field("location","LOCATION",item.location,"text",false),
      field("category","CATEGORY",item.category,"text",false)
    ].join("");
  }else if(state.section==="vendors"){
    fields=[
      field("name","VENDOR / ARTIST / GUEST NAME",item.name,"text",true),
      field("location","TABLE / BOOTH LOCATION",item.location,"text",false,"Examples: A1, B2-B3, X11-X12. Multiple ranges may be comma-separated."),
      field("totalTables","TOTAL TABLES / BOOTHS",item.totalTables??"","number",false,"Imported automatically when your spreadsheet includes a Total Tables column."),
      selectField("area","MAP AREA",item.area||"Main Level",["Main Level","Lower Level","Patio","Celebrity Guest Alley","Convention Services","Other"]),
      selectField("type","LOCATION TYPE",item.type||"Vendor / Artist",["Vendor / Artist","Outdoor Vendor","Celebrity","Service","Food","Gaming","Other"]),
      checkboxField("conQuest","CON-QUEST PARTICIPANT",item.conQuest,"When checked, this vendor's table/booth markers are shaded red on the public vector map."),
      field("description","VENDOR DESCRIPTION / ITEMS FOR SALE",item.description||"","textarea",true,"Imported from the spreadsheet Description column and displayed in the attendee vendor popup."),
      field("categories","PRODUCTS / CATEGORIES",item.categories,"text",true,"Optional keywords used by attendee map search."),
      field("notes","OPTIONAL PUBLIC NOTES",item.notes||"","textarea",true)
    ].join("");
  }else if(state.section==="events"){
    fields=[
      field("id","ID / SLUG",item.id,"text",false,"Keep existing IDs stable whenever possible."),
      field("category","CATEGORY",item.category,"text",false),
      field("title","TITLE",item.title,"text",true),
      field("summary","SHORT SUMMARY",item.summary,"textarea",true),
      `<div class="field full"><label>CONTENT BLOCKS (JSON)</label><textarea class="code" name="contentJson">${escapeHtml(JSON.stringify(item.content||[],null,2))}</textarea><span class="help">Advanced field. This preserves menus, schedules, lists and other rich content blocks.</span></div>`
    ].join("");
  }else if(state.section==="socialLinks"){
    fields=[
      field("id","ID / SLUG",item.id||"","text",false,"Stable internal ID such as instagram or facebook-group."),
      selectField("platform","PLATFORM",item.platform||"facebook",[
        "facebook","facebook-group","facebook-event","instagram","youtube","threads","bluesky","tiktok","other"
      ]),
      field("label","DISPLAY LABEL",item.label||"","text",true,"Example: Facebook Group"),
      field("subtitle","SHORT SUBTITLE",item.subtitle||"","text",true,"Example: JOIN THE COMMUNITY"),
      field("url","SOCIAL MEDIA URL",item.url||"","url",true),
      checkboxField("enabled","SHOW IN ATTENDEE APP",item.enabled!==false,"Turn this off to temporarily hide the link without deleting it.")
    ].join("");
  }else if(state.section==="faq"){
    fields=[
      field("id","ID / SLUG",item.id||"","text",false,"Stable internal ID such as ticket-refunds."),
      field("category","CATEGORY",item.category||"General","text",false,"Examples: Tickets, Venue, Guests, Policies, Safety"),
      field("question","QUESTION",item.question||"","text",true),
      field("answer","ANSWER",item.answer||"","textarea",true,"Use blank lines to separate paragraphs. You may use {EVENT_DATES} to insert the current event date range automatically."),
      field("bullets","BULLET LIST",Array.isArray(item.bullets)?item.bullets.join("\n"):"","textarea",true,"Optional. Enter one bullet per line."),
      checkboxField("enabled","SHOW IN ATTENDEE APP",item.enabled!==false,"Turn this off to hide the FAQ without deleting it."),
      `<div class="field full faq-source-note">
        <strong>WEBSITE SOURCE</strong>
        <a href="https://scifivalleycon.com/faq" target="_blank" rel="noopener">Open the public Sci-Fi Valley Con FAQ ↗</a>
        <span>The app FAQ is now editable independently in Program Admin. Changes here update the app, not the external website.</span>
      </div>`
    ].join("");
  }else if(state.section==="tshirts"){
    fields=[
      field("id","ID / SLUG",item.id||"","text",false,"Stable internal ID. Auto-synced Ecwid items use ecwid-PRODUCTID."),
      field("title","SHIRT TITLE",item.title||"","text",true,"Example: SFVC 2026 Fall Black Shirt"),
      field("price","DISPLAY PRICE",item.price||"","text",false,"Example: $25.00"),
      field("url","PRODUCT / BUY URL",item.url||"","url",true),
      field("image","MAIN SHIRT IMAGE URL",item.image||"","url",true,"Auto-synced products receive this from the Ecwid catalog."),
      field("badge","BADGE / YEAR",item.badge||"","text",false,"Example: 2026 or NEW"),
      field("description","DESCRIPTION",item.description||"","textarea",true),
      checkboxField("enabled","SHOW IN ATTENDEE APP",item.enabled!==false,"Turn this off to hide the shirt without deleting it."),
      item.source==="ecwid"
        ? `<div class="field full sync-source-note"><strong>AUTO-SYNCED FROM ECWID</strong><span>Product ID ${escapeHtml(item.sourceProductId||"")} • ${item.inStock===false?"Out of stock":"Available"}</span></div>`
        : `<div class="field full sync-source-note manual"><strong>MANUAL LISTING</strong><span>This record will be preserved when the daily store sync runs.</span></div>`
    ].join("");
  }else if(state.section==="sponsors"){
    fields=[
      field("id","ID / SLUG",item.id||"","text",false,"Stable internal ID for this sponsor."),
      field("name","SPONSOR NAME",item.name,"text",true),
      field("url","COMPANY URL",item.url,"url",true),
      field("logo","LOGO IMAGE URL",item.logo,"url",true,"Leave blank to display the sponsor as a styled text wordmark."),
      field("label","OPTIONAL LABEL",item.label,"text",false),
      checkboxField("enabled","SHOW IN ATTENDEE APP",item.enabled!==false,"Turn this off to temporarily hide the sponsor without deleting it.")
    ].join("");
  }

  form.innerHTML=`
    <div class="form-head">
      <h3>${escapeHtml(recordInfo(item,state.selectedIndex)[0])}</h3>
      ${state.section==="settings"||state.section==="directions"||state.section==="celebrityInfo"||state.section==="mapSettings"?"":'<button type="button" class="btn danger small" id="deleteRecordButton">Delete</button>'}
    </div>
    <div class="fields">${fields}</div>`;

  form.querySelectorAll("input,textarea,select").forEach(el=>{
    el.addEventListener("input",()=>{setDirty(true);});
    el.addEventListener("change",()=>{setDirty(true);});
  });
  $("#deleteRecordButton")?.addEventListener("click",deleteCurrentRecord);
}

function commitFormToState(){
  const form=$("#recordForm");
  if(state.selectedIndex===null||form.classList.contains("hidden"))return true;
  const item=state.data[state.selectedIndex];
  if(!item)return true;
  const fd=new FormData(form);

  try{
    if(state.section==="mapSettings"){
      item.published=fd.get("published")==="on";
      item.directoryPublished=fd.get("directoryPublished")==="on";
      ["title","subtitle","conQuestNote","draftNote"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
    }else if(state.section==="homeBanner"){
      item.enabled=fd.get("enabled")==="on";
      item.autoUpdate=fd.get("autoUpdate")==="on";
      ["imageUrl","alt","sourceUrl"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
      item.linkTarget="guests";
      item.sourceMode=item.autoUpdate?"website-auto":"manual";
    }else if(state.section==="directions"){
      ["venueName","venueAddress","venueNotes","shuttleName","shuttleAddress","shuttleNotes","shuttleHours"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
      item.shuttleEnabled=fd.get("shuttleEnabled")==="on";
    }else if(state.section==="settings"){
      ["eventName","editionLabel","startDate","endDate","venue","city","state","photoShop","pushApiUrl"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
    }else if(state.section==="celebrityInfo"){
      item.published=fd.get("published")==="on";
      ["statusNotice","photoOpLineupMinutes","photoOpLocation","photoOpLocationDetail","photoOpUpdatePoint","photoOpNotice","autographNotice","panelRoom","panelNotice","panelSeatingNote","generalNote"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
    }else if(state.section==="pricing"){
      ["guestName","autograph","selfie","combo","proPhoto","notes"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
    }else if(state.section==="photoOps"){
      ["day","time","title","type","notes"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
    }else if(state.section==="autographs"){
      ["guestName","Friday","Saturday","Sunday"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
    }else if(state.section==="groupOps"){
      ["title","participants","price","notes"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
    }else if(state.section==="panels"){
      ["day","startTime","endTime","title","location","participants","description"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
    }else if(state.section==="guests"){
      ["name","group","character","knownFor","bio","photo","imdb","instagram","photoOp","photoShop"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
    }else if(state.section==="schedule"){
      ["id","day","time","title","location","category"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
      if(!item.id)item.id=`sched-${Date.now()}`;
    }else if(state.section==="vendors"){
      ["name","description","categories","location","area","type","notes"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
      const totalTables=String(fd.get("totalTables")||"").trim(); item.totalTables=totalTables===""?null:Number(totalTables);
      item.conQuest=fd.get("conQuest")==="on";
    }else if(state.section==="events"){
      ["id","category","title","summary"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
      item.content=JSON.parse(String(fd.get("contentJson")||"[]"));
      if(!Array.isArray(item.content))throw new Error("Event content blocks must be a JSON array.");
    }else if(state.section==="socialLinks"){
      ["id","platform","label","subtitle","url"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
      if(!item.id)item.id=`social-${Date.now()}`;
      item.enabled=fd.get("enabled")==="on";
    }else if(state.section==="faq"){
      ["id","category","question","answer"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
      if(!item.id)item.id=`faq-${Date.now()}`;
      item.bullets=String(fd.get("bullets")||"").split(/\r?\n/).map(v=>v.trim()).filter(Boolean);
      item.enabled=fd.get("enabled")==="on";
      item.sourceUrl=item.sourceUrl||"https://scifivalleycon.com/faq";
      item.sourceUpdatedAt=item.sourceUpdatedAt||new Date().toISOString();
    }else if(state.section==="tshirts"){
      ["id","title","price","url","image","badge","description"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
      if(!item.id)item.id=`tshirt-${Date.now()}`;
      item.enabled=fd.get("enabled")==="on";
    }else if(state.section==="sponsors"){
      ["id","name","url","logo","label"].forEach(k=>item[k]=String(fd.get(k)||"").trim());
      if(!item.id)item.id=`sponsor-${Date.now()}`;
      item.enabled=fd.get("enabled")==="on";
    }
    return true;
  }catch(err){
    setStatus(err.message,"error");
    return false;
  }
}

function newItem(){
  if(state.section==="settings"||state.section==="homeBanner"||state.section==="celebrityInfo"||state.section==="mapSettings"||state.section==="mapLayout")return;
  if(!commitFormToState())return;
  let item={};
  if(state.section==="pricing")item={id:`price-${Date.now()}`,guestName:"NEW GUEST",autograph:"TBD",selfie:"TBD",combo:"TBD",proPhoto:"TBD",notes:""};
  if(state.section==="photoOps")item={id:`photo-${Date.now()}`,day:"Friday",time:"12:00 PM",title:"NEW PHOTO OP",type:"Solo",notes:""};
  if(state.section==="autographs")item={id:`auto-${Date.now()}`,guestName:"NEW GUEST",Friday:"",Saturday:"",Sunday:""};
  if(state.section==="groupOps")item={id:`group-${Date.now()}`,title:"NEW GROUP OP",participants:"",price:"TBD",notes:""};
  if(state.section==="panels")item={id:`panel-${Date.now()}`,day:"Friday",startTime:"12:00 PM",endTime:"1:00 PM",title:"NEW PANEL",location:"PANEL ROOM 1",participants:"",description:""};
  if(state.section==="guests")item={id:`guest-${Date.now()}`,name:"New Guest",group:"",character:"",knownFor:"",bio:"",photo:"",imdb:"",instagram:"",photoOp:"",photoShop:""};
  if(state.section==="schedule")item={id:`sched-${Date.now()}`,day:"Friday",time:"12:00 PM",title:"New Schedule Item",location:"",category:""};
  if(state.section==="vendors")item={id:`map-${Date.now()}`,name:"New Vendor",description:"",categories:"",location:"",totalTables:1,area:"Main Level",type:"Vendor / Artist",conQuest:false,notes:""};
  if(state.section==="events")item={id:`event-${Date.now()}`,title:"New Event Section",category:"Activities",summary:"",content:[]};
  if(state.section==="socialLinks")item={id:`social-${Date.now()}`,platform:"facebook",label:"New Social Link",subtitle:"",url:"",enabled:true};
  if(state.section==="faq")item={id:`faq-${Date.now()}`,category:"General",question:"New FAQ Question",answer:"",bullets:[],enabled:true,sourceUrl:"https://scifivalleycon.com/faq",sourceUpdatedAt:new Date().toISOString()};
  if(state.section==="tshirts")item={id:`tshirt-${Date.now()}`,title:"New Official T-Shirt",price:"$25.00",url:"",image:"",badge:"NEW",description:"",enabled:true};
  if(state.section==="sponsors")item={id:`sponsor-${Date.now()}`,name:"New Sponsor",url:"",logo:"",label:"",enabled:true};
  state.data.push(item);
  state.selectedIndex=state.data.length-1;
  setDirty(true);
  renderList();
  renderForm();
}

async function deleteCurrentRecord(){
  if(state.section==="settings"||state.section==="homeBanner"||state.section==="celebrityInfo"||state.section==="mapSettings"||state.section==="mapLayout")return;
  if(state.selectedIndex===null)return;
  const item=state.data[state.selectedIndex];
  const name=recordInfo(item,state.selectedIndex)[0];
  $("#confirmTitle").textContent=`Delete ${SECTIONS[state.section].singular}?`;
  $("#confirmText").textContent=`Remove "${name}" from this section? The deletion is not published until you click Save & Publish.`;
  const dialog=$("#confirmDialog");
  dialog.showModal();
  dialog.addEventListener("close",()=>{
    if(dialog.returnValue==="confirm"){
      state.data.splice(state.selectedIndex,1);
      state.selectedIndex=null;
      $("#recordForm").classList.add("hidden");
      $("#emptyEditor").classList.remove("hidden");
      setDirty(true);
      renderList();
    }
  },{once:true});
}

async function saveSection(){
  if(!state.authenticated){setStatus("You are not authenticated through Cloudflare Access.","error");return;}
  if(!commitFormToState())return;

  $("#saveButton").disabled=true;
  $("#saveButton").textContent="Publishing…";
  try{
    const result=await api(`/api/content/${state.section}`,{
      method:"POST",
      body:JSON.stringify({data:state.data})
    });
    state.currentSha=result.sha||null;
    state.exists=true;
    setDirty(false);
    if(result.versionBumped===false){
      setStatus(`Published, but the attendee-app version marker could not be refreshed automatically: ${result.versionWarning||"unknown error"}. Open apps will still receive the 10-minute fallback refresh.`,"error");
    }else{
      setStatus(`Published successfully. GitHub commit ${String(result.commit||"").slice(0,7)} created and attendee apps were flagged to refresh.`,"success");
    }
    loadHistory();
  }catch(err){
    setStatus(err.message,"error");
  }finally{
    $("#saveButton").disabled=false;
    $("#saveButton").textContent="Save & Publish";
  }
}

async function loadHistory(){
  $("#historyList").innerHTML=`<p class="muted">Loading history…</p>`;
  try{
    const result=await api(`/api/history?type=${encodeURIComponent(state.section)}`);
    const items=result.commits||[];
    $("#historyList").innerHTML=items.map(c=>`
      <div class="history-item">
        <div><strong>${escapeHtml(c.message)}</strong><small>${escapeHtml(c.author||"")} • ${new Date(c.date).toLocaleString()}</small></div>
        <small>${escapeHtml(c.sha.slice(0,7))}</small>
      </div>`).join("")||`<p class="muted">No commits found for this file.</p>`;
  }catch(err){
    $("#historyList").innerHTML=`<p class="muted">${escapeHtml(err.message)}</p>`;
  }
}

function downloadBackup(){
  commitFormToState();
  const blob=new Blob([JSON.stringify(state.data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=`sfvc-${state.section}-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}


async function loadBroadcastDashboard(){
  $("#pushSubscriberCount").textContent="—";
  $("#pushLastBroadcast").textContent="LOADING";
  $("#broadcastHistoryList").innerHTML=`<p class="muted">Loading push service…</p>`;
  try{
    const [stats,history]=await Promise.all([api("/api/push/stats"),api("/api/push/history")]);
    $("#pushSubscriberCount").textContent=String(stats.subscribers??0);
    const last=history.broadcasts?.[0];
    $("#pushLastBroadcast").textContent=last?new Date(last.created_at).toLocaleString():"NONE";
    renderBroadcastHistory(history.broadcasts||[]);
  }catch(err){
    $("#pushSubscriberCount").textContent="OFFLINE";
    $("#pushLastBroadcast").textContent="NOT CONNECTED";
    $("#broadcastHistoryList").innerHTML=`<p class="muted">${escapeHtml(err.message)}</p>`;
    setStatus(err.message,"error");
  }
}
function renderBroadcastHistory(items){
  $("#broadcastHistoryList").innerHTML=items.map(b=>{
    const removed=Boolean(Number(b.hidden_from_updates||0));
    return `<div class="broadcast-history-item ${removed?"removed-from-apps":""}">
      <div class="broadcast-history-copy">
        <div class="broadcast-history-title-row">
          <strong>${escapeHtml(b.title)}</strong>
          ${removed?'<span class="broadcast-removed-badge">REMOVED FROM APPS</span>':""}
        </div>
        <p>${escapeHtml(b.body)}</p>
        <small>${new Date(b.created_at).toLocaleString()}${removed&&b.hidden_at?` • Removed ${new Date(b.hidden_at).toLocaleString()}`:""}</small>
      </div>
      <div class="broadcast-history-actions">
        <div class="broadcast-results">
          <b>${b.queued_count||0}</b><small>QUEUED</small>
          <b>${b.delivered_count||0}</b><small>DELIVERED</small>
          <b>${b.failed_count||0}</b><small>FAILED</small>
        </div>
        ${removed
          ? '<span class="broadcast-remove-complete">NO LONGER SHOWN IN RECENT ALERTS</span>'
          : `<button class="btn small danger broadcast-remove-button" type="button" data-remove-broadcast="${Number(b.id||0)}">REMOVE FROM ALL APPS</button>`}
      </div>
    </div>`;
  }).join("")||`<p class="muted">No broadcasts have been sent yet.</p>`;

  document.querySelectorAll("[data-remove-broadcast]").forEach(button=>{
    button.addEventListener("click",()=>removeBroadcastFromApps(Number(button.dataset.removeBroadcast||0)));
  });
}

async function removeBroadcastFromApps(broadcastId){
  if(!broadcastId)return;

  if(!confirm(
    "Remove this update from RECENT EVENT ALERTS on all attendee apps?\\n\\n"+
    "This also stops any queued copies that have not been delivered yet. "+
    "Notifications already shown by a phone's operating system cannot be remotely erased."
  ))return;

  const button=document.querySelector(`[data-remove-broadcast="${broadcastId}"]`);
  if(button){
    button.disabled=true;
    button.textContent="REMOVING…";
  }

  try{
    const result=await api("/api/push/remove",{
      method:"POST",
      body:JSON.stringify({broadcastId})
    });

    setStatus(
      `Broadcast removed from Recent Event Alerts on all apps. ${
        result.futureQueuedDeliveriesSuppressed?"Any not-yet-delivered queued copies will also be suppressed.":""
      }`,
      "success"
    );

    await loadBroadcastDashboard();
  }catch(err){
    setStatus(`Could not remove broadcast: ${err.message}`,"error");
    if(button){
      button.disabled=false;
      button.textContent="REMOVE FROM ALL APPS";
    }
  }
}
async function sendPushBroadcast(){
  const title=$("#broadcastTitle").value.trim();
  const body=$("#broadcastMessage").value.trim();
  const url=$("#broadcastUrl").value.trim()||"/";
  const urgency=$("#broadcastUrgency").value;
  const tag=$("#broadcastTag").value.trim()||"sfvc-update";

  if(!title||!body){setStatus("A title and message are required.","error");return}
  if(!$("#broadcastConfirm").checked){setStatus("Confirm that you intend to send this notification to all subscribers.","error");return}
  if(!confirm(`Send this push notification to ALL subscribed devices?\n\n${title}\n${body}`))return;

  const btn=$("#sendBroadcastButton");
  btn.disabled=true;
  btn.textContent="QUEUEING BROADCAST…";
  try{
    const result=await api("/api/push/send",{
      method:"POST",
      body:JSON.stringify({title,body,url,urgency,tag})
    });
    setStatus(`Broadcast queued for ${result.queued||0} subscribed devices.`,"success");
    $("#broadcastMessage").value="";
    $("#broadcastCharCount").textContent="0";
    $("#broadcastConfirm").checked=false;
    await loadBroadcastDashboard();
  }catch(err){
    setStatus(err.message,"error");
  }finally{
    btn.textContent="SEND PUSH TO ALL SUBSCRIBERS";
    btn.disabled=!$("#broadcastConfirm").checked;
  }
}


let analyticsRefreshTimer=null;

async function loadAnalyticsDashboard(){
  clearInterval(analyticsRefreshTimer);
  $("#analyticsActiveNow").textContent="—";
  $("#analyticsTodayUsers").textContent="—";
  $("#analyticsPeakActive").textContent="—";
  $("#analyticsPushSubscribers").textContent="—";
  $("#analyticsUpdated").textContent="Loading analytics…";

  try{
    const [stats,history]=await Promise.all([
      api("/api/analytics/stats"),
      api("/api/analytics/history")
    ]);

    $("#analyticsActiveNow").textContent=String(stats.activeNow??0);
    $("#analyticsTodayUsers").textContent=String(stats.todayUsers??0);
    $("#analyticsPeakActive").textContent=String(stats.peakActiveToday??0);
    $("#analyticsPushSubscribers").textContent=String(stats.pushSubscribers??0);
    $("#analyticsUpdated").textContent=`Updated ${new Date(stats.generatedAt).toLocaleTimeString()} • Active window ${stats.activeWindowMinutes||5} min`;
    $("#analyticsHeartbeatStatus").textContent=stats.lastHeartbeatAt
      ? `LAST APP HEARTBEAT: ${new Date(stats.lastHeartbeatAt).toLocaleString()}`
      : "LAST APP HEARTBEAT: NONE RECEIVED YET";

    renderAnalyticsHistory(history.days||[]);

    // Keep Active Now reasonably fresh while staff leaves this dashboard open.
    analyticsRefreshTimer=setInterval(async()=>{
      if(state.section!=="analytics"){clearInterval(analyticsRefreshTimer);return}
      try{
        const live=await api("/api/analytics/stats");
        $("#analyticsActiveNow").textContent=String(live.activeNow??0);
        $("#analyticsTodayUsers").textContent=String(live.todayUsers??0);
        $("#analyticsPeakActive").textContent=String(live.peakActiveToday??0);
        $("#analyticsPushSubscribers").textContent=String(live.pushSubscribers??0);
        $("#analyticsUpdated").textContent=`Updated ${new Date(live.generatedAt).toLocaleTimeString()} • Active window ${live.activeWindowMinutes||5} min`;
        $("#analyticsHeartbeatStatus").textContent=live.lastHeartbeatAt
          ? `LAST APP HEARTBEAT: ${new Date(live.lastHeartbeatAt).toLocaleString()}`
          : "LAST APP HEARTBEAT: NONE RECEIVED YET";
      }catch{}
    },60000);
  }catch(err){
    $("#analyticsUpdated").textContent="Analytics service unavailable.";
    setStatus(err.message,"error");
  }
}

function renderAnalyticsHistory(days){
  const body=$("#analyticsHistoryBody");
  body.innerHTML=days.map(row=>`
    <tr>
      <td>${escapeHtml(row.day)}</td>
      <td><strong>${Number(row.unique_users||0).toLocaleString()}</strong></td>
      <td>${Number(row.peak_active||0).toLocaleString()}</td>
    </tr>`).join("")||`<tr><td colspan="3">No usage data has been recorded yet.</td></tr>`;

  const firstSeven=days.slice(0,7);
  const avg=firstSeven.length
    ? Math.round(firstSeven.reduce((sum,row)=>sum+Number(row.unique_users||0),0)/firstSeven.length)
    : 0;

  $("#analyticsSevenDayAverage").textContent=firstSeven.length?avg.toLocaleString():"—";
  $("#analyticsDaysRecorded").textContent=String(days.length);
}


function getMapDoc(){
  if(!state.data[0])state.data[0]={id:"layout-1",canvas:{width:1200,height:1780,defaultWidth:820},elements:[],locations:[]};
  if(!Array.isArray(state.data[0].elements))state.data[0].elements=[];
  if(!Array.isArray(state.data[0].locations))state.data[0].locations=[];
  return state.data[0];
}
function mapLabelItems(){return getMapDoc().elements.filter(item=>item.type==="text");}
function mapShapeItems(){return getMapDoc().elements.filter(item=>item.type==="rect"||item.type==="path");}

function mapModeItems(mode=state.mapLayoutMode){
  if(mode==="locations")return getMapDoc().locations;
  if(mode==="labels")return mapLabelItems();
  return mapShapeItems();
}

function clearMapLayoutSelection(){
  state.mapLayoutSelectedItems=new Set();
  state.mapLayoutPrimaryItem=null;
  state.mapLayoutSelectedId="";
}

function setMapSingleSelection(item){
  state.mapLayoutSelectedItems=new Set();
  if(item)state.mapLayoutSelectedItems.add(item);
  state.mapLayoutPrimaryItem=item||null;
  state.mapLayoutSelectedId=item?.id||"";
}

function currentMapItem(){
  const source=mapModeItems();
  if(state.mapLayoutPrimaryItem&&source.includes(state.mapLayoutPrimaryItem))return state.mapLayoutPrimaryItem;
  return source.find(x=>x.id===state.mapLayoutSelectedId)||null;
}

function mapSelectionItems(){
  const source=mapModeItems();
  const selected=source.filter(item=>state.mapLayoutSelectedItems?.has(item));
  if(selected.length)return selected;
  const current=currentMapItem();
  return current?[current]:[];
}

function mapItemIsSelected(item){
  if(!item)return false;
  if(state.mapLayoutSelectedItems?.size)return state.mapLayoutSelectedItems.has(item);
  return item===state.mapLayoutPrimaryItem||(!state.mapLayoutPrimaryItem&&item.id===state.mapLayoutSelectedId);
}

function toggleMapMultiSelection(item){
  if(!item)return;
  if(!state.mapLayoutSelectedItems)state.mapLayoutSelectedItems=new Set();

  // Bring an existing single selection into the Set before starting a Shift selection.
  if(state.mapLayoutSelectedItems.size===0){
    const current=currentMapItem();
    if(current)state.mapLayoutSelectedItems.add(current);
  }

  if(state.mapLayoutSelectedItems.has(item)){
    state.mapLayoutSelectedItems.delete(item);
  }else{
    state.mapLayoutSelectedItems.add(item);
  }

  const selected=[...state.mapLayoutSelectedItems];
  state.mapLayoutPrimaryItem=state.mapLayoutSelectedItems.has(item)
    ? item
    : (selected[selected.length-1]||null);
  state.mapLayoutSelectedId=state.mapLayoutPrimaryItem?.id||"";
}

function setMapLayoutMode(mode){
  if(state.mapLayoutMode!==mode){
    state.mapLayoutMode=mode;
    clearMapLayoutSelection();
  }
}

function mapItemFromSvgRoot(root){
  if(!root)return null;
  if(root.dataset.mapLocationIndex!==undefined){
    return {mode:"locations",item:getMapDoc().locations[Number(root.dataset.mapLocationIndex)]||null};
  }
  if(root.dataset.mapLabelIndex!==undefined){
    return {mode:"labels",item:getMapDoc().elements[Number(root.dataset.mapLabelIndex)]||null};
  }
  if(root.dataset.mapShapeIndex!==undefined){
    return {mode:"shapes",item:getMapDoc().elements[Number(root.dataset.mapShapeIndex)]||null};
  }
  return null;
}

function mapSvgRootForItem(svg,item){
  if(!svg||!item)return null;
  if(state.mapLayoutMode==="locations"){
    const index=getMapDoc().locations.indexOf(item);
    return index>=0?svg.querySelector(`[data-map-location-index="${index}"]`):null;
  }

  const index=getMapDoc().elements.indexOf(item);
  if(index<0)return null;
  return item.type==="text"
    ? svg.querySelector(`[data-map-label-index="${index}"]`)
    : svg.querySelector(`[data-map-shape-index="${index}"]`);
}
function mapSvgEscape(v=""){return escapeHtml(v)}
function mapAdminElementTransform(item){
  const tx=Number(item.translateX||0),ty=Number(item.translateY||0),sx=Number(item.scaleX??1),sy=Number(item.scaleY??1),ox=Number(item.originX||0),oy=Number(item.originY||0),rot=Number(item.rotation||0);
  const parts=[];if(tx||ty)parts.push(`translate(${tx} ${ty})`);if(rot)parts.push(`rotate(${rot} ${ox} ${oy})`);if(sx!==1||sy!==1)parts.push(`translate(${ox} ${oy}) scale(${sx} ${sy}) translate(${-ox} ${-oy})`);return parts.length?` transform="${parts.join(' ')}"`:'';
}
function adminMapCodeFontSize(code,w,h){
  const shortest=Math.max(8,Math.min(Number(w||20),Number(h||12)));
  const byShape=Math.max(6,Math.min(10,shortest*.70));
  return Math.max(5.5,byShape-(String(code).length>2?.8:0));
}
function adminMapLabelY(loc,cy){
  const raw=loc?.labelDy;
  if(raw===null||raw===undefined||String(raw).trim()==="")return cy;
  const offset=Number(raw);
  return Number.isFinite(offset)?cy+offset:cy;
}
function buildAdminMapSvg(){
  const doc=getMapDoc(), canvas=doc.canvas||{}, w=Number(canvas.width||1200), h=Number(canvas.height||1780), out=[];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">`);
  out.push(`<style>
    .outline{fill:#fffdf4;stroke:#352720;stroke-width:5;stroke-linejoin:round}.zone{stroke:#352720;stroke-width:4}.zone-label,.level-label,.tiny{fill:#291f1a;text-anchor:middle}.zone-label{font-family:Georgia,serif;font-weight:800}.level-label{font-family:Arial,sans-serif;font-weight:900;letter-spacing:2px}.hall-floor{fill:#ebe8dd;stroke:#352720;stroke-width:4}.stairs{fill:#fffdf4;stroke:#352720;stroke-width:3}.tiny{font-family:Arial,sans-serif;font-size:12px;font-weight:800}.map-table{fill:#fffdf6;stroke:#40322b;stroke-width:2;cursor:grab}.map-table-label{font-family:Arial,sans-serif;font-weight:900;fill:#201916;text-anchor:middle;dominant-baseline:middle;pointer-events:none;paint-order:stroke;stroke:#fffdf4;stroke-width:1.5px;stroke-linejoin:round}.map-label-hit,.map-shape-hit{cursor:grab}.map-editor-selected{stroke:#1f6e77 !important;stroke-width:7 !important;filter:drop-shadow(0 0 3px rgba(31,110,119,.55))}.map-editor-hidden{opacity:.25}.service{fill:#f2bd3f;stroke:#352720;stroke-width:3}.map-resize-outline{fill:none;stroke:#1f6e77;stroke-width:2;stroke-dasharray:8 5;pointer-events:none}.map-resize-handle{fill:#fff7df;stroke:#1f6e77;stroke-width:2}.map-resize-handle[data-map-resize="n"],.map-resize-handle[data-map-resize="s"]{cursor:ns-resize}.map-resize-handle[data-map-resize="e"],.map-resize-handle[data-map-resize="w"]{cursor:ew-resize}.map-resize-handle[data-map-resize="nw"],.map-resize-handle[data-map-resize="se"]{cursor:nwse-resize}.map-resize-handle[data-map-resize="ne"],.map-resize-handle[data-map-resize="sw"]{cursor:nesw-resize}
  </style>`);
  (doc.elements||[]).forEach((item,itemIndex)=>{
    const isShape=item.type==='rect'||item.type==='path',selected=state.mapLayoutMode==='shapes'&&mapItemIsSelected(item),hidden=item.hidden===true;
    const baseClass=item.className||'';const extra=`${isShape?' map-shape-hit':''}${selected?' map-editor-selected':''}${hidden?' map-editor-hidden':''}`;
    const cls=` class="${mapSvgEscape((baseClass+extra).trim())}"`;const fill=item.fill?` fill="${mapSvgEscape(item.fill)}"`:'';const transform=mapAdminElementTransform(item);const data=isShape?` data-map-shape-id="${mapSvgEscape(item.id)}" data-map-shape-index="${itemIndex}"`:'';
    if(item.type==='rect')out.push(`<rect id="${mapSvgEscape(item.id)}"${data}${cls} x="${Number(item.x)||0}" y="${Number(item.y)||0}" width="${Number(item.width)||0}" height="${Number(item.height)||0}" rx="${Number(item.rx||0)}"${fill}${transform}/>`);
    else if(item.type==='path')out.push(`<path id="${mapSvgEscape(item.id)}"${data}${cls} d="${mapSvgEscape(item.d||'')}"${fill}${transform}/>`);
    else if(item.type==='text'){
      const x=Number(item.x||0),y=Number(item.y||0),lines=String(item.text||'').split(/\n/),fs=Number(item.fontSize||22),lh=Number(item.lineHeight||1.15),anc=item.anchor||'middle';
      out.push(`<text data-map-label-id="${mapSvgEscape(item.id)}" data-map-label-index="${itemIndex}" class="map-label-hit ${mapSvgEscape(item.className||'zone-label')} ${state.mapLayoutMode==='labels'&&mapItemIsSelected(item)?'map-editor-selected':''}" x="${x}" y="${y}" text-anchor="${mapSvgEscape(anc)}" font-size="${fs}" font-weight="${mapSvgEscape(item.fontWeight||'800')}" font-style="${mapSvgEscape(item.fontStyle||'normal')}" font-family="${mapSvgEscape(item.fontFamily||'Georgia, serif')}" fill="${mapSvgEscape(item.fill||'#291f1a')}">`);lines.forEach((line,index)=>out.push(`<tspan x="${x}" dy="${index===0?0:fs*lh}">${mapSvgEscape(line)}</tspan>`));out.push(`</text>`);
    }
  });
  (doc.locations||[]).forEach((loc,locIndex)=>{
    if(loc.hidden)return;
    const code=String(loc.id||'').toUpperCase(),
      shape=(loc.shape||'rect').toLowerCase(),
      rot=Number(loc.rotation||0),
      x=Number(loc.x||0),
      y=Number(loc.y||0),
      w=Number(loc.w||28),
      h=Number(loc.h||12),
      cx=x+w/2,
      cy=y+h/2,
      labelX=cx+(Number(loc.labelDx)||0),
      labelY=adminMapLabelY(loc,cy),
      fontSize=adminMapCodeFontSize(code,w,h),
      selected=state.mapLayoutMode==='locations'&&mapItemIsSelected(loc)?' map-editor-selected':'',
      locationTransform=rot?` transform="rotate(${rot} ${cx} ${cy})"`:'',
      labelCounterTransform=rot?` transform="rotate(${-rot} ${cx} ${cy})"`:'';

    // V2.9: the location group may rotate, but the label receives the exact
    // inverse transform, guaranteeing that the table number remains upright.
    out.push(`<g data-map-location-id="${code}" data-map-location-index="${locIndex}"${locationTransform}>`);

    if(shape==='booth'){
      out.push(`<rect id="table-${code}" class="map-table${selected}" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>`);
      out.push(`<path d="M${x},${y} L${cx},${cy} L${x+w},${y} Z" fill="#f4f4f4" stroke="#d8d8d8" stroke-width="1" pointer-events="none"/>`);
      out.push(`<path d="M${x},${y+h} L${cx},${cy} L${x+w},${y+h} Z" fill="#eeeeee" stroke="#d8d8d8" stroke-width="1" pointer-events="none"/>`);
    }else{
      const c=shape==='service'?'service':'map-table';
      out.push(`<rect id="table-${code}" class="${c}${selected}" x="${x}" y="${y}" width="${w}" height="${h}" rx="1"/>`);
    }

    out.push(`<text class="map-table-label" x="${labelX}" y="${labelY}" font-size="${fontSize}"${labelCounterTransform}>${mapSvgEscape(code)}</text>`);
    out.push(`</g>`);
  });
  out.push(`</svg>`);return out.join('');
}
function renderMapLayoutList(){
  const q=(document.getElementById('mapLayoutSearch')?.value||'').trim().toLowerCase();
  const source=mapModeItems();
  const items=source.filter(item=>JSON.stringify(item).toLowerCase().includes(q));
  const selectedCount=mapSelectionItems().length;

  document.getElementById('mapLayoutCount').textContent=
    `${items.length} ITEMS${selectedCount>1?` • ${selectedCount} SELECTED`:''}`;

  document.getElementById('mapLayoutItemList').innerHTML=items.map(item=>{
    let title,sub;
    if(state.mapLayoutMode==='locations'){
      title=item.id||'LOCATION';
      sub=`${item.shape||'rect'} • x ${item.x} • y ${item.y}`;
    }else if(state.mapLayoutMode==='labels'){
      title=(item.text||'Label').split(/\n/)[0];
      sub=`${item.id||''} • x ${item.x} • y ${item.y}`;
    }else{
      title=item.id||'OBJECT';
      sub=item.type==='rect'
        ? `rectangle • ${item.width} × ${item.height} • x ${item.x} • y ${item.y}`
        : `path / outline • offset ${item.translateX||0}, ${item.translateY||0}`;
    }

    const sourceIndex=source.indexOf(item);
    return `<button class="record ${mapItemIsSelected(item)?'active map-multi-active':''}"
      data-map-select-index="${sourceIndex}">
      <span class="record-main">
        <span class="record-title">${escapeHtml(title)}</span>
        <span class="record-sub">${escapeHtml(sub)}</span>
      </span>
    </button>`;
  }).join('')||'<p class="muted">No items found.</p>';

  document.querySelectorAll('[data-map-select-index]').forEach(btn=>{
    btn.addEventListener('click',event=>{
      const item=mapModeItems()[Number(btn.dataset.mapSelectIndex)];
      if(!item)return;
      if(event.shiftKey)toggleMapMultiSelection(item);
      else setMapSingleSelection(item);
      renderMapLayoutDesigner(false);
    });
  });
}
function renderMapLayoutInspector(){
  const selected=mapSelectionItems();
  const item=currentMapItem();
  const empty=document.getElementById('mapLayoutEmpty');
  const form=document.getElementById('mapLayoutInspectorForm');
  const meta=document.getElementById('mapLayoutSelectionMeta');

  if(selected.length>1){
    form.classList.add('hidden');
    empty.classList.remove('hidden');
    meta.textContent=`${selected.length} ${state.mapLayoutMode==='locations'?'LOCATIONS':state.mapLayoutMode==='labels'?'LABELS':'OBJECTS'} SELECTED`;
    empty.innerHTML=`<div class="empty-icon">☷</div>
      <h3>${selected.length} items selected</h3>
      <p><strong>Release Shift, then drag any highlighted item</strong> to move the entire group together.</p>
      <p>The arrow-key and floating nudge controls also move the whole selection while preserving spacing.</p>`;
    return;
  }

  if(!item){
    empty.innerHTML='<div class="empty-icon">⌖</div><h3>Select a table, booth, label, or map object</h3><p>Use the list or click directly on the SVG preview.</p>';
    empty.classList.remove('hidden');
    form.classList.add('hidden');
    meta.textContent='NO SELECTION';
    return;
  }

  empty.classList.add('hidden');
  form.classList.remove('hidden');
  meta.textContent=state.mapLayoutMode==='locations'?`LOCATION ${item.id}`:state.mapLayoutMode==='labels'?`LABEL ${item.id}`:`OBJECT ${item.id}`;
  if(state.mapLayoutMode==='locations'){
    const assigned=state.mapVendors.find(v=>expandAdminLocationCodes(v.location).includes(String(item.id||'').toUpperCase()));form.innerHTML=`<div class="form-head"><h3>Edit ${escapeHtml(item.id)}</h3></div><div class="fields"><div class="field"><label>CODE / ID</label><input name="id" value="${escapeHtml(item.id||'')}" /></div><div class="field"><label>SHAPE</label><select name="shape"><option value="rect" ${item.shape==='rect'?'selected':''}>Table</option><option value="booth" ${item.shape==='booth'?'selected':''}>Booth</option><option value="service" ${item.shape==='service'?'selected':''}>Service Box</option></select></div><div class="field"><label>X</label><input name="x" type="number" value="${escapeHtml(item.x)}" /></div><div class="field"><label>Y</label><input name="y" type="number" value="${escapeHtml(item.y)}" /></div><div class="field"><label>WIDTH</label><input name="w" type="number" value="${escapeHtml(item.w)}" /></div><div class="field"><label>HEIGHT</label><input name="h" type="number" value="${escapeHtml(item.h)}" /></div><div class="field"><label>ROTATION</label><input name="rotation" type="number" value="${escapeHtml(item.rotation||0)}" /></div><div class="field full checkbox-field"><label><input type="checkbox" name="hidden" ${item.hidden?'checked':''}/> <strong>Hide this table / booth</strong></label></div><div class="field full"><label>ASSIGNED VENDOR</label><input value="${escapeHtml(assigned?assigned.name:'— no vendor currently assigned —')}" disabled /><span class="help">Con-Quest participation is controlled in Vendors & Booths.</span></div></div>`;
  }else if(state.mapLayoutMode==='labels'){
    form.innerHTML=`<div class="form-head"><h3>Edit ${escapeHtml(item.id)}</h3></div><div class="fields"><div class="field"><label>LABEL ID</label><input name="id" value="${escapeHtml(item.id||'')}" /></div><div class="field full"><label>TEXT</label><textarea name="text">${escapeHtml(item.text||'')}</textarea><span class="help">Use a new line to stack text inside a room.</span></div><div class="field"><label>X</label><input name="x" type="number" value="${escapeHtml(item.x)}" /></div><div class="field"><label>Y</label><input name="y" type="number" value="${escapeHtml(item.y)}" /></div><div class="field"><label>FONT SIZE</label><input name="fontSize" type="number" value="${escapeHtml(item.fontSize||22)}" /></div><div class="field"><label>LINE HEIGHT</label><input name="lineHeight" type="number" step="0.05" value="${escapeHtml(item.lineHeight||1.15)}" /></div><div class="field"><label>ANCHOR</label><select name="anchor"><option value="middle" ${item.anchor==='middle'?'selected':''}>middle</option><option value="start" ${item.anchor==='start'?'selected':''}>start</option><option value="end" ${item.anchor==='end'?'selected':''}>end</option></select></div><div class="field"><label>FONT WEIGHT</label><input name="fontWeight" value="${escapeHtml(item.fontWeight||'800')}" /></div><div class="field"><label>FONT STYLE</label><select name="fontStyle"><option value="normal" ${item.fontStyle!=='italic'?'selected':''}>normal</option><option value="italic" ${item.fontStyle==='italic'?'selected':''}>italic</option></select></div><div class="field"><label>FILL COLOR</label><input name="fill" value="${escapeHtml(item.fill||'#291f1a')}" /></div></div>`;
  }else if(item.type==='rect'){
    form.innerHTML=`<div class="form-head"><h3>Edit object ${escapeHtml(item.id)}</h3></div><div class="fields"><div class="field"><label>OBJECT ID</label><input name="id" value="${escapeHtml(item.id||'')}" /></div><div class="field"><label>TYPE</label><input value="Rectangle / Box" disabled /></div><div class="field"><label>X</label><input name="x" type="number" value="${escapeHtml(item.x||0)}" /></div><div class="field"><label>Y</label><input name="y" type="number" value="${escapeHtml(item.y||0)}" /></div><div class="field"><label>WIDTH</label><input name="width" type="number" min="2" value="${escapeHtml(item.width||0)}" /></div><div class="field"><label>HEIGHT</label><input name="height" type="number" min="2" value="${escapeHtml(item.height||0)}" /></div><div class="field"><label>CORNER RADIUS</label><input name="rx" type="number" min="0" value="${escapeHtml(item.rx||0)}" /></div><div class="field"><label>FILL COLOR</label><input name="fill" value="${escapeHtml(item.fill||'')}" placeholder="#f2bd3f" /></div><div class="field full"><label>CSS / MAP CLASS</label><input name="className" value="${escapeHtml(item.className||'zone')}" /><span class="help">Examples: zone, service, hall-floor, stairs, outline.</span></div><div class="field full checkbox-field"><label><input type="checkbox" name="hidden" ${item.hidden?'checked':''}/> <strong>Hide this object from the attendee map</strong></label></div><div class="field full"><span class="help"><strong>Tip:</strong> Drag this object directly on the map to move it. Use the corner and side anchor points to stretch or resize it.</span></div></div>`;
  }else{
    form.innerHTML=`<div class="form-head"><h3>Edit path / outline ${escapeHtml(item.id)}</h3></div><div class="fields"><div class="field"><label>OBJECT ID</label><input name="id" value="${escapeHtml(item.id||'')}" /></div><div class="field"><label>TYPE</label><input value="Path / Irregular Area" disabled /></div><div class="field"><label>MOVE X</label><input name="translateX" type="number" step="1" value="${escapeHtml(item.translateX||0)}" /></div><div class="field"><label>MOVE Y</label><input name="translateY" type="number" step="1" value="${escapeHtml(item.translateY||0)}" /></div><div class="field"><label>WIDTH SCALE</label><input name="scaleX" type="number" step="0.01" value="${escapeHtml(item.scaleX??1)}" /></div><div class="field"><label>HEIGHT SCALE</label><input name="scaleY" type="number" step="0.01" value="${escapeHtml(item.scaleY??1)}" /></div><div class="field"><label>SCALE ORIGIN X</label><input name="originX" type="number" value="${escapeHtml(item.originX||0)}" /></div><div class="field"><label>SCALE ORIGIN Y</label><input name="originY" type="number" value="${escapeHtml(item.originY||0)}" /></div><div class="field"><label>ROTATION</label><input name="rotation" type="number" value="${escapeHtml(item.rotation||0)}" /></div><div class="field"><label>FILL COLOR</label><input name="fill" value="${escapeHtml(item.fill||'')}" /></div><div class="field full"><label>CSS / MAP CLASS</label><input name="className" value="${escapeHtml(item.className||'zone')}" /></div><div class="field full"><label>ADVANCED PATH DATA</label><textarea name="d" rows="5">${escapeHtml(item.d||'')}</textarea><span class="help">Usually leave this alone. Drag changes position. Use the blue resize anchors to stretch the whole area. Use the orange/blue path points directly on the map to pull individual corners and curve controls.</span></div><div class="field full checkbox-field"><label><input type="checkbox" name="hidden" ${item.hidden?'checked':''}/> <strong>Hide this object from the attendee map</strong></label></div></div>`;
  }
  form.querySelectorAll('input,textarea,select').forEach(el=>el.addEventListener('input',commitMapInspector));
}
function commitMapInspector(){
  const item=currentMapItem(),form=document.getElementById('mapLayoutInspectorForm');if(!item||!form)return;const fd=new FormData(form);
  if(state.mapLayoutMode==='locations'){item.id=String(fd.get('id')||'').trim().toUpperCase();item.shape=String(fd.get('shape')||'rect').trim();['x','y','w','h','rotation'].forEach(k=>item[k]=Number(fd.get(k)||0));item.hidden=fd.get('hidden')==='on'}
  else if(state.mapLayoutMode==='labels'){item.id=String(fd.get('id')||'').trim();item.text=String(fd.get('text')||'');item.anchor=String(fd.get('anchor')||'middle');item.fontWeight=String(fd.get('fontWeight')||'800');item.fontStyle=String(fd.get('fontStyle')||'normal');item.fill=String(fd.get('fill')||'#291f1a');['x','y','fontSize'].forEach(k=>item[k]=Number(fd.get(k)||0));item.lineHeight=Number(fd.get('lineHeight')||1.15)}
  else if(item.type==='rect'){item.id=String(fd.get('id')||'').trim();['x','y','width','height','rx'].forEach(k=>item[k]=Number(fd.get(k)||0));item.fill=String(fd.get('fill')||'').trim()||null;item.className=String(fd.get('className')||'zone').trim();item.hidden=fd.get('hidden')==='on'}
  else{item.id=String(fd.get('id')||'').trim();['translateX','translateY','scaleX','scaleY','originX','originY','rotation'].forEach(k=>item[k]=Number(fd.get(k)||0));if(!Number.isFinite(item.scaleX)||item.scaleX===0)item.scaleX=1;if(!Number.isFinite(item.scaleY)||item.scaleY===0)item.scaleY=1;item.fill=String(fd.get('fill')||'').trim()||null;item.className=String(fd.get('className')||'zone').trim();item.d=String(fd.get('d')||'');item.hidden=fd.get('hidden')==='on'}
  state.mapLayoutSelectedId=item.id;setDirty(true);renderMapLayoutDesigner(false);
}
function selectMapPreviewTarget(event){
  const root=event.target.closest('[data-map-location-index],[data-map-label-index],[data-map-shape-index]');
  const target=mapItemFromSvgRoot(root);
  if(!target?.item)return;
  if(state.mapLayoutMode!==target.mode){state.mapLayoutMode=target.mode;clearMapLayoutSelection()}
  if(event.shiftKey)toggleMapMultiSelection(target.item);else setMapSingleSelection(target.item);
  updateMapModeButtons();renderMapLayoutDesigner(false);
}
function updateMapModeButtons(){document.getElementById('mapModeLocations')?.classList.toggle('active',state.mapLayoutMode==='locations');document.getElementById('mapModeLabels')?.classList.toggle('active',state.mapLayoutMode==='labels');document.getElementById('mapModeShapes')?.classList.toggle('active',state.mapLayoutMode==='shapes')}
function svgClientPoint(svg,clientX,clientY){const pt=svg.createSVGPoint();pt.x=clientX;pt.y=clientY;const matrix=svg.getScreenCTM();return matrix?pt.matrixTransform(matrix.inverse()):{x:clientX,y:clientY}}

function parseEditablePath(d){
  const tokens=String(d||"").match(/[MLQZmlqz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi)||[];
  const commands=[];
  let i=0,currentX=0,currentY=0,startX=0,startY=0;

  while(i<tokens.length){
    const raw=tokens[i++];
    if(!/^[A-Za-z]$/.test(raw))return null;
    const relative=raw===raw.toLowerCase();
    const cmd=raw.toUpperCase();

    const num=()=>{
      if(i>=tokens.length||/^[A-Za-z]$/.test(tokens[i]))throw new Error("Invalid SVG path");
      return Number(tokens[i++]);
    };

    try{
      if(cmd==="M"||cmd==="L"){
        let x=num(),y=num();
        if(relative){x+=currentX;y+=currentY}
        currentX=x;currentY=y;
        if(cmd==="M"){startX=x;startY=y}
        commands.push({cmd,x,y});
      }else if(cmd==="Q"){
        let cx=num(),cy=num(),x=num(),y=num();
        if(relative){cx+=currentX;cy+=currentY;x+=currentX;y+=currentY}
        commands.push({cmd,cx,cy,x,y});
        currentX=x;currentY=y;
      }else if(cmd==="Z"){
        commands.push({cmd:"Z"});
        currentX=startX;currentY=startY;
      }else{
        return null;
      }
    }catch{
      return null;
    }
  }

  return commands.length?commands:null;
}

function formatMapNumber(value){
  const n=Math.round(Number(value)*10)/10;
  return Number.isInteger(n)?String(n):String(n);
}

function serializeEditablePath(commands){
  return commands.map(c=>{
    if(c.cmd==="M"||c.cmd==="L")return `${c.cmd}${formatMapNumber(c.x)} ${formatMapNumber(c.y)}`;
    if(c.cmd==="Q")return `Q${formatMapNumber(c.cx)} ${formatMapNumber(c.cy)} ${formatMapNumber(c.x)} ${formatMapNumber(c.y)}`;
    return "Z";
  }).join(" ");
}

function svgClientPointInElement(element,clientX,clientY){
  const svg=element?.ownerSVGElement;
  if(!svg)return{x:clientX,y:clientY};
  const pt=svg.createSVGPoint();
  pt.x=clientX;pt.y=clientY;
  const matrix=element.getScreenCTM();
  return matrix?pt.matrixTransform(matrix.inverse()):svgClientPoint(svg,clientX,clientY);
}

function pathCommandPoint(command,role){
  if(!command)return null;
  if(role==="control"&&command.cmd==="Q")return{x:command.cx,y:command.cy};
  if((command.cmd==="M"||command.cmd==="L"||command.cmd==="Q")&&role==="end")return{x:command.x,y:command.y};
  return null;
}

function setPathCommandPoint(command,role,x,y){
  if(!command)return;
  if(role==="control"&&command.cmd==="Q"){command.cx=x;command.cy=y;return}
  if(role==="end"&&(command.cmd==="M"||command.cmd==="L"||command.cmd==="Q")){command.x=x;command.y=y}
}

function renderPathPointOverlay(svg,item){
  svg.querySelector("#mapPathPointOverlay")?.remove();
  if(state.mapLayoutMode!=="shapes"||!item||item.type!=="path")return;

  const commands=parseEditablePath(item.d);
  if(!commands)return;

  const NS="http://www.w3.org/2000/svg";
  const group=document.createElementNS(NS,"g");
  group.id="mapPathPointOverlay";

  const transform=adminTransformValue(item);
  if(transform)group.setAttribute("transform",transform);

  let previous=null;

  commands.forEach((command,index)=>{
    if(command.cmd==="Q"){
      if(previous){
        const guide=document.createElementNS(NS,"line");
        guide.setAttribute("class","map-path-guide");
        guide.setAttribute("x1",previous.x);
        guide.setAttribute("y1",previous.y);
        guide.setAttribute("x2",command.cx);
        guide.setAttribute("y2",command.cy);
        group.appendChild(guide);
      }

      const guide2=document.createElementNS(NS,"line");
      guide2.setAttribute("class","map-path-guide");
      guide2.setAttribute("x1",command.cx);
      guide2.setAttribute("y1",command.cy);
      guide2.setAttribute("x2",command.x);
      guide2.setAttribute("y2",command.y);
      group.appendChild(guide2);

      const control=document.createElementNS(NS,"circle");
      control.setAttribute("class","map-path-control-handle");
      control.setAttribute("cx",command.cx);
      control.setAttribute("cy",command.cy);
      control.setAttribute("r",6);
      control.dataset.pathCommand=String(index);
      control.dataset.pathRole="control";
      group.appendChild(control);
    }

    if(command.cmd==="M"||command.cmd==="L"||command.cmd==="Q"){
      const handle=document.createElementNS(NS,"circle");
      handle.setAttribute("class","map-path-point-handle");
      handle.setAttribute("cx",command.x);
      handle.setAttribute("cy",command.y);
      handle.setAttribute("r",7);
      handle.dataset.pathCommand=String(index);
      handle.dataset.pathRole="end";
      group.appendChild(handle);
      previous={x:command.x,y:command.y};
    }
  });

  svg.appendChild(group);

  group.querySelectorAll("[data-path-command]").forEach(handle=>{
    handle.addEventListener("pointerdown",beginMapPathPointDrag);
  });
}

function beginMapPathPointDrag(event){
  const overlay=event.currentTarget.closest("#mapPathPointOverlay");
  const svg=event.currentTarget.ownerSVGElement;
  const item=currentMapItem();
  if(!overlay||!svg||!item||item.type!=="path")return;

  const commands=parseEditablePath(item.d);
  if(!commands)return;

  state.mapDrag={
    kind:"path-point",
    pointerId:event.pointerId,
    svg,
    overlay,
    commands,
    commandIndex:Number(event.currentTarget.dataset.pathCommand),
    role:event.currentTarget.dataset.pathRole
  };

  event.currentTarget.setPointerCapture?.(event.pointerId);
  event.preventDefault();
  event.stopPropagation();
}

function continueMapPathPointDrag(event){
  const d=state.mapDrag;
  if(!d||d.kind!=="path-point"||event.pointerId!==d.pointerId)return;

  const item=currentMapItem();
  if(!item||item.type!=="path")return;

  const p=svgClientPointInElement(d.overlay,event.clientX,event.clientY);
  const command=d.commands[d.commandIndex];
  setPathCommandPoint(command,d.role,Math.round(p.x*10)/10,Math.round(p.y*10)/10);

  item.d=serializeEditablePath(d.commands);

  const target=d.svg.querySelector(`[data-map-shape-id="${CSS.escape(item.id)}"]`);
  if(target)target.setAttribute("d",item.d);

  const point=pathCommandPoint(command,d.role);
  const handle=d.overlay.querySelector(`[data-path-command="${d.commandIndex}"][data-path-role="${d.role}"]`);
  if(handle&&point){
    handle.setAttribute("cx",point.x);
    handle.setAttribute("cy",point.y);
  }

  setDirty(true);
  event.preventDefault();
  event.stopPropagation();
}

function finishMapPathPointDrag(event){
  const d=state.mapDrag;
  if(!d||d.kind!=="path-point"||event.pointerId!==d.pointerId)return;
  state.mapDrag=null;
  renderMapLayoutDesigner(false);
  event.preventDefault();
  event.stopPropagation();
}

function mapItemPosition(item){
  if(state.mapLayoutMode==='shapes'&&item.type==='path')return{x:Number(item.translateX||0),y:Number(item.translateY||0)};
  return{x:Number(item.x||0),y:Number(item.y||0)};
}
function setMapItemPosition(item,x,y){
  if(state.mapLayoutMode==='shapes'&&item.type==='path'){item.translateX=x;item.translateY=y}
  else{item.x=x;item.y=y}
}

function beginMapObjectDrag(event){
  if(event.button!==undefined&&event.button!==0)return;

  const root=event.currentTarget;
  const svg=root.ownerSVGElement;
  if(!svg)return;

  const target=mapItemFromSvgRoot(root);
  if(!target?.item)return;

  if(state.mapLayoutMode!==target.mode){
    state.mapLayoutMode=target.mode;
    clearMapLayoutSelection();
  }

  // Shift + click is intentionally selection-only. This makes it easy to build
  // a row/column selection without accidentally nudging items while clicking.
  if(event.shiftKey){
    toggleMapMultiSelection(target.item);
    updateMapModeButtons();
    renderMapLayoutDesigner(false);
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  // Clicking an already-selected member keeps the full group selected.
  // Clicking anything else without Shift starts a fresh single selection.
  if(!mapItemIsSelected(target.item)){
    setMapSingleSelection(target.item);
  }else{
    state.mapLayoutPrimaryItem=target.item;
    state.mapLayoutSelectedId=target.item.id||"";
  }

  updateMapModeButtons();
  renderMapLayoutList();
  renderMapLayoutInspector();

  const selected=mapSelectionItems();
  const dragItems=selected.map(item=>{
    const itemRoot=mapSvgRootForItem(svg,item);
    if(!itemRoot)return null;
    const pos=mapItemPosition(item);
    return{
      item,
      root:itemRoot,
      startX:pos.x,
      startY:pos.y,
      baseTransform:itemRoot.getAttribute('transform')||''
    };
  }).filter(Boolean);

  if(!dragItems.length)return;

  const pointer=svgClientPoint(svg,event.clientX,event.clientY);
  state.mapDrag={
    kind:'move-group',
    pointerId:event.pointerId,
    captureRoot:root,
    svg,
    items:dragItems,
    pointerX:pointer.x,
    pointerY:pointer.y,
    dx:0,
    dy:0
  };

  root.setPointerCapture?.(event.pointerId);
  event.preventDefault();
  event.stopPropagation();
}

function continueMapObjectDrag(event){
  const d=state.mapDrag;
  if(!d||d.kind!=='move-group'||event.pointerId!==d.pointerId)return;

  const p=svgClientPoint(d.svg,event.clientX,event.clientY);
  d.dx=p.x-d.pointerX;
  d.dy=p.y-d.pointerY;

  d.items.forEach(entry=>{
    entry.root.setAttribute(
      'transform',
      `translate(${d.dx} ${d.dy}) ${entry.baseTransform}`.trim()
    );
  });

  event.preventDefault();
  event.stopPropagation();
}

function finishMapObjectDrag(event){
  const d=state.mapDrag;
  if(!d||d.kind!=='move-group'||event.pointerId!==d.pointerId)return;

  d.items.forEach(entry=>{
    setMapItemPosition(
      entry.item,
      Math.round((entry.startX+d.dx)*10)/10,
      Math.round((entry.startY+d.dy)*10)/10
    );
  });

  if(d.items.length)setDirty(true);
  d.captureRoot?.releasePointerCapture?.(event.pointerId);
  state.mapDrag=null;
  renderMapLayoutDesigner(false);

  event.preventDefault();
  event.stopPropagation();
}
function pathBaseBox(item,svg){
  if(!item||item.type!=="path"||!svg)return null;
  const target=svg.querySelector(`[data-map-shape-id="${CSS.escape(item.id)}"]`);
  if(!target||typeof target.getBBox!=="function")return null;
  try{
    const b=target.getBBox();
    if(!Number.isFinite(b.width)||!Number.isFinite(b.height)||b.width<=0||b.height<=0)return null;
    return {x:b.x,y:b.y,w:b.width,h:b.height};
  }catch{return null}
}
function normalizePathResizeOrigin(item,base){
  const sx=Number(item.scaleX??1)||1,sy=Number(item.scaleY??1)||1;
  const oldOx=Number(item.originX||0),oldOy=Number(item.originY||0),tx=Number(item.translateX||0),ty=Number(item.translateY||0);
  const visibleX=tx+oldOx+(base.x-oldOx)*sx;
  const visibleY=ty+oldOy+(base.y-oldOy)*sy;
  item.originX=base.x;item.originY=base.y;
  item.translateX=visibleX-base.x;item.translateY=visibleY-base.y;
  item.scaleX=sx;item.scaleY=sy;
}
function resizeItemGeometry(item,svg){
  if(!item)return null;
  if(state.mapLayoutMode==='locations')return{x:Number(item.x||0),y:Number(item.y||0),w:Number(item.w||10),h:Number(item.h||10),keys:['x','y','w','h'],kind:'location'};
  if(state.mapLayoutMode==='shapes'&&item.type==='rect')return{x:Number(item.x||0),y:Number(item.y||0),w:Number(item.width||10),h:Number(item.height||10),keys:['x','y','width','height'],kind:'rect'};
  if(state.mapLayoutMode==='shapes'&&item.type==='path'){
    const base=pathBaseBox(item,svg);if(!base)return null;
    normalizePathResizeOrigin(item,base);
    const sx=Math.max(.01,Math.abs(Number(item.scaleX??1)||1)),sy=Math.max(.01,Math.abs(Number(item.scaleY??1)||1));
    return{x:base.x+Number(item.translateX||0),y:base.y+Number(item.translateY||0),w:base.w*sx,h:base.h*sy,kind:'path',baseX:base.x,baseY:base.y,baseW:base.w,baseH:base.h};
  }
  return null;
}
function applyResizeGeometry(item,g,svg){
  if(!item||!g)return;
  if(g.kind==='path'){
    const bw=Math.max(.01,Number(g.baseW||1)),bh=Math.max(.01,Number(g.baseH||1));
    item.originX=Number(g.baseX||0);item.originY=Number(g.baseY||0);
    item.translateX=g.x-item.originX;item.translateY=g.y-item.originY;
    item.scaleX=Math.max(.01,g.w/bw);item.scaleY=Math.max(.01,g.h/bh);
    return;
  }
  const info=resizeItemGeometry(item,svg);if(!info||!info.keys)return;
  item[info.keys[0]]=g.x;item[info.keys[1]]=g.y;item[info.keys[2]]=g.w;item[info.keys[3]]=g.h;
}
function resizeAnchorPoints(g){
  const mx=g.x+g.w/2,my=g.y+g.h/2;
  return{
    nw:[g.x,g.y],n:[mx,g.y],ne:[g.x+g.w,g.y],
    e:[g.x+g.w,my],se:[g.x+g.w,g.y+g.h],s:[mx,g.y+g.h],
    sw:[g.x,g.y+g.h],w:[g.x,my]
  };
}
function renderResizeOverlay(svg){
  svg.querySelector('#mapResizeOverlay')?.remove();
  if(mapSelectionItems().length>1)return;
  const item=currentMapItem(),g=resizeItemGeometry(item,svg);if(!g)return;
  if(Number(item.rotation||0)!==0){
    if(state.mapLayoutMode==='shapes'&&item?.type==='path')renderPathPointOverlay(svg,item);
    return;
  }
  const NS='http://www.w3.org/2000/svg',group=document.createElementNS(NS,'g');group.id='mapResizeOverlay';
  const outline=document.createElementNS(NS,'rect');outline.setAttribute('class','map-resize-outline');outline.setAttribute('x',g.x);outline.setAttribute('y',g.y);outline.setAttribute('width',g.w);outline.setAttribute('height',g.h);group.appendChild(outline);
  Object.entries(resizeAnchorPoints(g)).forEach(([name,[x,y]])=>{
    const h=document.createElementNS(NS,'circle');h.setAttribute('data-map-resize',name);h.setAttribute('class','map-resize-handle');h.setAttribute('cx',x);h.setAttribute('cy',y);h.setAttribute('r',7);group.appendChild(h)
  });
  svg.appendChild(group);
  group.querySelectorAll('[data-map-resize]').forEach(h=>h.addEventListener('pointerdown',beginMapResize));

  // Irregular paths get their actual editable vertices in addition to the
  // overall width/height resize box.
  if(state.mapLayoutMode==='shapes'&&item?.type==='path')renderPathPointOverlay(svg,item);
}
function beginMapResize(event){
  const svg=event.currentTarget.ownerSVGElement,item=currentMapItem(),g=resizeItemGeometry(item,svg);if(!svg||!item||!g)return;
  const p=svgClientPoint(svg,event.clientX,event.clientY);
  state.mapDrag={kind:'resize',pointerId:event.pointerId,svg,handle:event.currentTarget.dataset.mapResize,start:{...g},pointerX:p.x,pointerY:p.y};
  event.currentTarget.setPointerCapture?.(event.pointerId);event.preventDefault();event.stopPropagation();
}
function updateResizeOverlayGeometry(svg,g){
  const group=svg.querySelector('#mapResizeOverlay');if(!group)return;
  const outline=group.querySelector('.map-resize-outline');if(outline){outline.setAttribute('x',g.x);outline.setAttribute('y',g.y);outline.setAttribute('width',g.w);outline.setAttribute('height',g.h)}
  Object.entries(resizeAnchorPoints(g)).forEach(([name,[x,y]])=>{const h=group.querySelector(`[data-map-resize="${name}"]`);if(h){h.setAttribute('cx',x);h.setAttribute('cy',y)}});
}
function adminTransformValue(item){
  const attr=mapAdminElementTransform(item);const m=attr.match(/transform="([^"]*)"/);return m?m[1]:'';
}
function continueMapResize(event){
  const d=state.mapDrag;if(!d||d.kind!=='resize'||event.pointerId!==d.pointerId)return;
  const item=currentMapItem();if(!item)return;
  const p=svgClientPoint(d.svg,event.clientX,event.clientY),dx=p.x-d.pointerX,dy=p.y-d.pointerY,min=4,g={...d.start};
  if(d.handle.includes('e'))g.w=Math.max(min,d.start.w+dx);
  if(d.handle.includes('s'))g.h=Math.max(min,d.start.h+dy);
  if(d.handle.includes('w')){const nx=Math.min(d.start.x+d.start.w-min,d.start.x+dx);g.w=d.start.w+(d.start.x-nx);g.x=nx}
  if(d.handle.includes('n')){const ny=Math.min(d.start.y+d.start.h-min,d.start.y+dy);g.h=d.start.h+(d.start.y-ny);g.y=ny}
  applyResizeGeometry(item,g,d.svg);
  if(g.kind==='path'){
    const target=d.svg.querySelector(`[data-map-shape-id="${CSS.escape(item.id)}"]`);if(target){const t=adminTransformValue(item);if(t)target.setAttribute('transform',t);else target.removeAttribute('transform')}
  }else{
    const target=state.mapLayoutMode==='locations'?d.svg.querySelector(`#table-${CSS.escape(item.id)}`):d.svg.querySelector(`[data-map-shape-id="${CSS.escape(item.id)}"]`);
    if(target){target.setAttribute('x',g.x);target.setAttribute('y',g.y);target.setAttribute('width',g.w);target.setAttribute('height',g.h)}
  }
  updateResizeOverlayGeometry(d.svg,g);setDirty(true);event.preventDefault();
}
function finishMapResize(event){
  const d=state.mapDrag;if(!d||d.kind!=='resize'||event.pointerId!==d.pointerId)return;
  state.mapDrag=null;renderMapLayoutDesigner(false);event.preventDefault();
}
function bindMapDesignerDrag(){
  document.querySelectorAll('#adminMapSvgHost [data-map-location-id],#adminMapSvgHost [data-map-label-id],#adminMapSvgHost [data-map-shape-id]').forEach(el=>{
    el.addEventListener('pointerdown',beginMapObjectDrag);
    el.addEventListener('pointermove',continueMapObjectDrag);
    el.addEventListener('pointerup',finishMapObjectDrag);
    el.addEventListener('pointercancel',finishMapObjectDrag);
  });

  const svg=document.querySelector('#adminMapSvgHost svg');
  if(svg){
    svg.addEventListener('pointerdown',event=>{
      if(event.target===svg&&!event.shiftKey){
        clearMapLayoutSelection();
        renderMapLayoutDesigner(false);
      }
    });
    svg.addEventListener('pointermove',continueMapResize);
    svg.addEventListener('pointerup',finishMapResize);
    svg.addEventListener('pointercancel',finishMapResize);
    svg.addEventListener('pointermove',continueMapPathPointDrag);
    svg.addEventListener('pointerup',finishMapPathPointDrag);
    svg.addEventListener('pointercancel',finishMapPathPointDrag);
    renderResizeOverlay(svg);
  }
}
function renderMapLayoutDesigner(resetZoom=true){if(resetZoom===true)state.mapLayoutZoom=1;updateMapModeButtons();renderMapLayoutList();renderMapLayoutInspector();const host=document.getElementById('adminMapSvgHost');if(host){host.innerHTML=buildAdminMapSvg();const svg=host.querySelector('svg');if(svg){const base=Number(getMapDoc().canvas?.defaultWidth||820);svg.style.width=`${Math.round(base*state.mapLayoutZoom)}px`;svg.style.maxWidth='none'}bindMapDesignerDrag()}updateMapSourceBadge()}
async function buildFloorMapBackup(){
  const layout=JSON.parse(JSON.stringify(state.data||[]));
  const [settingsResult,vendorsResult]=await Promise.all([
    api('/api/content/mapSettings').catch(()=>({data:[]})),
    api('/api/content/vendors').catch(()=>({data:state.mapVendors||[]}))
  ]);
  return{
    format:'sfvc-floor-map-chatgpt-source',
    version:2,
    exportedAt:new Date().toISOString(),
    source:'Sci-Fi Valley Con Program Admin Map Designer',
    purpose:'Source of truth for future ChatGPT map revisions and RESTORE BASE MAP updates.',
    instructions:'Upload this JSON file into the Sci-Fi Valley Con ChatGPT project before requesting another map revision. Tell ChatGPT to replace its embedded RESTORE BASE MAP with mapLayout and preserve these exact positions, dimensions, rotations, path points, labels, and transformations.',
    restoreBaseTarget:{
      attendeeFile:'data/map-layout.json',
      adminRecoveryFile:'public/default-map-layout.json',
      adminEmbeddedConstant:'EMBEDDED_MAP_LAYOUT'
    },
    mapLayoutSha:state.currentSha||null,
    counts:{
      locations:Array.isArray(layout?.[0]?.locations)?layout[0].locations.length:0,
      elements:Array.isArray(layout?.[0]?.elements)?layout[0].elements.length:0,
      vendors:Array.isArray(vendorsResult.data)?vendorsResult.data.length:0
    },
    mapLayout:layout,
    mapSettings:Array.isArray(settingsResult.data)?settingsResult.data:[],
    vendors:Array.isArray(vendorsResult.data)?vendorsResult.data:[]
  };
}
function floorMapBackupFilename(){
  const d=new Date(),pad=n=>String(n).padStart(2,'0');
  return `sfvc-floor-map-for-chatgpt-${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.json`;
}
async function exportFloorMapBackup(){
  try{
    const payload=await buildFloorMapBackup(),text=JSON.stringify(payload,null,2),blob=new Blob([text],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=floorMapBackupFilename();document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    setStatus(`ChatGPT map source exported: ${payload.counts.locations} locations, ${payload.counts.elements} map elements, ${payload.counts.vendors} vendor records.`,`success`);
  }catch(err){setStatus(`Map backup export failed: ${err.message}`,'error')}
}
async function copyFloorMapBackup(){
  try{
    const payload=await buildFloorMapBackup(),text=JSON.stringify(payload,null,2);
    if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text)}else{
      const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
    }
    setStatus('ChatGPT floor-map source JSON copied to the clipboard.','success');
  }catch(err){setStatus(`Could not copy map JSON: ${err.message}`,'error')}
}

function mapNudge(dx,dy){
  const items=mapSelectionItems();
  if(!items.length)return;
  items.forEach(item=>{
    const p=mapItemPosition(item);
    setMapItemPosition(item,p.x+dx,p.y+dy);
  });
  setDirty(true);
  renderMapLayoutDesigner(false);
}
function mapAddLocation(){const doc=getMapDoc(),base={id:`NEW${doc.locations.length+1}`,shape:'rect',x:320,y:320,w:24,h:10,rotation:0,labelDx:0,labelDy:null,hidden:false};doc.locations.push(base);state.mapLayoutMode='locations';setMapSingleSelection(base);setDirty(true);renderMapLayoutDesigner(false)}
function mapAddLabel(){const doc=getMapDoc(),base={id:`label-${Date.now()}`,type:'text',text:'New Label',x:400,y:400,fontSize:22,className:'zone-label',anchor:'middle',lineHeight:1.15,fontWeight:'800',fontStyle:'normal',fontFamily:'Georgia, serif',fill:'#291f1a',editable:true};doc.elements.push(base);state.mapLayoutMode='labels';setMapSingleSelection(base);setDirty(true);renderMapLayoutDesigner(false)}
function mapAddShape(){const doc=getMapDoc(),base={id:`box-${Date.now()}`,type:'rect',x:400,y:400,width:100,height:70,fill:'#f2bd3f',className:'zone',rx:3,editable:true,hidden:false};doc.elements.push(base);state.mapLayoutMode='shapes';setMapSingleSelection(base);setDirty(true);renderMapLayoutDesigner(false)}
function mapDuplicateItem(){
  const doc=getMapDoc(),selected=mapSelectionItems(),item=currentMapItem();
  if(selected.length>1){alert('Duplicate works on one map item at a time. Click one item normally first.');return}
  if(!item)return;
  const clone=JSON.parse(JSON.stringify(item));clone.id=`${item.id}-copy`;
  if(state.mapLayoutMode==='shapes'&&clone.type==='path'){clone.translateX=Number(clone.translateX||0)+12;clone.translateY=Number(clone.translateY||0)+12}
  else{clone.x=Number(clone.x||0)+12;clone.y=Number(clone.y||0)+12}
  if(state.mapLayoutMode==='locations')doc.locations.push(clone);else doc.elements.push(clone);
  setMapSingleSelection(clone);setDirty(true);renderMapLayoutDesigner(false)
}
function mapDeleteItem(){
  const selected=mapSelectionItems(),doc=getMapDoc(),item=currentMapItem();
  if(selected.length>1){alert('Multi-selection is currently for moving and nudging. Click one item normally before deleting.');return}
  if(!item)return;
  if(!confirm(`Delete ${item.id}?`))return;
  if(state.mapLayoutMode==='locations')doc.locations=doc.locations.filter(x=>x!==item);
  else doc.elements=doc.elements.filter(x=>x!==item);
  clearMapLayoutSelection();setDirty(true);renderMapLayoutDesigner(false)
}

$$(".nav[data-section]").forEach(b=>b.addEventListener("click",()=>loadSection(b.dataset.section)));
$("#recordSearch").addEventListener("input",renderList);
$("#addButton").addEventListener("click",newItem);
$("#saveButton").addEventListener("click",saveSection);
$("#reloadButton").addEventListener("click",()=>loadSection());
$("#downloadButton").addEventListener("click",downloadBackup);
$("#refreshHistoryButton").addEventListener("click",loadHistory);
$("#broadcastMessage")?.addEventListener("input",()=>$("#broadcastCharCount").textContent=String($("#broadcastMessage").value.length));
$("#broadcastConfirm")?.addEventListener("change",()=>$("#sendBroadcastButton").disabled=!$("#broadcastConfirm").checked);
$("#sendBroadcastButton")?.addEventListener("click",sendPushBroadcast);
$("#refreshBroadcasts")?.addEventListener("click",loadBroadcastDashboard);
$("#refreshAnalytics")?.addEventListener("click",loadAnalyticsDashboard);
$("#refreshReports")?.addEventListener("click",loadReportDashboard);
$("#enableReportPush")?.addEventListener("click",enableAdminReportPush);
$("#closeReportDetail")?.addEventListener("click",()=>$("#reportDetailModal")?.close());
$("#reportDetailModal")?.addEventListener("click",event=>{if(event.target===event.currentTarget)event.currentTarget.close()});
$("#reportStatusFilter")?.addEventListener("change",loadReportDashboard);
$("#reportCategoryFilter")?.addEventListener("change",loadReportDashboard);
$("#reportSearch")?.addEventListener("input",()=>{clearTimeout(reportSearchTimer);reportSearchTimer=setTimeout(loadReportDashboard,250)});
$("#refreshRegistrations")?.addEventListener("click",loadRegistrationDashboard);
$("#registrationSearch")?.addEventListener("input",()=>{
  clearTimeout(registrationSearchTimer);
  registrationSearchTimer=setTimeout(loadRegistrationDashboard,250);
});
$("#refreshDevices")?.addEventListener("click",loadDeviceDashboard);
$("#tshirtSyncNow")?.addEventListener("click",runTshirtSync);
$("#homeBannerCheckNow")?.addEventListener("click",checkHomeBannerNow);
let deviceSearchTimer=null;
$("#deviceSearch")?.addEventListener("input",()=>{clearTimeout(deviceSearchTimer);deviceSearchTimer=setTimeout(loadDeviceDashboard,250)});
$("#vendorExcelButton")?.addEventListener("click",()=>$("#vendorExcelInput")?.click());
$("#vendorExcelInput")?.addEventListener("change",event=>{const file=event.target.files?.[0];if(file)importVendorSpreadsheet(file);event.target.value=""});
$("#vendorDeleteAll")?.addEventListener("click",deleteAllVendors);
document.addEventListener("keydown",mapKeyboardNudge);
initNudgePadDrag();
$("#mapModeLocations")?.addEventListener("click",()=>{setMapLayoutMode("locations");renderMapLayoutDesigner(false)});
$("#mapModeLabels")?.addEventListener("click",()=>{setMapLayoutMode("labels");renderMapLayoutDesigner(false)});
$("#mapModeShapes")?.addEventListener("click",()=>{setMapLayoutMode("shapes");renderMapLayoutDesigner(false)});
$("#mapLayoutSearch")?.addEventListener("input",()=>renderMapLayoutList());
$("#mapAddLocation")?.addEventListener("click",mapAddLocation);
$("#mapAddLabel")?.addEventListener("click",mapAddLabel);
$("#mapAddShape")?.addEventListener("click",mapAddShape);
$("#mapRestoreBase")?.addEventListener("click",restoreBaseFloorMap);
$("#mapExportBackup")?.addEventListener("click",exportFloorMapBackup);
$("#mapCopyBackup")?.addEventListener("click",copyFloorMapBackup);
$("#mapDuplicateItem")?.addEventListener("click",mapDuplicateItem);
$("#mapDeleteItem")?.addEventListener("click",mapDeleteItem);
$("#mapNudgeUp")?.addEventListener("click",()=>mapNudge(0,-Number($("#mapNudgeStep")?.value||5)));
$("#mapNudgeDown")?.addEventListener("click",()=>mapNudge(0,Number($("#mapNudgeStep")?.value||5)));
$("#mapNudgeLeft")?.addEventListener("click",()=>mapNudge(-Number($("#mapNudgeStep")?.value||5),0));
$("#mapNudgeRight")?.addEventListener("click",()=>mapNudge(Number($("#mapNudgeStep")?.value||5),0));
$("#mapZoomInAdmin")?.addEventListener("click",()=>{state.mapLayoutZoom=Math.min(3,state.mapLayoutZoom+.25);renderMapLayoutDesigner(false)});
$("#mapZoomOutAdmin")?.addEventListener("click",()=>{state.mapLayoutZoom=Math.max(.5,state.mapLayoutZoom-.25);renderMapLayoutDesigner(false)});
$("#mapZoomResetAdmin")?.addEventListener("click",()=>{state.mapLayoutZoom=1;renderMapLayoutDesigner(false)});
window.addEventListener("beforeunload",e=>{if(state.dirty){e.preventDefault();e.returnValue="";}});

(async()=>{
  await checkAuth();
  ensureAdminReportServiceWorker().catch(()=>{});
  const params=new URLSearchParams(location.search);
  const requested=params.get("section");
  const initial=SECTIONS[requested]?requested:"guests";
  await loadSection(initial);
  const reportId=params.get("report");
  if(initial==="reports"&&reportId)openReportDetail(reportId);
})();
