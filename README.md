# Lead Liasion Loader
requires node.js installed to make changes

# install (run once)
```npm install```

# development
```npm start``` 

This starts a local development webserver that watches for changes inside src folder , and automaticly compiles a development build when a file is changed. if you made changes, make sure to use npm run build before publishing for production.

# production build
```npm run build```

This generates llgameloader.js

# requirements for production site :
1)include llgameloader.js
2)include llgameloader.css
3)two divs with ids background and gameDiv
4)svg with id backButton
5)serve assets folder

all other files not needed for production

notes : 
 
 1) use this to fix notch issue on iphone X 
 ```<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"> ```
 
 2) remove any refrence of phaser or swal js libraries in html file

# loading a game
to access go to
http://localhost:8080/loader/?game=TestGame

## Game Events

Check ```loader/ll_libs/GameEvents.js``` for when game events get triggered


feel free to edit the code in ```loader/ll_libs/GameEvents.js``` event function. But remember the code there is shared and embedded into every game.

the way I set up currently, the game triggers events that will dynamically call JavaScript files in gameEvents folder. This way you only need make changes / add new files to gameEvents folder when integrating games.

You could also send events to php instead of javascript

it might make sense to send events directly to parent window from GameEvents.js ,and others with seperate file.

more info in ```loader/ll_libs/GameEvents.js```

## Phaser Editor

In each game the .scene files compile directly into their corresponding .js file. this is done by phasereditor2d v3 . for these .js files, make sure to not edit anything between ```/* START-USER-CODE */``` and ```/* END-USER-CODE */```

the .scene files aren't needed to run the game, but please store them so its easier to edit the game if changes are needed.

## Game requirements

Games require Main.js.

Phaser Games use assets.json to load the game assets. This includes any script files. This is only for local files.

## Settings.json and Params

in ```settings.json```   the files array will override any asset in the game. so you can set logo , background , prizes etc here and it will overwrite the image, including with http addresses

if  a token is passed into the game via query parameters in the url ( like this ?token=32423) ,  instead of loading settings.json from the game folder ,its loaded from  ``` `../../activation-settings.php?${queryString}` ``` . queryString contains the token and activation id ( if it exists ).

*gameData* in ```settings.json``` is copied to each event, and then passed to js  or php

>if *gameData.gameId* is blank, the name of the folder will be used.
if *gameData.gamePath* is blank, the path of the folder will be used.

*gameData.token* and *gameData.prospect_id* are passed in from the url parameters

*backgroundColor* is the background Color

*backgroundFit* "cover" | "stretch" | "tile"

*disableBackButton* disable the back Button

*doneMessage*  message on game done

*doneButtonText* message on done button

*prize_threshold* threshold for prizes

*prize_threshold_message* show a message if threshold is met

*endButtonColor* color of end button string with color
 >format string #ffffff

*endButtonTextColor* color of end button text  with color in
>format string #ffffff

*prizeBoxBackColor* color of prize box back color with color in
>format string #ffffff

*prizeBoxTextColor* color of prize box text
>format string #ffffff

*backButtonColor*  color of back button
>format string #ffffff

*doneSecondMessage* optional secondary Message for message box

*googleFonts* array of google fonts to load https://fonts.google.com/

*borderSlices* border slices for border.

