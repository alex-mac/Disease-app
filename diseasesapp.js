if (Meteor.isClient) {
  // counter starts at 0
  Meteor.call('getDiseases', function(error, results) {
    if (error) {
      console.log("error: " + error);
    } 

    console.log(results);
    Session.set("diseases", results);

  });

  Template.diseases.helpers({
    rant: function() {
      return Session.get("diseases")
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.startup(function() {
      var cheerio = Meteor.npmRequire('cheerio');

      Meteor.methods({
        getDiseases: function() {
          result = Meteor.http.get('http://www.who.int/csr/don/archive/country/aus/en/');
          $ = cheerio.load(result.content);
          var resp = [];
          var length = $(".col_2-1_1 li a").length;
          for(var i = 1; i <= length; i++) {
            resp.push(
              {
                date: $(".col_2-1_1 li:nth-child(" + i + ") a").text(),
                description: $(".col_2-1_1 li:nth-child(" + i + ") span").text(),
                link: $(".col_2-1_1 li:nth-child(" + i + ") a").attr("href")
              }
            );
          }
          return resp;
        }
      })
    })
  });
}
