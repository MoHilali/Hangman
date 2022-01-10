//variables globales
var ongoingGame = false;
var fautes, guessWord, chronometre;
var timeS, timeE, totalTime;
var hallOfFame;

//objet joueur
function Joueur() {
     this.nom = "";
     this.score = 10000;
     this.temps = 10000;
}

$(function() {
     //click sur le bouton du jeu
     $("#startreset").click(function(event) {
          //si le jeu est en cours :
          if (ongoingGame) {
               // changer le text sur le bouton à commencer:
               $("#startreset").html("commencer !");

               //actualiser la page
               location.reload();
               // si on va commencer un nouveau jeu
          } else {
               //initier la page du jeu
               initGame();

               //initier le tableau du Hall of fame
               initTable();

               //generer un nouveau mot
               guessWord = generateWord();

               //enlever le commentaire pour voir le mot généré
               console.log(guessWord);
          }
     });

     //en tapant une lettre dans le input:
     $("#letterInput").on('change', function(e) {
          //mettre la lettre tape dans une variable String
          var content = new String($(this).val());
          //transformer la letter tape en RegExp pour la chercher dans le mot.
          var pattern = new RegExp(content, 'i');

          //cas ou l'utilisateur tape un charactere special ou un chiffre
          if (!(/[a-z]/gi.test(content))) {
               $("#instructions").html('<p>Veuillez saisir une lettre de l\'alphabet.</p>');
               //cas ou l'utilisateur tape plus qu'une lettre à la fois
          } else if (content.length != 1) {
               $("#instructions").html('<p>Veuillez saisir une seule lettre.</p>');
          } else {
               $("#instructions").html('<p>Vous avez saisi la lettre ' + content + '.</p>');
               //verifier si le mot contient la pattern
               if (pattern.test(guessWord)) {
                    //indiquer que c'est correct et remplacer toutes les instance de la lettre dans le mot
                    $("#instructions").append('<p>Correct !</p>');
                    replaceLetter(guessWord, pattern);
               } else {
                    //indiquer que ce n'est pas une bonne reponse
                    $("#instructions").append('<p>Oops rate! Veuillez reessayer.</p>');
                    //afficher la lettre excluse
                    showExclusions(pattern);
                    //incrementer le nombre de fautes (le score)
                    fautes++;
                    //afficher la partie du pendu correspondante au nbr de fautes
                    $("#pendu" + fautes).show();
               }
          }

          //conditions de fin du jeu
          if (!/_/.test($("#textContainer").text())) { //s'il n'y a plus de underscore dans le mot
               //afficher bravo et le score
               $("#instructions").html('<p>Bravo !</p> <p> Votre score est : ' + fautes + '</p>');
               //arreter le chronometre
               clearInterval(chronometre);

               //si le localStorage ne contient pas la cle 'Thof'
               if (!('Thof' in localStorage)) {
                    //creer le tableau du hall of fame et le mettre dans le localStorage
                    creatJSON();
               }

               //transformer ce qu'il y a dans la cle Thof du localStorage en objet array
               hallOfFame = JSON.parse(localStorage['Thof']);
               //verifier si le score du jouer en cours est meilleur que celui du dernier joueur dans le Hall of fame
               if (fautes <= hallOfFame[9].score) {
                    //capturer la date du fin du jeu et calculer le temps du jeu.
                    totalTime = $("#chrono").text();

                    //initialiser un timer de 5 secondes pour l'utilisateur pour saisir son nom
                    var timer = 5;
                    $("#inputfield span").show();
                    setInterval(function() {
                         if (timer > -1) {
                              $("#inputfield span").text(timer);
                              timer--;
                         }
                    }, 1000);

                    $("#instructions").append('<p>Tapez votre nom 😁</p>');
                    $("#letterInput").hide();
                    $("#nameInput").show();
                    $("#nameInput").val('');

                    //executer des commandes apres que les 5 secondes soient ecoulees
                    setTimeout(function() {
                         //mettre le nouveau joueur en bas de le tableau du Hall of fame
                         hallOfFame[9].nom = $("#nameInput").val();
                         hallOfFame[9].score = fautes;
                         hallOfFame[9].temps = totalTime;
                         var jr = hallOfFame[9];

                         //trier le tableau par score d'abord pui par temps de jeu.
                         hallOfFame.sort(function(ob1, ob2) {
                              // tri par score d'abord
                              if (ob1.score > ob2.score) {
                                   return 1;
                              } else if (ob1.score < ob2.score) {
                                   return -1;
                              }
                              // si meme score tri par temps
                              if (ob1.temps < ob2.temps) {
                                   return -1;
                              } else if (ob1.temps > ob2.temps) {
                                   return 1
                              } else {
                                   return 0;
                              }
                         });

                         //get le rang du joueur
                         var rang = parseInt(hallOfFame.indexOf(jr)) + 1;

                         // Remplir dans table Hall of fame
                         for (var i = 10; i > rang; i--) {
                              $("#rank" + i + "2").html($("#rank" + (i - 1) + "2").html());
                              $("#rank" + i + "3").html($("#rank" + (i - 1) + "3").html());
                              $("#rank" + i + "4").html($("#rank" + (i - 1) + "4").html());
                         }
                         $("#rank" + rang + "2").html(jr.nom);
                         $("#rank" + rang + "3").html(jr.score);
                         $("#rank" + rang + "4").html(jr.temps);

                         //remplacer l'ancienne hall of fame dans le localStorage par la nouvelle.
                         localStorage['Thof'] = JSON.stringify(hallOfFame);

                         //reinitialiser les elements cle du jeu.
                         initialState();
                    }, 5000);
               }
          } else if (fautes > 5) { //sinon si le nombre de tentative est 6
               //arreter le chronometre
               clearInterval(chronometre);
               $("#instructions").html('<p>Game Over !</p><p>Le mot etait "' + guessWord + '". Bon courage la prochaine fois !</p>');
               //afficher la bulle du personnage pendu.

               $("#pendu" + 7).show();
               //reinitialiser les elements cle du jeu.
               initialState();
          }
          //vider le input apres qu'on tape entrer
          $(this).val('');
     });

     // fonctions

     // fonction qui initialise tous les elements necessaires pour le debut du jeu.
     function initGame() {
          ongoingGame = true;
          fautes = 0;
          timeS = new Date();

          chronometre = setInterval(function() {
               var d = new Date();
               $("#chrono").html(Math.round((d.getTime() - timeS.getTime()) / 1000) + 's');
          }, 1000);

          $("#tableContainer").show();
          $("#THOF").show();
          $("#chrono").show();
          $("#inputfield span").hide();
          $("#illustration *").hide();
          $("#letterInput").prop('disabled', false);
          $("#letterInput").prop('placeholder', 'Taper une lettre...');
          $("#startreset").html("Reinitialiser !");
          $("#excluded").html('');
          $("#instructions").html("<p>Devinez une lettre :</p>");
     }

     //generer un mot aleatoire
     function generateWord() {
          var wordToGuess = words[Math.floor(Math.random() * words.length)];
          $("#textContainer").text('');
          for (var dash = 0; dash < wordToGuess.length; dash++)
               $("#textContainer").append('_ ');

          return wordToGuess;
     }

     //remplacer les undersore par les lettres correspondantes
     function replaceLetter(word, letter) {
          var hiddenWord = new String($("#textContainer").text());

          hiddenWord = hiddenWord.split(' ');
          for (var index = 0; index < word.length; index++) {
               if (letter.test(word.charAt(index))) {
                    hiddenWord[index] = word.charAt(index);
                    $("#textContainer").text(hiddenWord.join(' '));
               }
          }
     }

     //revenir a l'etat initial necessaire pour le debut du jeu.
     function initialState() {
          $("#letterInput").show();
          $("#letterInput").prop('placeholder', 'En attente...');
          $("#letterInput").prop('disabled', true);
          $("#nameInput").hide();
          $("#startreset").html("Commencer !");
          ongoingGame = false;
     }

     //aficher les lettres excluse (fausses)
     function showExclusions(letter) {
          if (!letter.test($("#excluded").text())) {
               $("#excluded").append($("#letterInput").val() + ' ')
          }
     }

     //creer le tableau hall of fame et le mettre dans localStorage
     function creatJSON() {
          hallOfFame = [];
          for (var i = 0; i < 10; i++) {
               hallOfFame[i] = new Joueur();
          }
          localStorage['Thof'] = JSON.stringify(hallOfFame);
     }

     //Initialiser le tableau du hall of fame
     function initTable() {
          //s'il n'y a rien dans le div du tableau on cree un nouvea tableau et on rempli les cases par des dash "---"
          if ($("#tableContainer").html() == '') {
               var table = $("<table>");
               table.attr("id", "table");

               var tr = $("<tr>");

               var tete = ["Rang", "Nom", "Score", "Temps"]
               for (var t of tete) {
                    td = $("<td>");
                    td.attr('class', 'tabelements')
                    tr.append(td.html(t));
               }

               table.append(tr);
               $("#tableContainer").append(table);

               for (var i = 1; i < 11; i++) {

                    var tr = $("<tr>");
                    tr.attr("id", parseInt(i))

                    var element = $("<td>");
                    element.attr("id", "rank");
                    element.attr("class", "tabelements");
                    element.html(parseInt(i));
                    tr.append(element);

                    element = $("<td>");
                    element.attr("class", "tabelements");
                    element.attr("id", "rank" + parseInt(i) + "2");
                    element.html('---');
                    tr.append(element);

                    element = $("<td>");
                    element.attr("class", "tabelements");
                    element.attr("id", "rank" + parseInt(i) + "3");
                    element.html('---');
                    tr.append(element);

                    element = $("<td>");
                    element.attr("class", "tabelements");
                    element.attr("id", "rank" + parseInt(i) + "4");
                    element.html('---');
                    tr.append(element);

                    table.append(tr);

                    $("#tableContainer").append(table);

               }
               $("tableContainer").append(table);

               //si le localStorage contient deja la cle 'Thof' on remplie le tableau par les joueurs valides
               if ('Thof' in localStorage) {
                    hallOfFame = JSON.parse(localStorage['Thof']);
                    for (var i = 0; i < hallOfFame.length; i++) {
                         if (hallOfFame[i].score < 7) {
                              $("#rank" + (i + 1) + "2").html(hallOfFame[i].nom);
                              $("#rank" + (i + 1) + "3").html(hallOfFame[i].score);
                              $("#rank" + (i + 1) + "4").html(hallOfFame[i].temps);
                         }
                    }
               }
          }
     }

});
