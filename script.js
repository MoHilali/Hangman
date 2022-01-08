var ongoingGame = false;
var score;
var words = ["mangar", "impossible", "parfait"]
$(function() {
     $("#startreset").click(function() {
          if (ongoingGame) {
               $("#startreset").html("commencer le Jeu !");
               //reload page
               location.reload();
          } else {
               ongoingGame = true;
               score = 0;
               $("#illustration *").hide();
               $("#letterInput").prop('disabled', false);
               $("#letterInput").prop('placeholder', 'Taper une lettre...');
               $("#startreset").html("Réinitialiser !");
               $("#instructions").html("<p>Devinez une lettre :</p>");

               var guessWord = generateWord();

               checkWord(guessWord);
          }
     });

     // functions
     function generateWord() {
          var wordToGuess = words[Math.floor(Math.random() * words.length)];
          $("#textContainer").text('');
          for (var dash = 0; dash < wordToGuess.length; dash++)
               $("#textContainer").append('_ ');

          return wordToGuess;
     }

     function checkWord(word) {
          $("#letterInput").on('change', function() {
               var pattern = new RegExp($(this).val(), 'i');

               if (!(/[a-z]/gi.test($(this).val()))) {
                    $("#instructions").html('<p>Veuillez saisir une lettre de l\'alphabet.</p>');
               } else if ($(this).val().length != 1) {
                    $("#instructions").html('<p>Veuillez saisir une seule lettre.</p>');
               } else {
                    $("#instructions").html('<p>Vous avez saisi la lettre ' + $(this).val() + '.</p>');
                    if (pattern.test(word)) {
                         $("#instructions").append('<p>Correct !</p>');
                         checkLetter(word, pattern);
                         if (!/_/.test($("#textContainer").text())) {
                              $("#instructions").text('<p>Bravo !</p>');
                              initialState();
                         }
                    } else {
                         $("#instructions").append('<p>Oops raté! Veuillez réessayer.</p>');
                         score++;
                         $("#pendu" + score).show();
                         if (score>5){
                              $("#instructions").text('<p>Game Over !</p>');
                              $("#pendu" + 7).show();
                              initialState();
                         }
                    }
               }
               $(this).val('');
          });
     }

     function checkLetter(word, letter) {
          var hiddenWord = new String($("#textContainer").text());

          hiddenWord = hiddenWord.split(' ');
          for (var index = 0; index < word.length; index++) {
               if (letter.test(word.charAt(index))) {
                    hiddenWord[index] = word.charAt(index);
                    $("#textContainer").text(hiddenWord.join(' '));
               }
          }
     }

     function initialState(){
          $("#letterInput").prop('disabled', true);
          $("#letterInput").prop('placeholder', 'En attente...');
          $("#startreset").html("Commencer le Jeu!");
          ongoingGame = false;
     }
});
