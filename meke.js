// declares all global variables needed
var qnum1, qnum2, dict_of_ans, correct_ans, ranges, result, rand_check, operations, global_ans_choice, now, right_answer, now2, progress_length, already_answers, total_questions, key, global_current_screen, screens, question_number, operation_symbols, is_active,time, skill_clicked;
var choice_operation = "";
var num_questions = 10;
var music_status = true;
var sound_status = true;
var message = [];
var pass_confirm_enter;
var guest_mode = false;
var mode = "Practice";
var total_cost, time_cost, eliminate_cost, skip_cost, multiplier_cost;
var time_exchange, eliminate_exchange, skip_exchange, multiplier_exchange, coin_exchange;
var wrong_choices_list = [];
var multiplier = 1;
// user data in global variables, so we don't always need to access via reading data table
var user_enter, pass_enter, user_id, name_enter;
var problems_answered;
var meke_coin, time_saver, eliminate_choice, question_skip, coin_multiplier;
var password;
var private_profile;
var sound_choice;
var medium_thres = 100;
var difficult_thres = 300;
var impossible_thres = 500;


// When you first run the app, there is a font-change. If you do not wish to use ASAP, please comment out or delete the following line of code
setFonts();

// maps the background sound name it its sound URL
var background_sounds = {
  "Original": "sound://category_loops/vibrant_game_musical_harping_movement_loop_1_accents.mp3", 
  "Upbeat": "sound://category_loops/show_me_a_hero_middle_loop.mp3",
  "Suspense": "sound://category_loops/pulsating_discovery_loop1.mp3",
  "Jazz": "sound://category_background/jazzy_beats.mp3",
};

// loginScreen password astrick (*) masking
var login = {
  password: "",
  passwordFiller: "",
};

// newAccountScreen password astrick (*) masking
var new_account_login = {
  password: "",
  passwordFiller: ""
};

// newAccountScreen confirm password astrick (*) masking
var new_account_confirm = {
  password: "",
  passwordFiller: ""
};

// passwordChangeScreen password astrick (*) masking
var change_new_pass = {
  password: "",
  passwordFiller: ""
};

// passwordChangeScreen confirm password astrick (*) masking
var change_confirm_pass = {
  password: "",
  passwordFiller: ""
};

// passwordChangeScreen current password astrick (*) masking
var change_curr_pass = {
  password: "",
  passwordFiller: ""
};

// begin background music
sound_choice = background_sounds["Original"];
playSound(sound_choice, true);
// maps each answer choice to if they are correct or not
dict_of_ans = {
  "ans1": "wrong",
  "ans2": "wrong",
  "ans3": "wrong",
  "ans4": "wrong"
};

// maps each skill to their question number ranges
ranges = {
  "additionScreen": [0,5],
  "subtractionScreen": [0,5],
  "multiplicationScreen":[0,5],
  "divisionScreen":[0,50],
  "randomScreen":[0,30]
};

// maps each skill to their operator
operations = {
  "additionScreen" : " + ",
  "subtractionScreen" : " - ",
  "multiplicationScreen" : " * ",
  "divisionScreen" : " / ",
  "randomScreen" : ""
};

// maps each skill to its icon URL to display the operator
operation_symbols = {
  "additionScreen" : "icon://fa-plus",
  "subtractionScreen" : "icon://fa-minus",
  "multiplicationScreen" : "icon://fa-times",
  "divisionScreen" : "divisionSymbol.png",
};

// maps each skill to their name (use in feedbackScreen)
screens = {
  "additionScreen" : "Addition",
  "subtractionScreen" : "Subtraction",
  "multiplicationScreen" : "Multiplication",
  "divisionScreen" : "Division",
  "randomScreen": "Random"
};

// correct answer choice
global_ans_choice = "";


// welcomeScreen --> loginScreen
onEvent("welcomeScreen", "click", function(){
  setScreen("loginScreen");
  login.password = "";
  login.passwordFiller = "";
  appScreenSwitchSound(); // play screen switch noise through method
});


// once the user clicks the login button, the program attempts to log the user in (if they have an account)
onEvent("loginScreenLoginButton", "click", function(){
  /*
      INPUTS:
        -Username, password
        
      LOGIC:
        - Won't allow a user to login if any fields are empty
        - Checks to see if there is an account in the database with the entered login
            - If there is, the user is logged in. If there isn't the user is prompted to make a new account. 
  */
  
  appScreenSwitchSound(); // plays the "tick" sound every time a button is clicked
  
  // hides the error label
  setProperty("loginScreenWrongLabel", "hidden", true);
  
  user_enter = getText("loginScreenUsernameInput").toLowerCase(); // gets the username that the user entered, and makes it lowercase. All users can only have lowercase usernames
  pass_enter = login.password; // gets the actual password the user typed, not the "***"
  password = pass_enter; // unencrypted password
  
  // checks if username or password is empty
  if (user_enter.trim() == "" || pass_enter.trim() == ""){
    setText("loginScreenWrongLabel","Username or Password cannot be empty."); // configures the feedback label for the user to display that they didn't enter anything for either username or password
    displayShortTime("loginScreenWrongLabel", 1000); // displays the error message on the screen for one second (1000 milliseconds)
  } 
  
  // reads the login database to check if there is a login with what the user entered
  else {
    pass_enter = SHA512(pass_enter); // encrypted password to check for a match in database
    readRecords("login_information", {username:user_enter, password:pass_enter}, function(records) { 
    
    // checks if the username the user entered and the encrypted password can be found in the database
    if (records.length>0) {    
        var foundRecord = records[0];
        
        // gets data for each user and stores it into global program varaibles
        problems_answered = foundRecord.problems_answered; // the total number of problems a user answered
        user_id = foundRecord.id; // the user's unique id
        name_enter = foundRecord.name; // the user's name
        meke_coin = foundRecord.meke_coin; // the amount of Meke coin the user has
        time_saver = foundRecord.time_saver; // the amount of time saver power ups the user has
        eliminate_choice = foundRecord.eliminate_choice; // the amount of eliminate choice power up the user has
        question_skip = foundRecord.question_skip; // the amount of question skip power up the user has
        coin_multiplier = foundRecord.coin_multiplier; // the amount of coin multiplier power up the user has
        private_profile = foundRecord.private_profile; // whether or not the user has a private profile (true/false)
        
        // sets the menuScreen welcome labels & the total questions answerd labels
        setProperty("menuScreenTotalProblemsLabel", "text", problems_answered); // sets the upper right corner total problems label to the total number of problems the user has answered
        setProperty("menuScreenWelcomeLabel", "text", "Welcome " + name_enter + "!"); // sets the welcome text in menuScreen to welcome the user
        
        // since the user is not in guest mode, the program sets the power up and their count labels to be visible in each of the skill screens when user logs in
        manipulatePowerUps("additionScreen", "show"); // shows all power up buttons & their respective counts on additionScreen
        manipulatePowerUps("subtractionScreen", "show"); // shows all power up buttons & their respective counts on subtractionScreen
        manipulatePowerUps("multiplicationScreen", "show"); // shows all power up buttons & their respective counts on multiplicationScreen
        manipulatePowerUps("divisionScreen", "show"); // shows all power up buttons & their respective counts on divisionScreen
        manipulatePowerUps("randomScreen", "show"); // shows all power up buttons & their respective counts on randomScreen
        
        // sets the skill screen labels
        updatePowerUpsLabels("additionScreen"); // update the power up count to match how many power ups the user has on additionScreen
        updatePowerUpsLabels("subtractionScreen"); // update the power up count to match how many power ups the user has on subtractionScreen
        updatePowerUpsLabels("multiplicationScreen"); // update the power up count to match how many power ups the user has on multiplicationScreen
        updatePowerUpsLabels("divisionScreen"); // update the power up count to match how many power ups the user has on divisionScreen
        updatePowerUpsLabels("randomScreen"); // update the power up count to match how many power ups the user has on randomScreen 
        
        // launches menuScreen
        setScreen("menuScreen"); // changes the app screen to menuScreen
        appScreenSwitchSound(); // plays the button click sound
        guest_mode = false; // since the user logged in, guest mode is set to false
    }
    
    // if the username and password fields are filled and if login information isn't found, shows an error message to the user
    else
    {
      setText("loginScreenWrongLabel","Incorrect password or username."); // configures the error message to have the desired feedback, which is that the login information wasn't found in the database
      displayShortTime("loginScreenWrongLabel", 1000); // displays the error message on the screen for 1 second
    }
    });
  }
});

// loginScreen --> newAccountScreen (if the user clicks the new user button)
onEvent("loginScreenNewUserButton", "click", function(){
  // resets all fields to be empty, just in case the user decides to enter the newAccountScreen twice, the old inputs are discarded, so the user needs to re-enter information. This keep information secure by not showing previous account creations
  setScreen("newAccountScreen"); // sets the screen to allow the user to make an account (newAccountScreen)
  setProperty("newAccountScreenFeedbackLabel", "text", ""); // sets input fields to empty
  setProperty("newAccountScreenNameInput", "text", ""); // sets name input field to empty 
  setProperty("newAccountScreenUsernameInput", "text", ""); // sets username input fields to empty
  setProperty("newAccountScreenPasswordInput", "text", ""); // sets password input fields to empty
  setProperty("newAccountScreenRetypeInput", "text", ""); // sets confirm password input fields to empty
  
  // resets password masks
  new_account_login.password = ""; // sets the actual password storage to a blank string, since that is what we set the password input field to
  new_account_login.passwordFiller = ""; // sets the masked password filler storage to a blank string, since that is what we set the password input field to
  
  new_account_confirm.password = ""; // sets the confirm password storage to a blank string, since that is what we set the confirm password input field to
  new_account_confirm.passwordFiller = ""; // sets the masked conirm password filler storage to a blank string, since that is what we set the confirm password input field to
  
  appScreenSwitchSound(); // plays button click sound
});

// creates a new account for a user
// only goes from newAccountScreen --> menuScreen if all inputs are valid
onEvent("newAccountScreenLoginButton", "click", function(){
  /*
  INPUTS:
    Name, username, password, retyped-password
  
  LOGIC:
    - Won't allow a user to create the account if any fields are empty
    - Won't allow a user to create an account if passwords don't match
    - Won't allow a user to create an account if the username is already in use. 
  */
  appScreenSwitchSound(); // button click noise
  
  // gets login information from user
  user_enter = getText("newAccountScreenUsernameInput").toLowerCase(); // gets what the user entered for their username and sets it to all lowercase (no uppercase letters in username)
  pass_enter = new_account_login.password; // gets the actual password the user entered, not the masked, "***"
  password = pass_enter; // unencrypted password 
  login.password = password; // sets the acutal, unmasked login password to be the actual password the user entered
  pass_confirm_enter = new_account_confirm.password; // gets the confirm, acutal password that the user entered, not the "***"
  name_enter = getText("newAccountScreenNameInput"); // gets the name the user entered
  
  // checks if any field is empty, and if they are, shows the user an error message
  if(user_enter.trim() == "" || pass_enter.trim() == "" || name_enter.trim() == ""){
    setText("newAccountScreenFeedbackLabel","Name, Username, or Password cannot be empty."); // configures the error label's text to tell the user that they can't have any empty fields
    displayShortTime("newAccountScreenFeedbackLabel", 1000); // displays the error message for 1 second 
  } 
  
  // checks if the password and confirm password match
  else if ((pass_enter != pass_confirm_enter))
  {
    setProperty("newAccountScreenFeedbackLabel", "text", "Passwords don't match"); // configures the error label's text to tell the user that the password and confirm passwords fields don't match
    displayShortTime("newAccountScreenFeedbackLabel", 1000); // displays error message for 1 second
  }
  
  // searches through the login database to see if the username the user entered is already taken
  else {
    readRecords("login_information", {username:user_enter}, function(records) {
      
      // checks if account is already in use
      if (records.length > 0) {    
          setText("newAccountScreenFeedbackLabel","Oops, it seems like this username is already in use. Please head back to login!"); // configures the error label's text to tell the user that the username is already in use
          displayShortTime("newAccountScreenFeedbackLabel", 1000); // displays error message for 1 second
      }
      
      // creates the account if the username isn't already found
      else
      {
        pass_enter = SHA512(pass_enter); // encrypts password the user entered
        
        createRecord("login_information", {username:user_enter, password:pass_enter, problems_answered:0, name:name_enter, problems_correct:0, problems_incorrect:0,badge_1:false,badge_2:false,badge_3:false,badge_4:false, meke_coin:0, time_saver:0, eliminate_choice: 0, question_skip: 0, coin_multiplier: 0, private_profile: false, additionScreen: 0, subtractionScreen: 0, multiplicationScreen: 0, divisionScreen: 0, randomScreen: 0}, function(record) {
          /* default default initializers for a new user. Default settings are below
          username: the username the user entered
          password: the encrypted password
          problems_answerd: 0
          name: the name the user entered
          problems_correct: 0
          problems_incorrect: 0
          
          badge1: false (have not achieved it yet)
          badge2: false (have not achieved it yet)
          badge3: false (have not achieved it yet)
          badge4: false (have not achieved it yet)
          
          time_saver: 0 (no power ups)
          question_skip: 0 (no power ups)
          coin_multiplier: 0 (no power ups)
          elminate_choice (no power ups)
          
          additionScreen: 0 (no problems answered correctly in addition mode)
          subtractionScreen: 0 (no problems answered correctly in addition mode)
          multiplicationScreen: 0 (no problems answered correctly in addition mode)
          divisionScreen: 0 (no problems answered correctly in addition mode)
          randomScreen: 0 (no problems answered correctly in addition mode)
          
          private_profile: false (user has a public profile by default)
          
          */
          problems_answered = 0; // sets the global variable for the total number of problems the user answerd to zero
          setProperty("menuScreenTotalProblemsLabel", "text", problems_answered);
          user_id = record.id;
        
         });
        
        // retrives the user_id for a user
        readRecords("login_information", {}, function(records) {
          for (var i =0; i < records.length; i++) {
            user_id = records[i].id;
          }
          
          user_id += 1; // always one more than the last record made
        });
        
        // settings for the user
        guest_mode = false; // since the user made an account, not guest mode
        setScreen("menuScreen"); // sets screen to menuScreen
        appScreenSwitchSound(); // button click sound
        meke_coin = 0; // user has no Meke coin
        time_saver = 0; // user has no time saver power up
        eliminate_choice = 0; // user has no elminate choice power up
        question_skip = 0; // user has no question skip power up
        coin_multiplier = 0; // user has no coin multiplier power up
        private_profile = false; // user has a public profile by default
        
        // configures the menuScreen welcome label to show the user's name
        setProperty("menuScreenWelcomeLabel", "text", "Welcome " + name_enter + "!");
      }
      
      });
  }
});

// masks the password typed on loginScreen
onEvent("loginScreenPasswordInput", "input", function() {
  // Credit: https://studio.code.org/projects/applab/vWDmwx9A3KwcT9HndDwlVHap_pCWW7qJyJPoV9efDXg/view
  
  // displays "*" instead of the actual password, and the actual password is stored in a dictionary-type object
  var content = getText("loginScreenPasswordInput");
  
  // Checking if backspace
  if (content.length < login.password.length){
    login.password = login.password.slice(0, -1);
    login.passwordFiller = login.passwordFiller.slice(0, -1);
  } else {
  
  
    if (login.password.length == 0){
      login.password = content;
        login.passwordFiller+="*";
    } else {
      login.password += content.substring(login.password.length);
       login.passwordFiller+="*";
    }
  }
  
  setText("loginScreenPasswordInput", login.passwordFiller);
  //console.log(login.password);
  
});

// masks the password typed on newAccountScreen
onEvent("newAccountScreenPasswordInput", "input", function() {
  // Credit: https://studio.code.org/projects/applab/vWDmwx9A3KwcT9HndDwlVHap_pCWW7qJyJPoV9efDXg/view
  
  // displays "*" instead of the actual password, and the actual password is stored in a dictionary-type object
  var content = getText("newAccountScreenPasswordInput");
  
  // Checking if backspace
  if (content.length < new_account_login.password.length){
    new_account_login.password = new_account_login.password.slice(0, -1);
    new_account_login.passwordFiller = new_account_login.passwordFiller.slice(0, -1);
  } else {
  
    if (new_account_login.password.length == 0){
      new_account_login.password = content;
        new_account_login.passwordFiller+="*";
    } else {
      new_account_login.password += content.substring(new_account_login.password.length);
       new_account_login.passwordFiller+="*";
    }
  }
  
  setText("newAccountScreenPasswordInput", new_account_login.passwordFiller);
  
});

// masks password typed in the retype password field of the newAccountScreen
onEvent("newAccountScreenRetypeInput", "input", function() {
  // Credit: https://studio.code.org/projects/applab/vWDmwx9A3KwcT9HndDwlVHap_pCWW7qJyJPoV9efDXg/view
  
  // displays "*" instead of the actual password, and the actual password is stored in a dictionary-type object
  var content = getText("newAccountScreenRetypeInput");
  
  // Checking if backspace
  if (content.length < new_account_confirm.password.length){
    new_account_confirm.password = new_account_confirm.password.slice(0, -1);
    new_account_confirm.passwordFiller = new_account_confirm.passwordFiller.slice(0, -1);
  } else {
    if (new_account_confirm.password.length == 0){
      new_account_confirm.password = content;
        new_account_confirm.passwordFiller+="*";
    } else {
      new_account_confirm.password += content.substring(new_account_confirm.password.length);
       new_account_confirm.passwordFiller+="*";
    }
  }
  
  setText("newAccountScreenRetypeInput", new_account_confirm.passwordFiller);
});

// masks password typed in the new password field of the passwordChangeScreen
onEvent("passwordChangeScreenNewPasswordInput", "input", function() {
  // displays "*" instead of the actual password, and the actual password is stored in a dictionary-type object
  var content = getText("passwordChangeScreenNewPasswordInput");
  
  // Checking if backspace
  if (content.length < change_new_pass.password.length){
    change_new_pass.password = change_new_pass.password.slice(0, -1);
    change_new_pass.passwordFiller = change_new_pass.passwordFiller.slice(0, -1);
  } else {
    if (change_new_pass.password.length == 0){
      change_new_pass.password = content;
        change_new_pass.passwordFiller+="*";
    } else {
      change_new_pass.password += content.substring(change_new_pass.password.length);
       change_new_pass.passwordFiller+="*";
    }
  }
  
  setText("passwordChangeScreenNewPasswordInput", change_new_pass.passwordFiller);
});

// masks password typed in the confirm password field of the passwordChangeScreen
onEvent("passwordChangeScreenConfirmPasswordInput", "input", function() {
  // Credit: https://studio.code.org/projects/applab/vWDmwx9A3KwcT9HndDwlVHap_pCWW7qJyJPoV9efDXg/view
  
  // displays "*" instead of the actual password, and the actual password is stored in a dictionary-type object
  var content = getText("passwordChangeScreenConfirmPasswordInput");
  
  // Checking if backspace
  if (content.length < change_confirm_pass.password.length){
    change_confirm_pass.password = change_confirm_pass.password.slice(0, -1);
    change_confirm_pass.passwordFiller = change_confirm_pass.passwordFiller.slice(0, -1);
  } else {
    if (change_confirm_pass.password.length == 0){
      change_confirm_pass.password = content;
        change_confirm_pass.passwordFiller+="*";
    } else {
      change_confirm_pass.password += content.substring(change_confirm_pass.password.length);
       change_confirm_pass.passwordFiller+="*";
    }
  }
  
  setText("passwordChangeScreenConfirmPasswordInput", change_confirm_pass.passwordFiller);
});

// masks password typed in the current password field of the passwordChangeScreen
onEvent("passwordChangeScreenCurrentPasswordInput", "input", function() {
  // Credit: https://studio.code.org/projects/applab/vWDmwx9A3KwcT9HndDwlVHap_pCWW7qJyJPoV9efDXg/view
  
  // displays "*" instead of the actual password, and the actual password is stored in a dictionary-type object
  var content = getText("passwordChangeScreenCurrentPasswordInput");
  
  // Checking if backspace
  if (content.length < change_curr_pass.password.length){
    change_curr_pass.password = change_curr_pass.password.slice(0, -1);
    change_curr_pass.passwordFiller = change_curr_pass.passwordFiller.slice(0, -1);
  } else {
    if (change_curr_pass.password.length == 0){
      change_curr_pass.password = content;
        change_curr_pass.passwordFiller+="*";
    } else {
      change_curr_pass.password += content.substring(change_curr_pass.password.length);
       change_curr_pass.passwordFiller+="*";
    }
  }
  
  setText("passwordChangeScreenCurrentPasswordInput", change_curr_pass.passwordFiller);
});

// newAccountScreen --> loginScreen
onEvent("newAccountScreenBackButton", "click", function(){
  setProperty("loginScreenUsernameInput", "text", ""); // reset username input text
  setProperty("loginScreenPasswordInput", "text", ""); // reset password input text
  setScreen("loginScreen"); // change the screen back to the login screen
  setProperty("loginScreenWrongLabel", "hidden", true); // hide the label that indicates if the user has entered in an incorrect login
  appScreenSwitchSound(); // play screen switch noise through method
});

