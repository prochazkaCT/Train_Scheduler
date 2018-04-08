
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAXAyXxALM9XT6i56mQ4trGojhFuoIBBqo",
    authDomain: "train-time-6c205.firebaseapp.com",
    databaseURL: "https://train-time-6c205.firebaseio.com",
    projectId: "train-time-6c205",
    storageBucket: "train-time-6c205.appspot.com",
    messagingSenderId: "553800974901"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //Populate the Firebase db with input data via the submit button
  $("#search").on("click", function(event) {
    event.preventDefault();

  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var firstTrainTime = $("#train-time-input").val().trim();
  var trainFrequency = $("#freq-input").val().trim();

   // Creates local "temporary" object for holding input train data
   var newTrain = {
    newTrainName: trainName,
    newTrainDestination: trainDestination,
    newFirstTrainTime: firstTrainTime,
    newTrainFrequency: trainFrequency,
  };

  //Uploads train data to the db
  database.ref().push(newTrain);

  //Testing internally that code is working
  // console.log(newTrain.newTrainName);
  // console.log(newTrain.newTrainDestination);
  // console.log("The first train time is: "+ newTrain.newFirstTrainTime);
  // console.log(newTrain.newTrainFrequency);

  alert("Train successfully added");
  
  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#train-time-input").val("");
  $("#freq-input").val("");

  return false;
  });

  //Create the firebase event for adding trains to the db and a row when the user enters train data. 
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
    // Store everything into a variable.
    var trainName = childSnapshot.val().newTrainName;
    // console.log("The trainName is: " + trainName);
    var trainDestination = childSnapshot.val().newTrainDestination;
    // console.log("The trainDestination is: " + trainDestination);
    var firstTrainTime = childSnapshot.val().newFirstTrainTime;
    // console.log("the firstTrainTime is: " + firstTrainTime);
    var trainFrequency = childSnapshot.val().newTrainFrequency;
    // console.log("The trainFrequency is: " + trainFrequency);
  
    var timeSplit = firstTrainTime.split(":");
    // console.log("the time split is : " + timeSplit);
    var trainTime = moment().hours(timeSplit[0]).minutes(timeSplit[1]);
    // console.log("the trainTime is : " + trainTime);
    var maxTime = moment.max(moment(), trainTime);
    // console.log("The maxTime is : " + maxTime);
    var trainMinutes;
    var trainNextArrival;

    if (maxTime === trainTime) {
      trainNextArrival = trainTime.format("hh:mm A");
      trainMinutes = trainTime.diff(moment(), "minutes");
    } else {
      var diffTimes = moment().diff(trainTime, "minutes");
      var timeRemainder = diffTimes % trainFrequency;
      trainMinutes = trainFrequency - timeRemainder;
      trainNextArrival = moment().add(trainMinutes, "m").format("hh:mm A");
    }

    // console.log("train minutes: " + trainMinutes);
    // console.log("trainNextArrival is: " + trainNextArrival);
  
    //Adding the train data to the table 
    $("#train-schedule-section > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + trainNextArrival + "</td><td>" + trainMinutes + "</td></tr>");
  });