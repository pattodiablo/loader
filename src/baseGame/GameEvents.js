const gameEventsFolder = "../../gameEvents";

export default class LeadLiaisonGameEvents {
  static async postToBackend(file, event) {
    //sends the content of event to php as json

    /*  fetch(`${gameEventsFolder}/${file}.php`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    });*/

    //sends content  to a javascript file

    const module = await import(/* webpackIgnore: true */ `${gameEventsFolder}/${file}.js`);
    module.event(event);
    console.log(`event sent to ${gameEventsFolder}/${file}.js`);
  }
  //OnDoneClose
  static event(event) {
    /*
      event.eventName - the name / type of event
      event.gameData - all data from gameData section of settings.json

      event.gameData.gameId - the id of the game ( the folder its in if not set in settings.json)
      event.gameData.token - token  but could be null
      event.gameData.prospect_id - prospect_id  but could be null

      event.eventData - this is a javascript object that contains data like prizes when game is Finished

    */

    /*
    this is the code that sends data from the game to js or php when a game has an event and wants to talk to outside world.
    Feel free to change this code.

    all the event data above ( eventName,gameData, and eventData ) gets sent to js or php.

    currently if event name is back it will send json to gameEvents/back.js

    By default, once a game is done, it will be sent to the file gameEvents/done/<<gameId>>.js

    you can override what file gets the done event in settings.json with the setting gameData.doneDataType.
    Using this setting is a good way to share code between games that output the same kind of data.
    For example all games that use prizes could use same file.

    */

    ///This code in this file is shared for all games, and loaded for all games.
    //I recommend not doing any copy pasting, or things like if(event.gameData.gameId=="testGame") here

    if (event.eventName == "done") {
      this.postToBackend(
        `done/${event.gameData.doneDataType || event.gameData.gameId}`,
        event
      );
    } else {
      this.postToBackend(event.eventName, event);
    }

    /*
      this code  block below will always call a different file for every game like ../gameEvents/gameFinished/testGame.js

      this.postToBackend(
        `gameFinished/${event.gameData.gameId}`,
        event
      );

      */
  }
}