![9slice with non-uniform corner sizes](https://github.com/jdotrjs/phaser3-nineslice/raw/master/README/layout-2.png)

use "border" as key in files array for the ninepatch image

 can be 1 to 4 elements and the values are assigned the
same way as when defining border offsets in CSS.

Array Length  | Use  | Explanation |
------------- | ---- | ----------- |
1 | `[ topRightBottomLeft ]` | The first (only) element is used as the value for all four sides
2 | `[ topBottom, leftRight ]` | The first element is used for the top and bottom, the second element is used as the for the left and right
3 | `[ top, rightLeft, bottom ]` | The first element is used for the top, second is used for the right and left, and the third element is used for the bottom
4 | `[ top, right, bottom, left ]` | Each element is assigned to a specific side


*logo.x* "left" | "middle" | "right"
*logo.y* "bottom" | "middle" | "right"
*logo.margin*
*logo.backgroundColor*
*logo.outlineColor*
*logo.padding*
*logo.borderRadius*
*logo.borderThickness*

## Phaser Scaling

the game will autoscale, but the scene will scale to keep the same aspect ratio. You can create an optional list in the game called ignoreScale and add gameObjects to that to ignore the scaling.

for items that ignore Scale, you have to manually manage the scaling. use resize function ( see align to top prefab in test game).

Once all items are arranged, the function ready will be called on the main scene. Most of the time the regular phaser 3 create is ok, but in same cases you might need to call stuff once all the objects are placed on the screen.

Instead of adding things directly to the scene, you have to manually add stuff to “this.fitScale” , or make a container in the “create” function and stuff to that.

use gameWidth and gameHeight to get the width and height of game. this is different then the screen width and height, its the safest box to fit objects into without going off screen.

you can use fit({width,height}) function to set this.gameWidth and this.gameHeight to a different size.

Default gameWidth is 1366 and gameHeight is 1024 ( ipad landscape )

you can use window.isMobile to detect mobile devices ( https://github.com/kaimallea/isMobile )

use window.isNotch ( true or false ) to detect if device has a notch

in settings.json set gameData.scaleMode to "none" to disable all autoscaling and fitScale container.
in settings.json  set gameData.responsive to true to enable game to be responsive.

## FIT ScaleMode

This mode is making use of Phaser's scale.mode: FIT of ScaleManager.

To use it, make sure to set appropriate values in settings.json file:

    gameData.scaleMode: "fit",
    gameWidth: 1920,
    gameHeight: 1080,
    
### NOTE: `gameWidth` and `gameHeight` are not necessary and will be set to 1366x1024 as default.

We are making use of the fact that the game will always try to stretch itself as much as possible
in both width and height BUT maintaining the aspect ratio.

After auto-fit, we then check the difference between gameRatio to deviceRatio and add width / height necessary

For this to look good on mobile devices both on portrait and horizontal view we do another trick:
If aspect ratio is > 1 (height / width > 1) we know that we should display our game in portrait view
so we swap `width` with `height` and then continue with adjustments to match deviceRatio.

In our Main.js of the game we are working on, we have to listen for `fit-scale-mode-resize` event, like that:

    this.sys.game.events.on('fit-scale-mode-resize', (dimensions) => {...}

Here, depending on our current aspectRatio and real game dimensions, we can make minor-adjustments to make sure
our game looks great no matter device and orientation!

Examples of games using this mode:

Rummage: https://bitbucket.org/leadliaisondev/rummage/src/master/


## Running outside Phaser

If you don't want to use phaser , just don't add a assets.json file to your game. 
If you do not use phaser, you are required to insert the content of the game to the div `gameDiv` .  

## LeadLiaisonGame API
In your game you can use the LeadLiaisonGame global var. With phaser these functions are also available directly on the root scene in Main.js ( this.settings, this.done() etc)

*LeadLiaisonGame.settings* - settings.json found in the game, see settings section above.

*LeadLiaisonGame.settings.gameData* - see settings section above

*LeadLiaisonGame.gameEvent({eventName,eventData})* - function for sending a game Event . see gameEvent section above 

example:
```LeadLiaisonGame.gameEvent({eventName:"replay", eventData:doneData})```

*LeadLiaisonGame.done({prizesWon,message})* - call this function when game is done to display done modal
    
    -You can pass in 'prize' key to done for the prize. ```done({prize:{name:"bla",key:"imagekey"}})```
    -passing true for prize picks a prize. ```done({prize:true})```
    -prize has a winPrizeKey , and winPrizeName  ( name and key from assets.json or settings.json files array)
    -use message to display a message (overrides settings.json)
    -use secondaryMessage to display a secondary message (overrides settings.json)
    -you can also send any other data
    -you can send same info as a gameEvent to not trigger modal (use eventName done, and options dictionary as eventData)
    
example:
```LeadLiaisonGame.done({ imageData: faceSwappedSrc , otherThing:5, prizesWon:[{}],message:"game done!" })```

*LeadLiaisonGame.message({message})* - call this function to show a message

example:
```LeadLiaisonGame.message({ message: `message here!` });```
