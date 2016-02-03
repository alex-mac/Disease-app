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

      Meteor.call('getDiseases', text, function(error, results) {
        if (error) {
          console.log("error: " + error);
        } 

        console.log(results);
        Session.set("diseases", results);

      });
    }
  });

  Template.countryName.events({
    "click .text": function() {
      // console.log(this.text)
      text = this.text

      // gets Search Results
      Meteor.call('getDiseases', text, function(error, results) {
        if (error) {
          console.log("error: " + error);
        } 

        Session.set("diseases", results);

      });

      
      // updates position in database (WIP)
      Countries.find({_id: this._id}, function(err, data) {
        if (err) console.log(err)
      }).update({createdAt: new Date});
    }
  });
  
  // delete history
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
                link: "http://www.who.int/" + $(".col_2-1_1 li:nth-child(" + i + ") a").attr("href")
              }
            );
          }
          return resp;
        }
      })
    })
  });
}
