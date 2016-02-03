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
          var temp = $(".col_2-1_1 li");
          var resp = []
          for(var i = 0; i < resp.length; i++) {
            resp.push(temp[i].text())
          }
          console.log(resp)
          return resp
        }
      })
    })
  });
}