// [RUN] menuScreen -->  skillSettingsScreen
onEvent("menuScreenAdditionButton", "click", function(){
  configureSkill("additionScreen"); // configure skill screen with method
  appScreenSwitchSound(); // play screen switch noise through method
});

// additionScreen --> menuScreen
onEvent("additionScreenBackButton", "click", function(){
  setScreen("menuScreen"); // changes to menuScreen
  updatePowerUpDatabase(); // updates the database with any power ups the user used in additionScreen
  stopTimedLoop(); // stops the timed loop if the user was in timed mode
  appScreenSwitchSound(); // play screen switch noise through method
});

// [RUN] menuScreen --> skillSettingsScreen
onEvent("menuScreenSubtractionButton", "click", function(){
  configureSkill("subtractionScreen"); // configure skill screen with method
});

// subtractionScreen --> menuScreen
onEvent("subtractionScreenBackButton", "click", function(){
  setScreen("menuScreen"); // changes to menuScreen
  updatePowerUpDatabase(); // updates the database with any power ups the user used in subtractionScreen
  stopTimedLoop(); // stops the timed loop if the user was in timed mode
  appScreenSwitchSound(); // play screen switch noise through method
});

// [RUN] menuScreen --> skillSettingsScreen
onEvent("menuScreenMultiplicationButton", "click", function(){
  configureSkill("multiplicationScreen"); // configure skill screen with method
});

// multiplicationScreen --> menuScreen
onEvent("multiplicationScreenBackButton", "click", function(){
  setScreen("menuScreen"); // changes to menuScreen
  updatePowerUpDatabase(); // updates the database with any power ups the user used in multiplicationScreen
  stopTimedLoop(); // stops the timed loop if the user was in timed mode
  appScreenSwitchSound(); // play screen switch noise through method
});

// [RUN] menuScreen --> skillSettingsScreen
onEvent("menuScreenDivisionButton", "click", function(){
  configureSkill("divisionScreen"); // configure skill screen with method
});

// divisionScreen --> menuScreen
onEvent("divisionScreenBackButton", "click", function(){
  setScreen("menuScreen"); // changes to menuScreen
  updatePowerUpDatabase(); // updates the database with any power ups the user used in divisionScreen
  stopTimedLoop(); // stops the timed loop if the user was in timed mode
  appScreenSwitchSound(); // play screen switch noise through method
});

// [RUN] menuScreen --> skillSettingsScreen
onEvent("menuScreenRandomButton", "click", function(){
  configureSkill("randomScreen"); // configure skill screen with method
});

// randomScreen --> menuScreen
onEvent("randomScreenBackButton", "click", function(){
  setScreen("menuScreen"); // changes to menuScreen
  updatePowerUpDatabase(); // updates the database with any power ups the user used in randomScreen
  stopTimedLoop(); // stops the timed loop if the user was in timed mode
  appScreenSwitchSound(); // play screen switch noise through method
});

// menuScreen --> instructionScreen
onEvent("menuScreenInstructionsButton","click",function(){
  setScreen("instructionScreen"); // shows the instructionScreen
  appScreenSwitchSound(); // play screen switch noise through method
  setText("instructionScreenInstructionsTextLabel", "Welcome to Meke! This app is focused on teaching basic math expressions.\n Each button on the menu screen will lead to a skill, as described on the button itself. Random is a combination of all the skills.");
});

// [TUTORIAL LINK] instructionScreen --> tutorial
onEvent("instructionScreenYoutubeButton", "click", function()
{
  open("https://youtu.be/k-nZDKGu-7M"); // links to the Meke youtube tutorial
  appScreenSwitchSound(); // play screen switch noise through method
});

// [TUTORIAL LINK] instructionScreen --> tutorial
onEvent("instructionScreenThumbnailButton", "click", function(){
  open("https://youtu.be/k-nZDKGu-7M"); // links to the Meke youtube tutorial
  appScreenSwitchSound(); // play screen switch noise through method
});

// instructionScreen --> menuScreen
onEvent("instructionScreenBackButton", "click", function()
{
  setScreen("menuScreen"); // goes to menuScreen
  appScreenSwitchSound(); // play screen switch noise through method
});

// feedbackScreen --> menuScreen
onEvent("feedbackScreenMenuButton", "click", function()
{
  if(!guest_mode){ // check if the user is not in guest mode
    setProperty("menuScreenTotalProblemsLabel", "text", problems_answered); // if logged in, set the total problems label to the total number of problems the user answered
  }
  setScreen("menuScreen"); // goes to menuScreen
  appScreenSwitchSound(); // play screen switch noise through method
});

// menuScreen --> settingsScreen
onEvent("menuScreenSettingsButton","click",function(){
  loadSound("settingsScreen"); // updates the feedback sound setting on settingsScreen to match the its muted/unmuted status
  loadMusic("settingsScreen"); // updates the background music setting on settingsScreen to match the its muted/unmuted status
  setScreen("settingsScreen"); // goes to settingsScreen
  configureSettingsScreen(); // loads the settingsScreen labels (username, name, password, profile visibility)
  appScreenSwitchSound(); // play screen switch noise through method
});

// edit the user's name
onEvent("settingsScreenNameEditButton", "click", function()
{
  setProperty("nameChangeScreenCurrentNameLabel", "text", name_enter); // sets the current name of the user to display
  appScreenSwitchSound(); // button click sound
  setScreen("nameChangeScreen"); // settingsScreen --> nameChangeScreen
  setProperty("nameChangeScreenNewNameInput", "text", ""); // name input is set to empty
});

// edit the user's username
onEvent("settingsScreenUsernameEditButton", "click", function()
{
  setProperty("usernameChangeScreenErrorMessage", "hidden", true); // hides the error messsage on the name change screen if the user had already recieved it
  setProperty("usernameChangeScreenCurrentUsername", "text", user_enter); // sets the current username label to be the user's username
  appScreenSwitchSound(); // button click sound
  setScreen("usernameChangeScreen"); // settingsScreen --> usernameChangeScreen
  setProperty("usernameChangeScreenNewUsernameInput", "text", ""); // blank input space for user
  
});

// save the changes to the user's username
onEvent("nameChangeScreenSaveButton", "click", function()
{
  appScreenSwitchSound(); // play screen switch noise through method
  saveNameChanges(); // updates the database with the new name the user entered
});

// save the changes to the user's password
onEvent("usernameChangeScreenSaveButton", "click", function()
{
  appScreenSwitchSound(); // play screen switch noise through method
  saveUsernameChanges(); // updates the database with the new username the user entered
});

// nameChangeScreen --> settingsScreen
onEvent("nameChangeScreenBackButton", "click", function()
{
  // user cancels the name change
  appScreenSwitchSound(); // play screen switch noise through method
  setScreen("settingsScreen"); // goes to settingsScreen
});

// usernameChangeScreen --> settingsScreen;
onEvent("usernameChangeScreenBackButton", "click", function(){
  // user cancels username change
  appScreenSwitchSound(); // play screen switch noise through method
  setScreen("settingsScreen"); // goes to settingsScreen
});

// passwordChangeScreen --> settingsScreen
onEvent("passwordChangeScreenBackButton", "click", function()
{
  appScreenSwitchSound(); // play screen switch noise through method
  setScreen("settingsScreen"); // goes to settingsScreen
});

// edit the user's password
onEvent("settingsScreenPasswordEditButton", "click", function()
{
  // resets password masks
  change_new_pass.password = ""; 
  change_new_pass.passwordFiller = "";
  
  change_confirm_pass.password = "";
  change_confirm_pass.passwordFiller = "";
  
  change_curr_pass.password = "";
  change_curr_pass.passwordFiller = "";
  
  setProperty("passwordChangeScreenNewPasswordInput", "text", ""); // sets the blank current password input area so user can enter a new password
  setProperty("passwordChangeScreenConfirmPasswordInput", "text", ""); // sets the blank new password input area so user can enter a new password
  setProperty("passwordChangeScreenCurrentPasswordInput", "text", ""); // sets the blank confirm new password input area so user can enter a new password
  
  appScreenSwitchSound(); // play screen switch noise through method
  setScreen("passwordChangeScreen"); // settingsScreen --> passwordChangeScreen
});

// save the changes to the user's password
onEvent("passwordChangeScreenSaveButton", "click", function()
{
  savePasswordChanges(); // button click sound
  appScreenSwitchSound(); // play screen switch noise through method
});

// settingsScreen --> loginScreen, logs user out
onEvent("settingsScreenLogOutButton", "click", function(){
  setProperty("loginScreenUsernameInput", "text", ""); // resets the username input field to be blank 
  setProperty("loginScreenPasswordInput", "text", ""); // resets the password input field to be blank
  login.password = ""; // resets what user entered to login
  login.passwordFiller = "";
  
  setProperty("menuScreenTotalProblemsLabel","hidden",false);
  setProperty("menuScreenWelcomeLabel","hidden",false);
  setProperty("loginScreenWrongLabel", "hidden", true);
  guest_mode = false;
  appScreenSwitchSound(); // play screen switch noise through method
  setScreen("loginScreen");
});

// settingsScreen --> menuScreen
onEvent("settingsScreenBackButton", "click", function(){
  setScreen("menuScreen");
  appScreenSwitchSound(); // play screen switch noise through method
});

// edit user profile visibility
onEvent("settingsScreenProfilePrivateEditButton", "click", function(){
  if (private_profile) // if profile is currently private
  {
    setProperty("privateChangeScreenCurrentVisible", "text", "Private"); // change text label to show status as private
  }
  else if (!private_profile) // profile is public
  {
    setProperty("privateChangeScreenCurrentVisible", "text", "Public"); // change text label to show status as public
  }
  setScreen("privateChangeScreen"); // change screen to private mode editor screen
  appScreenSwitchSound(); // play screen switch noise through method
});

// privateChangeScreen --> settingsScreen
onEvent("privateChangeScreenBackButton", "click", function()
{
  setScreen("settingsScreen"); // move from the private change screen back to the settings screen
});

// save user profile visibility
onEvent("privateChangeScreenSaveButton", "click", function(){
  saveVisibleChanges(); // call method to update any changed information in database
  setScreen("settingsScreen"); // move from the private change screen back to the settings screen
  appScreenSwitchSound(); // play screen switch noise through method
});

// shows the user how many problems they have selected to do
onEvent("skillSettingsScreenQuestionsSlider", "change", function()
{
  num_questions = getNumber("skillSettingsScreenQuestionsSlider"); // update the amount of questions user has chosen
  setProperty("skillSettingsScreenQuestionsLabel", "text", "Questions: " + num_questions); // change text on current screen to reflect the slider
});

// saves settings information
onEvent("skillSettingsScreenBeginButton","click",function(){
  appScreenSwitchSound(); // plays app sound if user hasn't disabled it
  updateSettings(skill_clicked); // updates the settings to confugre the skill to user's choice
  loadSound(skill_clicked); // load sound icon visbility
  loadMusic(skill_clicked); // load music icon visbility
});

onEvent("settingsScreenMusicDropdown", "change", function()
{
  var wanted = getText("settingsScreenMusicDropdown"); // get the new music choice from the user
  stopSound(sound_choice); // stop the current music
  sound_choice = background_sounds[wanted]; // update the sound choice variable to the new music choice
  if (music_status) // if the user currently has music selected
  {
    playSound(sound_choice, true); // start playing the new choice of music
  }
});

// explanation for help on skill difficulty
onEvent("skillSettingsScreenDifficultyHelpButton", "click", function()
{
  // display help message for difficulty, and edit the visibility of prompt elements
  setProperty("skillSettingsScreenExplanationArea", "text", "Difficulty\n\nMeke recommends the optimum difficulty for you based on your learning patterns.\n\nFeel free to override this and choose the skill you want!");
  setProperty("skillSettingsScreenEliminateButton", "hidden", false);
  setProperty("skillSettingsScreenExplanationArea", "hidden", false);
  appScreenSwitchSound(); // play screen switch noise through method
});

// explanation for help on skill mode (practice or timed)
onEvent("skillSettingsScreenModeHelpButton", "click", function()
{
  // display help message for timed or practice, and edit the visibility of prompt elements
  setProperty("skillSettingsScreenExplanationArea", "text", "Mode\n\nPlay in practice or timed modes. Only timed modes award Meke coin.\n\nNote: Must be logged in to earn Meke Coin");
  setProperty("skillSettingsScreenEliminateButton", "hidden", false);
  setProperty("skillSettingsScreenExplanationArea", "hidden", false);
  appScreenSwitchSound(); // play screen switch noise through method
});

// closes help windows
onEvent("skillSettingsScreenEliminateButton", "click", function(){
  // make both the button and prompt elements not visibile on exit
  setProperty("skillSettingsScreenExplanationArea", "hidden", true);
  setProperty("skillSettingsScreenEliminateButton", "hidden", true);
  appScreenSwitchSound(); // play screen switch noise through method
});

// feedbackScreen --> skillScreen based on whichever one the user just completed (addition, subtraction, multiplication, or division)
onEvent("feedbackScreenReplayButton", "click", function()
{
  progress_length = 0; // reset progress bar length variable
  setProperty(global_current_screen + "ProgressBarImage", "width", progress_length); // set the width of the bar to 0
  total_questions = {}; // reset dictionary of questions
  question_number = 1; // reset question number variable
  multiplier = 1; // reset multiplier for the current skill
  updateScreen(global_current_screen); // update the screen for the skill user has chosen
  setScreen(global_current_screen); // change screen to the screen the user has chosen
  is_active = true; // change variable to being the skill and accept responses
  appScreenSwitchSound(); // play screen switch noise through method
  
});

// clears all filters in the feedback area
onEvent("feedbackScreenClearFilterButton", "click", function()
{
  setProperty("feedbackScreenQuestionsArea", "text", message); // reset filter to none
  appScreenSwitchSound(); // play screen switch noise through method
});

// shows only questions the user got correct in the feedback area
onEvent("feedbackScreenCorrectFilterButton", "click", function()
{
  filter_results("Correct"); // call method to filter feedback to correct
  appScreenSwitchSound(); // play screen switch noise through method
});

// shows only questions the user got wrong in the feedback area
onEvent("feedbackScreenWrongFilterButton", "click", function()
{
  filter_results("Wrong!"); // call method to filter feedback to wrong
  appScreenSwitchSound(); // play screen switch noise through method
});

// toggle the music on and off when button is pressed in the settings screen
onEvent("settingsScreenMusicButton","click",function(){
  if (!music_status){ // if music is currently off
    playSound(sound_choice, true); // start playing music
    setProperty("settingsScreenMusicButton","icon-color","rgba(89,143,241,1.0)"); // make the icon completely visible
    music_status = true; // change setting for music to true
  } else{ // music is currently on
    stopSound(sound_choice); // stop playing music
    music_status = false; // change setting for music to false
    setProperty("settingsScreenMusicButton","icon-color","rgba(89,143,241,0.5)"); // make icon half visibile
  }
  appScreenSwitchSound(); // play screen switch noise through method
});

// toggle the sound effects (correct answer sound, alert sound, etc) on and off when the button is pressed in the settings screen
onEvent("settingsScreenSoundButton","click",function(){
  updateSound("settingsScreen"); // toggle the sound effects
});

// menuScreen --> resourceScreen
onEvent("menuScreenResourceButton", "click", function()
{
 setScreen("resourceScreen"); // switch screen to resource screen (screen with tutorial videos)
 appScreenSwitchSound(); // play screen switch noise through method
});

// links the resourceScreen for more complex skills
onEvent("resourceScreenComplexButton", "click", function()
{
  open("https://artofproblemsolving.com/videos"); // open link to videos
});

// menuScreen --> profileScreen
onEvent("menuScreenProfileButton","click",function(){
  appScreenSwitchSound(); // play screen switch noise through method
  if (guest_mode){ // if user is in guest mode
    menuScreenError(); // call method to display message that this feature is not available in guest mode
  } else{
    loadProfile(); // load elements of profile screen for user through method
    setScreen("profileScreen"); // change to profile screen
  }
});


// profileScreen --> settingsScreen
onEvent("profileScreenEditButton", "click", function()
{
  setScreen("settingsScreen"); // change screen to settings screen
  configureSettingsScreen(); // call method to configure settings screen
  appScreenSwitchSound(); // play screen switch noise through method
});

// profileScreen --> menuScreen
onEvent("profileScreenBackButton","click",function(){
  setScreen("menuScreen"); // change screen to menu screen
  appScreenSwitchSound(); // play screen switch noise through method
});


onEvent("profileScreenBadge1","click",function(){
  /* 
  when the user clicks on a badge, do one of the following:
    1. if the user has the badge, display how they received it
    2. if the user does not have the badge, detect if they have unlocked it. if they have, display it
      - otherwise, tell them they have not unlocked the badge yet.
  */
  readRecords("login_information", {username:user_enter, password:pass_enter}, function(records) {
    if (records.length>0) { 
      var checkUser = records[0];
      
      if(checkUser.badge_1 == false){
        setText("profileScreenBadgeStatusLabel","You have not unlocked this badge yet!"); // configures message for the to be shown to user
        displayShortTime("profileScreenBadgeStatusLabel", 1000); // shows user message for a 1 second
      }
      
      if (checkUser.badge_1 == true){
        setText("profileScreenBadgeStatusLabel","You unlocked this badge for: \n100 correct answers!"); // configures message for the to be shown to user
        setProperty("profileScreenBadgeStatusLabel","hidden",false); // shows user message for a 1 second
      }
    }
  });
  appScreenSwitchSound(); // play screen switch noise through method
});


onEvent("profileScreenBadge2","click",function(){
  /* 
  when the user presses on a badge, do one of the following:
    1. if the user has the badge, display how they received it
    2. if the user does not have the badge, detect if they have unlocked it. if they have, display it
      - otherwise, tell them they have not unlocked the badge yet.
  */
  readRecords("login_information", {username:user_enter, password:pass_enter}, function(records) {
    if (records.length>0) { 
      var checkUser = records[0];
      
      if(checkUser.badge_2 == false){
        setText("profileScreenBadgeStatusLabel","You have not unlocked this badge yet!"); // configures message for the to be shown to user
        displayShortTime("profileScreenBadgeStatusLabel", 1000); // shows user message for a 1 second
      }
      
      if (checkUser.badge_2 == true){
        setText("profileScreenBadgeStatusLabel","You unlocked this badge for: \n500 correct answers!"); // configures message for the to be shown to user
        setProperty("profileScreenBadgeStatusLabel","hidden",false); // shows user message for a 1 second
      }
    }
  });
  appScreenSwitchSound(); // play screen switch noise through method
});


onEvent("profileScreenBadge3","click",function(){
  /* 
  when the user presses on a badge, do one of the following:
    1. if the user has the badge, display how they received it
    2. if the user does not have the badge, detect if they have unlocked it. if they have, display it
      - otherwise, tell them they have not unlocked the badge yet.
  */
  readRecords("login_information", {username:user_enter, password:pass_enter}, function(records) {
    if (records.length>0) { 
      var checkUser = records[0];
      
      if(checkUser.badge_3 == false){
        setText("profileScreenBadgeStatusLabel","You have not unlocked this badge yet!"); // configures message for the to be shown to user
        displayShortTime("profileScreenBadgeStatusLabel", 1000); // shows user message for a 1 second
      }
      
      if (checkUser.badge_3 == true){
        setText("profileScreenBadgeStatusLabel","You unlocked this badge for: \n1000 correct answers!"); // configures message for the to be shown to user
        setProperty("profileScreenBadgeStatusLabel","hidden",false); // shows user message for a 1 second
      } 
    }
  });
  appScreenSwitchSound(); // play screen switch noise through method
});


onEvent("profileScreenBadge4","click",function(){
  /* 
  when the user presses on a badge, do one of the following:
    1. if the user has the badge, display how they received it
    2. if the user does not have the badge, detect if they have unlocked it. if they have, display it
      - otherwise, tell them they have not unlocked the badge yet.
  */
  readRecords("login_information", {username:user_enter, password:pass_enter}, function(records) {
    if (records.length>0) { 
      var checkUser = records[0];
      
      if (checkUser.badge_4 == false){
        setText("profileScreenBadgeStatusLabel","You have not unlocked this badge yet!"); // configures message for the to be shown to user
        displayShortTime("profileScreenBadgeStatusLabel", 1000); // shows user message for a 1 second
      }
      
      if (checkUser.badge_4 == true){
        setText("profileScreenBadgeStatusLabel","You unlocked this badge for: \n5000 correct answers!"); // configures message for the to be shown to user
        setProperty("profileScreenBadgeStatusLabel","hidden",false); // shows user message for a 1 second
      }
    }
  });
  appScreenSwitchSound(); // play screen switch noise through method
});

// menuScreen -> leaderboardScreen, also call the loadLeaderboardScreen function to set the elements of the leaderboard screen.
onEvent("menuScreenLeaderboardButton","click", function(){
  appScreenSwitchSound(); // play screen switch noise through method
  if (guest_mode){
    menuScreenError(); // won't show leaderboardScreen if user isn't signed in
  } else{
    setScreen("leaderboardScreen"); // set to leaderbardScreen
    loadLeaderboardScreen("total"); // load the filter on the leaderboardScreen as based off the total number of problems the user answered
    
  }
});

