import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const UserSettings = new Mongo.Collection('usersettings');

if (Meteor.isServer) {
    Meteor.publish('usersettings', function usersettingsPublication() {
        return UserSettings.find( { owner: this.userId });
    });
}

Meteor.methods({
    'usersettings.insert'(usersetting) {
        check(usersetting, Object);

        if (!this.userId) {
            throw new Meteor.error('not authorized');
        }

        UserSettings.insert({
            firstName: usersetting.firstName,
            lastName: usersetting.lastName,
            baseCurrency: usersetting.baseCurrency,
            currencyOptions: usersetting.currencyOptions,
            owner: Meteor.userId(),
        });
    },  

    'usersettings.update'(usersetting, usersettingId) {
        check(usersetting, Object);
        check(usersettingId, String);

        if (!this.userId) {
            throw new Meteor.error('not authorized');
        }

        UserSettings.update(usersettingId, { $set: {
            firstName: usersetting.firstName,
            lastName: usersetting.lastName,
            currencyOptions: usersetting.currencyOptions,
            owner: Meteor.userId(),
        }});
    },

    'usersettings.delete'(owner) {
        check(owner, String)
        if (!this.userId) {
            throw new Meteor.error('not authorized');
        }

        UserSettings.remove({owner: owner});
    }
});