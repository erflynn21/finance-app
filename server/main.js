import { Meteor } from 'meteor/meteor';
import '../imports/api/expenses.js';
import '../imports/api/incomes.js';
import '../imports/api/budgets.js';
import '../imports/api/usersettings.js';
import '../imports/api/monthlybudgets.js';
import '../imports/api/monthlyexpenses.js';
import '../imports/api/monthlyincomes.js';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish('userData', function () {
    if (this.userId) {
      return Meteor.users.find({ _id: this.userId }, {
        fields: { other: 1, things: 1 }
      });
    } else {
      this.ready();
    }
  });
  Meteor.users.allow({ remove: () => true });
});