// menuScreen -> shopScreen
onEvent("menuScreenShopButton","click",function(){
  appScreenSwitchSound(); // play screen switch noise through method
  if (guest_mode){
    menuScreenError(); // won't show shopScreen if user isn't signed in
  } else{
    loadShop(); // loads the shop and the current amount of Meke coin the user has
    setProperty("shopScreenInformationLabel","hidden",true); // hides explanation/tutorial label
    setProperty("shopScreenInformationExitButton","hidden",true); // hides explanation label close buton
    setScreen("shopScreen"); // set to shopScreen
  }
});

// shopScreen -> menuScreen
onEvent("shopScreenBackButton","click",function(){
  setScreen("menuScreen"); // set to menuScreen
  appScreenSwitchSound(); // play screen switch noise through method
});

// shows help for user on what the shop is and how to use it
onEvent("shopScreenQuestionButton","click",function(){
  setProperty("shopScreenInformationLabel","text","\n\nWelcome to the Meke Shop!\n\nHere you can buy powerups and items to help you in your math journey! Coins are earned for answering correctly in timed mode. The harder the difficulty, the more coins earned.\n\nClick on the icon of each item to learn about what it does!"); // Shop instructions
  setProperty("shopScreenInformationLabel","hidden",false); // shows shop instructions
  setProperty("shopScreenInformationExitButton","hidden",false); // shows close instructions button
  appScreenSwitchSound(); // play screen switch noise through method
});

// shows help for explanation of time_saver power up
onEvent("shopScreenTimeButton","click",function(){
  setProperty("shopScreenInformationLabel","text","\n\nTime Saver\n\nWhen used, increases the timer for the question for 10 seconds. Cannot be stacked.\n\nCost: 20 Meke Coin");
  setProperty("shopScreenInformationLabel","hidden",false);
  setProperty("shopScreenInformationExitButton","hidden",false);
  appScreenSwitchSound(); // play screen switch noise through method
});

// shows help for explanation of eliminate_choice power up
onEvent("shopScreenEliminateButton","click",function(){
  setProperty("shopScreenInformationLabel","text","\n\nEliminate Choice\nWhen used, eliminates two of the answer choices. Cannot be stacked.\n\nCost: 30 Meke Coin");
  setProperty("shopScreenInformationLabel","hidden",false);
  setProperty("shopScreenInformationExitButton","hidden",false);
  appScreenSwitchSound(); // play screen switch noise through method
});

// shows help for explanation of question_skip power up
onEvent("shopScreenSkipButton","click",function(){
  setProperty("shopScreenInformationLabel","text","\n\nQuestion Skip\nWhen used, skip the current question. Note that when a question is skipped, answer credit is not given.\n\nCost: 40 Meke Coin");
  setProperty("shopScreenInformationLabel","hidden",false);
  setProperty("shopScreenInformationExitButton","hidden",false);
  appScreenSwitchSound(); // play screen switch noise through method
});

// shows help for explanation of coin_multiplier power up
onEvent("shopScreenMultiplierButton","click",function(){
  setProperty("shopScreenInformationLabel","text","\n\nCoin Multiplier\nWhen used, quadruples the amount of coins given in the skill. Only will be effective on one round.\n\nCost: 50 Meke Coin");
  setProperty("shopScreenInformationLabel","hidden",false);
  setProperty("shopScreenInformationExitButton","hidden",false);
  appScreenSwitchSound(); // play screen switch noise through method
});

// closes all help windows
onEvent("shopScreenInformationExitButton","click",function(){
  setProperty("shopScreenInformationLabel","hidden",true);
  setProperty("shopScreenInformationExitButton","hidden",true);
  appScreenSwitchSound(); // play screen switch noise through method
});

// settingsScreen --> menuScreen
onEvent("skillSettingsScreenMenuButton", "click", function()
{
  setScreen("menuScreen");
  appScreenSwitchSound(); // play screen switch noise through method
});

/*
  The next few onEvents help with text box management for the shop screen.
  
  They Ensure the Following whenever anything is entered in:
   - If the user enters in a non-numeric character, delete it.
   - If the item amount is greater than 5000, it will default to 5000. Users can only exchange 5000 items at a time.
   - If the user deletes all the characters in the box, display 0.
   - Otherwise, accept the text as usual.

  The same logic is followed for all the items, except for the meke coin, which has a higher upper limit of 1000000.
  The first on event is commented to show the logic of the event. All other events follow the same logic
*/
onEvent("shopScreenTimeAmount","input",function(){
  // if the text is numeric
  if (isNumeric(getText("shopScreenTimeAmount"))){
    // if the text was zero before
    if(time_cost == 0){
      setText("shopScreenTimeAmount",parseInt(getText("shopScreenTimeAmount"))); // remove leading zero with parseInt
    } 
    
    // if the amount of higher than 5000 (upper limit)
    if(parseInt(getText("shopScreenTimeAmount")) > 5000){
      setText("shopScreenTimeAmount","5000"); // default to 5000
      time_cost = 5000 * 20; // calculate amount for 5000
    } else {
      time_cost = parseInt(getText("shopScreenTimeAmount")) * 20; // calculate cost for anything under 5000
    }
    setText("shopScreenCostLabel","Cost: " + calculateCost() + " Coin"); // update total cost label
  } else if (getText("shopScreenTimeAmount") == ""){ // if numbers were backspaced
    time_cost = 0; // reset cost for powerup to 0
    setText("shopScreenTimeAmount","0"); // change text back to 0
    setText("shopScreenCostLabel","Cost: " + calculateCost() + " Coin"); // recalculate cost
  } else { // character is not numeric
    setText("shopScreenTimeAmount",getText("shopScreenTimeAmount").slice(0,getText("shopScreenTimeAmount").length-1)); // slice the non numeric character off 
  }
});

// MATHEW COMMENT THIS CODE I HAVE NO IDEA WHAT IT DOES AND IT MAKES MY BRAIN HURT HAHAAHAHAHAHAHA
onEvent("shopScreenEliminateAmount","input",function(){
  if (isNumeric(getText("shopScreenEliminateAmount"))){
    if(eliminate_cost == 0){
      setText("shopScreenEliminateAmount",parseInt(getText("shopScreenEliminateAmount")));
    } 
    
    if(parseInt(getText("shopScreenEliminateAmount")) > 5000){
      setText("shopScreenEliminateAmount","5000");
      eliminate_cost = 5000 * 30;
    } else{
      eliminate_cost = parseInt(getText("shopScreenEliminateAmount")) * 30;
    }
    setText("shopScreenCostLabel","Cost: " + calculateCost() + " Coin");
  } else if (getText("shopScreenEliminateAmount") == ""){
    eliminate_cost = 0;
    setText("shopScreenEliminateAmount","0");
    setText("shopScreenCostLabel","Cost: " + calculateCost() + " Coin"); 
  } else {
    setText("shopScreenEliminateAmount",getText("shopScreenEliminateAmount").slice(0,getText("shopScreenEliminateAmount").length-1));
  }
});

// MATHEW COMMENT THIS CODE I HAVE NO IDEA WHAT IT DOES AND IT MAKES MY BRAIN HURT HAHAAHAHAHAHAHA
onEvent("shopScreenSkipAmount","input",function(){
  if (isNumeric(getText("shopScreenSkipAmount"))){
    if(skip_cost == 0){
      setText("shopScreenSkipAmount",parseInt(getText("shopScreenSkipAmount")));
    } 
    
    if(parseInt(getText("shopScreenSkipAmount")) > 5000){
      setText("shopScreenSkipAmount","5000");
      skip_cost = 5000 * 40;
    } else{
      skip_cost = parseInt(getText("shopScreenSkipAmount")) * 40;
    }
    setText("shopScreenCostLabel","Cost: " + calculateCost() + " Coin");
  } else if (getText("shopScreenSkipAmount") == ""){
    skip_cost = 0;
    setText("shopScreenSkipAmount","0");
    setText("shopScreenCostLabel","Cost: " + calculateCost() + " Coin"); 
  } else {
    setText("shopScreenSkipAmount",getText("shopScreenSkipAmount").slice(0,getText("shopScreenSkipAmount").length-1));
  }
});

// MATHEW COMMENT THIS CODE I HAVE NO IDEA WHAT IT DOES AND IT MAKES MY BRAIN HURT HAHAAHAHAHAHAHA
onEvent("shopScreenMultiplierAmount","input",function(){
  if (isNumeric(getText("shopScreenMultiplierAmount"))){
    if(multiplier_cost == 0){
      setText("shopScreenMultiplierAmount",parseInt(getText("shopScreenMultiplierAmount")));
    } 
    
    if(parseInt(getText("shopScreenMultiplierAmount")) > 5000){
      setText("shopScreenMultiplierAmount","5000");
      multiplier_cost = 5000 * 50;
    } else{
      multiplier_cost = parseInt(getText("shopScreenMultiplierAmount")) * 50;
    }
    setText("shopScreenCostLabel","Cost: " + calculateCost() + " Coin");
  } else if (getText("shopScreenMultiplierAmount") == ""){
    multiplier_cost = 0;
    setText("shopScreenMultiplierAmount","0");
    setText("shopScreenCostLabel","Cost: " + calculateCost() + " Coin"); 
  } else {
    setText("shopScreenMultiplierAmount",getText("shopScreenMultiplierAmount").slice(0,getText("shopScreenMultiplierAmount").length-1));
  }
});

// subtracts meke_coin from the user's balance and increases the power up counts
onEvent("shopScreenPurchaseButton","click",function(){
  appScreenSwitchSound(); // play screen switch noise through method
  if(calculateCost() == 0){
    shopScreenError();
  } else{ 
    readRecords("login_information", {username:user_enter}, function(records) {
      if (records.length > 0) {    
        var purchasing_user = records[0];
  
        var user_balance = purchasing_user.meke_coin;
        
        if (user_balance >= calculateCost()){
          purchasing_user.meke_coin = purchasing_user.meke_coin - calculateCost();
          meke_coin = purchasing_user.meke_coin;
          
          purchasing_user.time_saver = purchasing_user.time_saver + parseInt(getText("shopScreenTimeAmount"));
          time_saver = purchasing_user.time_saver;
          
          purchasing_user.eliminate_choice = purchasing_user.eliminate_choice + parseInt(getText("shopScreenEliminateAmount"));
          eliminate_choice = purchasing_user.eliminate_choice;
          
          purchasing_user.question_skip = purchasing_user.question_skip + parseInt(getText("shopScreenSkipAmount"));
          question_skip = purchasing_user.question_skip;
          
          purchasing_user.coin_multiplier = purchasing_user.coin_multiplier + parseInt(getText("shopScreenMultiplierAmount"));
          coin_multiplier = purchasing_user.coin_multiplier;
          
          
          updateRecord("login_information", purchasing_user, function(record, success) {
            if (success) {
              console.log("Record updated with id:" +record.id);
              shopScreenSuccess();
              loadShop();
            } else {
              console.log("Record NOT updated");
              shopScreenError();
            }
          });
        } else {
          shopScreenError();
        }
      }
    });
  }
});

// COMMENT CODE ABOVE
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// filter the leaderboard screen by total questions answered
onEvent("leaderboardScreenQuestionFilter", "click", function(){
  loadLeaderboardScreen("total");
  appScreenSwitchSound(); // play screen switch noise through method
}); 

// filter the leaderboard screen by correct answers
onEvent("leaderboardScreenCorrectFilter", "click", function(){
  loadLeaderboardScreen("correct");
  appScreenSwitchSound(); // play screen switch noise through method
});

// leaderboardScreen -> menuScreen
onEvent("leaderboardScreenBackButton","click",function(){
  setScreen("menuScreen");
  appScreenSwitchSound(); // play screen switch noise through method
});

// profileScreen -> searchScreen, hide all elements of profile screen.
onEvent("profileScreenSearchButton","click",function(){
  setProperty("searchScreenUsernameLabel","hidden",true);
  setProperty("searchScreenTotalQuestionsLabel","hidden",true);
  setProperty("searchScreenCorrectAnswersLabel","hidden",true);
  setProperty("searchScreenIncorrectAnswersLabel","hidden",true);
  setProperty("searchScreenAccuracyLabel","hidden",true);
  setProperty("searchScreenStatsLabel","hidden",true);
  setProperty("searchScreenBadgesLabel","hidden",true);
  setProperty("searchScreenBadge1","hidden",true);
  setProperty("searchScreenBadge2","hidden",true);
  setProperty("searchScreenBadge3","hidden",true);
  setProperty("searchScreenBadge4","hidden",true);
  setProperty("searchScreenErrorLabel","hidden",true);
  setProperty("searchScreenPrivateError", "hidden", true);
  setScreen("searchScreen");
  appScreenSwitchSound(); // play screen switch noise through method
});

// searchScreen -> menuScreen
onEvent("searchScreenBackButton","click",function(){
  setScreen("menuScreen");
  appScreenSwitchSound(); // play screen switch noise through method
});

// searchScreen -> profileScreen
onEvent("searchScreenProfileButton","click",function(){
  setScreen("profileScreen");
  appScreenSwitchSound(); // play screen switch noise through method
});

// when search icon is pressed, load data of the user requested by calling searchProfile
onEvent("searchScreenSearchButton","click",function(){
  searchProfile(getText("searchScreenUsernameInput").toLowerCase());
  appScreenSwitchSound(); // play screen switch noise through method
});

// shopScreen -> exchangeScreen
onEvent("menuScreenExchangeButton","click",function(){
  if (guest_mode) 
  {
    menuScreenError();
  }
  else
  {
    loadExchange();
    exchangeVisible(true);
    setScreen("exchangeScreen");
    setProperty("exchangeScreenUsernameInput", "text", "");
    appScreenSwitchSound(); // play screen switch noise through method
  }
  
});

// exchangeScreen -> menuScreen
onEvent("exchangeScreenBackButton","click",function(){
  setScreen("menuScreen");
  appScreenSwitchSound(); // play screen switch noise through method
});

// checks if the user entered was valid, and calls functions accordingly
onEvent("exchangeScreenSearchButton","click",function(){
  appScreenSwitchSound(); // play screen switch noise through method
  var searched_for = getText("exchangeScreenUsernameInput").toLowerCase();
  readRecords("login_information", {username:searched_for}, function(records) {
    if (records.length > 0) {    
      exchangeVisible(false);
      setProperty("exchangeScreenExchangeUserLabel","text","Exchanging with: " + searched_for);
    } else{
      exchangeVisible(true);
      setProperty("exchangeScreenExchangeUserLabel","text","Exchanging with:");
      exchangePrompt("error");
    }
  });
});

/*
  The next few onEvents help with text box management for the exchange screen.
  
  They Ensure the Following whenever anything is entered in:
   - If the user enters in a non-numeric character, delete it.
   - If the item amount is greater than 5000, it will default to 5000. Users can only exchange 5000 items at a time.
   - If the user deletes all the characters in the box, display 0.
   - Otherwise, accept the text as usual.

  The same logic is followed for all the items, except for the meke coin, which has a higher upper limit of 1000000.
  The first on event is commented to show the logic of the event. All other events follow the same logic
*/
onEvent("exchangeScreenTimeAmount","input",function(){
  // check to see if the new data in the text box is nuermic
  if (isNumeric(getText("exchangeScreenTimeAmount"))){
    // if the text is currently 0, set the data in the text to the entered amount to remove the leading 0
    if(time_exchange == 0){
      setText("exchangeScreenTimeAmount",parseInt(getText("exchangeScreenTimeAmount"))); // change the data to the integer value of the data
    } 
    
    // if the amount in the text box is greater than 5000
    if(parseInt(getText("exchangeScreenTimeAmount")) > 5000){
      setText("exchangeScreenTimeAmount","5000"); // default the text to 5000
      time_exchange = 5000; // change the variable amount to 5000
    } else{
      time_exchange = parseInt(getText("exchangeScreenTimeAmount")); // change the amount to the integer amount
    }
  } else if (getText("exchangeScreenTimeAmount") == ""){ // if the input box was backspaced to no characters
    time_exchange = 0;
    setText("exchangeScreenTimeAmount","0"); // change the text box to 0
  } else { // otherwise the character is not numeric (ex. letter, symbol)
    setText("exchangeScreenTimeAmount",getText("exchangeScreenTimeAmount").slice(0,getText("exchangeScreenTimeAmount").length-1)); // slice the new character off, as all inputs must be nuermic
  }
});

// same logic as above
onEvent("exchangeScreenSkipAmount","input",function(){
  if (isNumeric(getText("exchangeScreenSkipAmount"))){
    if(skip_exchange == 0){
      setText("exchangeScreenSkipAmount",parseInt(getText("exchangeScreenSkipAmount")));
    } 
    
    if(parseInt(getText("exchangeScreenSkipAmount")) > 5000){
      setText("exchangeScreenSkipAmount","5000");
      skip_exchange = 5000;
    } else{
      skip_exchange = parseInt(getText("exchangeScreenSkipAmount"));
    }
  } else if (getText("exchangeScreenSkipAmount") == ""){
    skip_exchange = 0;
    setText("exchangeScreenSkipAmount","0");
  } else {
    setText("exchangeScreenSkipAmount",getText("exchangeScreenSkipAmount").slice(0,getText("exchangeScreenSkipAmount").length-1));
  }
});

// same logic as above
onEvent("exchangeScreenEliminateAmount","input",function(){
  if (isNumeric(getText("exchangeScreenEliminateAmount"))){
    if(eliminate_exchange == 0){
      setText("exchangeScreenEliminateAmount",parseInt(getText("exchangeScreenEliminateAmount")));
    } 
    
    if(parseInt(getText("exchangeScreenEliminateAmount")) > 5000){
      setText("exchangeScreenEliminateAmount","5000");
      eliminate_exchange = 5000;
    } else{
      eliminate_exchange = parseInt(getText("exchangeScreenEliminateAmount"));
    }
  } else if (getText("exchangeScreenEliminateAmount") == ""){
    eliminate_exchange = 0;
    setText("exchangeScreenEliminateAmount","0");
  } else {
    setText("exchangeScreenEliminateAmount",getText("exchangeScreenEliminateAmount").slice(0,getText("exchangeScreenEliminateAmount").length-1));
  }
});

// same logic as above
onEvent("exchangeScreenMultiplierAmount","input",function(){
  if (isNumeric(getText("exchangeScreenMultiplierAmount"))){
    if(multiplier_exchange == 0){
      setText("exchangeScreenMultiplierAmount",parseInt(getText("exchangeScreenMultiplierAmount")));
    } 
    
    if(parseInt(getText("exchangeScreenMultiplierAmount")) > 5000){
      setText("exchangeScreenMultiplierAmount","5000");
      multiplier_exchange = 5000;
    } else{
      multiplier_exchange = parseInt(getText("exchangeScreenMultiplierAmount"));
    }
  } else if (getText("exchangeScreenMultiplierAmount") == ""){
    multiplier_exchange = 0;
    setText("exchangeScreenMultiplierAmount","0");
  } else {
    setText("exchangeScreenMultiplierAmount",getText("exchangeScreenMultiplierAmount").slice(0,getText("exchangeScreenMultiplierAmount").length-1));
  }
});

// same logic as above
onEvent("exchangeScreenMekeCoinAmount","input",function(){
  if (isNumeric(getText("exchangeScreenMekeCoinAmount"))){
    if(coin_exchange == 0){
      setText("exchangeScreenMekeCoinAmount",parseInt(getText("exchangeScreenMekeCoinAmount")));
    } 
    
    if(parseInt(getText("exchangeScreenMekeCoinAmount")) > 1000000){
      setText("exchangeScreenMekeCoinAmount","1000000");
      coin_exchange = 1000000;
    } else{
      coin_exchange = parseInt(getText("exchangeScreenMekeCoinAmount"));
    }
  } else if (getText("exchangeScreenMekeCoinAmount") == ""){
    coin_exchange = 0;
    setText("exchangeScreenMekeCoinAmount","0");
  } else {
    setText("exchangeScreenMekeCoinAmount",getText("exchangeScreenMekeCoinAmount").slice(0,getText("exchangeScreenMekeCoinAmount").length-1));
  }
});

