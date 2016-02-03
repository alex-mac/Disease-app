Countries = new Mongo.Collection("prevCountries");

if (Meteor.isClient) {

  Template.body.helpers({
    countries: function () {
      return Countries.find({}, {sort: {createdAt: -1}, limit: 5});
    }
  });

  Template.body.events({
    "submit .new-search": function (e) {
      e.preventDefault();
      var text = e.target.text.value;

      Countries.insert({
        text: text,
        createdAt: new Date() // current time
      });
 
      e.target.text.value = "";

      console.log(text)
      Meteor.call('getDiseases', text, function(error, results) {
        if (error) {
          console.log("error: " + error);
        } 

        console.log(results);
        Session.set("diseases", results);

      });
    }
  });

  // Template.countryName.events({
  //   "click .delete": function () {
  //     Countries.remove(this._id);
  //   }
  // });


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
        getDiseases: function(code) {
          result = Meteor.http.get('http://www.who.int/csr/don/archive/country/' + code + '/en/');
          $ = cheerio.load(result.content);
          var resp = [];
          var length = $(".col_2-1_1 li a").length;
          if (length > 10) {
            length = 10;
          } 
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