/*
  This onEvent handles the exchanging of items between users. More information about sections can be found
  withing the code itself. 
*/
onEvent("exchangeScreenExchangeButton","click",function(){
  appScreenSwitchSound(); // play screen switch noise through method
  
  // access the records of the user giving the items.
  readRecords("login_information", {username:user_enter}, function(records) {
    if (records.length > 0) {    
      // get a variable of the current user object
      var currentUser = records[0];
      
      // check if the users has enough items to exchange what they input in the box
      if(time_exchange <= currentUser.time_saver && eliminate_exchange <= currentUser.eliminate_choice && skip_exchange <= currentUser.question_skip && multiplier_exchange <= currentUser.coin_multiplier && coin_exchange <= currentUser.meke_coin){
        // take the items from the user giving the items
        currentUser.time_saver = currentUser.time_saver - parseInt(getText("exchangeScreenTimeAmount"));
        time_saver = currentUser.time_saver;
        
        // take the items from the user giving the items
        currentUser.eliminate_choice = currentUser.eliminate_choice - parseInt(getText("exchangeScreenEliminateAmount"));
        eliminate_choice = currentUser.eliminate_choice;
        
        // take the items from the user giving the items
        currentUser.question_skip = currentUser.question_skip - parseInt(getText("exchangeScreenSkipAmount"));
        question_skip = currentUser.question_skip;
        
        // take the items from the user giving the items
        currentUser.coin_multiplier = currentUser.coin_multiplier - parseInt(getText("exchangeScreenMultiplierAmount"));
        coin_multiplier = currentUser.coin_multiplier;
        
        // take the items from the user giving the items
        currentUser.meke_coin = currentUser.meke_coin - parseInt(getText("exchangeScreenMekeCoinAmount"));
        meke_coin = currentUser.meke_coin;
        
        // update the values displayed showing the amount of items the player has.
        setProperty("exchangeScreenTimeInv","text",currentUser.time_saver);
        setProperty("exchangeScreenEliminateInv","text",currentUser.eliminate_choice);
        setProperty("exchangeScreenSkipInv","text",currentUser.question_skip);
        setProperty("exchangeScreenMultiplierInv","text",currentUser.coin_multiplier);
        setProperty("exchangeScreenMekeCoinInv","text",currentUser.meke_coin);
        
        updateRecord("login_information", currentUser , function(record, success) {
            // if the records were successfully updated
            if (success) {
              console.log("Record updated with id:" +record.id);
              // access the user that will receieve the items
              readRecords("login_information", {username:getText("exchangeScreenUsernameInput")}, function(records) {
                if (records.length > 0) {    
                  var currentUser = records[0];
                  
                  // increase the amount of items the user has by the amount that is exchanged
                  currentUser.time_saver = currentUser.time_saver + parseInt(getText("exchangeScreenTimeAmount"));
                  currentUser.eliminate_choice = currentUser.eliminate_choice + parseInt(getText("exchangeScreenEliminateAmount"));
                  currentUser.question_skip = currentUser.question_skip + parseInt(getText("exchangeScreenSkipAmount"));
                  currentUser.coin_multiplier = currentUser.coin_multiplier + parseInt(getText("exchangeScreenMultiplierAmount"));
                  currentUser.meke_coin = currentUser.meke_coin + parseInt(getText("exchangeScreenMekeCoinAmount"));
                  
                  
                  
                  updateRecord("login_information", currentUser , function(record, success) {
                    // check if the user receieved the items
                    if (success) {
                      console.log("Record updated with id:" +record.id);
                      console.log("given");
                      exchangePrompt("success");
                      
                      // reset the text boxes back to 0
                      setProperty("exchangeScreenTimeAmount","text",0);
                      setProperty("exchangeScreenEliminateAmount","text",0);
                      setProperty("exchangeScreenSkipAmount","text",0);
                      setProperty("exchangeScreenMultiplierAmount","text",0);
                      setProperty("exchangeScreenMekeCoinAmount","text",0);
                    } else {
                      // otherwise display error message
                      console.log("Record NOT updated");
                      exchangePrompt("error");
                    }
                  });
                } else{ // indicates target user could not be found, in theory this will never be called
                  // display error message
                  exchangePrompt("error");
                }
              });
            } else { // indicates data update was not successful
              // display error message
              console.log("Record NOT updated");
              exchangePrompt("error");
            }
          });
      } else{ // indicates current user was not found, in theory this will never be called
        // display error message
        exchangePrompt("error");
      }
    } 
  });
});

// shows explanation for how the exchange system works
onEvent("exchangeScreenQuestionButton","click",function(){
  appScreenSwitchSound(); // play screen switch noise through method
  setProperty("exchangeScreenPromptText", "background-color", "rgb(117, 169, 249)"); // change background color
  setText("exchangeScreenPromptText","Welcome to the Player Exchange!\n\nHere you can give items to other players via their username. After entering the quantities of the items you want to give, simply click exchange to complete the transaction."); // set the help message
  setProperty("exchangeScreenPromptText","hidden",false); // change visibility of prompt
  setProperty("exchangeScreenPromptExitButton","hidden",false); 
});

// closes exchangeScreen explanation window
onEvent("exchangeScreenPromptExitButton","click",function(){
  appScreenSwitchSound(); // play screen switch noise through method
  setProperty("exchangeScreenPromptText","hidden",true);
  setProperty("exchangeScreenPromptExitButton","hidden",true);
});

// [RESOURCE SCREEN LINKS]
var addition_resources = [
  "https://www.youtube.com/watch?v=scvwSXku0HQ",
  "https://www.mathsisfun.com/numbers/addition.html",
  "https://www.math-only-math.com/kindergarten-addition-up-to-5.html"
];

var subtraction_resources = [
  "https://www.youtube.com/watch?v=pv8URIRgCdo",
  "https://www.skillsyouneed.com/num/subtraction.html",
  "https://www.youtube.com/watch?v=qKxQ33KcRWQ"
];

var multiplication_resources = [
  "https://www.youtube.com/watch?v=PZjIT9CH6bM",
  "http://www.numbernut.com/arithmetic/multiply-2digit.html",
  "https://www.khanacademy.org/math/arithmetic/arith-review-multiply-divide/arith-review-multi-digit-mult/v/2-digit-times-1-digit-example-no-carrying"
];

var division_resources = [
  "https://www.youtube.com/watch?v=rGMecZ_aERo",
  "https://www.smartick.com/blog/math/operations-and-algebraic-thinking/division/how-to-solve-double-digit-division/",
  "https://www.youtube.com/watch?v=VgGEUelia-A"
];

// BELOW CODE LINKS THE BUTTONS TO THEIR RESPECTIVE RESOURCES
onEvent("resourceScreenAddition1Button", "click", function(){
  open(addition_resources[0]);
  appScreenSwitchSound(); // play screen switch noise through method
});

onEvent("resourceScreenAddition2Button", "click", function(){
  open(addition_resources[1]);
  appScreenSwitchSound(); // play screen switch noise through method
});

onEvent("resourceScreenAddition3Button", "click", function(){
  open(addition_resources[2]);
  appScreenSwitchSound(); // play screen switch noise through method
});

onEvent("resourceScreenSubtraction1Button", "click", function(){
  open(subtraction_resources[0]);
  appScreenSwitchSound(); // play screen switch noise through method
});

onEvent("resourceScreenSubtraction2Button", "click", function(){
  open(subtraction_resources[1]);
  appScreenSwitchSound(); // play screen switch noise through method
});

onEvent("resourceScreenSubtraction3Button", "click", function(){
  open(subtraction_resources[2]);
  appScreenSwitchSound(); // play screen switch noise through method
});

onEvent("resourceScreenMultiplication1Button", "click", function(){
  open(multiplication_resources[0]);
  appScreenSwitchSound(); // play screen switch noise through method
});

onEvent("resourceScreenMultiplication2Button", "click", function(){
  open(multiplication_resources[1]);
  appScreenSwitchSound(); // play screen switch noise through method
});

onEvent("resourceScreenMultiplication3Button", "click", function(){
  open(multiplication_resources[2]);
  appScreenSwitchSound(); // play screen switch noise through method
});

onEvent("resourceScreenDivision1Button", "click", function(){
  open(division_resources[0]);
  appScreenSwitchSound(); // play screen switch noise through method
});

onEvent("resourceScreenDivision2Button", "click", function(){
  open(division_resources[1]);
  appScreenSwitchSound(); // play screen switch noise through method
});

onEvent("resourceScreenDivision3Button", "click", function(){
  open(division_resources[2]);
  appScreenSwitchSound(); // play screen switch noise through method
});


// resourceScreen --> menuScreen
onEvent("resourceScreenMenuButton", "click", function()
{
 setScreen("menuScreen"); 
 appScreenSwitchSound(); // play screen switch noise through method
});

// loginScreen --> menuScreen
onEvent("loginScreenGuestButton","click",function(){
  
  // sets guest mode to true since user is not signed in
  guest_mode = true;
  setProperty("menuScreenTotalProblemsLabel","hidden",true);
  setProperty("menuScreenWelcomeLabel","hidden",true);
  
  // hides all power up labels
  manipulatePowerUps("additionScreen", "hide");
  manipulatePowerUps("subtractionScreen", "hide");
  manipulatePowerUps("multiplicationScreen", "hide");
  manipulatePowerUps("divisionScreen", "hide");
  manipulatePowerUps("randomScreen", "hide");
  
  setScreen("menuScreen");
  appScreenSwitchSound(); // play screen switch noise through method
});


// ------------------------------------------------------------------------------------------------------------------------------------------------
// [FUNCTIONS]
function filter_results(correct_or_wrong)
{
  /*
    Function determines if answers were correct or incorrect, and append needed information to 
    display on the leaderboard screen when filered
    
    ARGUMENTS:
      - correct_or_wrong: the user will input if they want to see correct or wrong answers only to filter specific feedback
  */
  var filtered_message = []; 
  var value;
  
  // checks if the user filters for the correct or wrong answer, and sets the value of the variable "value" to be set respectively 
  if (correct_or_wrong == "Correct")
  {
    value = "Correct";
  }
  else 
  {
    value = "Wrong!";
  }
  
  // iterates through each key/value pair in the total_questions storage dictionary to check if the user got the question right or wrong
  // checks the filter value desired to only display the questions that the user wants to see
  for (var question in total_questions)
  {
    if (total_questions[question][1] == value)
    {
      if (total_questions[question][1] == "Correct"){
        filtered_message.push("Q" + question + " = " + total_questions[question][0] + "  " + total_questions[question][1]); // template for a correct question answered
      } 
      // if the user got the question wrong, they are presented with the wrong answer that they chose
      else {
        filtered_message.push("Q" + question + " = " + total_questions[question][0] + "  " + total_questions[question][1] + " \nYou answered: " + total_questions[question][2]); // template for a wrong question answered
      }
      filtered_message.push("\n------------------------------\n"); // separator between questions
    }
  }
  filtered_message = filtered_message.join(""); // joins the message into a screen to be displayed
  setProperty("feedbackScreenQuestionsArea", "text", filtered_message); // displays the message
}

function appScreenSwitchSound()
{
  /*
    Function plays a sound each time it is called within screen change onEvents
  */
  if(sound_status){
    playSound("sound://category_app/app_button_slide_cool_2.mp3");
  }
}

function feedback_action(typeScreen, correct_or_not)
{
  /*
    Function displays the feedback image (either a checkmark or an X on the current skillScreen)
    based on whether the user chose the correct answer or not
    
    ARGUMENTS: 
      - typeScreen: the current screen the user is on so the feedback is shown to the user correctly (additionScreen, subtractionScreen, multiplicationScreen, divisionScreen, randomScreen)
      - correct_or_not: if the user chose the correct or wrong answer. This value is used to set the icon and color appropriately
  */
  
  if (correct_or_not == "Correct")
  {
    setProperty(typeScreen+ "FeedbackImage", "image", "icon://fa-check"); // if the user got the question right, show a checkmark
    setProperty(typeScreen+ "FeedbackImage", "icon-color", "#a6eac6"); // sets color of checkmark to light green
  }
  else
  {
    setProperty(typeScreen+ "FeedbackImage", "image", "icon://fa-times-circle"); // if the user got the question wrong, show a X
    setProperty(typeScreen+ "FeedbackImage", "icon-color", "#ff8484"); // sets color of checkmark to light red
  } 
  displayShortTime(typeScreen+"FeedbackImage", 500); // display feedback icon on the screen
}

function loadLeaderboardScreen(filter)
{
  /*
    Function loads the leaderboardScreen leaderboard
    
    ARGUMENTS:
      - filter: The type of filtering that is done (total, correct). below are what the possible values for filter mean
        -total: leaderboard by the most number of questions answered
        -correct: leaderboard by the most number of questions answered correctly
  
  */
  
  var all_scores = {}; 
  var score_list = [];
  var final_dict = {};
  var ids;
  var sorted_scores;
  var user_name;
  var score;
  var counter;
  var output = [];
  // iterates through the database to find the users with the most number of questions answered 
  if (filter == "total")
  {
    // reads through the database and stores how many questions each user answered
    readRecords("login_information", {}, function(records) {
      if (records.length > 0) {
        
          for (var i =0; i < records.length; i++) {
            score_list.push(records[i].problems_answered);
            all_scores[records[i].id] = [records[i].problems_answered, records[i].username]; 
          }
          
        
          // removes the duplicate scores
          var unique_list = [];
          for (var n = 0; n < score_list.length; n++)
          {
            if (unique_list.indexOf(score_list[n]) >= 0) // checks if the score is already in the list. This creates a unique list of scores. 
            {
              
            }
            else
            {
              unique_list.push(score_list[n]);
              final_dict[score_list[n]] = [];
            }
          }
          
          // creates final_dict, which maps the # of questions as the key and the id of those who answered that # of quesitons as the value. 
          for (var index = 0; index < unique_list.length; index++)
          {
            for (var id in all_scores)
            {
              if (all_scores[id][0] == unique_list[index])
              {
                final_dict[unique_list[index]].push(id); // creates a list for the addition of values to final_dict's values
              }
            }
          }
        
          // stores the keys of the final_dict as a list from largest to smallest
          sorted_scores = Object.keys(final_dict).reverse();
          
          output = [];
          counter = 0;
          
          // creates the final message by mapping the score to the user and adding it to the output variable
          for (var s=0; s<sorted_scores.length; s++)
          {
            ids = final_dict[sorted_scores[s]];
            
            for (var id_user=0; id_user<ids.length; id_user++)
            {
              user_name = all_scores[ids[id_user]][1];
              score = sorted_scores[s];
              counter += 1;
              
              output.push(counter + ". " + user_name + " - " + score);
            }
          }
          
          // output is displayed on the screen
          setProperty("leaderboardScreenOutputArea", "text", output.join("\n"));
        }
        else {
              console.log("No records to read");
        }      
  
    });
  }
  
  // iterates through the database to find the users with the most number of questions answered correctly
  else if (filter == "correct")
  {
    // reads through the database and stores how many questions each user answered correctly
    readRecords("login_information", {}, function(records) {
      if (records.length > 0) {
        
          for (var i =0; i < records.length; i++) {
            score_list.push(records[i].problems_correct);
            all_scores[records[i].id] = [records[i].problems_correct, records[i].username]; 
          }
          
        
          // removes the duplicate scores
          var unique_list = [];
          for (var n = 0; n < score_list.length; n++)
          {
            if (unique_list.indexOf(score_list[n]) >= 0)
            {
              
            }
            else
            {
              unique_list.push(score_list[n]);
              final_dict[score_list[n]] = []; // creates a list for the addition of values to final_dict's values
            }
          }
          
          // creates final_dict, which maps the # of questions as the key and the id of those who answered that # of quesitons as the value. 
          for (var index = 0; index < unique_list.length; index++)
          {
            for (var id in all_scores)
            {
              if (all_scores[id][0] == unique_list[index])
              {
                final_dict[unique_list[index]].push(id);
              }
            }
          }
          
          // stores the keys of the final_dict as a list from largest to smallest
          sorted_scores = Object.keys(final_dict).reverse();
          
          
          output = [];
          counter = 0;
          
          // creates the final message by mapping the score to the user and adding it to the output variable
          for (var s=0; s<sorted_scores.length; s++)
          {
            ids = final_dict[sorted_scores[s]];
            
            for (var id_user=0; id_user<ids.length; id_user++)
            {
              user_name = all_scores[ids[id_user]][1];
              score = sorted_scores[s];
              counter += 1;
              
              output.push(counter + ". " + user_name + " - " + score);
            }
          }
          
           // output is displayed on the screen
          setProperty("leaderboardScreenOutputArea", "text", output.join("\n"));
        }
        else {
              console.log("No records to read");
        }      
  
    });
  }
  
  
  
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// [MAIN DRIVER FUNCTION]
function updateScreen(typeScreen)
{
  /*
    This function
      -Randomly picks which answer choice will contain the correct answer
        -wrong answers are made sure to not have the same value as any other answer choice
      
      -Generates values for answer choices
        -random numbers are used to generate wrong choices, the right choice is calculated using the numbers in the question
        -makes sure the question numbers divide evenly for division 
        -if user chose random skill, the program automatically generates the skill to give them after each problem
        
      -Sets the value of each answer button to their respective value
    
      -If timed mode, this function decreases the timer and marks the question wrong when the user runs out of time
    ARGUEMENTS:
      -typeScreen: the screen the user calls this function for (additionScreen, subtractionScreen, multiplicationScreen, divisionScreen, randomScreen)
  */
  
  // resets wrong choice list
  wrong_choices_list = [];
  
  // updates the power up count labels on the screen
  if (!guest_mode)
  {
    updatePowerUpsLabels("additionScreen");
    updatePowerUpsLabels("subtractionScreen");
    updatePowerUpsLabels("multiplicationScreen");
    updatePowerUpsLabels("divisionScreen");
    updatePowerUpsLabels("randomScreen");
  }
  
  
  
  // if set to timed mode, a loop will start counting down the timer.
  // when the timer is -1, reset the timed loop by calling updateScreen.
  if (mode == "Timed")
  {
    
    if (!guest_mode)
    {
      setProperty(typeScreen + "TimeSaverButton", "hidden", false);
      setProperty(typeScreen + "TimeSaverCount", "hidden", false);
      setProperty(typeScreen + "CoinMultiplierButton", "hidden", false);
      setProperty(typeScreen + "CoinMultiplierCount", "hidden", false);
    }
    
    setProperty(typeScreen + "TimeLabel", "hidden", false);
    time = 7; // default is 7 seconds per question in timed mode
    timedLoop(1000, function() {
      setText(typeScreen + "TimeLabel", time);
      time = time - 1;
      
      if (time == -1) {
        stopTimedLoop();
        feedbackSound("Wrong");
        
        // stores the feedbackScreen's result for running out of time as "Time up!"
        storeFeedback(typeScreen, "Wrong!", "Time Up!");
        feedback_action(typeScreen, "Wrong");
        
        progress_length += Math.ceil(230 / num_questions);  
        if (progress_length >= 230 && Object.keys(total_questions).length >= num_questions)
        {
          stopTimedLoop();
          is_active = false;
          configureFeedbackScreen(typeScreen, total_questions);
          setScreen("feedbackScreen");
          return;
        }
        else
        {
           setProperty(typeScreen + "ProgressBarImage", "width", progress_length); // increases progress bar length
           updateScreen(typeScreen); // next question
        }
           
        }
      
     });
  }
  
  else
  {
    if (!guest_mode)
    {
      // hides the power up count labels if in practice mode
      setProperty(typeScreen + "TimeSaverButton", "hidden", true);
      setProperty(typeScreen + "TimeSaverCount", "hidden", true);
      setProperty(typeScreen + "CoinMultiplierButton", "hidden", true);
      setProperty(typeScreen + "CoinMultiplierCount", "hidden", true);
    }
    
    setProperty(typeScreen + "TimeLabel", "hidden", true);
    stopTimedLoop();
  }
  
  
  // resets each choice to be wrong at the beginning
  dict_of_ans = {
  "ans1": "wrong",
  "ans2": "wrong",
  "ans3": "wrong",
  "ans4": "wrong"
  };
  
  global_current_screen = typeScreen;
  already_answers = [];
  
  // numbers in the question
  qnum1 = randomNumber((ranges[typeScreen])[0], (ranges[typeScreen])[1]);
  qnum2 = randomNumber((ranges[typeScreen])[0], (ranges[typeScreen])[1]);
  
  // determine the operation needed to display when the user is in the random mode
  if (typeScreen == "randomScreen"){
    setProperty("randomScreenDivideImage", "hidden", true);
    var choices = ["additionScreen", "subtractionScreen", "multiplicationScreen", "divisionScreen"];
    choice_operation = choices[randomNumber(0,3)];
    setProperty("randomScreenOperatorImage", "image", operation_symbols[choice_operation]);
    operations["randomScreen"] = operations[choice_operation];
    
    if (choice_operation == "divisionScreen")
    {
      setProperty("randomScreenDivideImage", "hidden", false);
    }
  }
  
  // generate another number if the division skill is chosen, and the question numbers generated have a remainder of not 0, if there is a division of 0, or if  the dividend is a prime number
  if (typeScreen == "divisionScreen" || choice_operation == "divisionScreen"){
    while (qnum1 % qnum2 != 0 || qnum2 == 0 || isPrime(qnum1)){
      qnum1 = randomNumber((ranges[typeScreen])[0], (ranges[typeScreen])[1]);
      qnum2 = randomNumber((ranges[typeScreen])[0], (ranges[typeScreen])[1]);
    }
  }
 
  // set the values of the question on the screen
  setProperty(typeScreen + "QNum1Label", "text", (qnum1));
  setProperty(typeScreen + "QNum2Label", "text", (qnum2));
  
  // picks the choice with the correct answer
  correct_ans = "ans" + randomNumber(1,4);
  dict_of_ans[correct_ans] = "correct";
  
  
  result = parseInt(eval(String(qnum1) + operations[typeScreen] + String(qnum2)));
  
  // iterates through the possible answer choices dictionary and sets the correct answer correct and wrong asnwers wrong. 
  for (var ans_choice in dict_of_ans)
  {
    if (dict_of_ans[ans_choice] == "correct")
    {
      if (result.toString().length >= 4){
        setProperty(typeScreen+ans_choice+"Button","font-size",30);
      } else {
        setProperty(typeScreen+ans_choice+"Button","font-size",41);
      }
      
      setProperty(typeScreen+ans_choice+"Button", "text", result);
      global_ans_choice = ans_choice;
    }
    else
    {
      wrong_choices_list.push(ans_choice);
      
      // makes sure the wrong answer isn't equal to the right answer or equal to any other choice
      rand_check = String(randomNumber((ranges[typeScreen])[0],(ranges[typeScreen])[1])) + operations[typeScreen] + String(randomNumber((ranges[typeScreen])[0],(ranges[typeScreen])[1]));
      rand_check = parseInt(eval(rand_check));
      
      // makes sure the randomly generated value isn't invalid, another answer choice, or equal to hte right answer.
      // if it is, the answer choice is generated again
      while (rand_check == result || already_answers.indexOf(rand_check) > -1 || isNaN(rand_check))
      {
        rand_check = String(randomNumber((ranges[typeScreen])[0],(ranges[typeScreen])[1])) + operations[typeScreen] + String(randomNumber((ranges[typeScreen])[0],(ranges[typeScreen])[1]));
        rand_check = parseInt(eval(rand_check));
      }
      
      // if the length of the answer chocie is larger than 4 characters, set the font smaller so everything will fit
      if (rand_check.toString().length >= 4){
        setProperty(typeScreen+ans_choice+"Button","font-size",30);
      } else {
        setProperty(typeScreen+ans_choice+"Button","font-size",41);
      }
      
      // sets the answer text of the wrong choices & adds the wrong choice to the list saying which choices are already used.  
      setProperty(typeScreen+ans_choice+"Button", "text", rand_check);
  
      already_answers.push(rand_check);
    }
    setProperty(typeScreen+ans_choice+"Button", "hidden", false);
  }
  
}

function updateSettings(typeScreen){
  /*
    Function gets the values the user entered for settings and saves them for use
    
    ARGUMENTS
      -typeScreen: the skill screen the user will complete
  */
  mode = getText("skillSettingsScreenModeDropdown"); // sets the timed or practice mode to the variable mod
  var difficulty = getText("skillSettingsScreenDifficultyDropdown");
  // sets difficulty of each skill based on ranges
  if (typeScreen == "additionScreen")
  {
    switch(difficulty)
    {
      case "Easy":
        ranges["additionScreen"] = [0,5];
        break;
      case "Medium":
        ranges["additionScreen"] = [1,10];
        break;
      case "Difficult":
        ranges["additionScreen"] = [5,50];
        break;
      case "Impossible":
        ranges["additionScreen"] = [100,1000];
    }
    
  }
  else if (typeScreen == "subtractionScreen")
  {
    switch(difficulty)
    {
      case "Easy":
        ranges["subtractionScreen"] = [0,5];
        break;
      case "Medium":
        ranges["subtractionScreen"] = [1,10];
        break;
      case "Difficult":
        ranges["subtractionScreen"] = [5,50];
        break
      case "Impossible":
        ranges["subtractionScreen"] = [100,1000];
   }
  }
  else if (typeScreen == "multiplicationScreen")
  {
    switch(difficulty)
    {
      case "Easy":
        ranges["multiplicationScreen"] = [0,5];
        break;
      case "Medium":
        ranges["multiplicationScreen"] = [1,10];
        break;
      case "Difficult":
        ranges["multiplicationScreen"] = [5,50];
        break;
      case "Impossible":
        ranges["multiplicationScreen"] = [100,500];
    }
  }
  else if (typeScreen == "divisionScreen")
  {
    switch(difficulty)
    {
      case "Easy":
        ranges["divisionScreen"] = [0,50];
        break;
      case "Medium":
        ranges["divisionScreen"] = [3,100];
        break;
      case "Difficult":
        ranges["divisionScreen"] = [3,200];
        break;
      case "Impossible":
        ranges["divisionScreen"] = [3,1000];
    }
  }
  else if (typeScreen == "randomScreen")
  {
    switch (difficulty)
    {
      case "Easy":
        ranges["randomScreen"] = [0,5];
        break;
      case "Medium":
        ranges["randomScreen"] = [1,10];
        break;
      case "Difficult":
        ranges["randomScreen"] = [10,30];
        break;
      case "Impossible":
        ranges["randomScreen"] = [50,1000];
    }
  }
  
  // generates the first question and starts the skill
  updateScreen(typeScreen);
  setScreen(typeScreen);
}

function configureSettingsScreen()
{
  /*
    This function sets up the settingsScreen for the user to view their login information and edit if desired
  */
  if (guest_mode)
  {
    setProperty("settingsScreenPersonalInformationLabel", "hidden", true);
    
    setProperty("settingsScreenCurrentName", "text", "Guest");
    setProperty("settingsScreenCurrentUsername", "text", "Guest");
    setProperty("settingsScreenCurrentPassword", "text", "*****");
    setProperty("settingsScreenCurrentProfilePrivate", "text", "Guest");
    
    setProperty("settingsScreenUsernameEditButton", "hidden", true);
    setProperty("settingsScreenNameEditButton", "hidden", true);
    setProperty("settingsScreenPasswordEditButton", "hidden", true);
    setProperty("settingsScreenProfilePrivateEditButton", "hidden", true);
    return;
  }
  
    // shows the personal information labels for a logged in user
    setProperty("settingsScreenPersonalInformationLabel", "hidden", false);
    setProperty("settingsScreenUsernameEditButton", "hidden", false);
    setProperty("settingsScreenNameEditButton", "hidden", false);
    setProperty("settingsScreenPasswordEditButton", "hidden", false);
    setProperty("settingsScreenProfilePrivateEditButton", "hidden", false);
    readRecords("login_information", {username:user_enter, password:pass_enter}, function(records) {
  
    // checks if login information can be found in the login database
    if (records.length>0) {    
        var foundRecord = records[0];
        var password_to_use = "";
        
        
        if (login.passwordFiller == "")
        {
          password_to_use = new_account_login.passwordFiller;
        }
        
        else if (new_account_login.passwordFiller == "")
        {
          password_to_use = login.passwordFiller;
        }
        
        // sets the current information labels for the usre
        setProperty("settingsScreenCurrentName", "text", foundRecord.name);
        setProperty("settingsScreenCurrentUsername", "text", foundRecord.username);
        setProperty("settingsScreenCurrentPassword", "text", repeatStringNumTimes("*", password.length));
        if (foundRecord.private_profile)
        {
          setProperty("settingsScreenCurrentProfilePrivate", "text", "Private");
        }
        else if (!foundRecord.private_profile)
        {
          setProperty("settingsScreenCurrentProfilePrivate", "text", "Public");
        }
        
        
        
        appScreenSwitchSound(); // play screen switch noise through method
      
    }
    });
}

// saves name changes
function saveNameChanges()
{
  var new_name = getText("nameChangeScreenNewNameInput");
  if (new_name == "") // makes sure the name isn't blank
  {
    setProperty("nameChangeScreenErrorLabel", "text", "Name cannot be blank");
    
    // displays error message on screen for name can't be empty
    displayShortTime("nameChangeScreenErrorLabel", 1000);
    
  }
  else
  {
    // if name isn't empty, update the database with the new name the user entered
    readRecords("login_information", {id: user_id}, function(records) {
      if (records.length>0) {    
        var updatedRecord = records[0];
        updatedRecord.name = new_name;
        
        updateRecord("login_information", updatedRecord, function(record, success) {
          if (success) console.log("Record updated with id:" +record.id);
          else console.log("Record NOT updated");
        });
      }
    });
  
    // sets settingsScreen name to reflect the change
    name_enter = new_name;
    setProperty("settingsScreenCurrentName", "text", new_name);
    setProperty("menuScreenWelcomeLabel", "text", "Welcome " + new_name + "!");
    setScreen("settingsScreen");
  }
}

// saves username changes
function saveUsernameChanges()
{
  var new_username = getText("usernameChangeScreenNewUsernameInput");
  new_username = new_username.toLowerCase();
  if (new_username == "")
  {
    // makes sure the username field isn't blank--can't have a blank username
    setProperty("usernameChangeScreenErrorMessage", "text", "Username cannot be blank");
    
    // displays error message
    displayShortTime("usernameChangeScreenErrorMessage", 1000);
  }
  
  else
  {
    // checks if the username is already in use by another user
    readRecords("login_information", {username:new_username}, function(records) {
      if (records.length>0) { 
        var recordFound = records[0];
        var found_id = recordFound.id;
    
        // displays error message for username already in use
        if (user_id != found_id)
        {
          setProperty("usernameChangeScreenErrorMessage", "text", "Username is taken");
          displayShortTime("usernameChangeScreenErrorMessage", 1000);
        }
        else
        {
          // since newly entered username is the same as the old username, just take the user back to the settingScreen, don't update database
          setScreen("settingsScreen");
        }
      }
      
      else
      {
        // if the username isn't already in use, update the datbase to have the new username for the user
        readRecords("login_information", {id: user_id}, function(records) {
          var updatedRecord = records[0];
          updatedRecord.username = new_username;
          updateRecord("login_information", updatedRecord, function(record, success) {
            if (success) console.log("Record updated with id:" +record.id);
            else console.log("Record NOT updated");
          });
          
          // updates the global variable of the user's username and updates settingsScreen to match the change
          user_enter = new_username;
          setProperty("settingsScreenCurrentUsername", "text", new_username);
          // takes the user back to settingsScreen
          setScreen("settingsScreen");
        }
       )}
          
        });
    }
}
  
// saves password changes
function savePasswordChanges()
{
  var new_pass = change_new_pass.password;
  var confirm_pass = change_confirm_pass.password;
  var current_pass = change_curr_pass.password;
  
  // checks if the user entered the same password--since the password is masked, we don't want them to make an error
  if (new_pass != confirm_pass)
  {
    setProperty("passwordChangeScreenErrorLabel", "text", "Passowrds do not match");
    displayShortTime("passwordChangeScreenErrorLabel", 1000); // displays error message for passwords not matching
  }
  
  // checks if the password that the user entered matches the current user password
  else if (current_pass != login.password)
  {
    setProperty("passwordChangeScreenErrorLabel", "text", "Wrong password entered");
    displayShortTime("passwordChangeScreenErrorLabel", 1000); // displays error message for wrong password entered
  }
  
  // checks if either of the password fields are empty--can't have an empty password
  else if (new_pass == "" || confirm_pass == "")
  {
    setProperty("passwordChangeScreenErrorLabel", "text", "Password cannot be empty");
    displayShortTime("passwordChangeScreenErrorLabel", 1000);
  }
  
  else 
  {
    // updates the user's password in the database
    readRecords("login_information", {id: user_id}, function(records) {
    if (records.length>0) {    
      var updatedRecord = records[0];
      updatedRecord.password = SHA512(new_pass);
      updateRecord("login_information", updatedRecord, function(record, success) {
        if (success) 
        {
          login.password = new_pass;
          // reflects the updates in settingsScreen
          setProperty("settingsScreenCurrentPassword", "text", repeatStringNumTimes("*", new_pass.length));
          setScreen("settingsScreen");
          password = new_pass;
          console.log("Record updated with id:" +record.id);
          
        }
        
      });
    }
  });
  
}
}

function saveVisibleChanges()
{
  /*
    saveVisibleChanges() saves the changes the user made to their profile visibility
  */
  var new_private = getText("privateChangeScreenNewVisibleDropdown"); // gets the setting the user put for their profile visiblity
  var bool_private; // bool value for private (true) or public (false)
  
  // tests the choice the user made and assigns bool private accordingly
  if (new_private == "Public") 
  {
    bool_private = false;
  }
  else if (new_private == "Private")
  {
    bool_private = true;
  }
  
  // updates the private_profile property of the user in the database
  readRecords("login_information", {id: user_id}, function(records) {
    if (records.length>0) {    
      var updatedRecord = records[0];
      updatedRecord.private_profile = bool_private;
      
      // updates the record
      updateRecord("login_information", updatedRecord, function(record, success) {
        if (success) 
        {
          // reflects the updates in settingsScreen
          setProperty("settingsScreenCurrentProfilePrivate", "text", new_private);
          setScreen("settingsScreen");
          private_profile = bool_private;
          console.log("Record updated with id:" +record.id);
          
        }
        
      });
    }
  });
  
  
}


function displayShortTime(id, time)
{
  /*
    This function displays an element on the screen for a set amount of time before making it hidden again
    
    ARGUMENTS:
      -id: the elementID that should be displayed
      -time: how long to display the element for (in milliseconds)
  
  */
  var time_target = getTime(); // sets the target time to the current time
  var time_now = 0; // sets time now to 0
  while (time_now - time_target < time) // while time now is less than the target time, show the element and update time now, until time now - target time is greater than the goal time
  {
    setProperty(id, "hidden", false);
    time_now = getTime();
  }
  // hides the element again
  setProperty(id, "hidden", true);
}

function repeatStringNumTimes(string, times) {
  /*
    This function repeats a string how the specificed number of times
    
    ARGUMENTS:
      -string: the string to be repeated
      -times: the number of times to repeat the string
  */  
  // creates an empty string that will host the repeated string
  var repeatedString = "";

  // sets the While loop with (times > 0) as the condition to check
  while (times > 0) { 
    repeatedString += string; // adds the original string to the repeatedstring
    times--; // subtracts 1 from times. Times is how many more times to add the original string to be repeated
  }
  
  // returns repeated string
  return repeatedString;
}


function configureSkillSettingsScreen(typeScreen)
{
  /*
    This function configures the settingsScreen the user enters before starting a skill
    
    ARGUMENTS:
      -typeScreen: the skill screen the user is about to go into (additionScreen, subtractionScreen, multiplicationScreen, divisionScreen, randomScreen)
  */
  if (guest_mode)
  {
    setProperty("skillSettingsScreenSkillLabel", "text", screens[typeScreen]); // displays the skill the user clicked
    setProperty("skillSettingsScreenDifficultyDropdown", "text", "Easy"); // displays the default difficuly (since not signed in, not auto difficulty)
    setProperty("skillSettingsScreenModeDropdown", "text", "Practice"); // practice vs. timed mode (default = practice)
    setProperty("skillSettingsScreenQuestionsSlider", "value", 10); // number of problems user will answer
  }
  readRecords("login_information", {id: user_id}, function(records) {
    var difficulty;
    var correct_probs_skill;
    if (records.length > 0)
    {
      var currentUser = records[0];
      
      // auto difficulty generator
      switch (typeScreen)
      {
        case "additionScreen":
          correct_probs_skill = currentUser.additionScreen; // gets the totol number of questions the user has answered for each skill
          break;
        case "subtractionScreen":
          correct_probs_skill = currentUser.subtractionScreen; // gets the totol number of questions the user has answered for each skill
          break;
        case "multiplicationScreen":
          correct_probs_skill = currentUser.multiplicationScreen; // gets the totol number of questions the user has answered for each skill
          break;
        case "divisionScreen":
          correct_probs_skill = currentUser.divisionScreen; // gets the totol number of questions the user has answered for each skill
          break;
        case "randomScreen":
          correct_probs_skill = currentUser.randomScreen; // gets the totol number of questions the user has answered for each skill
          break; 
      }
      
      switch (true)
      {
        case (correct_probs_skill > impossible_thres):
          difficulty = "Impossible"; // generates difficulty if user surpasses number of questions requirement
          break;
          
        case (correct_probs_skill > difficult_thres):
          difficulty = "Difficult"; // generates difficulty if user surpasses number of questions requirement
          break;
          
        case (correct_probs_skill > medium_thres):
          difficulty = "Medium"; // generates difficulty if user surpasses number of questions requirement
          break;
        
        default:
          difficulty = "Easy"; // default difficulty
      }
      
      setProperty("skillSettingsScreenSkillLabel", "text", screens[typeScreen]);
      setProperty("skillSettingsScreenDifficultyDropdown", "text", difficulty);
      setProperty("skillSettingsScreenModeDropdown", "text", "Practice");
      setProperty("skillSettingsScreenQuestionsSlider", "value", 10);
    }
    
  });
}


function configureSkill(typeScreen)
{
  /*
    This function configures the settings that the user chose before entering the skill
    
    ARGUMENTS:
      -typeScreen: the skill screen the user is about to go into (additionScreen, subtractionScreen, multiplicationScreen, divisionScreen, randomScreen)
  */
  if (!guest_mode)
  {
    updatePowerUpDatabase();
    updatePowerUpsLabels(typeScreen);
  }
  
  // resets settings for the skill about enter
  multiplier = 1; // coin_multiplier for meke_coin
  configureSkillSettingsScreen(typeScreen); // configures diffulty and labels
  setScreen("skillSettingsScreen"); // goes to skillSettingsScreen
  skill_clicked = typeScreen; // skill the user is on
  is_active = true; // game is now active (in play)
  progress_length = 0; // progress bar
  setProperty(typeScreen + "ProgressBarImage", "width", progress_length); // sets progress bar to nothing
  total_questions = {}; // clears previous questions answered
  question_number = 1; // question the user is on
  appScreenSwitchSound(); // play screen switch noise through method
}


function storeFeedback(typeScreen, correct_or_not, userAnswer)
{
  /*
    Function takes current skill screen and if the user got the answer correct or not, and forms a dictionary
    which stores this for the feedback screen
    
    ARGUMENTS:
      - typeScreen: the screen the user is currently on
      - correct_or_not: whether the user answered the question correctly
      - userAnswer: the answer the user put (only needed if user answered incorrectly)
  */
  
  key = question_number + ". " + String(qnum1) + operations[typeScreen] + String(qnum2);
  question_number += 1;
  
  // if the user answered the question correctly, only store the question, right answer, and "Correct"
  if(correct_or_not == "Correct"){
    total_questions[key] = [result, correct_or_not];
  } else {
    total_questions[key] = [result, correct_or_not, userAnswer]; // if the user answered incorrectly, store the question, correct answer, and what the user answered
  }
}

function feedbackSound(correct_or_not)
{
  /*
    Function plays a chime if the user got the question correct, or a muffled wrong answer sound 
  */
  
  if (correct_or_not == "Correct" && sound_status)
  {
    playSound("sound://category_achievements/lighthearted_bonus_objective_1.mp3"); // chime sound
  }
  else if (sound_status)
  {
    playSound("sound://category_hits/retro_game_simple_impact_2.mp3"); // muffled sound
  }
}

function configureFeedbackScreen(typeScreenFrom, database)
{
  /*
    Function configures the final feedback screen to contain the question and answers
      -User score
      -Question number, question, answer, whether correct or not
        -EX. Q11. 1 + 1 = 2 Correct
        
    ARGUMENTS:
      - typeScreenFrom: the screen the user just completed
      - database: the total_questions dictionary which is used to access the values the user answered
  */
  message = [];
  var counter = 0;
  var corrects = 0;
  
  // iteratures through each key/value pair in the total_questions dictionary and creates the feedback message based on the answer
  // if the user got the answer right, the app just displays correct
  // if the user got the answer wrong, the app dispays wrong, correct answer, and what the user put
  for (var question in database)
  {
    if (database[question][1] == "Correct"){
      corrects += 1;
      message.push("Q" + question + " = " + database[question][0] + "  " + database[question][1]);                                                  // adds to the output message the problem & right answer
    } else {
      message.push("Q" + question + " = " + database[question][0] + "  " + database[question][1] + " \nYou answered: " + database[question][2]); // adds to the output message the problem, right answer, and answer the user picked
    }
    message.push("\n------------------------------\n"); // separator between questions
    counter += 1;
  }
  
  // joins the message into a string and outputs it into the feedbackArea
  message = message.join("");
  setProperty("feedbackScreenQuestionsArea", "text", message);
  
  // creates the score the user received and color codes it based on the grade
  var percent = Math.round((corrects/Object.keys(total_questions).length) * 100);
  
  // color codes based on scale score (0-100)
  if (percent >= 90){
    setProperty("feedbackScreenScoreRightLabel", "text-color", "green"); 
    setProperty("feedbackScreenScoreLeftLabel", "text-color", "green");
  } else if (percent >= 80){
    setProperty("feedbackScreenScoreRightLabel", "text-color", "#ceb00a"); // dark yellow color
    setProperty("feedbackScreenScoreLeftLabel", "text-color", "#ceb00a");
  } else if (percent >= 70){
    setProperty("feedbackScreenScoreRightLabel", "text-color", "orange");
    setProperty("feedbackScreenScoreLeftLabel", "text-color", "orange");
  } else {
    setProperty("feedbackScreenScoreRightLabel", "text-color", "red");
    setProperty("feedbackScreenScoreLeftLabel", "text-color", "red");
  }
  setProperty("feedbackScreenScoreRightLabel", "text", percent + " %");
  
  // updates the total questions the user answered (ONLY IF SIGNED IN)
  if(!guest_mode){
    problems_answered += Object.keys(total_questions).length; // adds how many problems the user answered to their total question count
    setProperty("feedbackScreenCompletedLabel", "text", "You completed " + problems_answered + " problems total!");
    readRecords("login_information", {id: user_id}, function(records) {
      if (records.length>0) {    
        var updatedRecord = records[0]; 
        updatedRecord.problems_answered = problems_answered; // updates total questions answered in databsae
        updatedRecord.problems_correct = updatedRecord.problems_correct + corrects; // updates correct problems in database
        updatedRecord.problems_incorrect = updatedRecord.problems_incorrect + (num_questions-corrects); // updates incorrect problems in database
        
        // adds the number of correct questions the user answered to the screen (used in automatic difficulty generator)
        switch (typeScreenFrom)
        {
          case "additionScreen":
          updatedRecord.additionScreen += corrects;
          break;
        case "subtractionScreen":
          updatedRecord.subtractionScreen += corrects;
          break;
        case "multiplicationScreen":
          updatedRecord.multiplicationScreen += corrects;
          break;
        case "divisionScreen":
          updatedRecord.divisionScreen += corrects;
          break;
        case "randomScreen":
          updatedRecord.randomScreen += corrects;
          break;
        }
        
        // badge updates
        meke_coin = updatedRecord.meke_coin;
        updatedRecord.meke_coin = meke_coin;
        updatedRecord.time_saver = time_saver;
        updatedRecord.eliminate_choice = eliminate_choice;
        updatedRecord.question_skip = question_skip;
        updatedRecord.coin_multiplier = coin_multiplier;
        
        
        if (mode == "Timed")
        {
          meke_coin = updatedRecord.meke_coin + (corrects * multiplier);
          updatedRecord.meke_coin += (corrects * multiplier); // updates meke coin if in timed mode
        }
        
        updateRecord("login_information", updatedRecord, function(record, success) {
          if (success) console.log("Record updated with id:" +record.id);
          else console.log("Record NOT updated");
        });
      }
      else console.log("No record found");
    });
  } else{
    setProperty("feedbackScreenCompletedLabel", "text", "You completed " + Object.keys(total_questions).length + " questions!");  // IF GUEST MODE: only display how many questions the user answered, not their total number of questions
  }
}

function updatePowerUpDatabase()
{
  /*
    This function updates the database with how many power ups the user has
  */
  if(!guest_mode){
    readRecords("login_information", {username:user_enter}, function(records) {
    if (records.length>0) {    
      var updatedRecord = records[0];
      
      // badge updates
      updatedRecord.meke_coin = meke_coin; // updates the database with the current value of meke coin
      updatedRecord.time_saver = time_saver; // updates the database with the current value of time saver power up
      updatedRecord.eliminate_choice = eliminate_choice; // updates the database with the current value of eliminate choice power up
      updatedRecord.question_skip = question_skip; // updates the database with the current value of question skip power up
      updatedRecord.coin_multiplier = coin_multiplier; // updates the database with the current value of coin multiplier power up
      
      // updates database
      updateRecord("login_information", updatedRecord, function(record, success) {
        if (success) console.log("Record updated with id:" +record.id);
        else console.log("Record NOT updated");
      });
    }
    else console.log("No record found"); // error if update can't be completed
    });
  }
}

function loadProfile() {
  /*
    Function loadProfile
      - Searches for current user profile, and sets elements on the screen as pulled from the database.
      - Will automatically update badge status if the user has unlocked it.
  */
  setProperty("profileScreenBadgeStatusLabel","hidden",true);
  readRecords("login_information", {username:user_enter}, function(records) {
    if (records.length > 0) {    
      var currentUser = records[0];

      // sets labels on the user's profile to match their database stats
      setText("profileScreenNameLabel",currentUser.name);
      setText("profileScreenUsernameLabel",currentUser.username);
      setText("profileScreenTotalQuestionsLabel","Total Questions: " + currentUser.problems_answered);
      setText("profileScreenCorrectAnswersLabel","Correct Answers: " + currentUser.problems_correct);
      setText("profileScreenIncorrectAnswersLabel","Incorrect Answers: " + currentUser.problems_incorrect);
      if (problems_answered == 0){
        setText("profileScreenAccuracyLabel","Accuracy: 0%");
      } else{
        setText("profileScreenAccuracyLabel","Accuracy: " + Math.round((currentUser.problems_correct/currentUser.problems_answered)* 100) + "%");
      }
      
      // displays the badges the user has if they have answered enough problems correctly
      if (currentUser.problems_correct >= 100 && currentUser.badge_1 == false){
        console.log("entered");
        currentUser.badge_1 = true; // if the user has completed the number of questions needed for badge1, then update the user to have badge1 (100)
        updateRecord("login_information", currentUser, function(record, success) {
          if (success) console.log("Record updated with id:" +record.id);
          else console.log("Record NOT updated");
        });
      } 
      
      if (currentUser.badge_1){
        setProperty("profileScreenBadge1","image","1.png"); // if user already has the badge, set the placeholder to the actual badge
      }
      
      if (currentUser.problems_correct >= 500 && currentUser.badge_2 == false){
        console.log("entered");
        currentUser.badge_2 = true; // if the user has completed the number of questions needed for badge2, then update the user to have badge2 (500)
        updateRecord("login_information", currentUser, function(record, success) {
          if (success) console.log("Record updated with id:" +record.id);
          else console.log("Record NOT updated");
        });
      } 
      
      if (currentUser.badge_2){
        setProperty("profileScreenBadge2","image","2.png"); // if user already has the badge, set the placeholder to the actual badge
      }
      
      if (currentUser.problems_correct >= 1000 && currentUser.badge_3 == false){
        console.log("entered");
        currentUser.badge_3 = true; // if the user has completed the number of questions needed for badge3, then update the user to have badge3 (1000)
        updateRecord("login_information", currentUser, function(record, success) {
          if (success) console.log("Record updated with id:" +record.id);
          else console.log("Record NOT updated");
        });
      } 
      
      if (currentUser.badge_3){
        setProperty("profileScreenBadge3","image","3.png"); // if user already has the badge, set the placeholder to the actual badge
      }
      
      if (currentUser.problems_correct >= 5000 && currentUser.badge_4 == false){
        console.log("entered");
        currentUser.badge_4 = true; // if the user has completed the number of questions needed for badge4, then update the user to have badge4 (5000)
        updateRecord("login_information", currentUser, function(record, success) {
          if (success) console.log("Record updated with id:" +record.id);
          else console.log("Record NOT updated");
        });
      } 
      
      if (currentUser.badge_4){
        setProperty("profileScreenBadge4","image","4.png"); // if user already has the badge, set the placeholder to the actual badge
      }
    }
  });
}

function searchProfile(searchUsername) {
  /*
    Function searchProfile
      
      - Searches for entered user profile, and sets elements on the screen as pulled from the database.
      - If the user is not found, display an error message. If the user is found, update elements on the screen,
        and make them visible.
      
      Arguments:
        - searchUsername: passed in from the text box when the user presses the search button. 
  */
  readRecords("login_information", {username:searchUsername}, function(records) {
    if (records.length > 0) {    
      var currentUser = records[0];
      
      if (currentUser.private_profile)
      {
        displayShortTime("searchScreenPrivateError", 1000);
        return;
      }
      
      // set the elements on the screen to the data found about the user
      setText("searchScreenUsernameLabel",currentUser.username);
      setText("searchScreenTotalQuestionsLabel","Total Questions: " + currentUser.problems_answered);
      setText("searchScreenCorrectAnswersLabel","Correct Answers: " + currentUser.problems_correct);
      setText("searchScreenIncorrectAnswersLabel","Incorrect Answers: " + currentUser.problems_incorrect);
      if (currentUser.problems_answered == 0){
        setText("searchScreenAccuracyLabel","Accuracy: 0%");
      } else{
        setText("searchScreenAccuracyLabel","Accuracy: " + Math.round((currentUser.problems_correct/currentUser.problems_answered)* 100) + "%");
      }
      
      // if badges are unlocked, set them to the respective images, otherwise set the badge icon to a quuestion mark
      if (currentUser.badge_1){
        setProperty("searchScreenBadge1","image","1.png");
      } else{
        setProperty("searchScreenBadge1","image","icon://fa-question");
      }
      
      if (currentUser.badge_2){
        setProperty("searchScreenBadge2","image","2.png");
      } else{
        setProperty("searchScreenBadge2","image","icon://fa-question");
      }
      
      if (currentUser.badge_3){
        setProperty("searchScreenBadge3","image","3.png");
      } else{
        setProperty("searchScreenBadge3","image","icon://fa-question");
      }
      
      if (currentUser.badge_4){
        setProperty("searchScreenBadge4","image","4.png");
      } else{
        setProperty("searchScreenBadge4","image","icon://fa-question");
      }
      
      // make all elements visible
      setProperty("searchScreenUsernameLabel","hidden",false);
      setProperty("searchScreenTotalQuestionsLabel","hidden",false);
      setProperty("searchScreenCorrectAnswersLabel","hidden",false);
      setProperty("searchScreenIncorrectAnswersLabel","hidden",false);
      setProperty("searchScreenAccuracyLabel","hidden",false);
      setProperty("searchScreenStatsLabel","hidden",false);
      setProperty("searchScreenBadgesLabel","hidden",false);
      setProperty("searchScreenBadge1","hidden",false);
      setProperty("searchScreenBadge2","hidden",false);
      setProperty("searchScreenBadge3","hidden",false);
      setProperty("searchScreenBadge4","hidden",false);
      setProperty("searchScreenErrorLabel","hidden",true);
    } else{
      // set all elements to invisible if the user is not found, and display the error message
      setProperty("searchScreenUsernameLabel","hidden",true);
      setProperty("searchScreenTotalQuestionsLabel","hidden",true);
      setProperty("searchScreenCorrectAnswersLabel","hidden",true);
      setProperty("searchScreenIncorrectAnswersLabel","hidden",true);
      setProperty("searchScreenAccuracyLabel","hidden",true);
      setProperty("searchScreenStatsLabel","hidden",true);
      setProperty("searchScreenBadgesLabel","hidden",true);
      setProperty("searchScreenBadge1","hidden",true);
      setProperty("searchScreenBadge2","hidden",true);
      setProperty("searchScreenBadge3","hidden",true);
      setProperty("searchScreenBadge4","hidden",true);
      setProperty("searchScreenErrorLabel","hidden",true);
      setProperty("searchScreenErrorLabel","hidden",false);
    }
  });
}

function menuScreenError() {
  /*
    menuScreenError()
    displays an error for menuScreen trying to enter profileScreen without being logged in
  */
  setProperty("menuScreenErrorLabel", "hidden", false);
  displayShortTime("menuScreenErrorLabel", 1000);
}

function loadShop(){
   /*
    loadShop() loads the shop and the amount of meke_coin the user currently has
   */
   
   readRecords("login_information", {username:user_enter}, function(records) {
    if (records.length > 0) {    
      var currentUser = records[0];
      
      // sets how many meke_coin the user has
      setProperty("shopScreenUsernameLabel","text",currentUser.username);
      setProperty("shopScreenBalanceLabel","text", currentUser.meke_coin);
      // sets placeholder of each power up
      setProperty("shopScreenTimeAmount","text","0"); 
      setProperty("shopScreenEliminateAmount","text","0");
      setProperty("shopScreenSkipAmount","text","0");
      setProperty("shopScreenMultiplierAmount","text","0");
      setProperty("shopScreenCostLabel","text","Cost: 0 Coin");
      
      
      total_cost = 0; 
      time_cost = 0;
      eliminate_cost = 0;
      skip_cost = 0;
      multiplier_cost = 0;
    }
  });
}


function shopScreenError(){
  /*
    shopScreenError() displays an error with the purchase, such as if user doesn't have enough meke_coin and tries to buy something
  */
  setProperty("shopScreenInformationLabel", "text", "\n\n\n\n There was an error with your purchase. Please try again.");
  setProperty("shopScreenInformationLabel", "background-color", "rgb(247, 150, 150)");
  setProperty("shopScreenInformationLabel", "hidden", false);
  displayShortTime("shopScreenInformationLabel", 1000); // displays the message on the screen
  setProperty("shopScreenInformationLabel", "background-color", "rgb(117, 169, 249)");
}

function shopScreenSuccess(){
  /*
    shopScreenSuccess() displays a success message if the user has enogh resources to complete the transaction
  */
  setProperty("shopScreenInformationLabel", "text", "\n\n\n\n Purchase successful!");
  setProperty("shopScreenInformationLabel", "background-color", "rgb(127, 225, 173)");
  setProperty("shopScreenInformationLabel", "hidden", false);
  displayShortTime("shopScreenInformationLabel", 1000); // displays the message on the screen
  setProperty("shopScreenInformationLabel", "background-color", "rgb(117, 169, 249)");
}

function isNumeric(str) {
  /*
    isNumeric() checks to make sure that a string is an integer
  */
  if (typeof str != "string") return false; // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)
         !isNaN(parseFloat(str)); // ensure strings of whitespace fail
}

function calculateCost(){
  /*
    calculateCost() calculates the number of meke_coin required to complete the purchase
  */
  return time_cost + eliminate_cost + skip_cost + multiplier_cost;
}

function manipulatePowerUps(typeScreen, hidden)
{
  /*
  manipulatePowerUps() either hides or shows the powerups along with their respective counts
    ARGUMENTS: 
      -typeSceen - the screen the user updates the power ups for
      -hidden: either to hide or show each power up
  */
  var value;
  
  // if hidden is set to hide, then we hide all the power ups
  if (hidden == "hide")
  {
    value = true;
  }
  else
  {
    value = false;
  }
  
  // hides or shows each power up button based on the value needed
  setProperty(typeScreen + "TimeSaverButton", "hidden", value);
  setProperty(typeScreen + "EliminateChoiceButton", "hidden", value);
  setProperty(typeScreen + "QuestionSkipButton", "hidden", value);
  setProperty(typeScreen + "CoinMultiplierButton", "hidden", value);
  
  // hides or shows each power up count based on the value needed
  setProperty(typeScreen + "TimeSaverCount", "hidden", value);
  setProperty(typeScreen + "EliminateChoiceCount", "hidden", value);
  setProperty(typeScreen + "QuestionSkipCount", "hidden", value);
  setProperty(typeScreen + "CoinMultiplierCount", "hidden", value);
}

function updatePowerUpsLabels(typeScreen)
{
  // updates the power up count if a power up is used
  // ARGUMENTS:
  //  -typeScreen: the screen to update the power up label on
  setProperty(typeScreen + "TimeSaverCount", "text", time_saver);
  setProperty(typeScreen + "EliminateChoiceCount", "text", eliminate_choice);
  setProperty(typeScreen + "QuestionSkipCount", "text", question_skip);
  setProperty(typeScreen + "CoinMultiplierCount", "text", coin_multiplier);
}

function eliminateChoiceFunction(typeScreen)
{
  /*
    Function elininates one of the incorrect choices
        
    ARGUMENTS:
      - typeScreen: the screen to hide the incorrect choice from
  */ 
  
  var rand_index = randomNumber(0,wrong_choices_list.length-1); // chooses the name of the answer choice to eliminate
  var wrong_choice = wrong_choices_list[rand_index]; // wrong choice to remove
  var wrong_choice_complete = typeScreen + wrong_choice + "Button"; // full element name of the wrong choice
  
  // if there are still incorrect choices left, remove an incorrect one
  if (wrong_choice)
  {
    setProperty(wrong_choice_complete, "hidden", true); // hides wrong choice
    removeItem(wrong_choices_list, rand_index); // removes wrong choice from list since it has already been removed
    eliminate_choice -=1; // decreases the power up label
  }
  
}

function loadExchange() {
  /*
    loadExchange() loads how many of each power up or meke coin the user can exchange with someone else
  */
  
  readRecords("login_information", {username:user_enter}, function(records) {
    if (records.length > 0) {    
      var currentUser = records[0];
      
      // set the elements on the screen to the data found about the user
      setProperty("exchangeScreenTimeInv","text",currentUser.time_saver);
      setProperty("exchangeScreenEliminateInv","text",currentUser.eliminate_choice);
      setProperty("exchangeScreenSkipInv","text",currentUser.question_skip);
      setProperty("exchangeScreenMultiplierInv","text",currentUser.coin_multiplier);
      setProperty("exchangeScreenMekeCoinInv","text",currentUser.meke_coin);
      setProperty("exchangeScreenTimeAmount","text",0);
      setProperty("exchangeScreenEliminateAmount","text",0);
      setProperty("exchangeScreenSkipAmount","text",0);
      setProperty("exchangeScreenMultiplierAmount","text",0);
      setProperty("exchangeScreenMekeCoinAmount","text",0);
      setProperty("exchangeScreenExchangeUserLabel", "text", "Exchanging with:");
      
      // sets the amount the user wishes to exchange for each power up
      time_exchange = 0; 
      eliminate_exchange = 0; 
      skip_exchange = 0; 
      multiplier_exchange = 0; 
      coin_exchange = 0; 
    } 
  });
}

function exchangeVisible(visible) {
  /*
    exchangeVisible() either hides or unhides elements based on if the user has searched for another user yet
    ARGUMENTS:
      -visible: true/false, whether to hide or unhide
  */
  
  // change all related elements on the exchange screen to either true or false
  setProperty("exchangeScreenTimeInv","hidden",visible);
  setProperty("exchangeScreenEliminateInv","hidden",visible);
  setProperty("exchangeScreenSkipInv","hidden",visible);
  setProperty("exchangeScreenMultiplierInv","hidden",visible);
  setProperty("exchangeScreenMekeCoinInv","hidden",visible);
  setProperty("exchangeScreenEliminateAmount","hidden",visible);
  setProperty("exchangeScreenEliminateIcon","hidden",visible);
  setProperty("exchangeScreenEliminateLabel","hidden",visible);
  setProperty("exchangeScreenTimeAmount","hidden",visible);
  setProperty("exchangeScreenTimeIcon","hidden",visible);
  setProperty("exchangeScreenTimeLabel","hidden",visible);
  setProperty("exchangeScreenSkipAmount","hidden",visible);
  setProperty("exchangeScreenSkipIcon","hidden",visible);
  setProperty("exchangeScreenSkipLabel","hidden",visible);
  setProperty("exchangeScreenMultiplierAmount","hidden",visible);
  setProperty("exchangeScreenMultiplierIcon","hidden",visible);
  setProperty("exchangeScreenMultiplierLabel","hidden",visible);
  setProperty("exchangeScreenMekeCoinAmount","hidden",visible);
  setProperty("exchangeScreenMekeCoinIcon","hidden",visible);
  setProperty("exchangeScreenMekeCoinLabel","hidden",visible);
  setProperty("exchangeScreenExchangeButton","hidden",visible);
}

function exchangePrompt(type){
  /*
    exchangePrompt() either displays a success message showing the exchange has been completed or an error message if the exchange threw an error
      -errors include not having enough meke coin
  */
  if(type == "error"){
    // edit the color of the prompt to red, change text
    setText("exchangeScreenPromptText","\n\n\n\nThere was an error with your exchange. Please try again.");
    setProperty("exchangeScreenPromptText", "background-color", "rgb(247, 150, 150)");
  } else if (type == "success"){
    // edit the color of the prompt to green, change text
    setText("exchangeScreenPromptText","\n\n\n\nExchange Successful!");
    setProperty("exchangeScreenPromptText", "background-color", "rgb(127, 225, 173)");
  }
  
  // call method to show the prompt text for 1000 ms
  displayShortTime("exchangeScreenPromptText", 1000);
}

function updateSound(typeScreen) 
{
  // toggle the sound status variable, as well as the icon type to display the sound status
  if (!sound_status){
    sound_status = true;
    setProperty(typeScreen + "SoundButton","image","icon://fa-volume-up");
  } else {
    sound_status = false;
    setProperty(typeScreen + "SoundButton","image", "icon://fa-volume-off");
  }
  appScreenSwitchSound(); // play screen switch noise through method
}

// ganning comment dis
function loadSound(typeScreen)
{
  /*
    Function sets the feedback sound icon on each skill screen to match their muted or unmuted state (determined by the user)
    
    ARGUMENTS
      -typeSreen: the screen to update the feedback sound icon on (additionScreen, subtractionScreen, multiplicationScreen, divisionScreen, randomScreen)
  */
  var image;
  if (sound_status)
  {
    image = "icon://fa-volume-up";
  }
  else
  {
    image = "icon://fa-volume-off";
  }
  setProperty(typeScreen + "SoundButton","image", image);
}

function updateMusic(typeScreen)
{
  // checks music status
  if (!music_status){
    playSound(sound_choice, true); // plays music sound of choice
    setProperty(typeScreen + "MusicButton","icon-color","rgba(89,143,241,1.0)"); // change icon transparency
    music_status = true; // change music status
  } else{
    stopSound(sound_choice); // stops the music sound of choice
    music_status = false; // change music status
    setProperty(typeScreen + "MusicButton","icon-color","rgba(89,143,241,0.5)"); // change icon to be part transparent
  }
  appScreenSwitchSound(); // play screen switch noise through method
}


function loadMusic(typeScreen)
{
  /*
    Function sets the background music icon on each skill screen to match their muted or unmuted state (determined by the user)
    
    ARGUMENTS
      -typeSreen: the screen to update the background music icon on (additionScreen, subtractionScreen, multiplicationScreen, divisionScreen, randomScreen)
  */
  
  if (music_status)
  {
    setProperty(typeScreen + "MusicButton","icon-color","rgba(89,143,241,1.0)");
  }
  else
  {
    setProperty(typeScreen + "MusicButton","icon-color","rgba(89,143,241,0.5)");
  }
}

// --------------------------------------------------------------------------------------------------------------------------------------------
// [SKILL SCREEN INTERACTIONS]

onEvent("additionScreen", "click", function(event) {
  /*
  [ADDITION SCREEN] feedback for user if they clicked the correct answer or not
    -Displays the next question
    -Checks if user has completed desired number of questions
    -Logs question and answer by calling storeFeedback()
  */
  
  
  // prevents the user from spamming an answer choice and crashing the program
  if (!is_active){
    return;
  }
  
  var elementClicked = event.targetId;
  if (elementClicked != "additionScreen") {
    
    // allows the user to skip a question if they have the question skip power up
    // skipped questions are not stored in feedbackScreen
    if (elementClicked.includes("QuestionSkipButton") && question_skip > 0)
    {
      if (mode == "Timed"){
        stopTimedLoop();
      }
      playSound("sound://category_alerts/vibrant_game_shutter_alert_1_short_quick.mp3");
      question_skip -= 1;
      updatePowerUpsLabels("additionScreen");
      
      updateScreen("additionScreen");
    }
    
    else if (elementClicked.includes("EliminateChoiceButton") && eliminate_choice > 0)
    {
      // # of eliminate_choice is updated within eliminate_choice_function
      // eliminates an incorrect answer choice and updates the number of powerups left accordingly
      eliminateChoiceFunction("additionScreen");
      updatePowerUpsLabels("additionScreen");
    }
    
    else if (elementClicked.includes("CoinMultiplierButton") && coin_multiplier > 0)
    {
      // only used if in timed mode.
      // each time the CoinMultiplierButton is clicked, the constant that is multiplied by meke_coin the user receives is incremented  by 1. 
      if (mode == "Timed")
      {
        multiplier += 1;
        coin_multiplier -= 1;
        updatePowerUpsLabels("additionScreen");
      }
    }
      
    else if (elementClicked.includes("TimeSaverButton") && time_saver > 0)
    {
      // only used if in timed mode.
      // each time TimeSaverButton is clicked, the time the user has to answer the question is increased by 10 seconds. 
      if (mode == "Timed")
      {
        time += 10;
        time_saver -= 1;
        updatePowerUpsLabels("additionScreen");
      }
    }
    
    else if (elementClicked.includes("SoundButton"))
    {
      // toggles and either mutes/unmutes the alert and feedback sounds
      // if currently unmuted, this mutes the alert and feeedback sounds
      // if currently muted, this unmutes the alert and feedback sounds
      updateSound("additionScreen");
    }
      
    else if (elementClicked.includes("MusicButton"))
    {
      // toggles and either mutes/unmutes the background music
      // if currently unmuted, this mutes the background music
      // if currently muted, this unmutes the background music
      updateMusic("additionScreen");
    }
    
    if (elementClicked.includes("ans") != true)
    {
      return; // doesn't allow user to click on anything except for the answer choices
    }
    else if (mode == "Timed")
    {
      stopTimedLoop();
    }
    
    right_answer = "additionScreen" + global_ans_choice+ "Button";  // sets the right answer choice for the screen
    
    
    
    // stops timer if timed mode is on and user clicks on an answer choice
    
    
    if (elementClicked == right_answer) // checks if user clicked the correct answer
    {
      feedbackSound("Correct");
      storeFeedback("additionScreen", "Correct");
      feedback_action("additionScreen", "Correct");
    }
    else // the answer is wrong
    {
      feedbackSound("Wrong");
      storeFeedback("additionScreen", "Wrong!",getText(elementClicked));
      feedback_action("additionScreen", "Wrong");
    }
    
    // update the progress bar
    progress_length += Math.ceil(230 / num_questions);  
    if (progress_length >= 230 && Object.keys(total_questions).length >= num_questions)
    {
      is_active = false;
      configureFeedbackScreen("additionScreen", total_questions);
      setScreen("feedbackScreen");
    }
    else
    {
       setProperty("additionScreenProgressBarImage", "width", progress_length);
       updateScreen("additionScreen");
    }
    
    
  }
});


onEvent("subtractionScreen", "click", function(event) {
  /*
  [SUBTRACTION SCREEN] feedback for user if they clicked the correct answer or not
    -Displays the next question
    -Checks if user has completed desired number of questions
    -Logs question and answer by calling storeFeedback()
  */
  
  
  
  // prevents the user from spamming an answer choice and crashing the program
  if (!is_active){
    return;
  }
  
  var elementClicked = event.targetId;
  if (elementClicked != "subtractionScreen") {
    
    // allows the user to skip a question if they have the question skip power up
    // skipped questions are not stored in feedbackScreen
    if (elementClicked.includes("QuestionSkipButton") && question_skip > 0)
    {
      if (mode == "Timed")
      {
      stopTimedLoop();
      }
      
      playSound("sound://category_alerts/vibrant_game_shutter_alert_1_short_quick.mp3");
      question_skip -= 1;
      updatePowerUpsLabels("subtractionScreen");
      
      updateScreen("subtractionScreen");
    }
    
    else if (elementClicked.includes("EliminateChoiceButton") && eliminate_choice > 0)
    {
      // # of eliminate_choice is updated within eliminate_choice_function
      // eliminates an incorrect answer choice and updates the number of powerups left accordingly
      eliminateChoiceFunction("subtractionScreen");
      updatePowerUpsLabels("subtractionScreen");
    }
    
    else if (elementClicked.includes("CoinMultiplierButton") && coin_multiplier > 0)
    {
      // only used if in timed mode.
      // each time the CoinMultiplierButton is clicked, the constant that is multiplied by meke_coin the user receives is incremented  by 1. 
      if (mode == "Timed")
      {
        multiplier += 1;
        coin_multiplier -= 1;
        updatePowerUpsLabels("subtractionScreen");
      }
    }
    
    else if (elementClicked.includes("TimeSaverButton") && time_saver > 0)
    {
      // only used if in timed mode.
      // each time TimeSaverButton is clicked, the time the user has to answer the question is increased by 10 seconds. 
      if (mode == "Timed")
      {
        time += 10;
        time_saver -= 1;
        updatePowerUpsLabels("subtractionScreen");
      }
    }
    else if (elementClicked.includes("SoundButton"))
    {
      // toggles and either mutes/unmutes alert and feedback sounds
      // if currently unmuted, this mutes the alert and feeedback sounds
      // if currently muted, this unmutes the alert and feedback sounds
      updateSound("subtractionScreen");
    }
    
    else if (elementClicked.includes("MusicButton"))
    {
      // toggles and either mutes/unmutes the background music
      // if currently unmuted, this mutes the background music
      // if currently muted, this unmutes the background music
      updateMusic("subtractionScreen");
    }
    
    
    if (elementClicked.includes("ans") != true)
    {
      return;
    }
    
    right_answer = "subtractionScreen" + global_ans_choice+ "Button";
    
    // stops timer if timed mode is on and user clicks on an answer choice
    if (mode == "Timed")
    {
      stopTimedLoop();
    }
   
    if (elementClicked == right_answer) // correct answer chosen
    {
      feedbackSound("Correct"); // play correct sound
      storeFeedback("subtractionScreen","Correct"); // store the correct answer was given
      feedback_action("subtractionScreen", "Correct"); // sets the feedback to correct (check)
    }
    else // incorrect answer chosen
    {
      feedbackSound("Wrong"); // plays the wrong sound
      storeFeedback("subtractionScreen", "Wrong!",getText(elementClicked)); // stores the feedback for the wrong answer
      feedback_action("subtractionScreen", "Wrong"); // sets the feedback to wrong (x
    }
    
    progress_length += Math.ceil(230 / num_questions); // increments the progress
    if (progress_length >= 230 && Object.keys(total_questions).length >= num_questions) // if the user has answered the desired amount of questions
    {
      is_active = false; // game is not in active play anymore 
      configureFeedbackScreen("subtractionScreen", total_questions); // sets properties of elements on feedbackScreen to match what the user has completed
      setScreen("feedbackScreen"); // goes to feedbackScreen
    }
    else
    {
      setProperty("subtractionScreenProgressBarImage", "width", progress_length); // increments the progress bar
      updateScreen("subtractionScreen"); // loads a new question
    }
    
    
  }
});

onEvent("multiplicationScreen", "click", function(event) {
  /*
  [MULTIPLICATION SCREEN] feedback for user if they clicked the correct answer or not
    -Displays the next question
    -Checks if user has completed desired number of questions
    -Logs question and answer by calling storeFeedback()
  */
  
  // prevents the user from spamming an answer choice and crashing the program
  if (!is_active){
    return;
  }
  
  var elementClicked = event.targetId;
  if (elementClicked != "multiplicationScreen") {
    
    // allows the user to skip a question if they have the question skip power up
    // skipped questions are not stored in feedbackScreen
    if (elementClicked.includes("QuestionSkipButton") && question_skip > 0)
    {
      if (mode == "Timed")
      {
      stopTimedLoop(); 
      }
      
      playSound("sound://category_alerts/vibrant_game_shutter_alert_1_short_quick.mp3"); // skip sound
      question_skip -= 1; // reduces the question skip count
      updatePowerUpsLabels("multiplicationScreen"); // updates all power up labels & their counts
      updateScreen("multiplicationScreen"); // loads a new question
    }
    
    else if (elementClicked.includes("EliminateChoiceButton") && eliminate_choice > 0)
    {
      // # of eliminate_choice is updated within eliminate_choice_function
      // eliminates an incorrect answer choice and updates the number of powerups left accordingly
      eliminateChoiceFunction("multiplicationScreen");
      updatePowerUpsLabels("multiplicationScreen");
    }
    
    else if (elementClicked.includes("CoinMultiplierButton") && coin_multiplier > 0)
    {
      // only used if in timed mode.
      // each time the CoinMultiplierButton is clicked, the constant that is multiplied by meke_coin the user receives is incremented  by 1. 
      if (mode == "Timed")
      {
        multiplier += 1;
        coin_multiplier -= 1;
        updatePowerUpsLabels("multiplicationScreen");
      }
    }
    
    else if (elementClicked.includes("TimeSaverButton") && time_saver > 0)
    {
      // only used if in timed mode.
      // each time TimeSaverButton is clicked, the time the user has to answer the question is increased by 10 seconds. 
      if (mode == "Timed")
      {
        time += 10;
        time_saver -= 1;
        updatePowerUpsLabels("multiplicationScreen");
      }
    }
    
    else if (elementClicked.includes("SoundButton"))
    {
      // toggles and either mutes/unmutes alert and feedback sounds
      // if currently unmuted, this mutes the alert and feeedback sounds
      // if currently muted, this unmutes the alert and feedback sounds
      updateSound("multiplicationScreen");
    }
    
    else if (elementClicked.includes("MusicButton"))
    {
      // toggles and either mutes/unmutes the background music
      // if currently unmuted, this mutes the background music
      // if currently muted, this unmutes the background music
      updateMusic("multiplicationScreen");
    }
    
    if (elementClicked.includes("ans") != true)
    {
      return;
    }
    
    right_answer = "multiplicationScreen" + global_ans_choice+ "Button";
    
    // stops timer if timed mode is on and user clicks on an answer choice
    if (mode == "Timed")
    {
      stopTimedLoop();
    }
   
    if (elementClicked == right_answer)
    {
      feedbackSound("Correct"); // stores the answer the user answered correctly
      feedback_action("multiplicationScreen", "Correct"); // plays the correct sound
      storeFeedback("multiplicationScreen", "Correct"); // sets the feedback to correct (check)
    }
    else
    {
      storeFeedback("multiplicationScreen", "Wrong!",getText(elementClicked)); // stores the feedback for the wrong answer
      feedbackSound("Wrong"); // plays the wrong sound
      feedback_action("multiplicationScreen", "Wrong"); // sets the feedback to wrong (x)
    } 
    
    progress_length += Math.ceil(230 / num_questions); // increments the progress
    if (progress_length >= 230 && Object.keys(total_questions).length >= num_questions) // if the user has answered the desired amount of questions
    {
      is_active = false;
      configureFeedbackScreen("multiplicationScreen", total_questions); // sets properties of elements on feedbackScreen to match what the user has completed
      setScreen("feedbackScreen"); // goes to feedbackScreen
    }
    else
    {
      setProperty("multiplicationScreenProgressBarImage", "width", progress_length); // increments the progress bar
      updateScreen("multiplicationScreen"); // loads a new question
    }
    
    
  }
  });


onEvent("divisionScreen", "click", function(event) {
  /*
  [DIVISION SCREEN] feedback for user if they clicked the correct answer or not
    -Displays the next question
    -Checks if user has completed desired number of questions
    -Logs question and answer by calling storeFeedback()
  */
  
  // prevents the user from spamming an answer choice and crashing the program
  if (!is_active){
    return;
  }
  
  var elementClicked = event.targetId;
  if (elementClicked != "divisionScreen") {
    
    // allows the user to skip a question if they have the question skip power up
    // skipped questions are not stored in feedbackScreen
    if (elementClicked.includes("QuestionSkipButton") && question_skip > 0)
    {
      if (mode == "Timed")
      {
      stopTimedLoop();
      }
      
      playSound("sound://category_alerts/vibrant_game_shutter_alert_1_short_quick.mp3"); // skip sound
      question_skip -= 1; // reduces the question skip count
      updatePowerUpsLabels("divsionScreen"); // updates all power up labels & their counts
      updateScreen("divisionScreen"); // loads a new question
    }
    
    else if (elementClicked.includes("EliminateChoiceButton") && eliminate_choice > 0)
    {
      // # of eliminate_choice is updated within eliminate_choice_function
      // eliminates an incorrect answer choice and updates the number of powerups left accordingly
      eliminateChoiceFunction("divisionScreen");
      updatePowerUpsLabels("divisionScreen");
    }
    
    else if (elementClicked.includes("CoinMultiplierButton") && coin_multiplier > 0)
    {
      // only used if in timed mode.
      // each time the CoinMultiplierButton is clicked, the constant that is multiplied by meke_coin the user receives is incremented  by 1. 
      if (mode == "Timed")
      {
        multiplier += 1;
        coin_multiplier -= 1;
        updatePowerUpsLabels("divisionScreen");
      }
    }
    
    else if (elementClicked.includes("TimeSaverButton") && time_saver > 0)
    {
      // only used if in timed mode.
      // each time TimeSaverButton is clicked, the time the user has to answer the question is increased by 10 seconds. 
      if (mode == "Timed")
      {
        time += 10;
        time_saver -= 1;
        updatePowerUpsLabels("divisionScreen");
      }
    }
    
    else if (elementClicked.includes("SoundButton"))
    {
      // toggles and either mutes/unmutes alert and feedback sounds
      // if currently unmuted, this mutes the alert and feeedback sounds
      // if currently muted, this unmutes the alert and feedback sounds
      updateSound("divisionScreen");
    }
    
    else if (elementClicked.includes("MusicButton"))
    {
      // toggles and either mutes/unmutes the background music
      // if currently unmuted, this mutes the background music
      // if currently muted, this unmutes the background music
      updateMusic("divisionScreen");
    }
    
    if (elementClicked.includes("ans") != true)
    {
      return; // doesn't allow user to click on anything except for the answer choices
    }
    
    right_answer = "divisionScreen" + global_ans_choice+ "Button";
    
    // stops timer if timed mode is on and user clicks on an answer choice
    if (mode == "Timed")
    {
      stopTimedLoop();
    }
    
    if (elementClicked == right_answer)
    {
      storeFeedback("divisionScreen", "Correct"); // stores the answer the user answered correctly
      feedbackSound("Correct"); // plays the correct sound
      feedback_action("divisionScreen", "Correct"); // sets the feedback to correct (check)
      
    } else {
      storeFeedback("divisionScreen", "Wrong!",getText(elementClicked)); // stores the feedback for the wrong answer
      feedbackSound("Wrong"); // plays the wrong sound
      feedback_action("divisionScreen", "Wrong"); // sets the feedback to wrong (x)
    }
    
    progress_length += Math.ceil(230 / num_questions); // increments the progress
    if (progress_length >= 230 && Object.keys(total_questions).length >= num_questions) // if the user has answered the desired amount of questions
    {
      is_active = false;// game is not in active play anymore
      configureFeedbackScreen("divisionScreen", total_questions); // sets properties of elements on feedbackScreen to match what the user has completed
      setScreen("feedbackScreen"); // goes to feedbackScreen 
    }
    else
    {
      setProperty("divisionScreenProgressBarImage", "width", progress_length); // increments the progress bar
      updateScreen("divisionScreen"); // loads a new question
    }
  }
});

onEvent("randomScreen", "click", function(event) {
  /*
  [RANDOM SCREEN] feedback for user if they clicked the correct answer or not
    -Displays the next question
    -Checks if user has completed desired number of questions
    -Logs question and answer by calling storeFeedback()
  */
  
  // prevents the user from spamming an answer choice and crashing the program
  if (!is_active){
    return;
  }
  
  var elementClicked = event.targetId;
  if (elementClicked != "randomScreen") {
    
    // allows the user to skip a question if they have the question skip power up
    // skipped questions are not stored in feedbackScreen
    if (elementClicked.includes("QuestionSkipButton") && question_skip > 0)
    {
      if (mode == "Timed")
      {
      stopTimedLoop(); // stops the timer in case in timed mode
      }
      
      playSound("sound://category_alerts/vibrant_game_shutter_alert_1_short_quick.mp3"); // skip sound
      question_skip -= 1; // reduces the question skip count
      
      updatePowerUpsLabels("randomScreen"); // updates all power up labels & their counts
      updateScreen("randomScreen"); // loads a new question
    }
    
    else if (elementClicked.includes("EliminateChoiceButton") && eliminate_choice > 0)
    {
      // # of eliminate_choice is updated within eliminate_choice_function
      // eliminates an incorrect answer choice and updates the number of powerups left accordingly
      eliminateChoiceFunction("randomScreen");
      updatePowerUpsLabels("randomScreen");
    }
    
    else if (elementClicked.includes("CoinMultiplierButton") && coin_multiplier > 0)
    {
      // only used if in timed mode.
      // each time the CoinMultiplierButton is clicked, the constant that is multiplied by meke_coin the user receives is incremented  by 1. 
      if (mode == "Timed")
      {
        multiplier += 1;
        coin_multiplier -= 1;
        updatePowerUpsLabels("randomScreen");
      }
    }
    
    else if (elementClicked.includes("TimeSaverButton") && time_saver > 0)
    {
      // only used if in timed mode.
      // each time TimeSaverButton is clicked, the time the user has to answer the question is increased by 10 seconds. 
      if (mode == "Timed")
      {
        time += 10;
        time_saver -= 1;
        updatePowerUpsLabels("randomScreen");
      }
    }
    
    else if (elementClicked.includes("SoundButton"))
    {
      // toggles and either mutes/unmutes alert and feedback sounds
      // if currently unmuted, this mutes the alert and feeedback sounds
      // if currently muted, this unmutes the alert and feedback sounds
      updateSound("randomScreen");
    }
    
    else if (elementClicked.includes("MusicButton"))
    {
      // toggles and either mutes/unmutes the background music
      // if currently unmuted, this mutes the background music
      // if currently muted, this unmutes the background music
      updateMusic("randomScreen");
    }
    
    if (elementClicked.includes("ans") != true)
    {
      return; // doesn't allow user to click on anything except for the answer choices
    }
    
    right_answer = "randomScreen" + global_ans_choice+ "Button"; // sets the right answer choice for the screen
    
    // stops timer if timed mode is on and user clicks on an answer choice
    if (mode == "Timed")
    {
      stopTimedLoop();
    }
    
    if (elementClicked == right_answer) // checks if user clicked the correct answer
    {
      storeFeedback("randomScreen", "Correct"); // stores the answer the user answered correctly
      feedbackSound("Correct"); // plays the correct sound 
      feedback_action("randomScreen", "Correct"); // sets the feedback to correct (check)
    } else {
      storeFeedback("randomScreen", "Wrong!",getText(elementClicked)); // stores the feedback for the wrong answer
      feedbackSound("Wrong"); // plays the wrong sound
      feedback_action("randomScreen", "Wrong"); // sets the feedback to wrong (x)
    }
    
    progress_length += Math.ceil(230 / num_questions); // increments the progress
    if (progress_length >= 230 && Object.keys(total_questions).length >= num_questions) // if the user has answered the desired amount of questions
    {
      is_active = false; // game is not in active play anymore
      configureFeedbackScreen("randomScreen", total_questions); // sets properties of elements on feedbackScreen to match what the user has completed
      setScreen("feedbackScreen"); // goes to feedbackScreen
    }
    else
    {
      setProperty("randomScreenProgressBarImage", "width", progress_length); // increments the progress bar
      updateScreen("randomScreen"); // loads a new question
    }
    
    
    
  }
});

// check if prime number
function isPrime(num) {
  for(var i = 2; i < num; i++)
    if(num % i === 0) return false; // tests for strict equality
  return num > 1;
}

function setFonts()
{
  /*
    Function sets the font of all text in Meke to be Asap
      -configured in code because code.org does not typically support Asap as a font
  */
  setStyle("welcomeScreenAppNameLabel", "font-family: ASAP;");
  setStyle("loginScreenTitleLabel", "font-family: ASAP;");
  setStyle("welcomeScreenContinueLabel", "font-family: ASAP;");
  setStyle("loginScreenDescriptionLabel", "font-family: ASAP;");
  setStyle("loginScreenUsernameLabel", "font-family: ASAP;");
  setStyle("loginScreenPasswordLabel", "font-family: ASAP;");
  setStyle("loginScreenUsernameInput", "font-family: ASAP;");
  setStyle("loginScreenPasswordInput", "font-family: ASAP;");
  setStyle("loginScreenWrongLabel", "font-family: ASAP;");
  setStyle("loginScreenNewUserButton", "font-family: ASAP;");
  setStyle("loginScreenLoginButton", "font-family: ASAP;");
  setStyle("loginScreenGuestButton", "font-family: ASAP;");
  setStyle("menuScreenMekeLabel", "font-family: ASAP;");
  setStyle("menuScreenWelcomeLabel", "font-family: ASAP;");
  setStyle("menuScreenTotalProblemsLabel", "font-family: ASAP;");
  setStyle("menuScreenAdditionButton", "font-family: ASAP;");
  setStyle("menuScreenSubtractionButton", "font-family: ASAP;");
  setStyle("menuScreenMultiplicationButton", "font-family: ASAP;");
  setStyle("menuScreenDivisionButton", "font-family: ASAP;");
  setStyle("menuScreenRandomButton", "font-family: ASAP;");
  setStyle("menuScreenResourceButton", "font-family: ASAP;");
  setStyle("searchScreenUsernameInput", "font-family: ASAP;");
  setStyle("searchScreenUsernameLabel", "font-family: ASAP;");
  setStyle("searchScreenBadgesLabel", "font-family: ASAP;");
  setStyle("searchScreenPrivateError", "font-family: ASAP;");
  setStyle("searchScreenErrorLabel", "font-family: ASAP;");
  setStyle("searchScreenStatsLabel", "font-family: ASAP;");
  setStyle("searchScreenTotalQuestionsLabel", "font-family: ASAP;");
  setStyle("searchScreenCorrectAnswersLabel", "font-family: ASAP;");
  setStyle("searchScreenIncorrectAnswersLabel", "font-family: ASAP;");
  setStyle("searchScreenAccuracyLabel", "font-family: ASAP;");
  setStyle("searchScreenBackButton", "font-family: ASAP;");
  setStyle("searchScreenProfileButton", "font-family: ASAP;");
  setStyle("settingsScreenTitleLabel", "font-family: ASAP;");
  setStyle("settingsScreenMusicLabel", "font-family: ASAP;");
  setStyle("settingsScreenMusicDropdown", "font-family: ASAP;");
  setStyle("settingsScreenPersonalInformationLabel", "font-family: ASAP;");
  setStyle("settingsScreenNameLabel", "font-family: ASAP;");
  setStyle("settingsScreenCurrentName", "font-family: ASAP;");
  setStyle("settingsScreenUsernameLabel", "font-family: ASAP;");
  setStyle("settingsScreenCurrentUsername", "font-family: ASAP;");
  setStyle("settingsScreenPasswordLabel", "font-family: ASAP;");
  setStyle("settingsScreenCurrentPassword", "font-family: ASAP;");
  setStyle("settingsScreenProfilePrivateLabel", "font-family: ASAP;");
  setStyle("settingsScreenCurrentProfilePrivate", "font-family: ASAP;");
  setStyle("settingsScreenNameEditButton", "font-family: ASAP;");
  setStyle("settingsScreenPasswordEditButton", "font-family: ASAP;");
  setStyle("settingsScreenProfilePrivateEditButton", "font-family: ASAP;");
  setStyle("settingsScreenFeedbackLabel", "font-family: ASAP;");
  setStyle("settingsScreenLogOutButton", "font-family: ASAP;");
  setStyle("settingsScreenBackButton", "font-family: ASAP;");
  setStyle("nameChangeScreenTitleLabel", "font-family: ASAP;");
  setStyle("nameChangeScreenNameLabel", "font-family: ASAP;");
  setStyle("nameChangeScreenCurrentNameLabel", "font-family: ASAP;");
  setStyle("nameChangeScreenNewLabel", "font-family: ASAP;");
  setStyle("nameChangeScreenNewNameInput", "font-family: ASAP;");
  setStyle("nameChangeScreenErrorLabel", "font-family: ASAP;");
  setStyle("nameChangeScreenBackButton", "font-family: ASAP;");
  setStyle("nameChangeScreenSaveButton", "font-family: ASAP;");
  setStyle("usernameChangeScreenTitleLabel", "font-family: ASAP;");
  setStyle("usernameChangeScreenUsername", "font-family: ASAP;");
  setStyle("usernameChangeScreenCurrentUsername", "font-family: ASAP;");
  setStyle("usernameChangeScreenNewUsernameLabel", "font-family: ASAP;");
  setStyle("usernameChangeScreenNewUsernameInput", "font-family: ASAP;");
  setStyle("usernameChangeScreenErrorMessage", "font-family: ASAP;");
  setStyle("usernameChangeScreenBackButton", "font-family: ASAP;");
  setStyle("usernameChangeScreenSaveButton", "font-family: ASAP;");
  setStyle("passwordChangeScreenTitleLabel", "font-family: ASAP;");
  setStyle("passwordChangeScreenPassword", "font-family: ASAP;");
  setStyle("passwordChangeScreenCurrentPasswordInput", "font-family: ASAP;");
  setStyle("passwordChangeScreenNewPassword", "font-family: ASAP;");
  setStyle("passwordChangeScreenNewPasswordInput", "font-family: ASAP;");
  setStyle("passwordChangeScreenConfirmPassword", "font-family: ASAP;");
  setStyle("passwordChangeScreenConfirmPasswordInput", "font-family: ASAP;");
  setStyle("passwordChangeScreenErrorLabel", "font-family: ASAP;");
  setStyle("passwordChangeScreenBackButton", "font-family: ASAP;");
  setStyle("passwordChangeScreenSaveButton", "font-family: ASAP;");
  setStyle("privateChangeScreenTitleLabel", "font-family: ASAP;");
  setStyle("privateChangeScreenVisibleLabel", "font-family: ASAP;");
  setStyle("privateChangeScreenCurrentVisible", "font-family: ASAP;");
  setStyle("privateChangeScreenNewVisibleLabel", "font-family: ASAP;");
  setStyle("privateChangeScreenNewVisibleDropdown", "font-family: ASAP;");
  setStyle("privateChangeScreenErrorLabel", "font-family: ASAP;");
  setStyle("privateChangeScreenErrorLabel", "font-family: ASAP;");
  setStyle("privateChangeScreenBackButton", "font-family: ASAP;");
  setStyle("privateChangeScreenSaveButton", "font-family: ASAP;");
  setStyle("leaderboardScreenTitleLabel", "font-family: ASAP;");
  setStyle("leaderboardScreenQuestionFilter", "font-family: ASAP;");
  setStyle("leaderboardScreenCorrectFilter", "font-family: ASAP;");
  setStyle("leaderboardScreenOutputArea", "font-family: ASAP;");
  setStyle("leaderboardScreenBackButton", "font-family: ASAP;");
  setStyle("shopScreenShopLabel", "font-family: ASAP;");
  setStyle("shopScreenBalanceLabel", "font-family: ASAP;");
  setStyle("shopScreenUsernameLabel", "font-family: ASAP;");
  setStyle("shopScreenTimeLabel", "font-family: ASAP;");
  setStyle("shopScreenEliminateLabel", "font-family: ASAP;");
  setStyle("shopScreenSkipLabel", "font-family: ASAP;");
  setStyle("shopScreenMultiplierLabel", "font-family: ASAP;");
  setStyle("shopScreenTimeAmount", "font-family: ASAP;");
  setStyle("shopScreenEliminateAmount", "font-family: ASAP;");
  setStyle("shopScreenSkipAmount", "font-family: ASAP;");
  setStyle("shopScreenMultiplierAmount", "font-family: ASAP;");
  setStyle("shopScreenCostLabel", "font-family: ASAP;");
  setStyle("shopScreenPurchaseButton", "font-family: ASAP;");
  setStyle("shopScreenBackButton", "font-family: ASAP;");
  setStyle("shopScreenInformationLabel", "font-family: ASAP;");
  setStyle("exchangeScreenPlayerExchangeLabel", "font-family: ASAP;");
  setStyle("exchangeScreenExchangeUserLabel", "font-family: ASAP;");
  setStyle("exchangeScreenUsernameInput", "font-family: ASAP;");
  setStyle("exchangeScreenPromptText", "font-family: ASAP;");
  setStyle("exchangeScreenTimeLabel", "font-family: ASAP;");
  setStyle("exchangeScreenTimeAmount", "font-family: ASAP;");
  setStyle("exchangeScreenEliminateLabel", "font-family: ASAP;");
  setStyle("exchangeScreenEliminateAmount", "font-family: ASAP;");
  setStyle("exchangeScreenSkipLabel", "font-family: ASAP;");
  setStyle("exchangeScreenSkipAmount", "font-family: ASAP;");
  setStyle("exchangeScreenMultiplierLabel", "font-family: ASAP;");
  setStyle("exchangeScreenMultiplierAmount", "font-family: ASAP;");
  setStyle("exchangeScreenMekeCoinLabel", "font-family: ASAP;");
  setStyle("exchangeScreenMekeCoinAmount", "font-family: ASAP;");
  setStyle("exchangeScreenExchangeButton", "font-family: ASAP;");
  setStyle("exchangeScreenBackButton", "font-family: ASAP;");
  setStyle("exchangeScreenShopButton", "font-family: ASAP;");
  setStyle("exchangeScreenTimeInv", "font-family: ASAP;");
  setStyle("exchangeScreenEliminateInv", "font-family: ASAP;");
  setStyle("exchangeScreenSkipInv", "font-family: ASAP;");
  setStyle("exchangeScreenMultiplierInv", "font-family: ASAP;");
  setStyle("exchangeScreenMekeCoinInv", "font-family: ASAP;");
  setStyle("resourceScreenTitleLabel", "font-family: ASAP;");
  setStyle("resourceScreenAdditionLabel", "font-family: ASAP;");
  setStyle("resourceScreenAddition1Button", "font-family: ASAP;");
  setStyle("resourceScreenAddition2Button", "font-family: ASAP;");
  setStyle("resourceScreenAddition3Button", "font-family: ASAP;");
  setStyle("resourceScreenSubtractionLabel", "font-family: ASAP;");
  setStyle("resourceScreenSubtraction1Button", "font-family: ASAP;");
  setStyle("resourceScreenSubtraction2Button", "font-family: ASAP;");
  setStyle("resourceScreenSubtraction3Button", "font-family: ASAP;");
  setStyle("resourceScreenMultiplicationLabel", "font-family: ASAP;");
  setStyle("resourceScreenMultiplication1Button", "font-family: ASAP;");
  setStyle("resourceScreenMultiplication2Button", "font-family: ASAP;");
  setStyle("resourceScreenMultiplication3Button", "font-family: ASAP;");
  setStyle("resourceScreenDivisionLabel", "font-family: ASAP;");
  setStyle("resourceScreenDivision1Button", "font-family: ASAP;");
  setStyle("resourceScreenDivision2Button", "font-family: ASAP;");
  setStyle("resourceScreenDivision3Button", "font-family: ASAP;");
  setStyle("resourceScreenComplexButton", "font-family: ASAP;");
  setStyle("resourceScreenMenuButton", "font-family: ASAP;");
  setStyle("skillSettingsScreenSkillLabel", "font-family: ASAP;");
  setStyle("skillSettingsScreenDifficultyLabel", "font-family: ASAP;");
  setStyle("skillSettingsScreenDifficultyDropdown", "font-family: ASAP;");
  setStyle("skillSettingsScreenExplanationArea", "font-family: ASAP;");
  setStyle("skillSettingsScreenModeLabel", "font-family: ASAP;");
  setStyle("skillSettingsScreenModeDropdown", "font-family: ASAP;");
  setStyle("skillSettingsScreenQuestionsLabel", "font-family: ASAP;");
  setStyle("skillSettingsScreenBeginButton", "font-family: ASAP;");
  setStyle("skillSettingsScreenMenuButton", "font-family: ASAP;");
  setStyle("additionScreenAdditionLabel", "font-family: ASAP;");
  setStyle("subtractionScreenSubtractionLabel", "font-family: ASAP;");
  setStyle("multiplicationScreenMultiplicationLabel", "font-family: ASAP;");
  setStyle("divisionScreenDivisionLabel", "font-family: ASAP;");
  setStyle("randomScreenRandomLabel", "font-family: ASAP;");
  setStyle("newAccountScreenTitleLabel", "font-family: ASAP");
  setStyle("newAccountScreenInfoLabel", "font-family: ASAP");
  setStyle("newAccountScreenNameLabel", "font-family: ASAP");
  setStyle("newAccountScreenNameInput", "font-family: ASAP");
  setStyle("newAccountScreenUsernameLabel", "font-family: ASAP");
  setStyle("newAccountScreenUsernameInput", "font-family: ASAP");
  setStyle("newAccountScreenPasswordLabelnewAccountScreenPasswordInput", "font-family: ASAP");
  setStyle("newAccountScreenPasswordInput", "font-family: ASAP");
  setStyle("newAccountScreenRetypeLabel", "font-family: ASAP");
  setStyle("newAccountScreenRetypeInput", "font-family: ASAP");
  setStyle("newAccountScreenFeedbackLabel", "font-family: ASAP");
  setStyle("newAccountScreenBackButton", "font-family: ASAP");
  setStyle("newAccountScreenLoginButton", "font-family: ASAP");
  setStyle("menuScreenErrorLabel", "font-family: ASAP");
  
  
  var types = ["additionScreen", "subtractionScreen", "multiplicationScreen", "divisionScreen", "randomScreen"];
  
  // iterates through each element on the skill screens and sets their font
  for (var type=0; type < types.length-1; type++)
  {
    var value = types[type];
    setStyle(value + "TimeLabel", "font-family: ASAP;");
    setStyle(value + "QNum1Label", "font-family: ASAP;");
    setStyle(value + "QNum2Label", "font-family: ASAP;");
    setStyle(value + "ans1Button", "font-family: ASAP;");
    setStyle(value + "ans2Button", "font-family: ASAP;");
    setStyle(value + "ans3Button", "font-family: ASAP;");
    setStyle(value + "ans4Button", "font-family: ASAP;");
    setStyle(value + "EliminateChoiceCount", "font-family: ASAP;");
    setStyle(value + "TimeSaverCount", "font-family: ASAP;");
    setStyle(value + "QuestionSkipCount", "font-family: ASAP;");
    setStyle(value + "CoinMultiplierCount", "font-family: ASAP;");
  }
}



/*
* Secure Hash Algorithm (SHA512)
* http://www.happycode.info/
*/
// Start of SHA512()
function SHA512(str) {
 function int64(msint_32, lsint_32) {
 this.highOrder = msint_32;
 this.lowOrder = lsint_32;
 }

 var H = [new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),
 new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),
 new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),
 new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)];

 var K = [new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),
 new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),
 new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),
 new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),
 new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),
 new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),
 new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),
 new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),
 new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),
 new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),
 new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
 new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),
 new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),
 new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),
 new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),
 new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),
 new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
 new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),
 new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),
 new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),
 new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),
 new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),
 new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),
 new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
 new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),
 new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),
 new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),
 new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),
 new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
 new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),
 new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),
 new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),
 new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),
 new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),
 new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),
 new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),
 new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
 new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),
 new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),
 new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)];

 var W = new Array(64);
 var a, b, c, d, e, f, g, h, i, j;
 var T1, T2;
 var charsize = 8;

 function utf8_encode(str) {
 return unescape(encodeURIComponent(str));
 }

 function str2binb(str) {
 var bin = [];
 var mask = (1 << charsize) - 1;
 var len = str.length * charsize;

 for (var i = 0; i < len; i += charsize) {
 bin[i >> 5] |= (str.charCodeAt(i / charsize) & mask) << (32 - charsize - (i % 32));
 }

 return bin;
 }

 function binb2hex(binarray) {
 var hex_tab = '0123456789abcdef';
 var str = '';
 var length = binarray.length * 4;
 var srcByte;

 for (var i = 0; i < length; i += 1) {
 srcByte = binarray[i >> 2] >> ((3 - (i % 4)) * 8);
 str += hex_tab.charAt((srcByte >> 4) & 0xF) + hex_tab.charAt(srcByte & 0xF);
 }

 return str;
 }

 function safe_add_2(x, y) {
 var lsw, msw, lowOrder, highOrder;

 lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);
 msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);
 lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

 lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);
 msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);
 highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

 return new int64(highOrder, lowOrder);
 }

 function safe_add_4(a, b, c, d) {
 var lsw, msw, lowOrder, highOrder;

 lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);
 msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);
 lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

 lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);
 msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);
 highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

 return new int64(highOrder, lowOrder);
 }

 function safe_add_5(a, b, c, d, e) {
 var lsw, msw, lowOrder, highOrder;

 lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);
 msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);
 lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

 lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);
 msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);
 highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

 return new int64(highOrder, lowOrder);
 }

 function maj(x, y, z) {
 return new int64(
 (x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder),
 (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder)
 );
 }

 function ch(x, y, z) {
 return new int64(
 (x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder),
 (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder)
 );
 }

 function rotr(x, n) {
 if (n <= 32) {
 return new int64(
 (x.highOrder >>> n) | (x.lowOrder << (32 - n)),
 (x.lowOrder >>> n) | (x.highOrder << (32 - n))
 );
 } else {
 return new int64(
 (x.lowOrder >>> n) | (x.highOrder << (32 - n)),
 (x.highOrder >>> n) | (x.lowOrder << (32 - n))
 );
 }
 }

 function sigma0(x) {
 var rotr28 = rotr(x, 28);
 var rotr34 = rotr(x, 34);
 var rotr39 = rotr(x, 39);

 return new int64(
 rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder,
 rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder
 );
 }

 function sigma1(x) {
 var rotr14 = rotr(x, 14);
 var rotr18 = rotr(x, 18);
 var rotr41 = rotr(x, 41);

 return new int64(
 rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder,
 rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder
 );
 }

 function gamma0(x) {
 var rotr1 = rotr(x, 1), rotr8 = rotr(x, 8), shr7 = shr(x, 7);

 return new int64(
 rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder,
 rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder
 );
 }

 function gamma1(x) {
 var rotr19 = rotr(x, 19);
 var rotr61 = rotr(x, 61);
 var shr6 = shr(x, 6);

 return new int64(
 rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder,
 rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder
 );
 }

 function shr(x, n) {
 if (n <= 32) {
 return new int64(
 x.highOrder >>> n,
 x.lowOrder >>> n | (x.highOrder << (32 - n))
 );
 } else {
 return new int64(
 0,
 x.highOrder << (32 - n)
 );
 }
 }

 str = utf8_encode(str);
 strlen = str.length*charsize;
 str = str2binb(str);

 str[strlen >> 5] |= 0x80 << (24 - strlen % 32);
 str[(((strlen + 128) >> 10) << 5) + 31] = strlen;

 for (var i = 0; i < str.length; i += 32) {
 a = H[0];
 b = H[1];
 c = H[2];
 d = H[3];
 e = H[4];
 f = H[5];
 g = H[6];
 h = H[7];

 for (var j = 0; j < 80; j++) {
 if (j < 16) {
 W[j] = new int64(str[j*2 + i], str[j*2 + i + 1]);
 } else {
 W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);
 }

 T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]);
 T2 = safe_add_2(sigma0(a), maj(a, b, c));
 h = g;
 g = f;
 f = e;
 e = safe_add_2(d, T1);
 d = c;
 c = b;
 b = a;
 a = safe_add_2(T1, T2);
 }

 H[0] = safe_add_2(a, H[0]);
 H[1] = safe_add_2(b, H[1]);
 H[2] = safe_add_2(c, H[2]);
 H[3] = safe_add_2(d, H[3]);
 H[4] = safe_add_2(e, H[4]);
 H[5] = safe_add_2(f, H[5]);
 H[6] = safe_add_2(g, H[6]);
 H[7] = safe_add_2(h, H[7]);
 }

 var binarray = [];
 for (var f = 0; f < H.length; f++) {
 binarray.push(H[f].highOrder);
 binarray.push(H[f].lowOrder);
 }
 return binb2hex(binarray);
}
// End of SHA512()